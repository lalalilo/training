import { useMachine } from "@xstate/react";
import { createMachine } from "xstate";

const dogMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QQPZQLIEMDGALAlgHZgB0A7pvgC5FQDEANmJgG5wAEuKAtmANoAGALqJQABxSxq+FIVEgAHogCMAFgElVATgBMADgDMygKwB2AwK2rjAGhABPFVq0kDB61uUA2bwb369AF9Au1QMHAJickoaQnoAM0wGBlh2TFgmMDFBESQQCSkaWXklBDVjEhNlAXdVatUDY2MDO0cELwMSAW9dHUsDUz0Gg2DQtCw8IlIxBkx7WjoAJzAqAFdFwlSuXhz5AulivNLlAc1TPpqtAy8tY29TVpUDHRIdHXPLJq9jf3PgkJAhBQEDg8jCE0iYD2kgOciOiAAtDoXKZTLotIZ1AI7novF5HggkRU9ENTHi9MorjUBKpRiBwREptFpHFoYUZHDQMc9K8+qZut9nKoKe4CSdlCQ9LdvA1un4miMAQzJlEZnNaGzYSVEEZVGcBDcAni-KZVGKriQvPoDTprjT+U06crISQMmAshq8vsipzFDruq9jNY8T86gahgSfJo-GotOcbs9rl5-oEgA */
  id: "dogMachine",
  context: { hasABall: false },
  initial: "waiting",
  states: {
    waiting: {
      on: {
        "leaves home": "playing",
        "falls asleep": "sleeping",
      },
    },
    playing: {
      on: {
        "returns home": "waiting",
      },
    },
    sleeping: {
      type: "final",
    },
  },
});

export const DogComponent = () => {
  const [snapshot] = useMachine(dogMachine);

  return <div>{snapshot.context.hasABall ? "🎾" : "🐶"}</div>;
};
