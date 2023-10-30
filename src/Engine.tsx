// import { DIRECTION_OFFETS } from "./constants"; 

export enum StoneType {
    WHITE,
    BLACK
};

export type Move = {
  readonly x: number,
  readonly y: number,
  stoneType?: StoneType
};

export type GameState = {
  board: Intersection[][],
  turnNum: number
}

export interface IGameStrategy {
  playMove(move: Move): void;
  getGameState(): GameState;
  getTurnNum(): number;
  getBoardSize(): number;
  getLegalMoves(stoneType?: StoneType): Move[];
  getResult(): unknown;
  isOver(): boolean;
  isLegalMove(move: Move): boolean;
  subscribe(gameStateCallback: (state: GameState) => void): void;
}

class Stone {
  type: StoneType;
  group: Group;
  constructor(stoneType: StoneType) {
      this.type = stoneType;
      this.group = new Group();
      this.group.addStone(this);
  }
}

export class Intersection {
  stone: Stone | null = null;
  isEmpty(): boolean {
    return this.stone === null;
  }
};

class Group {
  private stones: Stone[] = [];
  liberties: Set<Intersection> = new Set();

  addStone(stone: Stone) {
    this.stones.push(stone);
  }
  
  // Merges another group into this group
  mergeGroup(otherGroup: Group) {
    otherGroup.stones.forEach(stone => {
      stone.group = this;
      this.addStone(stone);
    });
    otherGroup.liberties.forEach(liberty => this.liberties.add(liberty));
  }
} 

export class LocalGameStrategy implements IGameStrategy{
  private board: Intersection[][];
  private turnNum: number;
  private boardSize: number;
  private subscribers: Array<(state: GameState) => void> = []; 

  constructor(boardSize: number) {
    this.board = Array.from({length: boardSize}, () => Array.from({length: boardSize}, () => new Intersection()));
    this.turnNum = 1;
    this.boardSize = boardSize;
  }

  subscribe(gameStateCallback: (state: GameState) => void) {
    this.subscribers.push(gameStateCallback);
  } 

  notifySubscribers(newState: GameState) {
    for (const subscriber of this.subscribers) {
      subscriber(newState);
    }
  }

  isValidStoneType = (stoneType: StoneType) => stoneType === (this.turnNum % 2 === 0 ? StoneType.WHITE : StoneType.BLACK);

  playMove(move: Move): void {
    // Assign stone type if not provided & validate move
    if (move.stoneType === undefined) {
        move.stoneType = this.turnNum % 2 === 0 ? StoneType.WHITE : StoneType.BLACK;
    }
    if (!this.isValidStoneType(move.stoneType)) {
        throw Error(`It is not ${StoneType[move.stoneType]}'s turn to move`);
    } 
    if (!this.isLegalMove(move)) {
        throw Error('That move is illegal');
    }

    // Add stone to board
    this.board[move.x][move.y].stone = new Stone(move.stoneType);

    // // Iterate cardinally around intersection
    // const source = this.board[move.y][move.x];
    // for (const offset of DIRECTION_OFFETS) {
    //   const i = move.y + offset[0];
    //   const j = move.x + offset[1];
    //   if (0 <= i  && i < this.boardSize && 0 <= j && j < this.boardSize) {
    //     const itr = this.board[i][j];
    //     if (itr.stone !== null) {
    //       const allyGroup = itr.stone.group;
    //       if (itr.stone.type === move.stoneType) {
    //         source.stone.group.mergeGroup(allyGroup);
    //       } else {
    //         // remove liberties / capture
    //         const opponentGroup = itr.stone.group;
    //         opponentGroup.liberties.delete(source)
    //         // capture : NOTE need to keep track of captured intersections so peices can't be replaced?
    //         if (opponentGroup.liberties.size === 0) {
    //           opponentGroup.liberties.forEach(liberty => {
    //               liberty.stone = null;
    //           });
    //         }
    //       }
    //     }
    //   }
    // }

    this.turnNum++;

    this.notifySubscribers(this.getGameState());
  }

  // get a flat representation of the board for the view, intended to be sent to subscribers
  getGameState(): GameState {
    return {
      board: this.board,
      turnNum: this.turnNum
    }
  }

  getTurnNum(): number {
    return this.turnNum;
  }

  getBoardSize(): number {
    return this.boardSize;
  }

  getLegalMoves(stone?: Stone | undefined): Move[] {
      
  }

  getResult(): unknown {
      
  }

  isOver(): boolean {
      
  }
  
  isLegalMove(move: Move): boolean {
    if ((move.x >= this.boardSize) || (move.x < 0)) {
        return false;
    } else if ((move.y >= this.boardSize) || (move.y < 0)) {
        return false;
    }
      
    return true;
  }
};

