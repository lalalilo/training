import { useMachine, useSelector } from "@xstate/react";
import { useState } from "react";
import styled from "styled-components";
import "./App.css";
import {
  getStepName,
  pomodoroMachine,
  PomodoroMachineRef,
} from "./machines/pomodoroMachine";

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
  const [snapshot, send, ref] = useMachine(pomodoroMachine);

  const [sessionDuration, setSessionDuration] = useState(
    snapshot.context.sessionDuration
  );
  const [longBreak, setLongBreak] = useState(snapshot.context.longBreak);
  const [shortBreak, setShortBreak] = useState(snapshot.context.shortBreak);

  return (
    <div className="App">
      {snapshot.value === "idle" ? (
        <>
          <InputWrapper>
            <span style={{ paddingRight: "10px" }}>Session duration:</span>
            <input
              type="number"
              value={sessionDuration}
              onChange={(e) =>
                setSessionDuration(Number.parseInt(e.target.value))
              }
            />
          </InputWrapper>
          <InputWrapper>
            <span style={{ paddingRight: "10px" }}>Long break duration:</span>
            <input
              type="number"
              value={longBreak}
              onChange={(e) => setLongBreak(Number.parseInt(e.target.value))}
            />
          </InputWrapper>
          <InputWrapper>
            <span style={{ paddingRight: "10px" }}>Short break duration:</span>
            <input
              value={shortBreak}
              onChange={(e) => setShortBreak(Number.parseInt(e.target.value))}
            />
          </InputWrapper>
          <Button
            onClick={() =>
              send({ type: "start", sessionDuration, longBreak, shortBreak })
            }
          >
            Start
          </Button>
        </>
      ) : (
        <>
          <h2>{getStepName(snapshot.context.currentCycle)}</h2>
          <Timer pomodoroMachine={ref} />
          <div>Nb de cycle: {snapshot.context.currentCycle % 3}</div>
        </>
      )}
    </div>
  );
}

interface TimerProps {
  pomodoroMachine: PomodoroMachineRef;
}

const Timer = ({ pomodoroMachine }: TimerProps) => {
  const machineSeconds = useSelector(
    pomodoroMachine,
    (snapshot) => snapshot.context.stepSeconds
  );

  const snapshot = pomodoroMachine.getSnapshot();
  const { minutes, seconds } = convertSecondsToTime(machineSeconds);
  const can = snapshot.can.bind(snapshot);

  return (
    <div className="App">
      <h1>
        {padTime(minutes)}:{padTime(seconds)}
      </h1>
      <Button
        onClick={() =>
          pomodoroMachine.send({
            type: "minute",
          })
        }
        disabled={!can({ type: "minute" })}
      >
        min
      </Button>
      <Button
        onClick={() =>
          pomodoroMachine.send({
            type: "second",
          })
        }
        disabled={!can({ type: "second" })}
      >
        sec
      </Button>
      <Button
        onClick={() =>
          pomodoroMachine.send({
            type: "reset",
          })
        }
        disabled={!can({ type: "reset" })}
      >
        reset
      </Button>
      <Button
        onClick={() =>
          pomodoroMachine.send({
            type: "play",
          })
        }
        // Don't know why it it not rerendered on button click (same for other but less painful)
        disabled={!can({ type: "play" })}
      >
        start
      </Button>
      <Button
        onClick={() =>
          pomodoroMachine.send({
            type: "pause",
          })
        }
        disabled={!can({ type: "pause" })}
      >
        Pause
      </Button>
      <Button
        onClick={() =>
          pomodoroMachine.send({
            type: "stop",
          })
        }
        disabled={!can({ type: "stop" })}
      >
        Stop
      </Button>
    </div>
  );
};

const InputWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 4px;
`;

const Button = styled.button`
  margin: 4px;
`;

export default App;
