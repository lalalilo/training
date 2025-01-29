import { useMachine } from "@xstate/react";
import styled from "styled-components";
import "./App.css";
import {timerMachine} from "./timerMachine";

function convertSecondsToTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const secondsLeft = seconds % 60;
  return {
    minutes,
    seconds: secondsLeft,
  };
}

function padTime(minsOrSecs: number) {
  return minsOrSecs < 10 ? `0${minsOrSecs}` : minsOrSecs;
}

function App() {
  const [snapshot, send] = useMachine(timerMachine);
  const { minutes, seconds } = convertSecondsToTime(snapshot.context.seconds);
  const can = snapshot.can.bind(snapshot);

  return (
    <div className="App">
      <h1>
        {padTime(minutes)}:{padTime(seconds)}
      </h1>
      <Button
        onClick={() =>
          send({
            type: "minute",
          })
        }
        disabled={!can({ type: "minute" })}
      >
        min
      </Button>
      <Button
        onClick={() =>
          send({
            type: "second",
          })
        }
        disabled={!can({ type: "second" })}
      >
        sec
      </Button>
      <Button
        onClick={() =>
          send({
            type: "reset",
          })
        }
        disabled={!can({ type: "reset" })}
      >
        reset
      </Button>
      <Button
        onClick={() =>
          send({
            type: "start",
          })
        }
        disabled={!can({ type: "start" })}
      >
        start
      </Button>
      <Button
        onClick={() =>
          send({
            type: "stop",
          })
        }
        disabled={!can({ type: "stop" })}
      >
        pause
      </Button>
    </div>
  );
}

const Button = styled.button`
  margin: 4px;
`;

export default App;
