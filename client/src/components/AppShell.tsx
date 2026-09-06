import type { ReactNode } from "react";
import { Bell, CalendarDays, EyeOff, Flag, FlaskConical, Settings, ShieldCheck } from "lucide-react";
import { Link, useLocation } from "wouter";
import { timezoneShort } from "@/data/demo";
import { usePrototype } from "@/hooks/usePrototype";

const navigation = [
  { href: "/", label: "Watch Plan", icon: CalendarDays },
  { href: "/following", label: "Following", icon: Flag },
  { href: "/states", label: "State Lab", icon: FlaskConical },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function AppShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { timezone, spoilersHidden } = usePrototype();
  const isActive = (href: string) => href === "/" ? location === "/" : location.startsWith(href);

  return (
    <div className="product-shell">
      <header className="product-topbar">
        <Link href="/" className="product-wordmark" aria-label="Watch Plan home">
          WATCH<span>PLAN</span><small>prototype</small>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map(({ href, label }) => (
            <Link key={href} href={href} className={isActive(href) ? "active" : ""}>{label}</Link>
          ))}
        </nav>
        <div className="topbar-signals">
          {spoilersHidden && <span><EyeOff size={13} /> Spoilers hidden</span>}
          <span><ShieldCheck size={13} /> Scenario data</span>
          <span className="timezone-chip">{timezoneShort(timezone)}</span>
          <button className="notification-button" aria-label="Notifications"><Bell size={17} /></button>
          <span className="profile-dot">JS</span>
        </div>
      </header>
      {children}
      <nav className="mobile-nav" aria-label="Mobile navigation">
        {navigation.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={isActive(href) ? "active" : ""}>
            <Icon size={19} /><span>{label === "Watch Plan" ? "Plan" : label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
