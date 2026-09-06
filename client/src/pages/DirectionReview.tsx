import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  ArrowUpRight,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  EyeOff,
  Flag,
  ListFilter,
  Radio,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Tv,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

type DirectionId = "editorial" | "planner" | "command";

type Direction = {
  id: DirectionId;
  marker: string;
  name: string;
  school: string;
  promise: string;
  bestFor: string;
  accent: string;
};

const directions: Direction[] = [
  {
    id: "editorial",
    marker: "A",
    name: "Matchday Editorial",
    school: "Bold timeline",
    promise: "Turns a crowded Saturday into a readable sports story.",
    bestFor: "Fast scanning with a strong consumer identity",
    accent: "#14613D",
  },
  {
    id: "planner",
    marker: "B",
    name: "Quiet Planner",
    school: "Calm utility",
    promise: "Feels like a trusted personal calendar, not another score app.",
    bestFor: "Repeat weekly planning and low cognitive load",
    accent: "#2E58A6",
  },
  {
    id: "command",
    marker: "C",
    name: "Signal Desk",
    school: "Broadcast command center",
    promise: "Makes coverage, freshness, and conflicts operationally explicit.",
    bestFor: "Power users and data-trust differentiation",
    accent: "#B7F44A",
  },
];

const selectDirection = (direction: Direction) => {
  window.localStorage.setItem("watch-plan-direction", direction.id);
  toast.success(`${direction.name} saved as your current preference`, {
    description: "This is only a design-review choice; it does not lock the product.",
  });
};

function EditorialPhone({ compact = false }: { compact?: boolean }) {
  const [starred, setStarred] = useState([true, false, true]);
  const toggleStar = (index: number) =>
    setStarred((current) => current.map((value, i) => (i === index ? !value : value)));

  return (
    <div className={`phone-shell editorial-phone ${compact ? "phone-compact" : ""}`}>
      <div className="phone-status"><span>9:41</span><span>Design scenario</span><span>5G · 89%</span></div>
      <div className="editorial-head">
        <div className="working-mark">WATCH<span>PLAN</span></div>
        <button className="icon-button light-button" aria-label="Search"><Search size={18} /></button>
        <p className="eyebrow">SATURDAY · SEP 12</p>
        <h2>Your day<br />in football.</h2>
        <div className="summary-rule">
          <span><strong>3</strong> matches</span>
          <span><strong>1</strong> overlap</span>
          <span><strong>2</strong> must-watch</span>
        </div>
      </div>
      <div className="editorial-feed">
        <div className="day-note"><Zap size={14} /> Your busiest window starts at 3:00 PM</div>
        <EditorialEvent
          time="10:00"
          zone="AM"
          competition="EN · PREMIER LEAGUE"
          home="London North"
          away="Manchester Blue"
          viewing="Verified live option"
          detail="Network channel · checked 18m ago"
          tone="verified"
          starred={starred[0]}
          onStar={() => toggleStar(0)}
        />
        <EditorialEvent
          time="3:00"
          zone="PM"
          competition="US · MAJOR LEAGUE SOCCER"
          home="Miami"
          away="Seattle"
          viewing="Access may vary"
          detail="Streaming service · package note"
          tone="access"
          starred={starred[1]}
          onStar={() => toggleStar(1)}
        />
        <EditorialEvent
          time="3:30"
          zone="PM"
          competition="EU · CHAMPIONS LEAGUE"
          home="Madrid White"
          away="Paris"
          viewing="Viewing not confirmed"
          detail="We’ll keep checking"
          tone="unknown"
          starred={starred[2]}
          onStar={() => toggleStar(2)}
        />
      </div>
      <PhoneNav active="Plan" dark={false} />
    </div>
  );
}

function EditorialEvent({ time, zone, competition, home, away, viewing, detail, tone, starred, onStar }: {
  time: string; zone: string; competition: string; home: string; away: string; viewing: string;
  detail: string; tone: "verified" | "access" | "unknown"; starred: boolean; onStar: () => void;
}) {
  return (
    <article className="editorial-event">
      <div className="time-stack"><strong>{time}</strong><span>{zone}</span></div>
      <div className="editorial-event-body">
        <div className="event-kicker"><span>{competition}</span><button onClick={onStar} aria-label="Toggle must-watch"><Star size={17} fill={starred ? "currentColor" : "none"} /></button></div>
        <h3>{home}<span>vs</span>{away}</h3>
        <div className={`viewing-line ${tone}`}>
          {tone === "verified" ? <ShieldCheck size={14} /> : tone === "access" ? <Tv size={14} /> : <CircleHelp size={14} />}
          <div><strong>{viewing}</strong><span>{detail}</span></div>
        </div>
      </div>
    </article>
  );
}

function PlannerPhone({ compact = false }: { compact?: boolean }) {
  const [spoilers, setSpoilers] = useState(true);
  const [mode, setMode] = useState<"All" | "Essential">("All");
  return (
    <div className={`phone-shell planner-phone ${compact ? "phone-compact" : ""}`}>
      <div className="phone-status planner-status"><span>9:41</span><span>Design scenario</span><span>5G · 89%</span></div>
      <div className="planner-head">
        <div className="planner-wordmark"><span>wp</span> Watch Plan <small>working title</small></div>
        <button className="avatar-button" aria-label="Profile">JS</button>
        <p>SEPTEMBER 12–13</p>
        <h2>A calmer<br />sports weekend.</h2>
        <div className="planner-toggle">
          {(["All", "Essential"] as const).map((item) => (
            <button key={item} onClick={() => setMode(item)} className={mode === item ? "active" : ""}>{item}</button>
          ))}
        </div>
      </div>
      <div className="planner-content">
        <div className="calm-callout">
          <div><Sparkles size={16} /><span>Your plan is clear</span></div>
          <p>One overlap needs a decision on Saturday afternoon.</p>
        </div>
        <div className="planner-day"><span>SATURDAY</span><strong>12</strong><em>3 matches</em></div>
        <PlannerRow time="10:00 AM" competition="Premier League" home="London North" away="Manchester Blue" status="Live option verified" state="good" essential />
        <PlannerRow time="3:00 PM" competition="Major League Soccer" home="Miami" away="Seattle" status="Access may vary" state="care" essential={false} />
        <PlannerRow time="3:30 PM" competition="Champions League" home="Madrid White" away="Paris" status="Viewing still unknown" state="muted" essential />
        <button className="spoiler-control" onClick={() => setSpoilers(!spoilers)}>
          <EyeOff size={17} /><span><strong>Spoilers {spoilers ? "hidden" : "visible"}</strong><small>Across plan, alerts and news</small></span><span className={`mini-switch ${spoilers ? "on" : ""}`}><i /></span>
        </button>
      </div>
      <PhoneNav active="Weekend" dark={false} planner />
    </div>
  );
}

function PlannerRow({ time, competition, home, away, status, state, essential }: {
  time: string; competition: string; home: string; away: string; status: string;
  state: "good" | "care" | "muted"; essential: boolean;
}) {
  return (
    <article className="planner-row">
      <div className="planner-time"><strong>{time}</strong><span>{competition}</span></div>
      <div className="planner-match"><h3>{home}<span>vs</span>{away}</h3><p className={state}><i />{status}</p></div>
      <Star size={17} fill={essential ? "currentColor" : "none"} className={essential ? "starred" : ""} />
    </article>
  );
}

function CommandPhone({ compact = false }: { compact?: boolean }) {
  const [density, setDensity] = useState<"Focus" | "Full">("Focus");
  const [armed, setArmed] = useState(true);
  return (
    <div className={`phone-shell command-phone ${compact ? "phone-compact" : ""}`}>
      <div className="phone-status command-status"><span>09:41:22</span><span>DEMO FEED</span><span>UTC−04</span></div>
      <div className="command-head">
        <div className="command-brand"><span>WP//</span> SIGNAL DESK</div>
        <button className="command-icon" aria-label="Filters"><SlidersHorizontal size={17} /></button>
        <div className="command-title"><p>SAT 12 SEP · LOCAL</p><h2>MATCH<br />CONTROL</h2><span>03 EVENTS / 01 CONFLICT</span></div>
        <div className="command-segment">
          {(["Focus", "Full"] as const).map((item) => <button key={item} onClick={() => setDensity(item)} className={density === item ? "active" : ""}>{item}</button>)}
        </div>
      </div>
      <div className="command-content">
        <div className="signal-health"><span><i /> FEED STATUS</span><strong>2 CURRENT</strong><strong className="warn">1 UNKNOWN</strong></div>
        <CommandEvent code="PL" time="10:00" home="LONDON NORTH" away="MANCHESTER BLUE" watch="LIVE VERIFIED" age="SRC 18M" state="live" />
        <div className="conflict-bracket"><span>CONFLICT WINDOW · 30 MIN</span></div>
        <CommandEvent code="MLS" time="15:00" home="MIAMI" away="SEATTLE" watch="ACCESS VARIES" age="SRC 09M" state="care" />
        <CommandEvent code="UCL" time="15:30" home="MADRID WHITE" away="PARIS" watch="VIEWING UNKNOWN" age="RECHECK 12M" state="unknown" />
        <button className={`alert-arm ${armed ? "armed" : ""}`} onClick={() => setArmed(!armed)}><Bell size={16} /><span>CHANGE ALERTS</span><strong>{armed ? "ARMED" : "PAUSED"}</strong></button>
      </div>
      <PhoneNav active="Desk" dark />
    </div>
  );
}

function CommandEvent({ code, time, home, away, watch, age, state }: {
  code: string; time: string; home: string; away: string; watch: string; age: string; state: "live" | "care" | "unknown";
}) {
  return (
    <article className={`command-event ${state}`}>
      <div className="command-meta"><span>{code}</span><strong>{time}</strong><small>LOCAL</small></div>
      <div className="command-match"><h3>{home}<span>/</span>{away}</h3><p><Radio size={13} />{watch}</p></div>
      <div className="command-age"><span>{age}</span><ArrowUpRight size={16} /></div>
    </article>
  );
}

function PhoneNav({ active, dark, planner = false }: { active: string; dark: boolean; planner?: boolean }) {
  const items = planner ? ["Weekend", "Following", "News"] : dark ? ["Desk", "Follows", "Intel"] : ["Plan", "Following", "News"];
  return (
    <nav className={`phone-nav ${dark ? "nav-dark" : ""}`} aria-label="Prototype navigation">
      {items.map((item, index) => (
        <button className={item === active ? "active" : ""} key={item} onClick={() => item !== active && toast.info(`${item} is outside this design-review screen`)}>
          {index === 0 ? <CalendarDays size={18} /> : index === 1 ? <Flag size={18} /> : <ListFilter size={18} />}
          <span>{item}</span>
        </button>
      ))}
    </nav>
  );
}

export function DirectionComparison() {
  const saved = useMemo(() => window.localStorage.getItem("watch-plan-direction"), []);
  return (
    <main className="review-page">
      <header className="review-header">
        <div>
          <p className="review-kicker">SPORTS CALENDAR APP · VISUAL DIRECTION REVIEW</p>
          <h1>Three ways to make<br />matchday feel manageable.</h1>
        </div>
        <div className="review-instructions">
          <span className="scenario-pill">Scenario data · not live</span>
          <p>Compare the same Saturday in three visual systems. Open any direction for a larger, clickable view.</p>
        </div>
      </header>
      <section className="direction-grid">
        {directions.map((direction) => (
          <article className={`direction-card ${direction.id} ${saved === direction.id ? "saved" : ""}`} key={direction.id}>
            <div className="direction-card-head">
              <div className="direction-marker" style={{ backgroundColor: direction.accent }}>{direction.marker}</div>
              <div><p>{direction.school}</p><h2>{direction.name}</h2></div>
              {saved === direction.id && <span className="saved-chip"><Check size={13} /> saved</span>}
            </div>
            <div className="phone-stage">
              {direction.id === "editorial" && <EditorialPhone compact />}
              {direction.id === "planner" && <PlannerPhone compact />}
              {direction.id === "command" && <CommandPhone compact />}
            </div>
            <div className="direction-card-foot">
              <p>{direction.promise}</p>
              <span>Best for: {direction.bestFor}</span>
              <div>
                <Link href={`/direction/${direction.id}`} className="open-direction">Open full view <ArrowUpRight size={15} /></Link>
                <button onClick={() => selectDirection(direction)}>Choose direction</button>
              </div>
            </div>
          </article>
        ))}
      </section>
      <footer className="review-footer">
        <span>Working title and scenario content are placeholders for design review.</span>
        <strong>Pick a direction—or tell me which parts to combine.</strong>
      </footer>
    </main>
  );
}

export function DirectionDetail({ id }: { id: DirectionId }) {
  const direction = directions.find((item) => item.id === id)!;
  return (
    <main className={`detail-page detail-${id}`}>
      <header className="detail-header">
        <Link href="/" className="back-link"><ArrowLeft size={17} /> All directions</Link>
        <div><p>{direction.marker} / {direction.school}</p><h1>{direction.name}</h1><span>{direction.promise}</span></div>
        <button className="choose-main" onClick={() => selectDirection(direction)}>Choose this direction <Check size={16} /></button>
      </header>
      <section className="detail-stage">
        <div className="detail-note left-note"><span>01</span><strong>Core hierarchy</strong><p>Time, teams, competition, viewing confidence, and freshness stay visible without opening the event.</p></div>
        {id === "editorial" && <EditorialPhone />}
        {id === "planner" && <PlannerPhone />}
        {id === "command" && <CommandPhone />}
        <div className="detail-note right-note"><span>02</span><strong>Try it</strong><p>Toggle must-watch, plan density, spoiler protection, or alerts to feel each direction’s interaction style.</p></div>
      </section>
      <div className="detail-footer"><span>Prototype scenario · not a live fixture or viewing guide</span><Link href="/">Compare all three <ArrowUpRight size={15} /></Link></div>
    </main>
  );
}

export function UnknownDirection() {
  return <DirectionComparison />;
}
