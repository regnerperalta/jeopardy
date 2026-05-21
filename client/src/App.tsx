import { useEffect, useState } from "react";

const API_BASE_URL = "https://9qfyhpni04.execute-api.us-east-1.amazonaws.com/prod/";

interface Clue {
  pk: string;
  sk: string;
  category: string;
  points: number;
  question: string;
  answer: string;
  isRevealed?: boolean;
}

interface Player {
  name: string;
  score: number;
}

export default function App() {
  const [clues, setClues] = useState<Clue[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Game Session States
  const [players, setPlayers] = useState<Player[]>([
    { name: "Player 1", score: 0 },
    { name: "Player 2", score: 0 },
    { name: "Player 3", score: 0 },
  ]);
  const [activeClue, setActiveClue] = useState<Clue | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  // 1. Fetch data from your API Gateway on Mount
  useEffect(() => {
    async function loadGame() {
      try {
        const response = await fetch(`${API_BASE_URL}/board?id=001`);
        if (!response.ok) throw new Error("Failed to communicate with API");
        const data = await response.json();
        
        const fetchedClues: Clue[] = data.clues;
        setClues(fetchedClues);

        // Extract distinct categories dynamically
        const uniqueCats = Array.from(new Set(fetchedClues.map((c) => c.category)));
        setCategories(uniqueCats);
      } catch (err: any) {
        setError(err.message || "Something went wrong loading the deck.");
      } finally {
        setLoading(false);
      }
    }
    loadGame();
  }, []);

  // 2. Scorekeeper Adjustments
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
      // Mark clue as used so it grays out on the main TV grid
      setClues((prev) =>
        prev.map((c) => (c.sk === activeClue.sk ? { ...c, isRevealed: true } : c))
      );
    }
    setActiveClue(null);
    setShowAnswer(false);
  };

  if (loading) return <div style={styles.centeredMessage}>Assembling Game Deck...</div>;
  if (error) return <div style={styles.centeredMessage}>Error: {error}</div>;

  return (
    <div style={styles.container}>
      {/* HEADER LOGO ZONE */}
      <header style={styles.header}>
        <h1 style={styles.title}>PARTY JEOPARDY</h1>
      </header>

      {/* MAIN GAME BOARD VIEW */}
      {!activeClue ? (
        <div style={styles.boardGrid(categories.length || 1)}>
          {/* Render Category Headers */}
          {categories.map((cat) => (
            <div key={cat} style={styles.categoryHeader}>
              {cat.toUpperCase()}
            </div>
          ))}

          {/* Render Value Tiles Grouped by Point Order */}
          {[100, 200, 300, 400, 500].map((value) =>
            categories.map((cat) => {
              const clue = clues.find((c) => c.category === cat && c.points === value);
              if (!clue) return <div key={`${cat}-${value}`} style={styles.emptyTile} />;
              
              return (
                <button
                  key={clue.sk}
                  disabled={clue.isRevealed}
                  style={clue.isRevealed ? styles.disabledTile : styles.clueTile}
                  onClick={() => setActiveClue(clue)}
                >
                  ${clue.points}
                </button>
              );
            })
          )}
        </div>
      ) : (
        /* BIG SCREEN CARD REVEAL VIEW */
        <div style={styles.activeCardOverlay}>
          <div style={styles.clueCardContent}>
            <h3 style={styles.cardCategory}>{activeClue.category.toUpperCase()}</h3>
            <p style={styles.bigQuestionText}>
              {showAnswer ? `ANSWER: ${activeClue.answer}` : `CLUE: ${activeClue.question}`}
            </p>
            
            <div style={styles.hostControls}>
              {!showAnswer ? (
                <button style={styles.actionBtn} onClick={() => setShowAnswer(true)}>
                  Reveal Answer
                </button>
              ) : (
                <button style={styles.closeBtn} onClick={closeClueCard}>
                  Return to Board
                </button>
              )}
            </div>

            {/* SCOREKEEPER PANELS (Visible on the same screen) */}
            <div style={styles.scorekeeperConsole}>
              <h4>Scorekeeper Console: Adjust Player Points</h4>
              <div style={styles.consoleRow}>
                {players.map((p, idx) => (
                  <div key={idx} style={styles.playerAdjustmentCard}>
                    <span><strong>{p.name}</strong></span>
                    <div style={styles.btnGroup}>
                      <button 
                        style={styles.plusBtn} 
                        onClick={() => adjustScore(idx, activeClue.points, true)}
                      >
                        Correct (+${activeClue.points})
                      </button>
                      <button 
                        style={styles.minusBtn} 
                        onClick={() => adjustScore(idx, activeClue.points, false)}
                      >
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

      {/* FIXED FOOTER SCOREBOARD FOR THE TV SCREEN */}
      <footer style={styles.scoreboard}>
        {players.map((player, idx) => (
          <div key={idx} style={styles.playerScoreCard}>
            <div style={styles.playerName}>{player.name}</div>
            <div style={player.score < 0 ? styles.negativeScore : styles.positiveScore}>
              {player.score < 0 ? `-$${Math.abs(player.score)}` : `$${player.score}`}
            </div>
          </div>
        ))}
      </footer>
    </div>
  );
}

// Minimalist, high-contrast style maps for standard TV displays
const styles: any = {
  container: {
    backgroundColor: "#000080", // Classic deep blue Jeopardy aesthetic
    color: "#ffffff",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    padding: "1rem",
    fontFamily: "'Impact', 'Arial Black', sans-serif",
  },
  header: { textAlign: "center", marginBottom: "1rem" },
  title: { fontSize: "2.5rem", letterSpacing: "2px", color: "#FFFF00" },
  boardGrid: (cols: number) => ({
    display: "grid",
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gap: "10px",
    flexGrow: 1,
    marginBottom: "120px", // space for fixed scoreboard
  }),
  categoryHeader: {
    backgroundColor: "#0000a0",
    border: "2px solid #000",
    padding: "15px 5px",
    textAlign: "center",
    fontSize: "1.2rem",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60px",
    textShadow: "2px 2px #000",
  },
  clueTile: {
    backgroundColor: "#0000ff",
    border: "2px solid #000",
    color: "#FFFF00", // Gold point totals
    fontSize: "2rem",
    fontWeight: "bold",
    cursor: "pointer",
    minHeight: "90px",
    transition: "transform 0.1s ease",
  },
  disabledTile: {
    backgroundColor: "#000033",
    border: "2px solid #000",
    color: "#333366",
    fontSize: "2rem",
    minHeight: "90px",
    cursor: "not-allowed",
  },
  emptyTile: { backgroundColor: "#000033", minHeight: "90px" },
  activeCardOverlay: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "120px",
  },
  clueCardContent: {
    backgroundColor: "#0000a0",
    border: "4px solid #FFFF00",
    borderRadius: "12px",
    padding: "3rem 2rem",
    width: "85%",
    maxWidth: "900px",
    textAlign: "center",
    boxShadow: "0px 10px 30px rgba(0,0,0,0.5)",
  },
  cardCategory: { color: "#FFFF00", fontSize: "1.5rem", marginBottom: "1.5rem" },
  bigQuestionText: { fontSize: "2.2rem", lineHeight: "1.4", margin: "2rem 0" },
  hostControls: { margin: "2rem 0", display: "flex", justifyContent: "center", gap: "15px" },
  actionBtn: { padding: "12px 24px", fontSize: "1.2rem", backgroundColor: "#FFFF00", color: "#000", border: "none", cursor: "pointer", fontWeight: "bold" },
  closeBtn: { padding: "12px 24px", fontSize: "1.2rem", backgroundColor: "#fff", color: "#000", border: "none", cursor: "pointer", fontWeight: "bold" },
  scorekeeperConsole: { borderTop: "2px dashed #FFFF00", paddingTop: "1.5rem", marginTop: "2rem" },
  consoleRow: { display: "flex", justifyContent: "space-around", gap: "10px", flexWrap: "wrap" },
  playerAdjustmentCard: { backgroundColor: "#000066", padding: "10px", borderRadius: "6px", display: "flex", flexDirection: "column", gap: "8px", minWidth: "200px" },
  btnGroup: { display: "flex", flexDirection: "column", gap: "5px" },
  plusBtn: { backgroundColor: "#00cc44", color: "#fff", border: "none", padding: "6px", cursor: "pointer", fontWeight: "bold" },
  minusBtn: { backgroundColor: "#cc0000", color: "#fff", border: "none", padding: "6px", cursor: "pointer", fontWeight: "bold" },
  scoreboard: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    height: "100px",
    backgroundColor: "#000",
    borderTop: "3px solid #FFFF00",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    padding: "0 2rem",
  },
  playerScoreCard: { textAlign: "center" },
  playerName: { fontSize: "1.1rem", color: "#aaa" },
  positiveScore: { fontSize: "2rem", color: "#00ff00" },
  negativeScore: { fontSize: "2rem", color: "#ff3333" },
  centeredMessage: { display: "flex", justifyContent: "center", alignPage: "center", height: "100vh", backgroundColor: "#000080", color: "#fff", fontSize: "2rem" },
};