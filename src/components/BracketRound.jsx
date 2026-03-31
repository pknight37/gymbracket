import TeamPill from "./TeamPill";

export default function BracketRound({ label, teams, advancedTeams }) {
  function getStatus(team) {
    if (!advancedTeams) return "pending";
    if (advancedTeams.includes(team.name)) return "advanced";
    return "eliminated";
  }

  return (
    <div className="bracket-round">
      {label && <div className="bracket-round__label">{label}</div>}
      {teams.map((team) => (
        <TeamPill key={team.name} team={team} status={getStatus(team)} />
      ))}
    </div>
  );
}
