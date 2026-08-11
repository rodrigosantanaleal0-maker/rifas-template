import { useEffect, useState } from 'react';

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

function computeParts(targetMs: number, nowMs: number): CountdownParts {
  const diff = Math.max(0, targetMs - nowMs);
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1_000) % 60),
    isPast: targetMs <= nowMs,
  };
}

/** Contagem regressiva real até `targetISO` (ex.: data oficial de apuração). */
export function useCountdown(targetISO: string | undefined): CountdownParts {
  const targetMs = targetISO ? new Date(targetISO).getTime() : 0;
  const [parts, setParts] = useState<CountdownParts>(() => computeParts(targetMs, Date.now()));

  useEffect(() => {
    if (!targetISO) return;
    const tick = () => setParts(computeParts(targetMs, Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetISO, targetMs]);

  return parts;
}
