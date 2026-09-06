import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Bell,
  CheckCircle2,
  CircleDot,
  Clock3,
  Eye,
  EyeOff,
  Flag,
  Info,
  Pause,
  Play,
  Radio,
  RefreshCcw,
  ShieldCheck,
  SquareArrowOutUpRight,
  Star,
} from "lucide-react";
import { Link, useParams } from "wouter";
import { toast } from "sonner";
import AppShell from "@/components/AppShell";
import { createLiveMatch, formatMatchClock, resolveLiveEvent, type LiveIncident, type LiveMatchData } from "@/data/live-demo";
import { usePrototype } from "@/hooks/usePrototype";

type LiveTab = "stats" | "timeline" | "table";

function IncidentIcon({ type }: { type: LiveIncident["type"] }) {
  if (type === "goal") return <CircleDot size={15} />;
  if (type === "yellow") return <span className="yellow-card" />;
  if (type === "substitution") return <RefreshCcw size={14} />;
  return <Flag size={14} />;
}

export default function LiveCenterPage() {
  const { id } = useParams<{ id?: string }>();
  const event = resolveLiveEvent(id);
  const liveMatch = useMemo(() => event ? createLiveMatch(event) : undefined, [event]);
  const prototype = usePrototype();
  const [clock, setClock] = useState(liveMatch?.baseSeconds || 0);
  const [paused, setPaused] = useState(false);
  const [tab, setTab] = useState<LiveTab>("stats");
  const [revealed, setRevealed] = useState(!prototype.spoilersHidden);
  const [followingLive, setFollowingLive] = useState(true);
  const hideLiveData = prototype.spoilersHidden && !revealed;

  useEffect(() => {
    setClock(liveMatch?.baseSeconds || 0);
    setTab("stats");
    setRevealed(!prototype.spoilersHidden);
  }, [liveMatch?.id, liveMatch?.baseSeconds, prototype.spoilersHidden]);

  useEffect(() => {
    if (paused || liveMatch?.status !== "live") return;
    const timer = window.setInterval(() => setClock((current) => current + 1), 1000);
    return () => window.clearInterval(timer);
  }, [paused, liveMatch?.status]);

  if (!event || !liveMatch) {
    return <AppShell><main className="not-found"><span>404</span><h1>Match Center not found.</h1><p>Choose a match from your Watch Plan to open its Live Center.</p><Link href="/">Return to Watch Plan</Link></main></AppShell>;
  }

  const unavailable = liveMatch.status === "unavailable";

  return (
    <AppShell>
      <main className="live-page">
        <div className="live-demo-notice"><Info size={13} /><span><strong>Simulated live feed for {event.home} vs {event.away}.</strong> This is an interaction prototype, not a real match or score.</span></div>
        <div className="live-page-head">
          <Link href={`/event/${event.id}`} className="live-back"><ArrowLeft size={17} /> Match details</Link>
          <div className={`live-feed-health ${unavailable ? "offline" : ""}`}><i /><span>{unavailable ? "UPDATES UNAVAILABLE" : "DEMO FEED HEALTHY"}</span><small>{unavailable ? event.status.replaceAll("_", " ") : "4s latency"}</small></div>
        </div>

        <section className="live-scoreboard">
          <div className="scoreboard-meta"><span>{liveMatch.competition.toUpperCase()} · {liveMatch.stage.toUpperCase()}</span><span><Radio size={13} /> {unavailable ? "MATCH CENTER" : "LIVE SIMULATION"}</span></div>
          <div className="live-clock"><i /><strong>{unavailable ? "—" : formatMatchClock(clock)}</strong><span>{liveMatch.period}</span></div>
          {unavailable ? (
            <div className="live-spoiler-guard unavailable"><AlertTriangle size={28} /><h1>Live updates unavailable</h1><p>{event.status === "postponed" ? "This match is postponed. Its Match Center remains available and will preserve the same event identity when a new kickoff is verified." : "The date is known, but kickoff time is not confirmed. Live updates will activate once the match begins."}</p><Link href={`/event/${event.id}`}>Review match details</Link></div>
          ) : hideLiveData ? (
            <div className="live-spoiler-guard">
              <EyeOff size={28} />
              <h1>Live score hidden</h1>
              <p>Your spoiler preference is protecting the score, incidents, and match statistics.</p>
              <button onClick={() => setRevealed(true)}><Eye size={16} /> Reveal this match</button>
            </div>
          ) : (
            <>
              <div className="scoreboard-grid">
                <div className="live-team home"><span className="live-team-mark" style={{ background: liveMatch.home.color }}>{liveMatch.home.code}</span><strong>{liveMatch.home.score}</strong><h1>{liveMatch.home.name}</h1><p>{liveMatch.home.record}</p></div>
                <div className="live-score-divider"><span>—</span><small>{liveMatch.venue}</small></div>
                <div className="live-team away"><span className="live-team-mark" style={{ background: liveMatch.away.color }}>{liveMatch.away.code}</span><strong>{liveMatch.away.score}</strong><h1>{liveMatch.away.name}</h1><p>{liveMatch.away.record}</p></div>
              </div>
              <div className="scoreboard-incidents">
                {liveMatch.incidents.filter((incident) => incident.type === "goal").map((incident) => <span key={incident.id}><CircleDot size={13} />{incident.primary} {incident.minute}</span>)}
                {!liveMatch.incidents.some((incident) => incident.type === "goal") && <span>No goals in this scenario</span>}
              </div>
            </>
          )}
          {!unavailable && <div className="scoreboard-controls"><button className={followingLive ? "active" : ""} onClick={() => { setFollowingLive(!followingLive); toast.success(followingLive ? "Live alerts paused" : "Following live", { description: `${event.home} vs ${event.away} · No real notifications are sent by this prototype.` }); }}><Star size={17} fill={followingLive ? "currentColor" : "none"} />{followingLive ? "Following live" : "Follow live"}</button><button onClick={() => setPaused(!paused)}>{paused ? <Play size={17} /> : <Pause size={17} />}{paused ? "Resume clock" : "Pause demo"}</button></div>}
        </section>

        {!hideLiveData && !unavailable && (
          <section className="live-content-grid">
            <div className="live-main-column">
              <article className="live-viewing-card">
                <div><span>U.S. VIEWING</span><h2>{liveMatch.viewingLabel}</h2><p>{liveMatch.accessNote}</p></div>
                <div className="live-provider"><span>{liveMatch.provider?.slice(0, 1) || "?"}</span><div><strong>{liveMatch.provider || "Not confirmed"}</strong><small>{liveMatch.freshness}</small></div></div>
                <button disabled={!liveMatch.provider || event.viewingState === "unknown" || event.viewingState === "unavailable"} onClick={() => toast.info("Demo destination", { description: "A production build would open the licensed event destination without implying entitlement." })}>Open viewing destination <SquareArrowOutUpRight size={15} /></button>
              </article>

              <div className="live-tabs" role="tablist" aria-label="Live match detail tabs">
                {(["stats", "timeline", "table"] as LiveTab[]).map((item) => <button role="tab" aria-selected={tab === item} key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{item === "timeline" ? "Play-by-play" : item}</button>)}
              </div>

              {tab === "stats" && <StatsPanel match={liveMatch} />}
              {tab === "timeline" && <TimelinePanel match={liveMatch} />}
              {tab === "table" && <TablePanel match={liveMatch} />}
            </div>

            <aside className="live-side-column">
              <article className="live-trust-card"><div className="live-panel-title"><span>FEED TRUST</span><ShieldCheck size={18} /></div><h2>Current demo projection</h2><ul><li><CheckCircle2 size={14} /><span><strong>Clock and score</strong> Updated by this match’s simulated feed</span></li><li><CheckCircle2 size={14} /><span><strong>Incidents</strong> Scoped to event ID {event.id}</span></li><li><Clock3 size={14} /><span><strong>Freshness</strong> {liveMatch.freshness}</span></li></ul><p>Production release requires licensed live status, result, incident, and statistics rights.</p></article>
              <article className="live-alert-card"><div className="live-panel-title"><span>LIVE ALERTS</span><Bell size={18} /></div><h2>Goals, cards, and final</h2><p>Notification controls are represented for every match, but delivery remains disabled in the prototype.</p><button onClick={() => toast.info("Alerts are simulated", { description: `${event.home} vs ${event.away} is ready for supplier-backed updates later.` })}>Review alert behavior</button></article>
              <article className="live-guardrail-card"><AlertTriangle size={18} /><p>Betting odds are intentionally excluded from the product scope.</p></article>
            </aside>
          </section>
        )}
      </main>
    </AppShell>
  );
}

function StatsPanel({ match }: { match: LiveMatchData }) {
  return <article className="live-panel stats-panel"><div className="live-panel-title"><span>TEAM STATS</span><Activity size={18} /></div>{match.stats.map((stat) => { const total = stat.home + stat.away || 1; const homeWidth = stat.format === "percent" ? stat.home : (stat.home / total) * 100; const awayWidth = stat.format === "percent" ? stat.away : (stat.away / total) * 100; const suffix = stat.format === "percent" ? "%" : ""; return <div className="stat-row" key={stat.label}><div><strong>{stat.home}{suffix}</strong><span>{stat.label}</span><strong>{stat.away}{suffix}</strong></div><div className="stat-bars"><i style={{ width: `${homeWidth}%` }} /><i style={{ width: `${awayWidth}%` }} /></div></div>; })}</article>;
}

function TimelinePanel({ match }: { match: LiveMatchData }) {
  return <article className="live-panel timeline-panel"><div className="live-panel-title"><span>PLAY-BY-PLAY</span><Radio size={18} /></div>{match.incidents.map((incident) => <div className={`incident-row team-${incident.team}`} key={incident.id}><strong>{incident.minute}</strong><span><IncidentIcon type={incident.type} /></span><div><h3>{incident.primary}</h3><p>{incident.secondary}</p></div></div>)}</article>;
}

function TablePanel({ match }: { match: LiveMatchData }) {
  return <article className="live-panel table-panel"><div className="live-panel-title"><span>SELECTED TABLE CONTEXT</span><Flag size={18} /></div><div className="table-head"><span>#</span><span>Club</span><span>P</span><span>Pts</span></div>{match.table.map((row) => <div className="table-row featured" key={row.club}><strong>{row.rank}</strong><span>{row.club}</span><span>{row.played}</span><strong>{row.points}</strong></div>)}<p>Compact scenario context only; this is not a complete or current league table.</p></article>;
}
