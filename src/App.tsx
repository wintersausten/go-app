import Board from "./Board"
import { LocalGameStrategy } from "./Engine"

function App() {
  return (
    <>
      <Board gameStrategy={new LocalGameStrategy(19)} />
    </>
  )
}

export default App
