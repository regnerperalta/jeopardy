import React, { useState } from "react";
import type { BoardProps, Clue, Player } from "../types/game";

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
        /* Card Overlay Modal */
        <div className="active-card-overlay">
          <div className="clue-card-content">
            <h3 className="card-category">{activeClue.category.toUpperCase()}</h3>
            <p className="big-question-text">
              {showAnswer ? `ANSWER: ${activeClue.answer}` : `CLUE: ${activeClue.question}`}
            </p>
            
            <div className="host-controls">
              {!showAnswer ? (
                <button className="action-btn" onClick={() => setShowAnswer(true)}>
                  Reveal Answer
                </button>
              ) : (
                <button className="close-btn" onClick={closeClueCard}>
                  Return to Board
                </button>
              )}
            </div>

            <div className="scorekeeper-console">
              <h4>Scorekeeper Console: Adjust Player Points</h4>
              <div className="console-row">
                {players.map((p, idx) => (
                  <div key={idx} className="player-adjustment-card">
                    <span><strong>{p.name}</strong></span>
                    <div className="btn-group">
                      <button className="plus-btn" onClick={() => adjustScore(idx, activeClue.points, true)}>
                        Correct (+${activeClue.points})
                      </button>
                      <button className="minus-btn" onClick={() => adjustScore(idx, activeClue.points, false)}>
                        Incorrect (-${activeClue.points})
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Scoreboard Ledger Footer */}
      <footer className="scoreboard">
        {players.map((player, idx) => (
          <div key={idx} className="player-score-card">
            <div className="player-name">{player.name}</div>
            <div className={player.score < 0 ? "negative-score" : "positive-score"}>
              {player.score < 0 ? `-$${Math.abs(player.score)}` : `$${player.score}`}
            </div>
          </div>
        ))}
      </footer>
    </>
  );
}