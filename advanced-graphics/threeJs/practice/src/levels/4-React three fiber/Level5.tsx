import { LevelContainer, LevelTitle } from "../../components/Level";
import { CANVAS_SIZE } from "../../App.tsx";
import { Level5Solution } from "./Solution.tsx";

const Exercise = () => {
  // code here
  // https://r3f.docs.pmnd.rs/getting-started/your-first-scene
  // https://drei.docs.pmnd.rs/getting-started/introduction

  return (
    <div
      style={{
        width: CANVAS_SIZE,
        height: CANVAS_SIZE,
        border: "1px solid black",
      }}
    >
      Hello World
    </div>
  );
};

export const Level5 = () => {
  return (
    <LevelContainer>
      <LevelTitle>React three fiber</LevelTitle>
      <Level5Solution />
      <div>
        <h2>Dev:</h2>
        <Exercise />
      </div>
    </LevelContainer>
  );
};
