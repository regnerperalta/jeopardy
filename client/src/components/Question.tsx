import type { Clue, Player } from "../types/game";
import { GAME_LABELS } from "../constants/gameConfig";
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
          {showAnswer 
            ? `${GAME_LABELS.ANSWER_PREFIX}${activeClue.answer}` 
            : `${GAME_LABELS.CLUE_PREFIX}${activeClue.question}`
          }
        </p>
        
        <div className="host-controls">
          {!showAnswer ? (
            <button className="action-btn" onClick={() => setShowAnswer(true)}>
              {GAME_LABELS.REVEAL_ANSWER}
            </button>
          ) : (
            <button className="close-btn" onClick={onClose}>
              {GAME_LABELS.RETURN_TO_BOARD}
            </button>
          )}
        </div>

        <div className="scorekeeper-console">
          <h4>{GAME_LABELS.CONSOLE_TITLE}</h4>
          <div className="console-row">
            {players.map((p, idx) => (
              <div key={idx} className="player-adjustment-card">
                <span><strong>{p.name}</strong></span>
                <div className="btn-group">
                  <button className="plus-btn" onClick={() => onAdjustScore(idx, activeClue.points, true)}>
                    {GAME_LABELS.CORRECT_PREFIX}{activeClue.points}{GAME_LABELS.CLOSE_PAREN}
                  </button>
                  <button className="minus-btn" onClick={() => onAdjustScore(idx, activeClue.points, false)}>
                    {GAME_LABELS.INCORRECT_PREFIX}{activeClue.points}{GAME_LABELS.CLOSE_PAREN}
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