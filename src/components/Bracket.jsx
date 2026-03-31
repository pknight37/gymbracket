import { TOURNAMENT } from "../data/tournament";
import { RESULTS } from "../data/results";
import BracketRegional from "./BracketRegional";
import TeamPill from "./TeamPill";
import "../styles/bracket.css";

export default function Bracket() {
  const regionalsById = Object.fromEntries(
    TOURNAMENT.regionals.map((r) => [r.id, r])
  );

  // Build semifinal and championship team lists from results
  const semi1Teams = buildSemiTeams("semi1", TOURNAMENT, RESULTS);
  const semi2Teams = buildSemiTeams("semi2", TOURNAMENT, RESULTS);
  const semi1Results = RESULTS["semifinal"]?.semi1 || null;
  const semi2Results = RESULTS["semifinal"]?.semi2 || null;

  const champTeams = buildChampTeams(TOURNAMENT, RESULTS);
  const champResults = RESULTS["championship"] || null;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-header__title">Tournament Bracket</h1>
        <p className="page-header__subtitle">
          {TOURNAMENT.name} &mdash; {TOURNAMENT.nationalsVenue}
        </p>
      </div>

      {/* Desktop: full grid bracket */}
      <div className="bracket-grid" aria-label="Tournament bracket">
        {/* Left side: Regional 1 (top) and Regional 2 (bottom) */}
        <div className="bracket-grid__side bracket-grid__side--left">
          <BracketRegional
            regional={regionalsById.regional1}
            results={RESULTS}
          />
          <BracketRegional
            regional={regionalsById.regional2}
            results={RESULTS}
          />
        </div>

        {/* Center: Semifinals + Championship */}
        <div className="bracket-grid__center">
          {/* Semifinal II (left regionals) */}
          <div className="bracket-semi">
            <div className="bracket-semi__label">Semifinal II</div>
            {semi2Teams.length > 0 ? (
              <div className="bracket-semi__teams">
                {semi2Teams.map((t) => (
                  <TeamPill
                    key={t.name}
                    team={t}
                    status={getTeamStatus(t.name, semi2Results)}
                  />
                ))}
              </div>
            ) : (
              <div className="bracket-semi__pending">TBD</div>
            )}
          </div>

          {/* Championship */}
          <div className="bracket-championship">
            <div className="bracket-championship__title">
              National Championship
            </div>
            <div className="bracket-championship__venue">
              {TOURNAMENT.championship.date} &middot;{" "}
              {TOURNAMENT.championship.time}
              <br />
              {TOURNAMENT.nationalsVenue} &middot;{" "}
              {TOURNAMENT.championship.network}
            </div>
            {champTeams.length > 0 ? (
              <div className="bracket-semi__teams">
                {champTeams.map((t) => (
                  <TeamPill
                    key={t.name}
                    team={t}
                    status={getTeamStatus(t.name, champResults)}
                  />
                ))}
              </div>
            ) : (
              <div className="bracket-semi__pending">TBD</div>
            )}
            {champResults && champResults.length > 0 && (
              <div className="bracket-championship__winner">
                {champResults[0]}
              </div>
            )}
          </div>

          {/* Semifinal I (right regionals) */}
          <div className="bracket-semi">
            <div className="bracket-semi__label">Semifinal I</div>
            {semi1Teams.length > 0 ? (
              <div className="bracket-semi__teams">
                {semi1Teams.map((t) => (
                  <TeamPill
                    key={t.name}
                    team={t}
                    status={getTeamStatus(t.name, semi1Results)}
                  />
                ))}
              </div>
            ) : (
              <div className="bracket-semi__pending">TBD</div>
            )}
          </div>
        </div>

        {/* Right side: Regional 3 (top) and Regional 4 (bottom) */}
        <div className="bracket-grid__side bracket-grid__side--right">
          <BracketRegional
            regional={regionalsById.regional3}
            results={RESULTS}
          />
          <BracketRegional
            regional={regionalsById.regional4}
            results={RESULTS}
          />
        </div>
      </div>
    </div>
  );
}

function getTeamStatus(teamName, results) {
  if (!results) return "pending";
  return results.includes(teamName) ? "advanced" : "eliminated";
}

/**
 * Build the list of teams in a semifinal from regional final results.
 */
function buildSemiTeams(semiId, tournament, results) {
  const semi = tournament.semifinals.find((s) => s.id === semiId);
  if (!semi) return [];

  const teams = [];
  for (const regId of semi.regionals) {
    const advancedNames = results["regional-final"]?.[regId];
    if (!advancedNames) continue;

    const regional = tournament.regionals.find((r) => r.id === regId);
    if (!regional) continue;

    for (const name of advancedNames) {
      const team = regional.teams.find((t) => t.name === name);
      if (team) teams.push(team);
    }
  }
  return teams;
}

/**
 * Build the list of teams in the championship from semifinal results.
 */
function buildChampTeams(tournament, results) {
  const teams = [];
  for (const semi of tournament.semifinals) {
    const advancedNames = results["semifinal"]?.[semi.id];
    if (!advancedNames) continue;

    for (const regId of semi.regionals) {
      const regional = tournament.regionals.find((r) => r.id === regId);
      if (!regional) continue;

      for (const name of advancedNames) {
        const team = regional.teams.find((t) => t.name === name);
        if (team) teams.push(team);
      }
    }
  }
  return teams;
}
