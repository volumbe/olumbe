"use client";

import { useState, useEffect } from "react";

export default function ElapsedTimer() {
  const [elapsed, setElapsed] = useState({
    weeks: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateElapsed = () => {
      // August 5, 2025 1:00 AM in Nairobi timezone (UTC+3)
      const targetDate = new Date("2025-08-05T01:00:00+03:00");
      const now = new Date();

      const diffMs = now.getTime() - targetDate.getTime();

      // If the target date is in the future, show zeros
      if (diffMs < 0) {
        setElapsed({ weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const totalSeconds = Math.floor(diffMs / 1000);
      const totalMinutes = Math.floor(totalSeconds / 60);
      const totalHours = Math.floor(totalMinutes / 60);
      const totalDays = Math.floor(totalHours / 24);
      const totalWeeks = Math.floor(totalDays / 7);

      const weeks = totalWeeks;
      const days = totalDays % 7;
      const hours = totalHours % 24;
      const minutes = totalMinutes % 60;
      const seconds = totalSeconds % 60;

      setElapsed({ weeks, days, hours, minutes, seconds });
    };

    calculateElapsed();
    const interval = setInterval(calculateElapsed, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatUnit = (value: number, unit: string) => {
    return `${value}${unit.charAt(0)}`;
  };

  return (
    <div className="text-[0.8rem] text-slate-300/80 font-mono tracking-wide flex items-center gap-1">
      <span className="text-emerald-400/60">⏱</span>
      <span>
        {formatUnit(elapsed.weeks, "w")} {formatUnit(elapsed.days, "d")}{" "}
        {formatUnit(elapsed.hours, "h")} {formatUnit(elapsed.minutes, "m")}{" "}
        {formatUnit(elapsed.seconds, "s")}
      </span>
    </div>
  );
}
