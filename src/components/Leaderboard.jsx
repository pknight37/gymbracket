import { Link } from "react-router-dom";
import { PICKS } from "../data/picks";
import { RESULTS } from "../data/results";
import { scoreAll } from "../utils/scoring";
import "../styles/leaderboard.css";

export default function Leaderboard() {
  if (PICKS.length === 0) {
    return (
      <div>
        <div className="page-header">
          <h1 className="page-header__title">Leaderboard</h1>
          <p className="page-header__subtitle">Bracket challenge standings</p>
        </div>
        <div className="empty-state">
          <p className="empty-state__message">
            No bracket picks have been submitted yet.
          </p>
        </div>
      </div>
    );
  }

  const leaderboard = scoreAll(PICKS, RESULTS);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-header__title">Leaderboard</h1>
        <p className="page-header__subtitle">Bracket challenge standings</p>
      </div>
      <div className="leaderboard">
        <table className="leaderboard__table">
          <thead>
            <tr>
              <th className="leaderboard__rank">#</th>
              <th>Name</th>
              <th className="leaderboard__score">Score</th>
              <th className="leaderboard__possible">Play-in</th>
              <th className="leaderboard__possible">2nd Rnd</th>
              <th className="leaderboard__possible">Reg Final</th>
              <th className="leaderboard__possible">Semis</th>
              <th className="leaderboard__possible">Champ</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry) => (
              <tr
                key={entry.name}
                className={
                  entry.rank === 1 ? "leaderboard__row--leader" : undefined
                }
              >
                <td className="leaderboard__rank">{entry.rank}</td>
                <td className="leaderboard__name">
                  <Link to={`/picks/${encodeURIComponent(entry.name)}`}>
                    {entry.name}
                  </Link>
                </td>
                <td className="leaderboard__score">{entry.total}</td>
                <td className="leaderboard__possible">
                  {entry.byRound["play-in"]?.points || 0}
                </td>
                <td className="leaderboard__possible">
                  {entry.byRound["second-round"]?.points || 0}
                </td>
                <td className="leaderboard__possible">
                  {entry.byRound["regional-final"]?.points || 0}
                </td>
                <td className="leaderboard__possible">
                  {entry.byRound["semifinal"]?.points || 0}
                </td>
                <td className="leaderboard__possible">
                  {entry.byRound["championship"]?.points || 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
