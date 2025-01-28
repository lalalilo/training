import { BrowserRouter, Route, Routes } from 'react-router-dom'
import styled from 'styled-components'
import './App.css'
import { LevelNav, Navigation, NavLink } from './components/Navigation'
import { Level1 } from './levels/Level1'
import { Level2 } from './levels/Level2'
import { Level3 } from './levels/Level3'
import { Level4 } from './levels/Level4'
import { Level5 } from './levels/Level5'
import { Level6 } from './levels/Level6'
import { Level7 } from './levels/Level7'
import { Level8 } from './levels/Level8'

function App() {
  return (
    <BrowserRouter>
      <AppContainer>
        <LevelNav>
          {/* <NavLink to="/dev">Dev</NavLink> */}
          <NavLink to="/level/1">Level 1</NavLink>
          <NavLink to="/level/2">Level 2</NavLink>
          <NavLink to="/level/3">Level 3</NavLink>
          <NavLink to="/level/4">Level 4</NavLink>
          <NavLink to="/level/5">Level 5</NavLink>
          <NavLink to="/level/6">Level 6</NavLink>
          <NavLink to="/level/7">Level 7</NavLink>
          <NavLink to="/level/8">Level 8</NavLink>
        </LevelNav>
        <Navigation />
        <Routes>
          {/* <Route path="/dev" element={<Dev />} /> */}
          <Route path="/level/1" element={<Level1 />} />
          <Route path="/level/2" element={<Level2 />} />
          <Route path="/level/3" element={<Level3 />} />
          <Route path="/level/4" element={<Level4 />} />
          <Route path="/level/5" element={<Level5 />} />
          <Route path="/level/6" element={<Level6 />} />
          <Route path="/level/7" element={<Level7 />} />
          <Route path="/level/8" element={<Level8 />} />
          <Route path="*" element={<Level1 />} />
        </Routes>
      </AppContainer>
    </BrowserRouter>
  )
}

const AppContainer = styled.div`
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  `

  export default App