import type { Clue, Player } from "../types/game";
import "./Question.css";

interface QuestionProps {
  activeClue: Clue;
  showAnswer: boolean;
  setShowAnswer: (show: boolean) => void;
  players: Player[];
  onAdjustScore: (playerIndex: number, points: number, isCorrect: boolean) => void;
  onClose: () => void;
}

export default function Question({
  activeClue,
  showAnswer,
  setShowAnswer,
  players,
  onAdjustScore,
  onClose,
}: QuestionProps) {
  return (
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
            <button className="close-btn" onClick={onClose}>
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
                  <button className="plus-btn" onClick={() => onAdjustScore(idx, activeClue.points, true)}>
                    Correct (+${activeClue.points})
                  </button>
                  <button className="minus-btn" onClick={() => onAdjustScore(idx, activeClue.points, false)}>
                    Incorrect (-${activeClue.points})
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}