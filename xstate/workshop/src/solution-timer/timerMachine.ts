import {
  ActorRef,
  ActorRefFrom,
  Snapshot,
  assign,
  fromCallback,
  sendTo,
  setup,
} from "xstate";

export type TimerMachineRef = ActorRefFrom<typeof timerMachine>;

type ChildEvent = {
  type: "sessionTerminated" | "sessionPaused";
};
type ParentActor = ActorRef<Snapshot<unknown>, ChildEvent>;

export const timerMachine = setup({
  types: {
    events: {} as
      | { type: "start" }
      | { type: "stop" }
      | { type: "reset" }
      | { type: "minute" }
      | { type: "second" }
      | { type: "TICK" },
    context: {} as { seconds: number; parentRef: ParentActor },
    input: {} as {
      parentRef: ParentActor;
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
}).createMachine({
  context: ({ input }) => ({
    seconds: 0,
    parentRef: input.parentRef,
  }),
  initial: "stopped",
  states: {
    stopped: {
      on: {
        start: {
          guard: ({ context }) => context.seconds > 0,
          target: "running",
        },
      },
    },
    running: {
      invoke: {
        src: "ticks",
      },
      on: {
        minute: {
          actions: assign({
            seconds: ({ context }) => context.seconds + 60,
          }),
        },
        second: {
          actions: assign({
            seconds: ({ context }) => context.seconds + 1,
          }),
        },
        stop: "stopped",

        TICK: {
          actions: assign({
            seconds: ({ context }) => context.seconds - 1,
          }),
        },
      },
      always: {
        guard: ({ context }) => context.seconds === 0,
        target: "terminated",
      },
    },
    terminated: {
      entry: sendTo(({ context }) => context.parentRef, {
        type: "sessionTerminated",
      }),
      always: "stopped",
    },
  },
});
