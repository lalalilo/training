import { ActorRefFrom, assign, setup } from "xstate";
import { TimerMachineRef, timerMachine } from "./timerMachine";

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
    context: {} as {
      sessionDuration: number;
      longBreak: number;
      shortBreak: number;
      currentCycle: number;
      timer: TimerMachineRef;
    },
  },
  actors: { timerMachine },
  actions: {
    setTimeAndLaunch: ({ context }) => {
      const step = getStepName(context.currentCycle);
      let duration = 0;
      if (step === "Work session") {
        duration = context.sessionDuration;
      } else if (step === "Long break") {
        duration = context.longBreak;
      } else {
        duration = context.shortBreak;
      }
      context.timer.send({
        type: "update",
        seconds: duration * 60,
      });
      context.timer.send({ type: "start" });
    },
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QAcD2BbVFUCdUGIBlAFQHkAFAbQAYBdRFVWASwBdnUA7BkAD0QAsAJgA0IAJ6IAjAFYAnADoAbDOoBmIWoAc6gQIDsSpQF9jYtJmx4FzCABswRYgEEASsRr0kINC3ZcefgQpaikFLS0pJX05GTUBJT0tJTFJBDU1JQVqeTlqLRkZAWpdU3MMLFxUBRwAV05OZk4oGvrCOBYufBw4MFZPHl82Dm5vIIys1X0ZWW0pacLUxCFhBUy8-SF9HLl9ZLKfCqtquoamltP22E7OfFgOkeIwHHQmgENWSAHvIf9R0CCMi0+myajkQliRmSsTUSwQWyECgRSliejkKi0sVMZhAnCwcEGRyqhL8I0CiAAtCkJIhogpNhoZJpqNNQnEDhZKtZbA4ScMAmNBKIafDVnpNkJEnIpHINNQBByidZTo1mny-uT4Vo1AopAU1FIZbIils4cbsgk9WpqEIWUotHpFZYqq0zs1XVcbuqyYL0gbdfrDdLCsJ9HC1IZdXrwQkSkopBknVzqrBWKhkMhIN6BQDpHp6QYwfpplIkrIzUCFDJ9LIBEy8vNMvpscYgA */
  id: "pomodoro",
  context: ({ spawn, self }) => ({
    sessionDuration: 25,
    longBreak: 15,
    shortBreak: 5,
    currentCycle: 1,
    timer: spawn(timerMachine, { input: { parentRef: self } }),
  }),
  initial: "idle",
  on: {
    STOP: ".stopped",
  },
  states: {
    idle: {
      on: {
        START: {
          guard: ({ event }) => event.sessionDuration > 0,
          actions: assign({
            sessionDuration: ({ event }) => event.sessionDuration,
            longBreak: ({ event }) => event.longBreak,
            shortBreak: ({ event }) => event.shortBreak,
          }),
          target: "running",
        },
      },
    },
    running: {
      initial: "runSession",

      states: {
        runSession: {
          entry: "setTimeAndLaunch",
          exit: assign({
            currentCycle: ({ context }) => context.currentCycle + 1,
          }),
          on: {
            reset: {
              guard: ({ context }) =>
                context.timer.getSnapshot().value !== "running",
              actions: "setTimeAndLaunch",
              target: "runSession",
              reenter: true,
            },
            sessionTerminated: {
              target: "runSession",
              reenter: true,
            },
          },
        },
      },
    },
    stopped: { type: "final" },
  },
});
