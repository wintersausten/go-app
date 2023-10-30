import './Board.css';

import { useEffect, useState } from 'react';

import { Intersection, StoneType, GameState, IGameStrategy } from './Engine.tsx';

const Stone = 
  ({ intersection }: { intersection: Intersection }) => {
    const intersectionCSSResolver = (intersection: Intersection) => {
      if (intersection.isEmpty()) {
        return 'empty';
      } else if (intersection.stone.type === StoneType.WHITE) { // TODO: I've verified that stone isn't null with isEmpty check -- how do I tell typescript?
        return 'white';
      } else {
        return 'black';
      }
    }
    const classes = `stone ${intersectionCSSResolver(intersection)}`;
    return <span className={classes} />
  }

function Board({ gameStrategy }: { gameStrategy: IGameStrategy }) {
  const [gameState, setGameState] = useState(gameStrategy.getGameState());

  useEffect(() => {
    const gameStateCallback = (newState: GameState) => setGameState(newState);
    gameStrategy.subscribe(gameStateCallback);
  });

  const size = gameStrategy.getBoardSize();

  const flattenIndex = (rowIndex: number, colIndex: number) => ((rowIndex * size) + colIndex);

  const handleIntersectionClick = (rowIndex: number, colIndex: number) => {
    if (!gameState.board[rowIndex][colIndex].isEmpty()) return;
    gameStrategy.playMove({x: rowIndex, y: colIndex});
  };

  const gridStyle = {
    gridTemplateRows: `repeat(${size}, 1fr)`,
    gridTemplateColumns: `repeat(${size}, 1fr)`,
    '--stone-hover-color': gameState.turnNum % 2 == 0 ? 'var(--stone-color-white)' : 'var(--stone-color-black)'
  }

  // Functions to generate grid cell css - grid lines that would extend outside square bounds made transparent
  const intersectionStyles = {
    '--border-after-color': (index: number) => {
        if ((index + 1) % size === 0) {
            return 'transparent';
        }
        return 'grey';
    },
    '--border-before-color': (index: number) => {
        if (index >= (size * (size - 1))) {
            return 'transparent';
        }
        return 'grey';
    }
  };

  const renderIntersections = () => {
    return gameState.board.map((intersectionRow: Intersection[], rowIndex: number) =>
      intersectionRow.map((intersection: Intersection, colIndex: number) => (
        <div 
          key={flattenIndex(rowIndex, colIndex)}
          className="grid-item"
          onClick={() => handleIntersectionClick(rowIndex, colIndex)}
          style={{
            '--border-before-color': intersectionStyles['--border-before-color'](flattenIndex(rowIndex, colIndex)),
            '--border-after-color': intersectionStyles['--border-after-color'](flattenIndex(rowIndex, colIndex))
          }}
          >
          <Stone intersection={intersection} />
        </div> 
      ))
    );
  }
  
  return (
    <div id="board" style={gridStyle}>
      {renderIntersections()} 
    </div>
  );
}

export default Board;
