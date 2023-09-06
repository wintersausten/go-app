import './Board.css';

import { memo, useState } from 'react';
import update from 'immutability-helper';

import { Intersection, Stone as StoneType } from './Engine.tsx';

const Stone = memo(
  ({ intersection }: { intersection: Intersection }) => {
    const intersectionCSSResolver = (intersection: Intersection) => {
      if (intersection.isEmpty()) {
        return 'empty';
      } else if (intersection.stone === StoneType.WHITE) {
        return 'white';
      } else {
        return 'black';
      }
    }
    const classes = `stone ${intersectionCSSResolver(intersection)}`;
    return <span className={classes} />
  }
)

function Board({ size }: { size: number }) {
  const [boardArray, setBoardArray] = useState(Array.from({ length: size * size }, () => new Intersection()));
  const [turnNum, setTurnNum] = useState(1);

  const handleIntersectionClick = (index: number) => {
    if (!boardArray[index].isEmpty()) return;
  
    const newBoardArray = update(boardArray, {
      [index]: {
        stone: {
          $set: turnNum % 2 == 0 ? StoneType.WHITE : StoneType.BLACK
        }
      }
    });
    
    setBoardArray(newBoardArray);
    setTurnNum(turnNum + 1);
  };

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
