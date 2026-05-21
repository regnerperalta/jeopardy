export interface Clue {
  pk: string;
  sk: string;
  category: string;
  question: string;
  answer: string;
  points: number;
  isRevealed?: boolean;
}

export interface Player {
  name: string;
  score: number;
}

// Update this interface to reflect our new architecture
export interface BoardProps {
  categories: string[];
  initialClues: Clue[];
  initialPlayers: Player[];
  onLeaveGame: () => void;
}

export interface GameConfig {
  boardId: string;
  playerNames: string[];
}