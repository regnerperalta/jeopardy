import React, { useState } from "react";
import type { BoardProps, Clue, Player } from "../types/game";
import Question from "./Question";
import "./Board.css";

export default function Board({ categories, initialClues, initialPlayers, onLeaveGame }: BoardProps) {
  // Gameplay Engine State Machine
  const [clues, setClues] = useState<Clue[]>(initialClues);
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [activeClue, setActiveClue] = useState<Clue | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const adjustScore = (playerIndex: number, points: number, isCorrect: boolean) => {
    const valueChange = isCorrect ? points : -points;
    setPlayers((prev) =>
      prev.map((player, idx) =>
        idx === playerIndex ? { ...player, score: player.score + valueChange } : player
      )
    );
  };

  const closeClueCard = () => {
    if (activeClue) {
      setClues((prev) =>
        prev.map((c) => (c.sk === activeClue.sk ? { ...c, isRevealed: true } : c))
      );
    }
    setActiveClue(null);
    setShowAnswer(false);
  };

  return (
    <>
      {/* Absolute Header Interceptor for the Close Action */}
      <button 
        className="exit-game-btn" 
        onClick={onLeaveGame}
        title="Leave current board"
        aria-label="Leave current board"
      >
        ✕
      </button>

      {/* CONDITIONAL RENDER: Active Selection View vs Grid Layout */}
      {!activeClue ? (
        <div 
          className="board-grid" 
          style={{ "--board-cols": categories.length } as React.CSSProperties}
        >
          {/* Render Category Headers */}
          {categories.map((cat) => (
            <div key={cat} className="category-header">
              {cat.toUpperCase()}
            </div>
          ))}

          {/* Render Value Tiles Grouped by Point Order */}
          {[100, 200, 300, 400, 500].map((value) =>
            categories.map((cat) => {
              const clue = clues.find((c) => c.category === cat && c.points === value);
              if (!clue) return <div key={`${cat}-${value}`} className="empty-tile" />;

              return (
                <button
                  key={clue.sk}
                  disabled={clue.isRevealed}
                  className={clue.isRevealed ? "disabled-tile" : "clue-tile"}
                  onClick={() => setActiveClue(clue)}
                >
                  ${clue.points}
                </button>
              );
            })
          )}
        </div>
      ) : (
        <Question 
          activeClue={activeClue}
          showAnswer={showAnswer}
          setShowAnswer={setShowAnswer}
          players={players}
          onAdjustScore={adjustScore}
          onClose={closeClueCard}
        />
      )}

      {/* Keep scoreboard persistent at bottom of screen */}
      <div className="scoreboard-container">
        {players.map((player) => (
          <div key={player.id} className="player-score-card">
            <span className="player-name">{player.name}</span>
            <p className="player-score-value">${player.score}</p>
          </div>
        ))}
      </div>
    </>
  );
}