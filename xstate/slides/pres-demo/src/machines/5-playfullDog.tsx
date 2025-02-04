import { assign, createMachine } from "xstate";

export const dogMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QQPZQLIEMDGALAlgHZgB0A7pvgC5FQDEANmJgG5wAEuKAtmANoAGALqJQABxSxq+FIVEgAHogDMAdgAcJAKwAmACwBGdQDYdZjVr0AaEAE9EBgJyqSq0wNWPl65VpPG9AF9Am1QMHAJickoaQnoAM0wGBlh2TFgmMDFBESQQCSkaWXklBB1lPRIzY0stXWMPAzMbewQDZQMqvS1fdUcPXwEA4NC0LDwiUkwqdipcMHYxTAAnAGs6VCjYKmnSMPHIqZm5haW1nPkC6WK80p0BSucOgy0DPR11PU9VFsQ9AU0qiajmMXgEyhqQOUIxA+wikxI01m80WK3WyzAVAArstCKkuLwLnkrkU5LcHB8SMpHHUBHVjMpvFpfghXgISC9uuoBOCBPoeqoYXCJlEkSdUWtotR2AAjJIMWYoWULObLFBkQh0eKYvDIhZy5JE8SSa5k0ClPzKKl6QwNdT2rQCRzqFn-Fw6JqM1TPAyqPSOIVjeGi44os6rKUzA0KqhKmUq3BqjV0CjUI35E2kkqIDSaAJ8vT2movGks3SVB51IFaYwBPQVQPhEVHPUSiO4dKt6N0KD4Nhd+XpkkyM2KRCWdlOgK1rQaXyg132qrOqdO1Q9UHBEIgQgoCBweTCw6XTMj7MIblUmmO+mM9TMux-HTWiEmAQvP009SNg4I1OxKAT0KM9yTadRn2cZxjB8JwhgaaxHzKe4OUsBkgTeLx1wMH9gxbcVwyA01zzUFxvQMYwLE8Sx7mMFkOkcbRZ18AxOVUcpoW3I8ETFMM0UjWV5UVZVkSTUdhxuc0c0sEhC3eXRfFUdcIVdIYSHtPlnWUHRLUMDjRibQ5EVDU4+I7VJxWjQis1AuTXA6Cj7yo94hldJoSBBWCKj0UxqR0YwcObIzW3DEh8FSGUUAxCArJAySEHrTp1zcDpZ3vJ1fDLQt3K0tCTBraCA04oNAoyMAsloGKJLHBBjDeRidEcbTPWpV4WWBEhaxqZ0KMdRwQSCLcgA */
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
          actions: assign({
            hasABall: ({ event }) => event.hasTakenTheBall,
          }),
          guard: ({ event }) => event.hasTakenTheBall,
        },
        "falls asleep": "sleeping",
      },
    },
    "at the park": {
      on: { "returns home": "waiting" },
      onDone: { target: "waiting" },

      states: {
        "wait ball to be thrown": {
          on: {
            "fetch the ball": "has the ball",
            wait: "is bored",
          },
        },

        "has the ball": {
          on: {
            "give the ball": "wait ball to be thrown",
          },
        },

        "is bored": { type: "final" },
      },

      initial: "has the ball",
    },
    sleeping: {
      type: "final",
    },
  },
});
