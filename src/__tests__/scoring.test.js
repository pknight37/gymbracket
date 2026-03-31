import { describe, it, expect } from "vitest";
import { countCorrectPicks, scoreBracket, scoreAll } from "../utils/scoring";

describe("countCorrectPicks", () => {
  it("returns 0 for null/undefined inputs", () => {
    expect(countCorrectPicks(null, null)).toBe(0);
    expect(countCorrectPicks(undefined, ["LSU"])).toBe(0);
    expect(countCorrectPicks(["LSU"], null)).toBe(0);
  });

  it("returns 0 when no picks match", () => {
    expect(countCorrectPicks(["LSU", "Utah"], ["Oklahoma", "Florida"])).toBe(0);
  });

  it("counts matching team names", () => {
    expect(
      countCorrectPicks(
        ["LSU", "Utah", "Oklahoma"],
        ["LSU", "Oklahoma", "Florida"]
      )
    ).toBe(2);
  });

  it("returns full count when all picks match", () => {
    expect(
      countCorrectPicks(["LSU", "Oklahoma"], ["LSU", "Oklahoma", "Florida"])
    ).toBe(2);
  });
});

describe("scoreBracket", () => {
  const pointScale = {
    "play-in": 1,
    "second-round": 2,
    "regional-final": 4,
    "semifinal": 8,
    "championship": 16,
  };

  it("returns 0 total for empty results", () => {
    const picks = {
      "play-in": { regional1: ["Maryland"] },
    };
    const results = {};
    const score = scoreBracket(picks, results, pointScale);
    expect(score.total).toBe(0);
  });

  it("scores play-in correctly", () => {
    const picks = {
      "play-in": {
        regional1: ["Maryland"],
        regional2: ["BYU"],
        regional3: ["UC Davis"],
        regional4: ["Clemson"],
      },
    };
    const results = {
      "play-in": {
        regional1: ["Maryland"],
        regional2: ["BYU"],
        regional3: ["Illinois"],
        regional4: ["Clemson"],
      },
    };
    const score = scoreBracket(picks, results, pointScale);
    expect(score.byRound["play-in"].correct).toBe(3);
    expect(score.byRound["play-in"].points).toBe(3);
    expect(score.total).toBe(3);
  });

  it("scores multiple rounds", () => {
    const picks = {
      "play-in": {
        regional1: ["Maryland"],
        regional2: ["BYU"],
        regional3: ["Illinois"],
        regional4: ["Clemson"],
      },
      "second-round": {
        regional1: ["LSU", "Michigan St.", "Kentucky", "Arkansas"],
        regional2: ["Utah", "UCLA", "Minnesota", "Stanford"],
        regional3: ["Oklahoma", "Missouri", "Georgia", "Auburn"],
        regional4: ["Florida", "California", "Alabama", "Oregon St."],
      },
    };
    const results = {
      "play-in": {
        regional1: ["Maryland"],
        regional2: ["BYU"],
        regional3: ["Illinois"],
        regional4: ["Clemson"],
      },
      "second-round": {
        regional1: ["LSU", "Michigan St.", "Kentucky", "Arkansas"],
        regional2: ["Utah", "UCLA", "Minnesota", "Stanford"],
        regional3: ["Oklahoma", "Missouri", "Georgia", "Auburn"],
        regional4: ["Florida", "California", "Alabama", "Oregon St."],
      },
    };
    const score = scoreBracket(picks, results, pointScale);
    // 4 play-in correct * 1pt = 4
    // 16 second-round correct * 2pt = 32
    expect(score.total).toBe(36);
  });

  it("scores championship round", () => {
    const picks = { championship: ["Oklahoma"] };
    const results = { championship: ["Oklahoma"] };
    const score = scoreBracket(picks, results, pointScale);
    expect(score.byRound["championship"].correct).toBe(1);
    expect(score.byRound["championship"].points).toBe(16);
  });
});

describe("scoreAll", () => {
  const pointScale = {
    "play-in": 1,
    "second-round": 2,
    "regional-final": 4,
    "semifinal": 8,
    "championship": 16,
  };

  it("returns empty array for no picks", () => {
    expect(scoreAll([], {}, pointScale)).toEqual([]);
  });

  it("sorts participants by score descending", () => {
    const results = {
      "play-in": {
        regional1: ["Maryland"],
        regional2: ["BYU"],
        regional3: ["Illinois"],
        regional4: ["Clemson"],
      },
    };
    const picks = [
      {
        name: "Alice",
        picks: {
          "play-in": {
            regional1: ["Maryland"],
            regional2: ["BYU"],
            regional3: ["Illinois"],
            regional4: ["Clemson"],
          },
        },
      },
      {
        name: "Bob",
        picks: {
          "play-in": {
            regional1: ["Maryland"],
            regional2: ["Utah St."],
            regional3: ["UC Davis"],
            regional4: ["Rutgers"],
          },
        },
      },
    ];
    const leaderboard = scoreAll(picks, results, pointScale);
    expect(leaderboard[0].name).toBe("Alice");
    expect(leaderboard[0].total).toBe(4);
    expect(leaderboard[0].rank).toBe(1);
    expect(leaderboard[1].name).toBe("Bob");
    expect(leaderboard[1].total).toBe(1);
    expect(leaderboard[1].rank).toBe(2);
  });

  it("assigns same rank for tied scores", () => {
    const results = {
      "play-in": {
        regional1: ["Maryland"],
        regional2: ["BYU"],
        regional3: ["Illinois"],
        regional4: ["Clemson"],
      },
    };
    const picks = [
      {
        name: "Alice",
        picks: {
          "play-in": {
            regional1: ["Maryland"],
            regional2: ["BYU"],
            regional3: ["UC Davis"],
            regional4: ["Rutgers"],
          },
        },
      },
      {
        name: "Bob",
        picks: {
          "play-in": {
            regional1: ["Maryland"],
            regional2: ["Utah St."],
            regional3: ["Illinois"],
            regional4: ["Rutgers"],
          },
        },
      },
    ];
    const leaderboard = scoreAll(picks, results, pointScale);
    expect(leaderboard[0].rank).toBe(1);
    expect(leaderboard[1].rank).toBe(1);
  });
});
