import {
  Activity,
  Bell,
  BellRing,
  CalendarClock,
  CircleAlert,
  CircleHelp,
  ClockAlert,
  History,
  RotateCcw,
  ShieldCheck,
  Star,
  Tv,
  WifiOff,
} from "lucide-react";
import type { DemoEvent } from "@/data/demo";
import { formatTime } from "@/data/demo";

const viewingCopy = {
  verified: { title: "Verified live option", icon: ShieldCheck },
  access: { title: "Live option · access may vary", icon: Tv },
  unknown: { title: "Viewing not confirmed", icon: CircleHelp },
  stale: { title: "Last-known viewing option", icon: WifiOff },
  replay: { title: "Replay option · not live", icon: RotateCcw },
  unavailable: { title: "Viewing temporarily unavailable", icon: CircleAlert },
};

export default function EventCard({
  event,
  timezone,
  mustWatch,
  reminder,
  onOpen,
  onOpenLive,
  onToggleMustWatch,
  onToggleReminder,
  compact = false,
}: {
  event: DemoEvent;
  timezone: string;
  mustWatch: boolean;
  reminder?: number;
  onOpen: () => void;
  onOpenLive: () => void;
  onToggleMustWatch: () => void;
  onToggleReminder: () => void;
  compact?: boolean;
}) {
  const display = formatTime(event, timezone);
  const view = viewingCopy[event.viewingState];
  const ViewIcon = view.icon;
  const isPostponed = event.status === "postponed";
  const isTbd = event.status === "date_confirmed_time_tbd";

  return (
    <article
      className={`match-card state-${event.viewingState} status-${event.status} ${compact ? "compact" : ""}`}
      onClick={onOpen}
      onKeyDown={(keyEvent) => {
        if (keyEvent.key === "Enter" || keyEvent.key === " ") onOpen();
      }}
      role="button"
      tabIndex={0}
      aria-label={`Open ${event.home} versus ${event.away}`}
    >
      <div className="match-time">
        {isPostponed ? <ClockAlert size={22} /> : isTbd ? <CalendarClock size={22} /> : <strong>{display.time}</strong>}
        <span>{isPostponed ? "POSTP." : isTbd ? "TIME" : display.zone}</span>
      </div>
      <div className="match-main">
        <div className="match-kicker">
          <span>{event.region.slice(0, 2).toUpperCase()} · {event.competition.toUpperCase()}</span>
          <span className={`coverage-badge tier-${event.coverageTier}`}>TIER {event.coverageTier}</span>
        </div>
        <h3><span>{event.home}</span><em>vs</em><span>{event.away}</span></h3>
        {event.status === "changed" && (
          <div className="change-note"><History size={13} /> Kickoff changed · your plan was updated</div>
        )}
        {event.status === "postponed" && (
          <div className="change-note critical"><ClockAlert size={13} /> Postponed · new kickoff pending</div>
        )}
        <div className={`viewing-summary ${event.viewingState}`}>
          <ViewIcon size={15} />
          <div><strong>{view.title}</strong><span>{event.provider ? `${event.provider}${event.channel ? ` · ${event.channel}` : ""} · ` : ""}{event.freshness}</span></div>
        </div>
        <button
          className="match-live-link"
          onClick={(clickEvent) => { clickEvent.stopPropagation(); onOpenLive(); }}
        ><Activity size={14} />{isPostponed || isTbd ? "Match Center" : "Live Center"}</button>
        {event.overlapGroup && <span className="overlap-tag">OVERLAP WINDOW</span>}
      </div>
      <div className="match-actions">
        <button
          onClick={(clickEvent) => { clickEvent.stopPropagation(); onToggleMustWatch(); }}
          className={mustWatch ? "active" : ""}
          aria-label={mustWatch ? "Remove from must-watch" : "Add to must-watch"}
        ><Star size={19} fill={mustWatch ? "currentColor" : "none"} /></button>
        <button
          onClick={(clickEvent) => { clickEvent.stopPropagation(); onToggleReminder(); }}
          className={reminder !== undefined ? "active" : ""}
          aria-label={reminder !== undefined ? "Remove reminder" : "Add reminder"}
          disabled={isPostponed || isTbd}
        >{reminder !== undefined ? <BellRing size={18} /> : <Bell size={18} />}</button>
      </div>
    </article>
  );
}
