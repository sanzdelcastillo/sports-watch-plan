import { demoEvents, type DemoEvent } from "@/data/demo";

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

export type LiveMatchData = {
  id: string;
  competition: string;
  stage: string;
  status: "live" | "unavailable";
  home: { name: string; code: string; score: number; record: string; color: string };
  away: { name: string; code: string; score: number; record: string; color: string };
  baseSeconds: number;
  period: string;
  venue: string;
  provider?: string;
  viewingLabel: string;
  freshness: string;
  source: string;
  accessNote: string;
  incidents: LiveIncident[];
  stats: LiveStat[];
  table: { rank: number; club: string; played: number; points: number }[];
};

const showcaseEvent: DemoEvent = {
  id: "valencia-barcelona",
  startUtc: "2026-09-13T18:00:00Z",
  competition: "La Liga",
  competitionCode: "LL",
  region: "Spain",
  home: "Valencia",
  away: "Barcelona",
  venue: "Valencia Stadium",
  stage: "Matchday 4",
  status: "scheduled",
  viewingState: "access",
  provider: "ESPN+",
  service: "Streaming subscription",
  availability: "live",
  accessNote: "Live option listed for the U.S. A subscription and location restrictions may apply.",
  freshness: "Demo feed updated 4 seconds ago",
  source: "Simulated licensed-feed contract",
  sourceUrlLabel: "Simulated live evidence record",
  reasons: ["Barcelona", "La Liga"],
  coverageTier: "A",
  narrative: "A simulated Live Center example.",
};

const palette = ["#B64132", "#2E4E83", "#B07A2B", "#336E54", "#6B4A78", "#7B3434"];
const viewingLabels = {
  verified: "Verified live option",
  access: "Live option · access may vary",
  unknown: "Viewing not confirmed",
  stale: "Last-known viewing option",
  replay: "Replay option",
  unavailable: "Viewing unavailable",
};

const scoreOverrides: Record<string, [number, number, number]> = {
  "valencia-barcelona": [0, 2, 26 * 60 + 49],
  "arsenal-chelsea": [1, 1, 63 * 60 + 12],
  "arsenal-man-city": [2, 1, 71 * 60 + 8],
};

const hashId = (value: string) => Array.from(value).reduce((sum, char) => sum + char.charCodeAt(0), 0);
const teamCode = (name: string) => name.replace(/[^A-Za-z ]/g, "").split(" ").filter(Boolean).map((part) => part[0]).join("").slice(0, 3).toUpperCase() || name.slice(0, 3).toUpperCase();

export const resolveLiveEvent = (id?: string) => {
  const requestedId = id || "arsenal-chelsea";
  if (requestedId === showcaseEvent.id) return showcaseEvent;
  return demoEvents.find((event) => event.id === requestedId);
};

export const createLiveMatch = (event: DemoEvent): LiveMatchData => {
  const seed = hashId(event.id);
  const [homeScore, awayScore, baseSeconds] = scoreOverrides[event.id] || [seed % 3, Math.floor(seed / 3) % 3, (31 + seed % 43) * 60 + seed % 60];
  const minute = Math.floor(baseSeconds / 60);
  const isUnavailable = event.status === "postponed" || event.status === "date_confirmed_time_tbd";
  const incidents: LiveIncident[] = [];

  for (let index = 0; index < homeScore; index += 1) {
    const eventMinute = 8 + index * 19;
    incidents.push({ id: `${event.id}-home-goal-${index}`, minute: `${eventMinute}′`, team: "home", type: "goal", primary: `${event.home} goal`, secondary: `Score update · ${event.home}` });
  }
  for (let index = 0; index < awayScore; index += 1) {
    const eventMinute = 14 + index * 23;
    incidents.push({ id: `${event.id}-away-goal-${index}`, minute: `${eventMinute}′`, team: "away", type: "goal", primary: `${event.away} goal`, secondary: `Score update · ${event.away}` });
  }
  incidents.push({ id: `${event.id}-yellow`, minute: `${Math.min(58, 17 + seed % 24)}′`, team: seed % 2 ? "home" : "away", type: "yellow", primary: "Yellow card", secondary: seed % 2 ? event.home : event.away });
  incidents.push({ id: `${event.id}-kickoff`, minute: "0′", team: "neutral", type: "kickoff", primary: "Kickoff", secondary: "First half" });
  incidents.sort((a, b) => Number.parseInt(b.minute) - Number.parseInt(a.minute));

  const possession = 38 + seed % 25;
  const homeShots = homeScore + 2 + seed % 5;
  const awayShots = awayScore + 3 + (seed + 2) % 5;
  const homeRank = 1 + seed % 9;
  const awayRank = 2 + (seed + 4) % 10;

  return {
    id: event.id,
    competition: event.competition,
    stage: event.stage,
    status: isUnavailable ? "unavailable" : "live",
    home: { name: event.home, code: teamCode(event.home), score: isUnavailable ? 0 : homeScore, record: `Scenario rank ${homeRank}`, color: palette[seed % palette.length] },
    away: { name: event.away, code: teamCode(event.away), score: isUnavailable ? 0 : awayScore, record: `Scenario rank ${awayRank}`, color: palette[(seed + 2) % palette.length] },
    baseSeconds: isUnavailable ? 0 : baseSeconds,
    period: isUnavailable ? (event.status === "postponed" ? "postponed" : "kickoff TBD") : minute > 45 ? "2nd half" : "1st half",
    venue: event.venue,
    provider: event.provider,
    viewingLabel: viewingLabels[event.viewingState],
    freshness: event.freshness,
    source: "Simulated live-feed contract",
    accessNote: event.accessNote,
    incidents: isUnavailable ? [] : incidents,
    stats: isUnavailable ? [] : [
      { label: "Possession", home: possession, away: 100 - possession, format: "percent" },
      { label: "Shots", home: homeShots, away: awayShots, format: "number" },
      { label: "Shots on goal", home: Math.min(homeShots, homeScore + 2), away: Math.min(awayShots, awayScore + 2), format: "number" },
      { label: "Corners", home: 1 + seed % 6, away: 1 + (seed + 3) % 6, format: "number" },
      { label: "Total passes", home: 120 + seed % 210, away: 130 + (seed * 2) % 210, format: "number" },
      { label: "Fouls", home: 3 + seed % 8, away: 3 + (seed + 2) % 8, format: "number" },
    ],
    table: [
      { rank: homeRank, club: event.home, played: 4, points: Math.max(3, 13 - homeRank) },
      { rank: awayRank, club: event.away, played: 4, points: Math.max(3, 13 - awayRank) },
    ].sort((a, b) => a.rank - b.rank),
  };
};

export const formatMatchClock = (seconds: number) => {
  const minute = Math.floor(seconds / 60);
  const second = seconds % 60;
  return `${minute}:${second.toString().padStart(2, "0")}`;
};
