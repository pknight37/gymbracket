import { POINT_SCALE } from "../data/scoring";
import { TOURNAMENT } from "../data/tournament";

/**
 * Count how many picked teams appear in the actual results.
 */
export function countCorrectPicks(picked, actual) {
  if (!picked || !actual) return 0;
  let count = 0;
  for (const name of picked) {
    if (actual.includes(name)) count++;
  }
  return count;
}

/**
 * Score a single participant's bracket against actual results.
 * Returns { total, maxPossible, byRound }.
 */
export function scoreBracket(picks, results, pointScale = POINT_SCALE) {
  let total = 0;
  const byRound = {};

  for (const round of TOURNAMENT.rounds) {
    const roundId = round.id;
    const pts = pointScale[roundId] || 0;

    const roundResult = { correct: 0, possible: 0, points: 0 };

    if (roundId === "championship") {
      const picked = picks[roundId];
      const actual = results[roundId];
      const possible = round.advanceCount;
      const correct = countCorrectPicks(picked, actual);
      roundResult.correct = correct;
      roundResult.possible = possible;
      roundResult.points = correct * pts;
    } else if (roundId === "semifinal") {
      for (const semi of TOURNAMENT.semifinals) {
        const picked = picks[roundId]?.[semi.id];
        const actual = results[roundId]?.[semi.id];
        const correct = countCorrectPicks(picked, actual);
        roundResult.correct += correct;
        roundResult.possible += round.advanceCount;
        roundResult.points += correct * pts;
      }
    } else {
      for (const regional of TOURNAMENT.regionals) {
        const picked = picks[roundId]?.[regional.id];
        const actual = results[roundId]?.[regional.id];
        const correct = countCorrectPicks(picked, actual);
        roundResult.correct += correct;
        roundResult.possible += round.advanceCount;
        roundResult.points += correct * pts;
      }
    }

    total += roundResult.points;
    byRound[roundId] = roundResult;
  }

  return { total, byRound };
}

/**
 * Score all participants and return a sorted leaderboard.
 */
export function scoreAll(picksArray, results, pointScale = POINT_SCALE) {
  const scored = picksArray.map((entry) => ({
    name: entry.name,
    ...scoreBracket(entry.picks, results, pointScale),
  }));

  scored.sort((a, b) => b.total - a.total);

  // Assign ranks (tied scores get the same rank)
  let rank = 1;
  for (let i = 0; i < scored.length; i++) {
    if (i > 0 && scored[i].total < scored[i - 1].total) {
      rank = i + 1;
    }
    scored[i].rank = rank;
  }

  return scored;
}
