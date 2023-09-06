export enum Stone {
    WHITE,
    BLACK
}
export class Intersection {
  stone: Stone | null = null;
  isEmpty(): boolean {
    return this.stone === null;
  }
}

export type Move = {
  readonly x: number,
  readonly y: number,
  readonly stone?: Stone
};

export interface Game {
  playMove(move: Move): void;
  getBoard(): Intersection[][];
  getTurn(): number;
  getLegalMoves(stoneType?: Stone): Move[];
  getResult(): unknown;
  isOver(): boolean;
  isLegalMove(move: Move): boolean;
};

export class LocalGame implements Game{
  private board: Intersection[][];
  private turn: number;
  
  constructor(boardSize: number) {
    this.board = Array.from({length: boardSize}, () => Array(boardSize).fill(new Intersection()));
    this.turn = 1;
  }

  isValidStone = (stone: Stone) => stone;

  playMove(move: Move): void {
    if(move.stone !== undefined && !this.isValidStone(move.stone)) {
        throw Error(`Cannot make a move with ${Stone[move.stone]} during `)
      }
      
  }

  getBoard(): Intersection[][] {
    return this.board;
  }

  getTurn(): number {
    return this.turn;
  }

  getLegalMoves(stoneType?: Stone | undefined): Move[] {
      
  }

  getResult(): unknown {
      
  }

  isOver(): boolean {
      
  }
  
  isLegalMove(move: Move): boolean {
      
  }
};

