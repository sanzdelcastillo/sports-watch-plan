export type ViewingState = "verified" | "access" | "unknown" | "stale" | "replay" | "unavailable";
export type EventStatus = "scheduled" | "changed" | "postponed" | "date_confirmed_time_tbd";

export type DemoEvent = {
  id: string;
  startUtc?: string;
  dateLabel?: string;
  previousStartUtc?: string;
  competition: string;
  competitionCode: string;
  region: string;
  home: string;
  away: string;
  venue: string;
  stage: string;
  status: EventStatus;
  viewingState: ViewingState;
  provider?: string;
  service?: string;
  channel?: string;
  availability?: "live" | "replay" | "unknown";
  accessNote: string;
  freshness: string;
  source: string;
  sourceUrlLabel: string;
  reasons: string[];
  overlapGroup?: string;
  coverageTier: "A" | "B";
  narrative: string;
};

export const demoEvents: DemoEvent[] = [
  {
    id: "arsenal-man-city",
    startUtc: "2026-09-12T14:00:00Z",
    competition: "Premier League",
    competitionCode: "PL",
    region: "England",
    home: "Arsenal",
    away: "Manchester City",
    venue: "North London Stadium",
    stage: "Matchweek 4",
    status: "scheduled",
    viewingState: "verified",
    provider: "NBC Sports",
    service: "TV provider",
    channel: "USA Network",
    availability: "live",
    accessNote: "Available with a participating TV package. Your access may vary.",
    freshness: "Checked 18 minutes ago",
    source: "Curated prototype evidence",
    sourceUrlLabel: "Viewing evidence record",
    reasons: ["Arsenal", "Premier League"],
    coverageTier: "A",
    narrative: "An early anchor match with a current U.S. live viewing option.",
  },
  {
    id: "miami-seattle",
    startUtc: "2026-09-12T19:00:00Z",
    competition: "Major League Soccer",
    competitionCode: "MLS",
    region: "United States",
    home: "Inter Miami",
    away: "Seattle Sounders",
    venue: "Miami Stadium",
    stage: "Regular season",
    status: "scheduled",
    viewingState: "access",
    provider: "Apple",
    service: "MLS Season Pass",
    availability: "live",
    accessNote: "A separate service or package may be required. We cannot confirm your entitlement.",
    freshness: "Checked 9 minutes ago",
    source: "Curated prototype evidence",
    sourceUrlLabel: "Viewing evidence record",
    reasons: ["Inter Miami", "MLS"],
    overlapGroup: "sat-afternoon",
    coverageTier: "A",
    narrative: "A followed club match that begins inside a competing viewing window.",
  },
  {
    id: "real-madrid-psg",
    startUtc: "2026-09-12T19:30:00Z",
    competition: "UEFA Champions League",
    competitionCode: "UCL",
    region: "Europe",
    home: "Real Madrid",
    away: "Paris Saint-Germain",
    venue: "Madrid Stadium",
    stage: "League phase",
    status: "scheduled",
    viewingState: "unknown",
    availability: "unknown",
    accessNote: "No current U.S. viewing option is verified. We’ll keep checking.",
    freshness: "Recheck scheduled in 12 minutes",
    source: "Curated prototype evidence",
    sourceUrlLabel: "Fixture evidence record",
    reasons: ["Real Madrid", "Champions League"],
    overlapGroup: "sat-afternoon",
    coverageTier: "B",
    narrative: "A high-priority fixture whose schedule is known but viewing remains unresolved.",
  },
  {
    id: "liverpool-arsenal",
    startUtc: "2026-09-12T22:30:00Z",
    previousStartUtc: "2026-09-12T23:00:00Z",
    competition: "Premier League",
    competitionCode: "PL",
    region: "England",
    home: "Liverpool",
    away: "Arsenal",
    venue: "Liverpool Stadium",
    stage: "Matchweek 4",
    status: "changed",
    viewingState: "verified",
    provider: "NBC Sports",
    service: "Peacock",
    availability: "live",
    accessNote: "Live viewing is listed. Subscription and location restrictions may apply.",
    freshness: "Time change checked 24 minutes ago",
    source: "Curated prototype evidence",
    sourceUrlLabel: "Revision and viewing record",
    reasons: ["Arsenal", "Premier League"],
    coverageTier: "A",
    narrative: "The new kickoff replaces an earlier time without creating another event.",
  },
  {
    id: "bayern-dortmund",
    startUtc: "2026-09-13T15:30:00Z",
    competition: "Bundesliga",
    competitionCode: "BUN",
    region: "Germany",
    home: "Bayern Munich",
    away: "Borussia Dortmund",
    venue: "Munich Arena",
    stage: "Matchday 3",
    status: "scheduled",
    viewingState: "stale",
    provider: "ESPN",
    service: "ESPN+",
    availability: "live",
    accessNote: "Last-known viewing data is shown while the source is temporarily unavailable.",
    freshness: "Last verified 2 hours ago",
    source: "Curated prototype evidence",
    sourceUrlLabel: "Last-known viewing record",
    reasons: ["Bayern Munich", "Bundesliga"],
    coverageTier: "B",
    narrative: "The fixture is scheduled, but the viewing record has aged beyond the demo threshold.",
  },
  {
    id: "barcelona-atletico",
    startUtc: "2026-09-13T18:00:00Z",
    competition: "La Liga",
    competitionCode: "LL",
    region: "Spain",
    home: "Barcelona",
    away: "Atlético Madrid",
    venue: "Barcelona Stadium",
    stage: "Matchday 4",
    status: "scheduled",
    viewingState: "replay",
    provider: "ESPN",
    service: "ESPN+",
    availability: "replay",
    accessNote: "A replay is listed. This does not represent a live viewing option.",
    freshness: "Checked 31 minutes ago",
    source: "Curated prototype evidence",
    sourceUrlLabel: "Replay evidence record",
    reasons: ["Barcelona", "La Liga"],
    coverageTier: "A",
    narrative: "Replay availability remains distinct from live coverage throughout the interface.",
  },
  {
    id: "lafc-america",
    startUtc: "2026-09-13T20:30:00Z",
    competition: "Leagues Cup",
    competitionCode: "LC",
    region: "North America",
    home: "Los Angeles FC",
    away: "Club América",
    venue: "Los Angeles Stadium",
    stage: "Knockout stage",
    status: "postponed",
    viewingState: "unavailable",
    availability: "unknown",
    accessNote: "Viewing details are withheld while a new kickoff is pending.",
    freshness: "Status checked 7 minutes ago",
    source: "Curated prototype evidence",
    sourceUrlLabel: "Status revision record",
    reasons: ["Los Angeles FC", "Club América", "Leagues Cup"],
    coverageTier: "B",
    narrative: "Postponement keeps the event identity and history while disabling stale reminders.",
  },
  {
    id: "inter-juventus",
    dateLabel: "Tue, Sep 15",
    competition: "Serie A",
    competitionCode: "SA",
    region: "Italy",
    home: "Inter Milan",
    away: "Juventus",
    venue: "Milan Stadium",
    stage: "Matchday 4",
    status: "date_confirmed_time_tbd",
    viewingState: "unknown",
    availability: "unknown",
    accessNote: "The date is known, but kickoff time and U.S. viewing are not confirmed.",
    freshness: "Fixture checked 46 minutes ago",
    source: "Curated prototype evidence",
    sourceUrlLabel: "Date-only fixture record",
    reasons: ["Inter Milan", "Juventus", "Serie A"],
    coverageTier: "B",
    narrative: "A date-only event remains visible without inventing a kickoff time.",
  },
];

export type FollowEntity = {
  id: string;
  name: string;
  type: "Club" | "Competition";
  region: string;
  code: string;
  color: string;
};

export const followEntities: FollowEntity[] = [
  { id: "arsenal", name: "Arsenal", type: "Club", region: "England", code: "ARS", color: "#B64132" },
  { id: "inter-miami", name: "Inter Miami", type: "Club", region: "United States", code: "MIA", color: "#D6A8C1" },
  { id: "real-madrid", name: "Real Madrid", type: "Club", region: "Spain", code: "RMA", color: "#D6B63C" },
  { id: "bayern", name: "Bayern Munich", type: "Club", region: "Germany", code: "BAY", color: "#A94343" },
  { id: "barcelona", name: "Barcelona", type: "Club", region: "Spain", code: "BAR", color: "#2E4E83" },
  { id: "premier-league", name: "Premier League", type: "Competition", region: "England", code: "PL", color: "#472568" },
  { id: "mls", name: "Major League Soccer", type: "Competition", region: "United States / Canada", code: "MLS", color: "#1E4367" },
  { id: "ucl", name: "UEFA Champions League", type: "Competition", region: "Europe", code: "UCL", color: "#263B77" },
  { id: "bundesliga", name: "Bundesliga", type: "Competition", region: "Germany", code: "BUN", color: "#BC3428" },
  { id: "libertadores", name: "Copa Libertadores", type: "Competition", region: "South America", code: "LIB", color: "#8A6323" },
];

export const defaultFollowing = ["arsenal", "inter-miami", "real-madrid", "premier-league", "mls", "ucl"];
export const defaultMustWatch = ["arsenal-man-city", "real-madrid-psg"];

export const timezoneOptions = [
  { value: "America/New_York", label: "Eastern Time · New York" },
  { value: "America/Chicago", label: "Central Time · Chicago" },
  { value: "America/Denver", label: "Mountain Time · Denver" },
  { value: "America/Los_Angeles", label: "Pacific Time · Los Angeles" },
  { value: "Europe/London", label: "United Kingdom · London" },
];

export const formatTime = (event: DemoEvent, timezone: string) => {
  if (!event.startUtc) return { time: "TBD", zone: "", day: event.dateLabel || "Date pending", dateKey: event.dateLabel || "TBD" };
  const date = new Date(event.startUtc);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).formatToParts(date);
  const hour = parts.find((part) => part.type === "hour")?.value || "";
  const minute = parts.find((part) => part.type === "minute")?.value || "";
  const dayPeriod = parts.find((part) => part.type === "dayPeriod")?.value || "";
  const day = new Intl.DateTimeFormat("en-US", { timeZone: timezone, weekday: "long", month: "short", day: "numeric" }).format(date);
  return { time: `${hour}:${minute}`, zone: dayPeriod, day, dateKey: day };
};

export const timezoneShort = (timezone: string) =>
  new Intl.DateTimeFormat("en-US", { timeZone: timezone, timeZoneName: "short" })
    .formatToParts(new Date("2026-09-12T14:00:00Z"))
    .find((part) => part.type === "timeZoneName")?.value || timezone;
