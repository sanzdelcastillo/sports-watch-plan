import { useEffect, useState } from "react";
import { defaultFollowing, defaultMustWatch } from "@/data/demo";

export type ReminderMap = Record<string, number>;

function useStoredState<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : fallback;
    } catch {
      return fallback;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}

export function usePrototype() {
  const [following, setFollowing] = useStoredState<string[]>("wp-following", defaultFollowing);
  const [mustWatch, setMustWatch] = useStoredState<string[]>("wp-must-watch", defaultMustWatch);
  const [reminders, setReminders] = useStoredState<ReminderMap>("wp-reminders", { "arsenal-man-city": 30 });
  const [timezone, setTimezone] = useStoredState("wp-timezone", "America/New_York");
  const [spoilersHidden, setSpoilersHidden] = useStoredState("wp-spoilers", true);
  const [showStale, setShowStale] = useStoredState("wp-show-stale", true);

  const toggleInList = (id: string, values: string[], setter: (next: string[]) => void) => {
    setter(values.includes(id) ? values.filter((item) => item !== id) : [...values, id]);
  };

  return {
    following,
    toggleFollowing: (id: string) => toggleInList(id, following, setFollowing),
    mustWatch,
    toggleMustWatch: (id: string) => toggleInList(id, mustWatch, setMustWatch),
    reminders,
    setReminder: (id: string, minutes?: number) => {
      const next = { ...reminders };
      if (minutes === undefined) delete next[id];
      else next[id] = minutes;
      setReminders(next);
    },
    timezone,
    setTimezone,
    spoilersHidden,
    setSpoilersHidden,
    showStale,
    setShowStale,
  };
}
