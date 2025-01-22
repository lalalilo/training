import { BrowserRouter, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import "./App.css";
import { LevelNav, Navigation, NavLink } from "./components/Navigation";
import { Level1 } from "./levels/1-basics/Level1.tsx";
import { Level2 } from "./levels/2-animations/Level2.tsx";
import { Level3 } from "./levels/3-materials/Level3.tsx";
import { Level4 } from "./levels/4-React three fiber/Level4.tsx";

function App() {
  return (
    <BrowserRouter>
      <AppContainer>
        <LevelNav>
          <NavLink to="/level/1">Level 1</NavLink>
          <NavLink to="/level/2">Level 2</NavLink>
          <NavLink to="/level/3">Level 3</NavLink>
          <NavLink to="/level/4">Level 4</NavLink>
        </LevelNav>
        <Navigation />
        <Routes>
          <Route path="/level/1" element={<Level1 />} />
          <Route path="/level/2" element={<Level2 />} />
          <Route path="/level/3" element={<Level3 />} />
          <Route path="/level/4" element={<Level4 />} />
          <Route path="*" element={<Level1 />} />
        </Routes>
      </AppContainer>
    </BrowserRouter>
  );
}

const AppContainer = styled.div`
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
`;

export default App;
