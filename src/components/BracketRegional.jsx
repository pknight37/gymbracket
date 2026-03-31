import BracketRound from "./BracketRound";

/**
 * Renders one regional (quadrant) of the bracket.
 * Shows play-in, second round, and regional final columns.
 */
export default function BracketRegional({ regional, results }) {
  const playInTeams = regional.teams.filter((t) => t.playIn);
  const nonPlayInTeams = regional.teams.filter((t) => !t.playIn);

  // Play-in results
  const playInResults = results["play-in"]?.[regional.id] || null;

  // Second round: 7 non-play-in teams + play-in winner
  const secondRoundTeams = buildSecondRoundTeams(
    nonPlayInTeams,
    playInTeams,
    playInResults
  );
  const secondRoundResults = results["second-round"]?.[regional.id] || null;

  // Regional final: top 4 from second round
  const regionalFinalTeams = buildNextRoundTeams(
    secondRoundTeams,
    secondRoundResults
  );
  const regionalFinalResults =
    results["regional-final"]?.[regional.id] || null;

  return (
    <div className="bracket-regional">
      <div className="bracket-regional__header">
        {regional.name} — {regional.host}
      </div>
      <div className="bracket-regional__rounds">
        {playInTeams.length > 0 && (
          <BracketRound
            label="First Round"
            teams={playInTeams}
            advancedTeams={playInResults}
          />
        )}
        <BracketRound
          label="Second Round"
          teams={secondRoundTeams}
          advancedTeams={secondRoundResults}
        />
        {regionalFinalTeams.length > 0 && (
          <BracketRound
            label="Regional Final"
            teams={regionalFinalTeams}
            advancedTeams={regionalFinalResults}
          />
        )}
      </div>
    </div>
  );
}

function buildSecondRoundTeams(nonPlayInTeams, playInTeams, playInResults) {
  if (!playInResults || playInResults.length === 0) {
    // Play-in hasn't happened — show all 9 teams
    return [...nonPlayInTeams, ...playInTeams];
  }
  // Replace play-in pair with the winner
  const winner = playInTeams.find((t) => playInResults.includes(t.name));
  if (winner) {
    return [...nonPlayInTeams, winner];
  }
  return nonPlayInTeams;
}

function buildNextRoundTeams(prevTeams, advancedNames) {
  if (!advancedNames || advancedNames.length === 0) return [];
  return prevTeams.filter((t) => advancedNames.includes(t.name));
}
