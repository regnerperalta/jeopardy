import { useState } from "react";
import Board from "./components/Board";
import GameSetup from "./components/GameSetup";
import type { Clue, Player } from "./types/game";
import "./App.css";

const API_BASE_URL = "https://9qfyhpni04.execute-api.us-east-1.amazonaws.com/prod/";

export default function App() {
  const [isConfigured, setIsConfigured] = useState(false);
  const [displayTitle, setDisplayTitle] = useState("Herencia Quisqueyana");
  
  const [clues, setClues] = useState<Clue[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);

  // Update signature to collect the title string from our Setup form submission
  const handleStartGame = async (boardId: string, playerNames: string[], gameTitle: string) => {
    const response = await fetch(`${API_BASE_URL}/board?id=${boardId}`);
    if (!response.ok) throw new Error(`Could not find Board ID "${boardId}"`);
    const data = await response.json();
    
    const fetchedClues: Clue[] = data.clues;
    setClues(fetchedClues);

    const uniqueCats = Array.from(new Set(fetchedClues.map((c) => c.category)));
    setCategories(uniqueCats);

    const activePlayers = playerNames
      .map((name) => name.trim())
      .filter((name) => name !== "")
      .map((name) => ({ name, score: 0 }));

    setPlayers(activePlayers.length ? activePlayers : [{ name: "Contestant 1", score: 0 }]);
    setDisplayTitle(gameTitle); // 👈 Set custom title state string
    setIsConfigured(true);
  };

  const handleLeaveGame = () => {
    if (window.confirm("Are you sure you want to exit the current board layout? Scores will be reset.")) {
      setClues([]);
      setCategories([]);
      setPlayers([]);
      setIsConfigured(false);
    }
  };

  return (
    <div className="jeopardy-container">
      <header className="jeopardy-header">
        {/* Render the title string dynamically from state! */}
        <h1 className="jeopardy-title">{displayTitle.toUpperCase()}</h1>
      </header>

      {!isConfigured ? (
        <GameSetup onGameStart={handleStartGame} />
      ) : (
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