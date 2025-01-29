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
  actors: {
    ticks: fromCallback(({ sendBack }) => {
      const interval = setInterval(() => {
        sendBack({ type: "TICK" });
      }, 1000);
      return () => clearInterval(interval);
    }),
  },
  types: {
    context: {} as {
      seconds: number;
      parentRef: ParentActor;
    },
    input: {} as {
      parentRef: ParentActor;
    },
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOlgBcB7AB2sgGIL0AncgbQAYBdRUay2LnK5K+XiAAeiAEwBGWSQCs8xQE4ALADZ161QA5NAZkMAaEAE9EmjgHYSGjupuGbsxTdWz1AX29m0WHiEpBQ0dBD0AK7UEOjkYJw8SCD8gsKi4lIIciTSxjYcqjZ6stbq0jaaZpYI6rIcJOWO6oq2ejqKmr7+GDgExCTMkfj4BFD0qASR8YniqUIiYslZdYq5LeoGqpqVLoZVFog6DdaqZ4Waqq2KiobdIAF9wYPDo-jjsGCYohCzyfPpJagFayQxKTTufSGaTlNwHGqGFokYyKaQ7fSozRo+6PIIDIYjMaMKjUP58AQLDLLGQaEgcQyyaQaOqXBmKaqIZQKPQcNS3AwVK6KHG9PGkAlvD7kFjsbhzCmAzIyNyNHkcaR6VGGVoMmwc7IFJQ2GzSWyKXTyDwiwL9cWvIkAFQAkgBhADSZJSCsWStqpTppryXk1ik1+tNDTyrTkoM0skqqmtT3x9ve9E9AJ91IQ5tUuQhl2KRVDhX1nU0yPatk2TPqLSTYpI8WYk3wcQYGe9VOBnM0ehI7RhehNHCxTPU+pKyOktY4sjOeU1Pnu+EoEDg4lxtvlaSzPYQAFo0SRKljVOrZHpDFcTRPDoeKxwn3OIVpB9DhX4HqLbWQSeEd0pIFJEQE06XpaQbjyORbk2MtdBIHYClKPRNXqfYG1-CUxkAxVs0MVDEIFNEWlQ9U9Xvc0GlQpxQSuFxNmXHobWeZtW3bCBcL3ECEE0IxclaJ8hxhREywqRp9FNfldGKWRfF8IA */
  types: {} as {
    events:
      | { type: "start" }
      | { type: "stop" }
      | { type: "reset" }
      | { type: "minute" }
      | { type: "second" }
      | { type: "update"; seconds: number }
      | { type: "TICK" };
  },
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
        update: {
          guard: ({ event }) => event.seconds > 0,
          actions: assign({
            seconds: ({ event }) => event.seconds,
          }),
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
