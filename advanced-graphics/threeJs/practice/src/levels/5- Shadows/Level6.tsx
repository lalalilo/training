import { LevelContainer, LevelTitle } from "../../components/Level";
import { CANVAS_SIZE } from "../../App.tsx";
import { Level6Solution } from "./Solution.tsx";

const Exercise = () => {
  // code here
  // https://r3f.docs.pmnd.rs/getting-started/your-first-scene
  // https://threejs.org/manual/#en/shadows
  // keywords: shadow map

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

export const Level6 = () => {
  return (
    <LevelContainer>
      <LevelTitle>Shadows</LevelTitle>
      <Level6Solution />
      <div>
        <h2>Dev:</h2>
        <Exercise />
      </div>
    </LevelContainer>
  );
};
