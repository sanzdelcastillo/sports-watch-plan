# Watch Plan — Complete AI Project Handoff

**Document status:** Current implementation handoff  
**Project:** Sports Calendar App / Watch Plan  
**Working project path:** `/home/ubuntu/sports-watch-plan-directions`  
**Current checkpoint:** `29bd4fe6`  
**Prototype URL:** `https://sportswatch-z2zc3ucl.manus.space`  
**Primary technology:** React 19, TypeScript, Vite, Wouter, Tailwind 4, Lucide React, Sonner  
**Product mode:** Frontend-only clickable validation prototype with deterministic scenario data

---

## 1. Mission and Product Definition

Watch Plan is a phone-first, responsive sports calendar and live-match planning product for U.S.-based soccer fans who follow multiple clubs and competitions. It is not intended to be a generic fixture list. Its central job is to help a fan answer four questions quickly:

1. **What matches matter to me in the next few days?**
2. **Which matches overlap or compete for my attention?**
3. **Where can I watch, and how certain is that information?**
4. **What is happening now for a match I am following?**

The product combines a personalized Watch Plan, event-level provenance, uncertainty-aware viewing information, reminders, spoiler protection, and a universal per-match Live Center.

The current app is a curated-data prototype. It does **not** connect to live sports suppliers, broadcaster APIs, notifications, calendar services, user accounts, or a production database. All demo scores, incidents, stats, and viewing records are deliberately labeled as simulated or curated.

> **Critical product principle:** Never present a provider listing as proof that the current user has access. Viewing state and fixture identity are separate concepts.

---

## 2. Current Implementation Status

### Completed

- Matchday Editorial visual direction selected and documented.
- Responsive Watch Plan homepage.
- Weekend, 7-day, and 14-day planning windows.
- Local timezone rendering from canonical UTC fixture timestamps.
- Followed club and competition catalogue.
- Must-watch state.
- Reminder state stored locally.
- Filters for all, must-watch, watch options, and changes.
- Overlap and planning-conflict presentation.
- Match detail pages with viewing, provenance, metadata, reminders, calendar simulation, and data-problem reporting.
- Explicit states for verified, access-dependent, unknown, stale, replay, changed, postponed, unavailable, and time-TBD events.
- State Lab for testing loading, empty, error, and event-state surfaces.
- Settings for timezone, spoiler protection, and stale viewing records.
- Universal event-specific Live Center routes.
- Live Center entry points on the homepage, every event card, and every event detail page.
- Per-event deterministic score, clock, incidents, stats, table context, and viewing scenario generation.
- Spoiler gate for live score, incidents, and stats.
- Graceful unavailable Live Center for postponed and kickoff-time-TBD fixtures.
- Desktop and mobile visual inspection.
- TypeScript validation and production build.
- Automated validation of all current event-specific Live Centers.

### In progress / next product milestone

**Starting lineups inside every Live Center.** The intended feature is described in Section 15 of this document. It should be implemented as a reusable tab/panel for every event, not hard-coded only for Arsenal vs Chelsea or Valencia vs Barcelona.

### Not implemented

- Real live feed connectivity.
- Licensed lineup, score, incident, stats, or play-by-play data.
- Backend persistence.
- Authentication or multi-user profiles.
- Push notifications.
- Calendar provider integration.
- Actual broadcaster deep links.
- Official team crests or broadcaster logos; display rights have not been confirmed.
- Betting odds; intentionally excluded from current product scope.

---

## 3. Design Direction: Matchday Editorial

The approved interface combines the urgency of a matchday programme with the clarity of a trustworthy calendar. It should feel energetic and editorial rather than like a generic SaaS dashboard. The primary screen is an active planning surface, not a marketing landing page.

### Design tokens

| Role | Value |
|---|---|
| Primary pitch | `#17643F` |
| Deep pitch | `#0E3C29` |
| Pitch soft | `#DFE9DF` |
| Warm paper | `#F3EFE4` |
| Paper highlight | `#FBF8F0` |
| Ink | `#121813` |
| Muted ink | `#697169` |
| Line | `#D3CEC0` |
| Priority amber | `#E5A62E` |
| Critical red | `#B64132` |
| Display type | Barlow Condensed, weights 600–700 |
| Body type | IBM Plex Sans, weights 400–700 |
| Utility type | IBM Plex Mono, weights 500–600 |
| Base spacing | 4px |
| Common spacing | 8, 12, 16, 24, 32, 48px |
| Control radius | 8px |
| Card radius | 14px |
| Major panel radius | 22px |
| Motion | 120–240ms using `cubic-bezier(0.23, 1, 0.32, 1)` |

### Visual rules

- Use Barlow Condensed for large display headlines, match names, scores, times, and section titles.
- Use IBM Plex Sans for readable body copy and interaction labels.
- Use IBM Plex Mono for timestamps, utility labels, freshness, feed-health indicators, and compact metadata.
- Use warm paper backgrounds for planning surfaces and deep pitch/dark gradients for live surfaces.
- Keep uncertainty visible in copy, not only in color or iconography.
- Do not use team logos, crests, or broadcaster marks until rights are confirmed. Current scenario uses text abbreviations and colored circles.
- Avoid excessive rounded SaaS cards. Use editorial bands, scoreboards, dividers, and strong typographic hierarchy.
- Motion should be restrained. Use live pulsing only for feed-health indicators and live dots.
- Preserve keyboard focus rings and visible accessible button labels.

### Current visual identity

The wordmark is `WATCHPLAN` with `WATCH` in deep pitch and `PLAN` in amber. `prototype` appears as a small IBM Plex Mono label. This is a provisional typographic mark, not a final logo.

---

## 4. Repository and File Structure

Relevant project files:

```text
/home/ubuntu/sports-watch-plan-directions/
├── client/
│   ├── index.html
│   └── src/
│       ├── App.tsx
│       ├── index.css
│       ├── components/
│       │   ├── AppShell.tsx
│       │   ├── ErrorBoundary.tsx
│       │   ├── EventCard.tsx
│       │   └── ui/                 # template/shadcn components
│       ├── data/
│       │   ├── demo.ts             # fixture, follow, timezone contracts
│       │   └── live-demo.ts        # deterministic Live Center generator
│       ├── hooks/
│       │   └── usePrototype.ts     # localStorage-backed prototype state
│       └── pages/
│           ├── LiveCenter.tsx
│           ├── ProductPrototype.tsx
│           └── NotFound.tsx
├── scripts/
│   └── validate-live-centers.ts    # validates all current event routes
├── server/
│   └── index.ts                    # template static server; do not modify for frontend tasks
├── package.json
├── tsconfig.json
├── vite.config.ts
├── brand-spec.md
└── AI_PROJECT_HANDOFF.md           # this file
```

### Scope boundary

For normal product/UI work, modify only `client/src`, `scripts`, and documentation. Do not alter the `server/` directory, backend APIs, database schemas, or deployment settings unless the task explicitly changes architecture and receives appropriate approval.

---

## 5. Routes

The router is in `client/src/App.tsx` and uses Wouter.

| Route | Component | Purpose |
|---|---|---|
| `/` | `WatchPlanPage` | Personalized match plan and planning overview |
| `/live` | `LiveCenterPage` | Default Live Center, currently defaults to Arsenal vs Chelsea |
| `/live/:id` | `LiveCenterPage` | Event-specific Live Center |
| `/event/:id` | `EventDetailPage` | Fixture details, viewing, provenance, planning actions |
| `/following` | `FollowingPage` | Follow clubs and competitions |
| `/states` | `StateLabPage` | Internal visual state gallery and system-state testing |
| `/settings` | `SettingsPage` | Timezone, spoiler protection, stale-data preferences |

### Navigation

`AppShell.tsx` provides desktop navigation and mobile bottom navigation:

- Watch Plan
- Live Center
- Following
- State Lab
- Settings

Every event card has a visibly labeled `Live Center` or `Match Center` link. Every event detail page has an `Open Live Center` action in the planning panel.

---

## 6. Watch Plan UI

The Watch Plan page is built in `client/src/pages/ProductPrototype.tsx`.

### Header and notice

- Sticky product topbar.
- Wordmark.
- Desktop primary navigation.
- Spoiler status chip.
- Scenario data chip.
- Timezone chip.
- Notification icon and profile initials.
- Amber prototype notice: “Curated scenario data for product testing — not a live fixture or viewing guide.”

### Hero

- Local timezone label, e.g. `YOUR LOCAL TIME · EDT`.
- Large display headline: `YOUR WEEKEND IN FOOTBALL.`
- Planning-window segmented control:
  - Weekend
  - 7 days
  - 14 days
- Summary metrics:
  - matches
  - overlap
  - must-watch
  - changes
- Decorative pitch-green background, field-line texture, and partial circular mark.

### Date ribbon

Shows five date cells with weekday, date, and count. The selected date uses pitch green and an underline. In the current scenario the Saturday count includes the Arsenal vs Chelsea fixture.

### Live entry banner

A dark green banner appears above the event feed:

- `LIVE DEMO`
- current simulated clock
- `AVAILABLE FOR EVERY MATCH`
- example Arsenal vs Chelsea score
- CTA `Follow live`

This is an editorial entry point, not a replacement for event-specific cards.

### Feed controls

- All
- Must-watch
- Watch options
- Changes
- Filters

The filter panel can show stale viewing records and links to Following.

### Planning alert

Amber alert describes the busiest overlap window and offers `Review priorities`.

### Event cards

Each card contains:

- local kickoff time and local day period
- region and competition
- coverage tier
- home and away teams
- changed/postponed note when relevant
- viewing summary and freshness
- explicit `Live Center` or `Match Center` action
- must-watch star
- reminder bell
- overlap tag when applicable

Event cards are keyboard reachable and open their event detail on card activation. The Live Center button stops event-card propagation so it opens `/live/:id` directly.

---

## 7. Event Detail UI

`EventDetailPage` provides the canonical detail surface for one event.

### Hero

- Region and competition.
- Tier and prototype coverage.
- Local date and time.
- Home vs away matchup.
- Stage and venue.
- Must-watch action.
- Changed kickoff banner when applicable.
- Postponed banner when applicable.

### Viewing card

The viewing card is explicitly separate from fixture identity.

Possible headings include:

- Verified live option
- Access may vary
- Viewing not confirmed
- Last-known viewing option
- Replay option · not live
- Viewing temporarily unavailable

The provider name is shown only when scenario evidence includes one. Copy must not imply the user’s entitlement.

### Provenance card

Displays:

- Fixture source
- Viewing evidence
- Coverage tier
- Last checked/freshness
- Prototype disclaimer

### Planning panel

Actions:

- Open Live Center
- Remind me / Reminder on
- Add to calendar
- Match information
- Report a data problem

Reminders and calendar actions are simulated locally. No external notification or calendar event is created.

---

## 8. Live Center UI

`LiveCenterPage` is route-driven and accepts any event ID through `/live/:id`.

### Live Center header

- Amber notice: simulated feed for the specific fixture.
- Back link to match details.
- Feed health indicator.
- `DEMO FEED HEALTHY` for scheduled scenario matches.
- `UPDATES UNAVAILABLE` for postponed/time-TBD matches.

### Scoreboard

Dark pitch-themed major panel with:

- competition and stage
- live simulation label
- simulated clock
- period label
- home team abbreviation, score, name, record/rank text
- away team abbreviation, score, name, record/rank text
- venue
- goal summary
- `Following live` toggle
- `Pause demo` / `Resume clock`

### Spoiler protection

When `spoilersHidden` is enabled, the Live Center hides:

- score
- goal summaries
- incidents
- stats
- table context
- viewing content below the scoreboard

It shows a prominent `Live score hidden` message and `Reveal this match` button. Reveal is local component state and does not disable global spoiler protection.

### Live content tabs

Current tabs:

1. Stats
2. Play-by-play
3. Table

Each tab renders event-specific deterministic data generated by `createLiveMatch(event)`.

### Viewing card

Shows the event’s own viewing state, provider, freshness, access note, and a simulated destination button. Unknown/unavailable states disable the destination.

### Trust and alerts side panels

The side rail communicates:

- score/clock source boundary
- incident event-ID scope
- freshness
- production licensing requirement
- simulated alerts for goals, cards, and final
- explicit betting exclusion

### Unavailable states

Postponed and date-confirmed/time-TBD events still open a Match Center route, but show:

- no invented score
- no invented clock
- updates unavailable
- explanation tied to the event’s status
- link back to match details

---

## 9. Data Contracts

### `DemoEvent`

Defined in `client/src/data/demo.ts`:

```ts
export type ViewingState =
  | "verified"
  | "access"
  | "unknown"
  | "stale"
  | "replay"
  | "unavailable";

export type EventStatus =
  | "scheduled"
  | "changed"
  | "postponed"
  | "date_confirmed_time_tbd";

type DemoEvent = {
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
```

### Current fixture scenarios

Current event IDs include:

- `arsenal-chelsea`
- `arsenal-man-city`
- `miami-seattle`
- `real-madrid-psg`
- `liverpool-arsenal`
- `bayern-dortmund`
- `barcelona-atletico`
- `lafc-america`
- `inter-juventus`

### Live match contract

Defined in `client/src/data/live-demo.ts`:

```ts
type LiveMatchData = {
  id: string;
  competition: string;
  stage: string;
  status: "live" | "unavailable";
  home: {
    name: string;
    code: string;
    score: number;
    record: string;
    color: string;
  };
  away: {
    name: string;
    code: string;
    score: number;
    record: string;
    color: string;
  };
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
```

### Live incidents

```ts
type LiveIncident = {
  id: string;
  minute: string;
  team: "home" | "away" | "neutral";
  type: "goal" | "yellow" | "substitution" | "kickoff";
  primary: string;
  secondary?: string;
};
```

### Live stats

```ts
type LiveStat = {
  label: string;
  home: number;
  away: number;
  format?: "number" | "percent";
};
```

### Generator behavior

`createLiveMatch(event)` derives deterministic scenario data from the event ID. It:

- preserves the event ID and teams
- generates stable but different scores per fixture
- creates deterministic goals, a yellow card, and kickoff incident
- creates possession, shots, shots on goal, corners, passes, and fouls
- creates compact table context
- returns `unavailable` for postponed and time-TBD events
- preserves provider/viewing/freshness copy from the event contract

This generator is for UX testing only. It must be replaced or wrapped by a supplier-backed normalized data adapter before production use.

---

## 10. Local Prototype State

`client/src/hooks/usePrototype.ts` stores state in `window.localStorage`.

Keys:

| Key | Type | Purpose |
|---|---|---|
| `wp-following` | string[] | Followed club/competition IDs |
| `wp-must-watch` | string[] | Must-watch event IDs |
| `wp-reminders` | `Record<string, number>` | Event ID to minutes-before reminder |
| `wp-timezone` | string | IANA timezone |
| `wp-spoilers` | boolean | Spoiler protection |
| `wp-show-stale` | boolean | Show stale viewing records |

Do not assume localStorage is a production persistence layer. It is intentionally sufficient for this clickable prototype.

---

## 11. Starting Lineups: Next Required Feature

The next AI should implement starting lineups in the universal Live Center.

### Required UX

Add a fourth tab to the Live Center tabs:

1. Stats
2. Play-by-play
3. **Lineups**
4. Table

The new tab must work for every event ID resolved by `resolveLiveEvent`.

### Required lineup information

The panel should include:

- home formation, e.g. `4-3-3`
- away formation, e.g. `4-2-3-1`
- starting XI for both teams
- positional labels: GK, DEF, MID, FWD or more specific labels where appropriate
- pitch-style visual layout or two-column lineup board
- substitutes bench for both teams
- manager/coach label where scenario data supports it
- lineup status:
  - Confirmed
  - Projected
  - Not available
- freshness, e.g. `Scenario lineup · not official`
- explicit prototype disclaimer

### Suggested data model

```ts
export type LineupPlayer = {
  id: string;
  name: string;
  shirt: number;
  position: "GK" | "DEF" | "MID" | "FWD";
  x: number;
  y: number;
  captain?: boolean;
};

export type TeamLineup = {
  team: "home" | "away";
  formation: string;
  manager?: string;
  status: "confirmed" | "projected" | "unavailable";
  players: LineupPlayer[];
  substitutes: { id: string; name: string; shirt: number; position: string }[];
};
```

Add to `LiveMatchData`:

```ts
lineups: {
  status: "confirmed" | "projected" | "unavailable";
  freshness: string;
  home: TeamLineup;
  away: TeamLineup;
};
```

### Important lineup guardrails

- Do not use real player names unless the scenario is clearly marked as simulated or the data is supplier-backed.
- Do not imply that a lineup is official before a confirmed supplier status exists.
- For postponed/time-TBD events, show `Lineups unavailable` rather than inventing a lineup.
- Preserve spoiler protection. If the user hides spoilers, the lineup tab can remain visible but should use a neutral pre-match state or display lineups only after explicit reveal, depending on the chosen UX.
- Keep the panel usable on a 390px-wide viewport.
- Add a lineup validation case to `scripts/validate-live-centers.ts`.

### Suggested visual direction

Use a split card:

- left/home side: pale pitch-green or warm tinted panel
- right/away side: dark blue or muted contrasting panel
- miniature pitch markings behind the players
- player pills with shirt number and name
- formation label above each side
- mobile view should stack home lineup and away lineup vertically

Do not overload the Live Center hero. The lineup data belongs beneath the score/viewing card inside the tab system.

---

## 12. Other Recommended Next Features

After lineups, prioritize in this order:

1. **Live now filter** on Watch Plan showing all currently active event centers.
2. **Substitution incidents** with player-in/player-out data.
3. **Final whistle state** with final score, match status, and replay/viewing distinction.
4. **Provider-backed normalized data adapter** with clear source timestamps.
5. **Notification preference UI** for goal, card, kickoff, lineup, and final alerts.
6. **Real calendar integration** using stable event IDs and update-in-place behavior.
7. **User testing instrumentation** for reveal-score, open-live, must-watch, and reminder actions.

---

## 13. Production Architecture Direction

The current frontend should eventually sit above a normalized sports data layer.

Recommended production boundaries:

```text
Supplier fixture feed
        ↓
Canonical fixture normalizer
        ↓
Event identity + revision store
        ↓
Viewing evidence adapter
        ↓
Live status / incidents / stats / lineups adapter
        ↓
Watch Plan API
        ↓
React frontend
```

The normalized event identity should remain stable across kickoff changes, postponed status, provider changes, and corrections. The frontend should never receive an entirely new event just because the kickoff moved.

For real near-real-time updates, use a persistent WebDev-hosted process or event-capable backend rather than scheduled AI runs. Minute-level polling should not be implemented with an AI schedule. The architecture should support supplier refreshes, webhooks if available, or persistent polling with source freshness recorded on every payload.

Any production integration requires:

- source rights review
- API credential storage
- supplier rate-limit handling
- freshness and outage behavior
- duplicate event prevention
- provider entitlement wording
- observability and retry handling
- data correction/reporting workflow

---

## 14. Commands for the Next AI

From the project root:

```bash
cd /home/ubuntu/sports-watch-plan-directions
```

Install dependencies if needed:

```bash
pnpm install
```

Run development server:

```bash
pnpm dev
```

Type-check:

```bash
pnpm check
```

Production build:

```bash
pnpm build
```

Validate all current event-specific Live Centers:

```bash
pnpm exec tsx scripts/validate-live-centers.ts
```

The validation script currently confirms that every event resolves, preserves teams and ID, returns a live simulation for ordinary scheduled events, and returns an unavailable state for postponed/time-TBD events.

---

## 15. Acceptance Criteria for Any Future Change

A future AI should not consider a feature complete until all of the following are true:

1. `pnpm check` passes.
2. `pnpm build` passes.
3. `pnpm exec tsx scripts/validate-live-centers.ts` passes.
4. The feature works for `arsenal-chelsea`, not only the original showcase event.
5. The feature works for at least one unknown-viewing event and one postponed/time-TBD event.
6. The feature is visually checked at approximately 1440×1000 and 390×844.
7. Spoiler protection behavior is preserved.
8. The current prototype disclaimer remains visible where scenario data is used.
9. No viewing label implies user entitlement.
10. No betting functionality is introduced without an explicit product decision.
11. Keyboard focus and accessible labels remain intact.
12. Existing routes continue to work.

---

## 16. Handoff Instructions to Another AI

Start by reading this file, then inspect the specific source files named above. Do not rebuild the app from scratch. Preserve the Matchday Editorial design system and extend existing abstractions.

For the starting-lineup milestone:

1. Read `client/src/data/live-demo.ts`.
2. Add lineup types and deterministic lineup generation.
3. Add `lineups` to `LiveMatchData`.
4. Add the Lineups tab in `client/src/pages/LiveCenter.tsx`.
5. Create a reusable lineup panel component if the JSX becomes dense.
6. Add styling in `client/src/index.css` using existing pitch/paper/amber tokens.
7. Add validation checks for lineups across all current event IDs.
8. Run type-check, build, and visual checks.
9. Save a checkpoint only after the implementation is complete and verified.

Do not convert the current curated data into live data silently. The next implementation may create richer deterministic scenario content, but any real-data integration must introduce a documented supplier boundary and preserve freshness/provenance semantics.

---

## 17. Current Known Risks

- The live clock is simulated and continues independently of real match state.
- Scores, incidents, stats, and table values are generated from event IDs and are not factual.
- Current team names and competition records are scenario content.
- There is no backend persistence or account model.
- LocalStorage state can be cleared by the browser.
- The `server/` template exists only to serve the static build.
- `pnpm` may display a warning that package-level `pnpm` overrides are ignored by the installed pnpm version; this is currently non-blocking because type-check and build pass.
- Vite reports a chunk-size warning after build; it is not currently a build failure.

---

## 18. Product Language Reference

Prefer:

- `Verified live option`
- `Live option · access may vary`
- `Viewing not confirmed`
- `Last-known viewing option`
- `Replay option · not live`
- `Viewing temporarily unavailable`
- `Live Center`
- `Match Center` for a postponed/time-TBD event
- `Scenario data`
- `Simulated live feed`
- `Current source supports this claim`
- `A separate service or package may be required`

Avoid:

- `Watch now` unless entitlement and destination are actually confirmed.
- `Live` when the record is replay-only or stale.
- `Official lineup` unless source status explicitly confirms it.
- `Guaranteed access`.
- Fake bookmaker odds.
- Unlabeled synthetic scores or player data.

---

## 19. Final Handoff Summary

Watch Plan is a polished, responsive soccer planning prototype with a Matchday Editorial design system. The app has a stable route-driven architecture and deterministic event data. The most important architectural correction already completed was changing Live Center from a single hard-coded showcase page into a universal event-specific template. Every fixture can now open its own Live Center, including Arsenal vs Chelsea, and unavailable events are represented safely.

The next logical implementation is starting lineups. Build them as a universal event-level data contract and tab, preserve spoiler and provenance rules, keep the current typography and dark live-surface language, and validate across ordinary, uncertain, and unavailable match scenarios.
