import React, { useState } from "react";
import { SETUP_LABELS } from "../constants/gameConfig"; // Ajusta la ruta según tu proyecto
import drMapUrl from '../assets/dominican-map.svg';
import "./GameSetup.css";

interface GameSetupProps {
  onGameStart: (boardId: string, playerNames: string[], gameTitle: string) => Promise<void>;
}

export default function GameSetup({ onGameStart }: GameSetupProps) {
  const [gameTitle, setGameTitle] = useState<string>(SETUP_LABELS.DEFAULT_GAME_TITLE);
  const [boardId, setBoardId] = useState<string>(SETUP_LABELS.DEFAULT_BOARD_ID);

  const [nameInputs, setNameInputs] = useState<string[]>([...SETUP_LABELS.DEFAULT_PLAYER_NAMES]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      // Pass the new title state value up to the orchestrator component
      await onGameStart(
        boardId, 
        nameInputs, 
        gameTitle.trim() || SETUP_LABELS.FALLBACK_ORCHESTRATOR_TITLE
      );
    } catch (err: any) {
      setError(err.message || SETUP_LABELS.DEFAULT_ERROR_MESSAGE);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePlayerNameChange = (index: number, value: string) => {
    setNameInputs((prev) => prev.map((n, idx) => (idx === index ? value : n)));
  };

  if (submitting) {
    return <div className="centered-message">{SETUP_LABELS.SUBMITTING_MESSAGE}</div>;
  }

  return (
    <div className="setup-screen">
      <form className="setup-card" onSubmit={handleSubmit}>
        <div className="setup-vector-branding">
          <div className="dr-flag-map-mask">
            <img 
              src={drMapUrl}
              alt={SETUP_LABELS.MAP_ALT_TEXT} 
              className="dr-brand-icon" 
            />
          </div>
        </div>

        <h2 className="setup-subtitle">{SETUP_LABELS.CONFIG_TITLE}</h2>
        
        {error && (
          <div style={{ color: "#ff3333", marginBottom: "1rem", fontWeight: "bold", textAlign: "center" }}>
            {error}
          </div>
        )}

        {/* Dynamic Game Title Input */}
        <div className="form-group">
          <label htmlFor="gameTitle">{SETUP_LABELS.LABEL_GAME_TITLE}</label>
          <input
            id="gameTitle"
            type="text"
            className="setup-input"
            value={gameTitle}
            onChange={(e) => setGameTitle(e.target.value)}
            placeholder={SETUP_LABELS.PLACEHOLDER_GAME_TITLE}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="boardId">{SETUP_LABELS.LABEL_BOARD_ID}</label>
          <input
            id="boardId"
            type="text"
            className="setup-input"
            value={boardId}
            onChange={(e) => setBoardId(e.target.value)}
            placeholder={SETUP_LABELS.PLACEHOLDER_BOARD_ID}
            required
          />
        </div>

        {nameInputs.map((name, idx) => (
          <div className="form-group" key={idx}>
            <label htmlFor={`player-${idx}`}>
              {SETUP_LABELS.LABEL_PLAYER_PREFIX}{idx + 1}{SETUP_LABELS.LABEL_PLAYER_SUFFIX}
            </label>
            <input
              id={`player-${idx}`}
              type="text"
              className="setup-input"
              value={name}
              onChange={(e) => handlePlayerNameChange(idx, e.target.value)}
              placeholder={`${SETUP_LABELS.PLACEHOLDER_PLAYER_PREFIX}${idx + 1}`}
            />
          </div>
        ))}

        <button type="submit" className="start-game-btn">
          {SETUP_LABELS.LAUNCH_BTN_TEXT}
        </button>
      </form>
    </div>
  );
}