// Participant bracket picks — populated from PDFs.
// Each entry has { name, picks } where picks has the same shape as RESULTS.
export const PICKS = [
  {
    name: "Lina",
    picks: {
      "play-in": {
        regional1: ["Central Mich."],
        regional2: ["Washington"],
        regional3: ["Nebraska"],
        regional4: ["Arizona St."],
      },
      "second-round": {
        regional1: ["Oklahoma", "Missouri", "Arkansas", "Ohio St."],
        regional2: ["UCLA", "Alabama", "Utah", "Minnesota"],
        regional3: ["LSU", "Stanford", "Michigan", "Auburn"],
        regional4: ["Florida", "Georgia", "Michigan St.", "California"],
      },
      "regional-final": {
        regional1: ["Oklahoma", "Arkansas"],
        regional2: ["UCLA", "Utah"],
        regional3: ["LSU", "Stanford"],
        regional4: ["Florida", "Georgia"],
      },
      "semifinal": {
        semi2: ["Oklahoma", "Utah"],
        semi1: ["LSU", "Florida"],
      },
      "championship": ["LSU"],
    },
  },
];
