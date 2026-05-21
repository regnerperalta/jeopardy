import React, { useState } from "react";

interface GameSetupProps {
  onGameStart: (boardId: string, playerNames: string[], gameTitle: string) => Promise<void>;
}

export default function GameSetup({ onGameStart }: GameSetupProps) {
  const [gameTitle, setGameTitle] = useState("Herencia Quisqueyana");
  const [boardId, setBoardId] = useState("001");
  const [nameInputs, setNameInputs] = useState<string[]>(["Player 1", "Player 2", "Player 3"]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      // Pass the new title state value up to the orchestrator component
      await onGameStart(boardId, nameInputs, gameTitle.trim() || "JEOPARDY");
    } catch (err: any) {
      setError(err.message || "An issue occurred querying this deck from the database.");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePlayerNameChange = (index: number, value: string) => {
    setNameInputs((prev) => prev.map((n, idx) => (idx === index ? value : n)));
  };

  if (submitting) return <div className="centered-message">Querying DynamoDB Deck...</div>;

  return (
    <div className="setup-screen">
      <form className="setup-card" onSubmit={handleSubmit}>
        <h2 className="setup-subtitle">Game Engine Configuration</h2>
        
        {error && (
          <div style={{ color: "#ff3333", marginBottom: "1rem", fontWeight: "bold", textAlign: "center" }}>
            {error}
          </div>
        )}

        {/* NEW: Dynamic Game Title Input */}
        <div className="form-group">
          <label htmlFor="gameTitle">GAME DISPLAY TITLE</label>
          <input
            id="gameTitle"
            type="text"
            className="setup-input"
            value={gameTitle}
            onChange={(e) => setGameTitle(e.target.value)}
            placeholder="e.g., Herencia Quisqueyana"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="boardId">DYNAMODB BOARD ID</label>
          <input
            id="boardId"
            type="text"
            className="setup-input"
            value={boardId}
            onChange={(e) => setBoardId(e.target.value)}
            placeholder="e.g., 001, 002"
            required
          />
        </div>

        {nameInputs.map((name, idx) => (
          <div className="form-group" key={idx}>
            <label htmlFor={`player-${idx}`}>PLAYER {idx + 1} NAME</label>
            <input
              id={`player-${idx}`}
              type="text"
              className="setup-input"
              value={name}
              onChange={(e) => handlePlayerNameChange(idx, e.target.value)}
              placeholder={`Contestant ${idx + 1}`}
            />
          </div>
        ))}

        <button type="submit" className="start-game-btn">
          LAUNCH GAME BOARD
        </button>
      </form>
    </div>
  );
}