import { createMachine } from "xstate";

export const parallelDogMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QQPZQLIEMDGALAlgHZgB0A7pvgC5FQDEANmJgG5wAEuKAtmANoAGALqJQABxSxq+FIVEgAHogBsAThIAWAEwBmAIw6BADgCsGgOwnVJ5QBoQAT0Q6bJAwL17zOoxt+qAXwD7VAwcAmJyShpCegAzTAYGWHZMWCYwMUERJBAJKRpZeSUEAz03VXNlXz9zLQ0XI3snBABaLRMSSxNjHR8jVSMtaqCQtCw8IlJMKnYqXDB2MUwAJwBrOlRI2CoZ0lCJiOnZ+cXl9ez5fOki3JK9IyMSAWVzUzeNZT0BHWUNZsQWgMXS0RgEqg0Jg6Rk8eg0oxAB3CUxIMzmCyWqw2KzAVAAritCCkuLxLrlroU5HdEKp1LoGsYvso+jp-o5AQMSMo1C4bHpmeY9CYTAikZNImjTpj1iQxAxMA5aFFqOwAEaJBhzFBqxbzFYoMiEOhxXF4dGLdVJMniSQ3KmgEraTqDB66PrmYy+AEIUHqbmqPq+foCARmUXjZESk4Y85rWXyxWxZWzS2aqja1W63D6w10CjUa15W2U4qIXxPR5QrwhrQvVR6b2+rk8nwNR4hsPBRER8XHc3SuNyhVK3BpfupuhQfBsccawsUmT2xSIEycv61wzWWuvRtaLQVDqWUyu6zhsK91HRs5YkioTj4FKqvFSYiwWAkWCEfBxOK0OiwMAOEwQgUFOFZ2FCedi0XUsEFXfdQx0VRfT0DpXjZFoNFUARNF+CxhVZIZBjPQ4UUlGMbzvAhH2fKY3xIdV1j-HYUDER8sVoKCChg6kEAaTpazBaxBiMPCbG9VdylrPcfgEbwQ3rEjIz7KVY1vbVqLVWjX3fRi1j-fMqC4u1YPMSoSEaWllHqP41AwlcYRIaSNzkwxwT0IIuxAiA4HkMUjiuaDbgdRBWjsdk2k8DQuRsKohQ0DwLA8rt-JRQzaEC7jguXPitG9ANNG0H4vF8OTdGSsZzyOS9+1jTKTN4nQtHUF0hhZD1HnsvjnVeF1QWskw6iMJSL3I68ZSHRMoHqktGvMcwSFat0dA6r0IoMHQnOwgZ5pDbkRRSntqrGgd42HJNDLVDUtR1dEcyXBdspKZRwTcIVa0FaxtF0RtOXdfQwTbXQDsq0io1qm9JpHMcpVTGaeJCviVrehoISqPprOsXcFohIEek9Wo3hG46r1OqGkwfNUUBxCB4aessXi6FxIRsIjVx0XccK+Hw4U8Ho6nMYmyNJtSqMpp8XzgeBySCpcSh8BbBPBKxHjE8LMIEfc3iFBWOg0SEhfB1TKI08XtKlj8vx-DKZayuXEH1hbmT3fk+hsYYmgirCcO+fXhQMQYoUsQ2VIomUxZoyX6L0m2bTt2DmTpKw91EhKtDMvKItXHCjA9V1XjBfRAkOqrhYh8PTcjuj33F6nIDp+2EDeZQuWMQblDMIUqlUb0sOijcOl+ARITULQQ4-DIxFjot48a1kQVR1kfkrLr2gWllfBMVDBqQladE8gIgA */
  id: "dogMachine",
  initial: "waiting",
  context: {
    hasABall: false,
  },
  states: {
    waiting: {
      on: {
        "leaves home": {
          target: "at the park",
          guard: ({ context }) => context.hasABall,
        },
        "falls asleep": "sleeping",
      },
    },
    "at the park": {
      type: "parallel",
      on: { "returns home": "waiting" },
      onDone: { target: "waiting" },

      states: {
        playing: {
          initial: "has the ball",
          states: {
            "wait ball to be thrown": {
              on: {
                "fetch the ball": "has the ball",
                wait: "is bored",
              },
            },

            "has the ball": {
              on: {
                "give the ball": {
                  target: "wait ball to be thrown",
                  reenter: true,
                },
              },
            },

            "is bored": { type: "final" },
          },
        },
        "do his business": {
          initial: "sniffing",
          states: {
            sniffing: {
              on: {
                "sees another dog": "barking",
              },
            },
            barking: {
              on: {
                "stops barking": "sniffing",
                wait: "is bored",
              },
            },

            "is bored": { type: "final" },
          },
        },
      },
    },
    sleeping: {
      type: "final",
    },
  },
});
