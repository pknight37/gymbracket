export default function ScoreSummary({ score }) {
  return (
    <div className="score-summary">
      <div className="score-summary__card score-summary__card--total">
        <div className="score-summary__value">{score.total}</div>
        <div className="score-summary__label">Total Score</div>
      </div>
      {Object.entries(score.byRound).map(([roundId, data]) => (
        <div key={roundId} className="score-summary__card">
          <div className="score-summary__value">
            {data.correct}/{data.possible}
          </div>
          <div className="score-summary__label">{formatRound(roundId)}</div>
        </div>
      ))}
    </div>
  );
}

function formatRound(roundId) {
  const labels = {
    "play-in": "Play-in",
    "second-round": "2nd Round",
    "regional-final": "Reg Final",
    "semifinal": "Semis",
    "championship": "Champ",
  };
  return labels[roundId] || roundId;
}
