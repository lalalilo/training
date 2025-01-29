import { useMachine, useSelector } from "@xstate/react";
import { useState } from "react";
import styled from "styled-components";
import "./App.css";
import { getStepName, pomodoroMachine } from "./machines/pomodoroMachine";
import { TimerMachineRef } from "./machines/timerMachine";

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
  const [snapshot, send] = useMachine(pomodoroMachine);

  const [sessionDuration, setSessionDuration] = useState(
    snapshot.context.sessionDuration
  );
  const [longBreak, setLongBreak] = useState(snapshot.context.longBreak);
  const [shortBreak, setShortBreak] = useState(snapshot.context.shortBreak);

  const can = snapshot.can.bind(snapshot);

  const resetAction = () =>
    send({
      type: "reset",
    });

  const canRest = !can({ type: "reset" });

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
              send({ type: "START", sessionDuration, longBreak, shortBreak })
            }
          >
            Start
          </Button>
        </>
      ) : (
        <>
          <h2>{getStepName(snapshot.context.currentCycle)}</h2>
          <Timer
            stopWatchMachine={snapshot.context.timer}
            resetAction={resetAction}
            canReset={canRest}
          />
          <div>Nb de cycle: {snapshot.context.currentCycle % 3}</div>
        </>
      )}
    </div>
  );
}

interface TimerProps {
  stopWatchMachine: TimerMachineRef;
  resetAction: () => void;
  canReset: boolean;
}

const Timer = ({ stopWatchMachine, resetAction, canReset }: TimerProps) => {
  const sec = useSelector(
    stopWatchMachine,
    (snapshot) => snapshot.context.seconds
  );

  const snapshot = stopWatchMachine.getSnapshot();
  const { minutes, seconds } = convertSecondsToTime(sec);
  const can = snapshot.can.bind(snapshot);

  return (
    <div className="App">
      <h1>
        {padTime(minutes)}:{padTime(seconds)}
      </h1>
      <Button
        onClick={() =>
          stopWatchMachine.send({
            type: "minute",
          })
        }
        disabled={!can({ type: "minute" })}
      >
        min
      </Button>
      <Button
        onClick={() =>
          stopWatchMachine.send({
            type: "second",
          })
        }
        disabled={!can({ type: "second" })}
      >
        sec
      </Button>
      <Button onClick={resetAction} disabled={canReset}>
        reset
      </Button>
      <Button
        onClick={() =>
          stopWatchMachine.send({
            type: "start",
          })
        }
        // Don't know why it it not rerendered on button click (same for other but less painful)
        //disabled={!can({ type: "start" })}
      >
        start
      </Button>
      <Button
        onClick={() =>
          stopWatchMachine.send({
            type: "stop",
          })
        }
        disabled={!can({ type: "stop" })}
      >
        Pause
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
