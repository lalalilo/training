import { useMachine } from "@xstate/react";
import { assign, createMachine } from "xstate";

const dogMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QQPZQLIEMDGALAlgHZgB0A7pvgC5FQDEANmJgG5wAEuKAtmANoAGALqJQABxSxq+FIVEgAHogCMAZgEkA7ABYAbJtWaATCd2rVADgA0IAJ6IjygKwkBm-RYECLuo7qdGTgC+QTaoGDgExOSUNIT0AGaYDAyw7JiwTGBigiJIIBJSNLLySgjKuhYkRqq6AJwGdW7ajhbWdohOLtp12spGFmpOOqoDIWFoWHhEpGIMmLa0dABOYFQArsuEaVy8ufKF0iX5ZRUaXZp1qtraoxbaFk429uWj1UaaynUXyveORiFQiBCCgIHB5OEplEwAdJEc5CdEABaIx1LSXVEWa5eJy-XS6Z7I8wkbRuJxmOpqXQ3Cx1cYgSGRGYxaTxWFFGQI0CnKomNwCCpOOq9QbXQmvZQkWm46nqNSPJyqemM6bROYLWjs+GlRC1SVCuq6ARGASkvx1QLitSS6XOAS9YU3MZAlXQkiZMDZTX5Q7FLmKXWqNFuSpfAYCcnOcWKkiUxUBMyBJq4wFBIA */
  id: "dogMachine",
  context: { hasABall: false },
  initial: "waiting",
  states: {
    waiting: {
      on: {
        "leaves home": {
          target: "playing",
          actions: assign({
            hasABall: ({ event }) => event.hasTakenTheBall,
          }),
          guard: ({ event }) => event.hasTakenTheBall,
        },
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
