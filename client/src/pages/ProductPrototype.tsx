import { useMemo, useState } from "react";
import { Link, useLocation, useParams } from "wouter";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bell,
  BellRing,
  CalendarCheck,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Clock3,
  Eye,
  EyeOff,
  Flag,
  History,
  Info,
  Link2,
  Loader2,
  MapPin,
  Plus,
  Radio,
  RefreshCcw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Tv,
  WifiOff,
  X,
} from "lucide-react";
import { toast } from "sonner";
import AppShell from "@/components/AppShell";
import EventCard from "@/components/EventCard";
import {
  demoEvents,
  followEntities,
  formatTime,
  timezoneOptions,
  timezoneShort,
  type DemoEvent,
} from "@/data/demo";
import { usePrototype } from "@/hooks/usePrototype";

type PlanFilter = "all" | "must" | "changes" | "watch";
type PlanWindow = "Weekend" | "7 days" | "14 days";

const viewingLabels = {
  verified: "Verified live option",
  access: "Access may vary",
  unknown: "Viewing not confirmed",
  stale: "Last-known data",
  replay: "Replay only",
  unavailable: "Temporarily unavailable",
};

function ActionButton({ children, onClick, secondary = false, disabled = false }: { children: React.ReactNode; onClick: () => void; secondary?: boolean; disabled?: boolean }) {
  return <button className={`action-button ${secondary ? "secondary" : ""}`} onClick={onClick} disabled={disabled}>{children}</button>;
}

function PrototypeNotice() {
  return <div className="prototype-notice"><Info size={13} /><span>Curated scenario data for product testing — not a live fixture or viewing guide.</span></div>;
}

export function WatchPlanPage() {
  const [, navigate] = useLocation();
  const prototype = usePrototype();
  const [filter, setFilter] = useState<PlanFilter>("all");
  const [windowSize, setWindowSize] = useState<PlanWindow>("Weekend");
  const [showFilters, setShowFilters] = useState(false);

  const visibleEvents = useMemo(() => demoEvents.filter((event) => {
    if (!prototype.showStale && event.viewingState === "stale") return false;
    if (windowSize === "Weekend" && event.status === "date_confirmed_time_tbd") return false;
    if (filter === "must") return prototype.mustWatch.includes(event.id);
    if (filter === "changes") return event.status === "changed" || event.status === "postponed";
    if (filter === "watch") return event.viewingState === "verified" || event.viewingState === "access" || event.viewingState === "replay";
    return true;
  }), [filter, prototype.mustWatch, prototype.showStale, windowSize]);

  const grouped = useMemo(() => visibleEvents.reduce<Record<string, DemoEvent[]>>((groups, event) => {
    const key = formatTime(event, prototype.timezone).dateKey;
    groups[key] = [...(groups[key] || []), event];
    return groups;
  }, {}), [visibleEvents, prototype.timezone]);

  const toggleReminder = (event: DemoEvent) => {
    if (prototype.reminders[event.id] !== undefined) {
      prototype.setReminder(event.id);
      toast("Reminder removed", { description: `${event.home} vs ${event.away}` });
    } else {
      prototype.setReminder(event.id, 30);
      toast.success("Reminder set for 30 minutes before kickoff", { description: `${event.home} vs ${event.away}` });
    }
  };

  const overlaps = demoEvents.filter((event) => event.overlapGroup === "sat-afternoon").length;
  const changes = demoEvents.filter((event) => event.status === "changed" || event.status === "postponed").length;

  return (
    <AppShell>
      <main className="plan-page">
        <PrototypeNotice />
        <section className="plan-hero">
          <div className="hero-copy">
            <p>YOUR LOCAL TIME · {timezoneShort(prototype.timezone)}</p>
            <h1>Your weekend<br />in football.</h1>
          </div>
          <div className="hero-brief">
            <span>PLAN WINDOW</span>
            <div className="window-switch">
              {(["Weekend", "7 days", "14 days"] as PlanWindow[]).map((item) => (
                <button key={item} className={windowSize === item ? "active" : ""} onClick={() => setWindowSize(item)}>{item}</button>
              ))}
            </div>
          </div>
          <div className="hero-stats">
            <span><strong>{visibleEvents.length}</strong> matches</span>
            <span><strong>{overlaps}</strong> overlap</span>
            <span><strong>{prototype.mustWatch.length}</strong> must-watch</span>
            <span><strong>{changes}</strong> changes</span>
          </div>
        </section>

        <div className="date-ribbon" aria-label="Date overview">
          {[{ day: "FRI", date: "11", count: 0 }, { day: "SAT", date: "12", count: 4 }, { day: "SUN", date: "13", count: 3 }, { day: "MON", date: "14", count: 0 }, { day: "TUE", date: "15", count: 1 }].map((date, index) => (
            <button key={date.day} className={index === 1 ? "active" : ""} onClick={() => toast.info(`${date.day} ${date.date}: ${date.count || "No"} followed matches in this scenario`)}>
              <span>{date.day}</span><strong>{date.date}</strong><i>{date.count || "—"}</i>
            </button>
          ))}
        </div>

        <section className="plan-layout">
          <div className="plan-feed-column">
            <div className="feed-toolbar">
              <div className="filter-tabs" role="tablist" aria-label="Plan filters">
                {([
                  ["all", "All"], ["must", "Must-watch"], ["watch", "Watch options"], ["changes", "Changes"],
                ] as [PlanFilter, string][]).map(([id, label]) => (
                  <button key={id} className={filter === id ? "active" : ""} onClick={() => setFilter(id)}>{label}</button>
                ))}
              </div>
              <button className="filter-button" onClick={() => setShowFilters(!showFilters)}><SlidersHorizontal size={16} /> Filters</button>
            </div>
            {showFilters && (
              <div className="filter-panel">
                <span><strong>Included because you follow</strong> 3 clubs and 3 competitions</span>
                <label><input type="checkbox" checked={prototype.showStale} onChange={(event) => prototype.setShowStale(event.target.checked)} /> Show last-known viewing data</label>
                <Link href="/following">Edit follows <ChevronRight size={15} /></Link>
              </div>
            )}

            <div className="planning-alert"><Sparkles size={17} /><div><strong>Your busiest window starts at 3:00 PM Saturday.</strong><span>Two followed matches overlap by 90 minutes. Mark the one you care about most.</span></div><button onClick={() => setFilter("must")}>Review priorities</button></div>

            {Object.keys(grouped).length === 0 ? (
              <div className="empty-state"><CalendarDays size={34} /><h2>No matches in this view</h2><p>Change the filter or follow more clubs and competitions.</p><button onClick={() => setFilter("all")}>Show all matches</button></div>
            ) : Object.entries(grouped).map(([day, events]) => (
              <section className="day-group" key={day}>
                <header><span>{day.split(",")[0].toUpperCase()}</span><h2>{day.replace(/^\w+,\s*/, "")}</h2><i>{events.length} {events.length === 1 ? "match" : "matches"}</i></header>
                <div className="event-list">
                  {events.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      timezone={prototype.timezone}
                      mustWatch={prototype.mustWatch.includes(event.id)}
                      reminder={prototype.reminders[event.id]}
                      onOpen={() => navigate(`/event/${event.id}`)}
                      onToggleMustWatch={() => {
                        prototype.toggleMustWatch(event.id);
                        toast.success(prototype.mustWatch.includes(event.id) ? "Removed from must-watch" : "Added to must-watch", { description: `${event.home} vs ${event.away}` });
                      }}
                      onToggleReminder={() => toggleReminder(event)}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>

          <aside className="plan-sidebar">
            <section className="sidebar-card now-card">
              <p>NEXT UP</p>
              <span className="big-time">10:00<small>AM</small></span>
              <h2>Arsenal <em>vs</em><br />Manchester City</h2>
              <div><ShieldCheck size={15} /> Viewing verified</div>
              <button onClick={() => navigate("/event/arsenal-man-city")}>Open match details <ArrowRight size={15} /></button>
            </section>
            <section className="sidebar-card conflict-card">
              <div className="sidebar-title"><span>PLANNING CONFLICT</span><strong>01</strong></div>
              <h3>Saturday · 3:00–5:30 PM</h3>
              <p>Inter Miami vs Seattle overlaps Real Madrid vs Paris Saint-Germain.</p>
              <div className="conflict-lines"><i /><i /></div>
              <button onClick={() => setFilter("must")}>Set priority</button>
            </section>
            <section className="sidebar-card trust-card">
              <div className="sidebar-title"><span>WHAT THE LABELS MEAN</span><CircleHelp size={15} /></div>
              <ul>
                <li><ShieldCheck size={14} /><span><strong>Verified</strong> Current source supports this claim</span></li>
                <li><Tv size={14} /><span><strong>Access may vary</strong> Service listed; entitlement unknown</span></li>
                <li><WifiOff size={14} /><span><strong>Last-known</strong> Source has not refreshed on time</span></li>
              </ul>
              <Link href="/states">See every product state <ArrowRight size={14} /></Link>
            </section>
          </aside>
        </section>
      </main>
    </AppShell>
  );
}

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const prototype = usePrototype();
  const [reportOpen, setReportOpen] = useState(false);
  const [reportType, setReportType] = useState("Wrong viewing option");
  const event = demoEvents.find((item) => item.id === id);

  if (!event) return <NotFoundPanel />;
  const display = formatTime(event, prototype.timezone);
  const reminder = prototype.reminders[event.id];
  const canRemind = event.status !== "postponed" && event.status !== "date_confirmed_time_tbd";

  return (
    <AppShell>
      <main className="event-page">
        <PrototypeNotice />
        <button className="text-back" onClick={() => navigate("/")}><ArrowLeft size={17} /> Back to Watch Plan</button>
        <section className={`event-hero state-${event.viewingState}`}>
          <div className="event-hero-top"><span>{event.region.toUpperCase()} · {event.competition.toUpperCase()}</span><span>TIER {event.coverageTier} · PROTOTYPE COVERAGE</span></div>
          <div className="event-hero-grid">
            <div className="event-time-block"><p>{event.status === "postponed" ? "POSTPONED" : display.day.toUpperCase()}</p><strong>{event.status === "postponed" ? "—" : display.time}</strong><span>{display.zone} · {timezoneShort(prototype.timezone)}</span></div>
            <div className="event-teams"><h1>{event.home}<span>vs</span>{event.away}</h1><p>{event.stage} · {event.venue}</p></div>
            <button className={`hero-star ${prototype.mustWatch.includes(event.id) ? "active" : ""}`} onClick={() => prototype.toggleMustWatch(event.id)}><Star size={21} fill={prototype.mustWatch.includes(event.id) ? "currentColor" : "none"} />{prototype.mustWatch.includes(event.id) ? "Must-watch" : "Mark must-watch"}</button>
          </div>
          {event.status === "changed" && <div className="hero-revision"><History size={16} /><span><strong>Kickoff changed.</strong> This event was moved 30 minutes earlier. Existing plan items were updated, not duplicated.</span></div>}
          {event.status === "postponed" && <div className="hero-revision critical"><AlertTriangle size={16} /><span><strong>This match is postponed.</strong> Reminders are paused until a new kickoff is verified.</span></div>}
        </section>

        <section className="event-detail-grid">
          <div className="event-primary">
            <article className={`viewing-card state-${event.viewingState}`}>
              <div className="section-heading"><div><span>U.S. VIEWING</span><h2>{viewingLabels[event.viewingState]}</h2></div>{event.viewingState === "verified" ? <ShieldCheck size={25} /> : event.viewingState === "stale" ? <WifiOff size={25} /> : <Tv size={25} />}</div>
              {event.provider ? <div className="provider-lockup"><span>{event.provider.slice(0, 1)}</span><div><strong>{event.provider}</strong><small>{[event.service, event.channel].filter(Boolean).join(" · ")}</small></div></div> : <div className="unknown-provider"><CircleHelp size={22} /><span>No provider is shown until evidence supports it.</span></div>}
              <p>{event.accessNote}</p>
              <div className="freshness-row"><Clock3 size={14} /><span>{event.freshness}</span><i>{event.availability === "replay" ? "REPLAY" : event.availability === "live" ? "LIVE" : "UNKNOWN"}</i></div>
              <ActionButton onClick={() => toast.info("Demo destination", { description: "The prototype does not open a broadcaster or imply access." })} disabled={event.viewingState === "unknown" || event.viewingState === "unavailable"}>
                <Link2 size={16} /> {event.viewingState === "replay" ? "Open replay destination" : "Open viewing destination"}
              </ActionButton>
            </article>

            <article className="detail-card why-card"><div className="section-heading"><div><span>WHY IT’S HERE</span><h2>Matched through your follows</h2></div><Flag size={21} /></div><div className="reason-list">{event.reasons.map((reason) => <span key={reason}><Check size={13} />{reason}</span>)}</div><p>Several follow paths can explain relevance, but the canonical event appears once.</p></article>

            <article className="detail-card provenance-card"><div className="section-heading"><div><span>TRUST & PROVENANCE</span><h2>What we know—and what we don’t</h2></div><ShieldCheck size={21} /></div><dl><div><dt>Fixture source</dt><dd>{event.source}</dd></div><div><dt>Viewing evidence</dt><dd>{event.sourceUrlLabel}</dd></div><div><dt>Coverage</dt><dd>Tier {event.coverageTier} scenario</dd></div><div><dt>Last checked</dt><dd>{event.freshness}</dd></div></dl><p className="fine-print">Prototype values are curated to test comprehension. They are not current viewing instructions.</p></article>
          </div>

          <aside className="event-actions-panel">
            <section><span>PLAN THIS MATCH</span><button className={`plan-action ${reminder !== undefined ? "active" : ""}`} disabled={!canRemind} onClick={() => {
              if (reminder !== undefined) prototype.setReminder(event.id);
              else prototype.setReminder(event.id, 30);
              toast.success(reminder !== undefined ? "Reminder removed" : "Reminder set", { description: reminder !== undefined ? "No notification will be sent." : "30 minutes before kickoff in this prototype." });
            }}>{reminder !== undefined ? <BellRing size={18} /> : <Bell size={18} />}<span><strong>{reminder !== undefined ? "Reminder on" : "Remind me"}</strong><small>{canRemind ? (reminder !== undefined ? `${reminder} minutes before` : "Default: 30 minutes before") : "Unavailable until time is confirmed"}</small></span></button><button className="plan-action" disabled={!canRemind} onClick={() => toast.success("Calendar action simulated", { description: "A production version would update the same stable calendar event when details change." })}><CalendarCheck size={18} /><span><strong>Add to calendar</strong><small>Stable event ID · updates in place</small></span></button></section>
            <section><span>MATCH INFORMATION</span><dl className="mini-facts"><div><dt><CalendarDays size={14} /> Stage</dt><dd>{event.stage}</dd></div><div><dt><MapPin size={14} /> Venue</dt><dd>{event.venue}</dd></div><div><dt><Radio size={14} /> Status</dt><dd>{event.status.replaceAll("_", " ")}</dd></div></dl></section>
            <button className="report-button" onClick={() => setReportOpen(true)}><AlertTriangle size={16} /> Report a data problem</button>
          </aside>
        </section>
      </main>
      {reportOpen && <ReportDialog event={event} type={reportType} setType={setReportType} onClose={() => setReportOpen(false)} />}
    </AppShell>
  );
}

function ReportDialog({ event, type, setType, onClose }: { event: DemoEvent; type: string; setType: (value: string) => void; onClose: () => void }) {
  const options = ["Wrong kickoff time", "Wrong match status", "Wrong viewing option", "Replay labeled as live", "Duplicate match", "Other"];
  return <div className="dialog-backdrop" role="presentation" onMouseDown={onClose}><section className="report-dialog" role="dialog" aria-modal="true" aria-labelledby="report-title" onMouseDown={(event) => event.stopPropagation()}><button className="dialog-close" onClick={onClose} aria-label="Close report dialog"><X size={19} /></button><span>DATA QUALITY</span><h2 id="report-title">Report a problem</h2><p>{event.home} vs {event.away}</p><label>What looks wrong?<select value={type} onChange={(changeEvent) => setType(changeEvent.target.value)}>{options.map((option) => <option key={option}>{option}</option>)}</select></label><label>Optional detail<textarea placeholder="Tell us what you expected to see…" /></label><div className="dialog-actions"><button onClick={onClose}>Cancel</button><button onClick={() => { onClose(); toast.success("Report captured for the prototype", { description: `${type}. No external submission was made.` }); }}>Submit report</button></div></section></div>;
}

export function FollowingPage() {
  const prototype = usePrototype();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"All" | "Club" | "Competition">("All");
  const results = followEntities.filter((entity) => (type === "All" || entity.type === type) && `${entity.name} ${entity.region}`.toLowerCase().includes(query.toLowerCase()));

  return <AppShell><main className="content-page"><PrototypeNotice /><header className="content-hero"><div><p>BUILD YOUR SIGNAL</p><h1>Follow what<br />matters.</h1></div><p>Clubs bring their eligible matches across competitions. Competition follows bring every supported event. Duplicate paths still produce one match.</p></header><section className="content-layout"><div className="catalogue-panel"><div className="catalogue-tools"><label><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search clubs and competitions" /></label><div>{(["All", "Club", "Competition"] as const).map((item) => <button key={item} className={type === item ? "active" : ""} onClick={() => setType(item)}>{item}</button>)}</div></div><div className="entity-grid">{results.map((entity) => { const active = prototype.following.includes(entity.id); return <article key={entity.id} className={active ? "followed" : ""}><span className="entity-mark" style={{ background: entity.color }}>{entity.code}</span><div><small>{entity.type.toUpperCase()} · {entity.region.toUpperCase()}</small><h2>{entity.name}</h2></div><button onClick={() => { prototype.toggleFollowing(entity.id); toast.success(active ? "Unfollowed" : "Following", { description: entity.name }); }}>{active ? <Check size={17} /> : <Plus size={17} />}{active ? "Following" : "Follow"}</button></article>; })}</div></div><aside className="follow-summary"><span>CURRENT SIGNAL</span><strong>{prototype.following.length}</strong><h2>follows shape your plan</h2><p>For this scenario, your follows explain each included match without changing its canonical identity.</p><div>{followEntities.filter((item) => prototype.following.includes(item.id)).slice(0, 5).map((item) => <span key={item.id}>{item.code}</span>)}</div><Link href="/">See your Watch Plan <ArrowRight size={15} /></Link></aside></section></main></AppShell>;
}

export function SettingsPage() {
  const prototype = usePrototype();
  return <AppShell><main className="content-page settings-page"><PrototypeNotice /><header className="content-hero"><div><p>YOUR EXPERIENCE</p><h1>Plan in your<br />own time.</h1></div><p>Timezone, spoiler behavior, and data-confidence preferences apply across the plan, event details, reminders, and future calendar output.</p></header><section className="settings-grid"><article className="settings-card"><div className="settings-icon"><Clock3 size={20} /></div><div><span>LOCAL TIME</span><h2>Display timezone</h2><p>Kickoffs are rendered from canonical UTC whenever a confirmed timestamp exists.</p><select value={prototype.timezone} onChange={(event) => prototype.setTimezone(event.target.value)}>{timezoneOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></div></article><article className="settings-card"><div className="settings-icon"><EyeOff size={20} /></div><div><span>SPOILER PROTECTION</span><h2>Hide results and revealing language</h2><p>Applies to the Watch Plan, detail pages, alerts, calendar text, and news labels.</p></div><button className={`settings-switch ${prototype.spoilersHidden ? "on" : ""}`} onClick={() => prototype.setSpoilersHidden(!prototype.spoilersHidden)} aria-label="Toggle spoiler protection"><i /></button></article><article className="settings-card"><div className="settings-icon"><WifiOff size={20} /></div><div><span>LAST-KNOWN DATA</span><h2>Show stale viewing records</h2><p>Keep useful last-known records visible, clearly labeled with their age.</p></div><button className={`settings-switch ${prototype.showStale ? "on" : ""}`} onClick={() => prototype.setShowStale(!prototype.showStale)} aria-label="Toggle stale viewing records"><i /></button></article><article className="settings-card disabled-setting"><div className="settings-icon"><Bell size={20} /></div><div><span>NOTIFICATIONS</span><h2>Change and kickoff alerts</h2><p>Shown for workflow testing. Push delivery will be validated after the production path is chosen.</p><button onClick={() => toast.info("Notification setup is deferred", { description: "The clickable prototype stores reminder choices locally but sends no messages." })}>Review prototype behavior</button></div></article></section></main></AppShell>;
}

export function StateLabPage() {
  const [, navigate] = useLocation();
  const prototype = usePrototype();
  const [mode, setMode] = useState<"cards" | "loading" | "empty" | "error">("cards");
  return <AppShell><main className="content-page state-page"><PrototypeNotice /><header className="content-hero"><div><p>VALIDATION TOOL</p><h1>Every state,<br />on purpose.</h1></div><p>This internal gallery lets the team compare normal, uncertain, revised, and failure states without waiting for live data to produce them.</p></header><div className="lab-controls">{(["cards", "loading", "empty", "error"] as const).map((item) => <button key={item} className={mode === item ? "active" : ""} onClick={() => setMode(item)}>{item}</button>)}</div>{mode === "cards" && <section className="state-gallery">{demoEvents.map((event) => <div key={event.id}><p>{event.status.replaceAll("_", " ")} · {event.viewingState}</p><EventCard event={event} timezone={prototype.timezone} mustWatch={prototype.mustWatch.includes(event.id)} reminder={prototype.reminders[event.id]} onOpen={() => navigate(`/event/${event.id}`)} onToggleMustWatch={() => prototype.toggleMustWatch(event.id)} onToggleReminder={() => prototype.setReminder(event.id, prototype.reminders[event.id] === undefined ? 30 : undefined)} compact /></div>)}</section>}{mode === "loading" && <section className="demo-system-state"><Loader2 size={32} className="spin" /><h2>Building your Watch Plan</h2><p>Matching followed clubs and competitions, then checking viewing evidence.</p><div className="skeleton-lines"><i /><i /><i /></div></section>}{mode === "empty" && <section className="demo-system-state"><CalendarDays size={32} /><h2>No followed matches in this window</h2><p>Your follows are intact. Try a longer planning window or add another club.</p><Link href="/following">Browse clubs and competitions</Link></section>}{mode === "error" && <section className="demo-system-state error"><RefreshCcw size={32} /><h2>Viewing source unavailable</h2><p>Fixtures remain visible. Last-known viewing records are labeled with age rather than presented as newly verified.</p><button onClick={() => toast.success("Refresh simulated", { description: "The demo remains in the controlled error state." })}>Try source again</button></section>}</main></AppShell>;
}

function NotFoundPanel() {
  return <AppShell><main className="not-found"><span>404</span><h1>Match not found.</h1><p>The event may have been removed or merged during review.</p><Link href="/">Return to Watch Plan</Link></main></AppShell>;
}
