import { useParams, Link } from "react-router-dom";
import { PICKS } from "../data/picks";
import { RESULTS } from "../data/results";
import { TOURNAMENT } from "../data/tournament";
import { scoreBracket } from "../utils/scoring";
import ScoreSummary from "./ScoreSummary";
import PicksSelector from "./PicksSelector";
import "../styles/picks.css";
import "../styles/bracket.css";

export default function PicksBracket() {
  const { name } = useParams();

  if (PICKS.length === 0) {
    return (
      <div>
        <div className="page-header">
          <h1 className="page-header__title">Picks</h1>
        </div>
        <div className="empty-state">
          <p className="empty-state__message">
            No bracket picks have been submitted yet.
          </p>
        </div>
      </div>
    );
  }

  if (!name) {
    return (
      <div>
        <div className="page-header">
          <h1 className="page-header__title">Picks</h1>
          <p className="page-header__subtitle">
            Select a participant to view their bracket.
          </p>
        </div>
        <PicksSelector current={null} />
      </div>
    );
  }

  const entry = PICKS.find(
    (p) => p.name.toLowerCase() === decodeURIComponent(name).toLowerCase()
  );

  if (!entry) {
    return (
      <div>
        <div className="page-header">
          <h1 className="page-header__title">Picks</h1>
        </div>
        <div className="empty-state">
          <p className="empty-state__message">
            No picks found for &ldquo;{decodeURIComponent(name)}&rdquo;.
          </p>
          <Link to="/picks">View all participants</Link>
        </div>
      </div>
    );
  }

  const score = scoreBracket(entry.picks, RESULTS);

  return (
    <div>
      <div className="picks-header">
        <div className="page-header">
          <h1 className="page-header__title">{entry.name}&apos;s Picks</h1>
        </div>
        <PicksSelector current={entry.name} />
      </div>

      <ScoreSummary score={score} />

      {/* Picks bracket by regional */}
      <div className="picks-regionals">
        {TOURNAMENT.regionals.map((regional) => (
          <PicksRegional
            key={regional.id}
            regional={regional}
            picks={entry.picks}
            results={RESULTS}
          />
        ))}

        {/* Semifinals */}
        {TOURNAMENT.semifinals.map((semi) => (
          <PicksRound
            key={semi.id}
            label={semi.name}
            picked={entry.picks["semifinal"]?.[semi.id]}
            actual={RESULTS["semifinal"]?.[semi.id]}
          />
        ))}

        {/* Championship */}
        <PicksRound
          label="National Championship"
          picked={entry.picks["championship"]}
          actual={RESULTS["championship"]}
        />
      </div>
    </div>
  );
}

function PicksRegional({ regional, picks, results }) {
  const rounds = ["play-in", "second-round", "regional-final"];

  return (
    <div className="picks-regional">
      <div className="picks-regional__header">
        {regional.name} — {regional.host}
      </div>
      {rounds.map((roundId) => {
        const picked = picks[roundId]?.[regional.id];
        const actual = results[roundId]?.[regional.id];
        if (!picked || picked.length === 0) return null;
        const round = TOURNAMENT.rounds.find((r) => r.id === roundId);
        return (
          <PicksRound
            key={roundId}
            label={round?.name || roundId}
            picked={picked}
            actual={actual}
          />
        );
      })}
    </div>
  );
}

function PicksRound({ label, picked, actual }) {
  if (!picked || picked.length === 0) return null;

  return (
    <div className="picks-round">
      <div className="picks-round__label">{label}</div>
      <div className="picks-round__teams">
        {picked.map((teamName) => {
          let status = "pending";
          if (actual) {
            status = actual.includes(teamName) ? "correct" : "incorrect";
          }
          return (
            <div key={teamName} className={`team-pill team-pill--${status}`}>
              <span className="team-pill__name">{teamName}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
