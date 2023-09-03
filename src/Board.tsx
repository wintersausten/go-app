import './Board.css';

import { memo, useState } from 'react';

enum Stone {
    EMPTY,
    WHITE,
    BLACK
  }

const Stone = memo(({ intersection }: { intersection: number }) => {
  const colorCSS = {
    [Stone.EMPTY]: '',
    [Stone.WHITE]: 'white',
    [Stone.BLACK]: 'black'
  }
  const classes = `stone ${colorCSS[intersection]}`;
  return <span className={classes} />
})

function Board({ size }: { size: number }) {
  const [boardArray, setBoardArray] = useState(Array(size*size).fill(Stone.EMPTY));
  const [turnNum, setTurnNum] = useState(1);

  const handleIntersectionClick = (index: number) => {
    if (boardArray[index] !== Stone.EMPTY) return;
  
    const newBoardArray = [...boardArray];
    newBoardArray[index] = turnNum % 2 == 0 ? Stone.WHITE : Stone.BLACK;
    
    setBoardArray(newBoardArray);
    setTurnNum(turnNum + 1);
    }

  const gridStyle = {
    gridTemplateRows: `repeat(${size}, 1fr)`,
    gridTemplateColumns: `repeat(${size}, 1fr)`,
    '--stone-hover-color': turnNum % 2 == 0 ? 'var(--stone-color-white)' : 'var(--stone-color-black)'
  }
  
  // Functions to generate grid cell css - grid lines that would extend outside square bounds made transparent
  const itemStyles = {
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
  return (
    <div id="board" style={gridStyle}>
      {boardArray.map((intersection, index) => (
        <div 
          key={index}
          className="grid-item"
          onClick={() => handleIntersectionClick(index)}
          style={{
            '--border-before-color': itemStyles['--border-before-color'](index),
            '--border-after-color': itemStyles['--border-after-color'](index)
          }}
          >
          <Stone intersection={intersection} />
        </div> 
      ))}
    </div>
  );
}

export default Board;