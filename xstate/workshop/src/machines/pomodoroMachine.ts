import { ActorRefFrom, assign, fromCallback, setup } from "xstate";

export type PomodoroMachineRef = ActorRefFrom<typeof pomodoroMachine>;

export const getStepName = (cycle: number) => {
  if (cycle % 3 === 1) {
    return "Work session";
  } else if (cycle % 3 === 2) {
    return "Short break";
  } else {
    return "Long break";
  }
};
export const pomodoroMachine = setup({
  types: {
    events: {} as
      | {
          type: "start";
          sessionDuration: number;
          longBreak: number;
          shortBreak: number;
        }
      | { type: "stop" }
      | { type: "pause" }
      | { type: "play" }
      | { type: "reset" }
      | { type: "minute" }
      | { type: "second" }
      | { type: "TICK" }
      | { type: "update"; seconds: number },
    context: {} as {
      sessionDuration: number;
      longBreak: number;
      shortBreak: number;
      currentCycle: number;
      stepSeconds: number;
    },
  },
  actors: {
    ticks: fromCallback(({ sendBack }) => {
      const interval = setInterval(() => {
        sendBack({ type: "TICK" });
      }, 1000);
      return () => clearInterval(interval);
    }),
  },
  actions: {
    setTimeAndLaunch: assign({
      stepSeconds: ({ context }) => {
        const step = getStepName(context.currentCycle);
        let duration = 0;
        if (step === "Work session") {
          duration = context.sessionDuration;
        } else if (step === "Long break") {
          duration = context.longBreak;
        } else {
          duration = context.shortBreak;
        }
        return duration * 60;
      },
    }),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QAcD2BbVFUCdUGJYAXVZAbQAYBdRFVWASyIdQDtaQAPRARgBYAnADoAHAGYJYkQFYKMmdIDsAGhABPRAFoAbEIEUKAJh4UxhgQOnbr2gL63VaTNjxCGEADZhCRAIY4iShokEDRGZjYObgQ+bT4hfmkJPiUJaUMRVQ0YkSFFEVNksSTDaQt7RwwsXFQhHABXVgBlIjBkfGxWMCFiX1ahJ2rXBubW8moOMKYWdhDow0VdRQMKPh5DcySeKyzEQ21FBLLFATEjC21pEQrQqpdakZa2-HQGVnrWoMn6aci5vb4uRE1jEfDWhgMIhEfF2MUUh0B5gE2mhFHyy2kN0G9zqjSe7VgYAAxmwIF8QlMIrNQPNFNI8nTpNJtsClKdYcUKEIytp9DwWcUrJiHLdnDVcaNnsRSOS6OEZlFEIJcjwzMiRBYxIpSgIVOpENp9kIjMV9opYmUKHYRdjxY8xgMPL41G8oPhkL56oTZbd5X8aQb9EJrBCoea+AZLLDZFyIXSTtsBPxQcLKmLhniHcgnS7WG6ACoASQAwgBpH2UhX-GK640bbRifSLKQifYctZ5JTGHgokSqy5Yu52zNtR3O134Cs-KmKhDWemqwH88w8CzSDnWPKgsEmQ1nbWD9MPEfIAaewkQd05qd+6lcQOHS507QmPha8zaWFv3KmcwZMyyGIPDXDcrBYHA3xHt8t6ziYPCiJIUiyPITJ6tkmgCPEGxnJYmEZPCgKHkMtTuF40G-He0RnFyKxXI2hhnLy0gwvqCAasGsR9nI5gnFqIFpsREr4uRM7VmCwhGPsjZog2UJtqxwHwdocj5IaiiqtsRE4vao7ZuOeYiVWAYIDGwbpKC+TbCkgLrqxYKGMaQGWBpbIvtaAnaSeZ5epAhn+vebHmAkkiYTIDYZCx2TWUIKTpIakbMhkWnDpKp4AGZvAwsAABa+RS05GQF+QqtsFCWKY4iKGYG4OfoZxXA2b7IjwyWuNKyDIHlcoUbOsSHKcix8OaBQiOpAiwssKrieiZVlGI9j2EAA */
  id: "pomodoro",
  context: {
    sessionDuration: 25,
    longBreak: 15,
    shortBreak: 5,
    currentCycle: 1,
    stepSeconds: 0,
  },
  initial: "idle",
  states: {
    idle: {
      on: {
        start: {
          guard: ({ event }) => event.sessionDuration > 0,
          actions: assign({
            sessionDuration: ({ event }) => event.sessionDuration,
            longBreak: ({ event }) => event.longBreak,
            shortBreak: ({ event }) => event.shortBreak,
          }),
          target: "runStep",
        },
      },
    },
    runStep: {
      initial: "playing",
      entry: "setTimeAndLaunch",
      exit: assign({
        currentCycle: ({ context, event }) =>
          event.type !== "stop"
            ? context.currentCycle + 1
            : context.currentCycle,
      }),
      on: {
        minute: {
          actions: assign({
            stepSeconds: ({ context }) => context.stepSeconds + 60,
          }),
        },
        second: {
          actions: assign({
            stepSeconds: ({ context }) => context.stepSeconds + 1,
          }),
        },
        reset: {
          actions: "setTimeAndLaunch",
        },
        stop: "stopped",
      },
      states: {
        playing: {
          invoke: {
            src: "ticks",
          },
          on: {
            pause: "paused",
            TICK: {
              actions: assign({
                stepSeconds: ({ context }) => context.stepSeconds - 1,
              }),
            },
          },
          always: {
            guard: ({ context }) => context.stepSeconds === 0,
            target: "finished",
          },
        },
        paused: {
          on: { play: "playing" },
        },
        finished: {
          type: "final",
        },
      },
      onDone: { target: "runStep", reenter: true },
    },
    stopped: { type: "final" },
  },
});
