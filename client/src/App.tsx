import { useState } from "react";
import Board from "./components/Board";
import GameSetup from "./components/GameSetup";
import type { Clue, Player } from "./types/game";
import "./App.css";

const API_BASE_URL = "https://9qfyhpni04.execute-api.us-east-1.amazonaws.com/prod/";

type AppStage = "SETUP" | "TRANSITION" | "LIVE";

export default function App() {
  const [stage, setStage] = useState<AppStage>("SETUP");
  const [displayTitle, setDisplayTitle] = useState("HERENCIA QUISQUEYANA");
  
  const [clues, setClues] = useState<Clue[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);

  const handleStartGame = async (boardId: string, playerNames: string[], gameTitle: string) => {
    const response = await fetch(`${API_BASE_URL}/board?id=${boardId}`);
    if (!response.ok) throw new Error(`Could not find Board ID "${boardId}"`);
    const data = await response.json();
    
    setClues(data.clues);
    setCategories(Array.from(new Set(data.clues.map((c: any) => c.category))));

    const activePlayers = playerNames
      .map((name) => name.trim())
      .filter((name) => name !== "")
      .map((name) => ({ name, score: 0 }));

    setPlayers(activePlayers.length ? activePlayers : [{ name: "Contestant 1", score: 0 }]);
    setDisplayTitle(gameTitle);
    
    // Trigger transition curtain drop sequence
    setStage("TRANSITION");
    setTimeout(() => {
      setStage("LIVE");
    }, 2500);
  };

  const handleLeaveGame = () => {
    if (window.confirm("Are you sure you want to exit? Scores will be reset.")) {
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
            <h1 className="splash-banner-text">¡PREPÁRATE!</h1>
            <p className="splash-subtext">Cargando Tablero de {displayTitle}</p>
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