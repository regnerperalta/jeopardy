import { useState } from "react";
import { APP_CONFIG } from "./constants/gameConfig";
import Board from "./components/Board";
import GameSetup from "./components/GameSetup";
import type { Clue, Player } from "./types/game";
import "./App.css";

type AppStage = "SETUP" | "TRANSITION" | "LIVE";

export default function App() {
  const [stage, setStage] = useState<AppStage>("SETUP");
  const [displayTitle, setDisplayTitle] = useState<string>(APP_CONFIG.DEFAULT_DISPLAY_TITLE);
  
  const [clues, setClues] = useState<Clue[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);

  const handleStartGame = async (boardId: string, playerNames: string[], gameTitle: string) => {
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/board?id=${boardId}`);
    if (!response.ok) throw new Error(APP_CONFIG.ERROR_BOARD_NOT_FOUND(boardId));
    const data = await response.json();
    
    setClues(data.clues);
    setCategories(Array.from(new Set(data.clues.map((c: any) => c.category))));

    const activePlayers = playerNames
      .map((name) => name.trim())
      .filter((name) => name !== "")
      .map((name) => ({ name, score: 0 }));

    setPlayers(
      activePlayers.length 
        ? activePlayers 
        : [{ name: APP_CONFIG.FALLBACK_CONTESTANT_NAME, score: 0 }]
    );
    setDisplayTitle(gameTitle);
    
    setStage("TRANSITION");
    setTimeout(() => {
      setStage("LIVE");
    }, APP_CONFIG.TRANSITION_DELAY_MS);
  };

  const handleLeaveGame = () => {
    if (window.confirm(APP_CONFIG.EXIT_CONFIRM_MESSAGE)) {
      setClues([]);
      setCategories([]);
      setPlayers([]);
      setStage("SETUP");
    }
  };

  return (
    <div className={`jeopardy-container ${stage === "TRANSITION" ? "no-scroll" : ""}`}>
      {stage !== "TRANSITION" && (
        <header className="jeopardy-header">
          <h1 className="jeopardy-title">{displayTitle.toUpperCase()}</h1>
        </header>
      )}

      {stage === "SETUP" && (
        <GameSetup onGameStart={handleStartGame} />
      )}

      {stage === "TRANSITION" && (
        <div className="curtain-splash-screen">
          <div className="splash-card animated-zoom">
            <h1 className="splash-banner-text">{APP_CONFIG.SPLASH_BANNER_TEXT}</h1>
            <p className="splash-subtext">
              {APP_CONFIG.SPLASH_SUBTEXT_PREFIX}{displayTitle}
            </p>
            <div className="island-spinner" />
          </div>
        </div>
      )}

      {stage === "LIVE" && (
        <Board 
          categories={categories} 
          initialClues={clues} 
          initialPlayers={players} 
          onLeaveGame={handleLeaveGame} 
        />
      )}
    </div>
  );
}