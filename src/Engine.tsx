export enum Stone {
  EMPTY,
  WHITE,
  BLACK
};

export type Move = {
  readonly x: number,
  readonly y: number,
  readonly stone?: Stone
};

export interface Game {
  playMove(move: Move): void;
  getBoard(): Stone[][];
  getTurn(): number;
  getLegalMoves(stoneType?: Stone): Move[];
  getResult(): unknown;
  isOver(): boolean;
  isLegalMove(move: Move): boolean;
};

export class LocalGame implements Game{
  private board: Stone[][];
  private turn: number;
  
  constructor(boardSize: number) {
    this.board = Array.from({length: boardSize}, () => Array(boardSize).fill(Stone.EMPTY));
    this.turn = 1;
  }

  playMove(move: Move): void {
      
  }

  getBoard(): Stone[][] {
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

