export type LiveIncident = {
  id: string;
  minute: string;
  team: "home" | "away" | "neutral";
  type: "goal" | "yellow" | "substitution" | "kickoff";
  primary: string;
  secondary?: string;
};

export type LiveStat = {
  label: string;
  home: number;
  away: number;
  format?: "number" | "percent";
};

export const liveMatch = {
  id: "valencia-barcelona",
  competition: "La Liga",
  stage: "Matchday 4",
  status: "live" as const,
  home: { name: "Valencia", code: "VAL", score: 0, record: "0–1–2", color: "#C97928" },
  away: { name: "Barcelona", code: "BAR", score: 2, record: "3–0–0", color: "#2E4E83" },
  baseSeconds: 26 * 60 + 49,
  period: "1st half",
  venue: "Valencia Stadium",
  provider: "ESPN+",
  viewingState: "access" as const,
  freshness: "Demo feed updated 4 seconds ago",
  source: "Simulated licensed-feed contract",
  accessNote: "Live option listed for the U.S. A subscription and location restrictions may apply.",
  incidents: [
    { id: "goal-1", minute: "6′", team: "away", type: "goal", primary: "Lamine Yamal", secondary: "Barcelona lead 0–1" },
    { id: "yellow-1", minute: "16′", team: "home", type: "yellow", primary: "Pepelu", secondary: "Yellow card" },
    { id: "goal-2", minute: "22′", team: "away", type: "goal", primary: "Fermín López", secondary: "Barcelona lead 0–2" },
    { id: "kickoff", minute: "0′", team: "neutral", type: "kickoff", primary: "Kickoff", secondary: "First half" },
  ] as LiveIncident[],
  stats: [
    { label: "Possession", home: 25, away: 75, format: "percent" },
    { label: "Shots", home: 0, away: 3, format: "number" },
    { label: "Shots on goal", home: 0, away: 3, format: "number" },
    { label: "Corners", home: 0, away: 1, format: "number" },
    { label: "Total passes", home: 36, away: 189, format: "number" },
    { label: "Fouls", home: 4, away: 2, format: "number" },
  ] as LiveStat[],
  table: [
    { rank: 1, club: "Barcelona", played: 3, points: 9 },
    { rank: 2, club: "Real Madrid", played: 3, points: 7 },
    { rank: 3, club: "Villarreal", played: 3, points: 7 },
    { rank: 16, club: "Valencia", played: 3, points: 1 },
  ],
};

export const formatMatchClock = (seconds: number) => {
  const minute = Math.floor(seconds / 60);
  const second = seconds % 60;
  return `${minute}:${second.toString().padStart(2, "0")}`;
};
