export default function TeamPill({ team, status }) {
  const modifier = status ? ` team-pill--${status}` : "";

  return (
    <div className={`team-pill${modifier}`}>
      {team.seed != null && (
        <span className="team-pill__seed">{team.seed}</span>
      )}
      <span className="team-pill__name">
        {team.isHost && <span className="team-pill__host">* </span>}
        {team.name}
      </span>
      <span className="team-pill__score">{team.nqs.toFixed(3)}</span>
    </div>
  );
}
