import styled from "styled-components";
import "./App.css";

function padTime(minsOrSecs: number) {
  return minsOrSecs < 10 ? `0${minsOrSecs}` : minsOrSecs;
}

function App() {
  return (
    <div className="App">
      <h1>
        {padTime(0)}:{padTime(0)}
      </h1>
      <Button>min</Button>
      <Button>sec</Button>
      <Button>reset</Button>
      <Button>start</Button>
      <Button>pause</Button>
    </div>
  );
}

const Button = styled.button`
  margin: 4px;
`;

export default App;
