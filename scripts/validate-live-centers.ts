import { demoEvents } from "../client/src/data/demo";
import { createLiveMatch, resolveLiveEvent } from "../client/src/data/live-demo";

const failures: string[] = [];

for (const event of demoEvents) {
  const resolved = resolveLiveEvent(event.id);
  if (!resolved) {
    failures.push(`${event.id}: route did not resolve`);
    continue;
  }
  const match = createLiveMatch(resolved);
  if (match.id !== event.id) failures.push(`${event.id}: generated wrong event ID`);
  if (match.home.name !== event.home || match.away.name !== event.away) failures.push(`${event.id}: generated wrong teams`);
  if (event.status === "postponed" || event.status === "date_confirmed_time_tbd") {
    if (match.status !== "unavailable") failures.push(`${event.id}: expected unavailable state`);
  } else if (match.status !== "live" || match.stats.length === 0) {
    failures.push(`${event.id}: expected populated live simulation`);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Validated ${demoEvents.length} event-specific Live Centers.`);
