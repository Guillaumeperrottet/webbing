"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Pause, Play } from "lucide-react";

type DemoPlayback = { paused: boolean; motionAllowed: boolean; togglePause: () => void };
const PlaybackContext = createContext<DemoPlayback | null>(null);

export function DemoPlaybackProvider({ children }: { children: ReactNode }) {
  const [paused, setPaused] = useState(false);
  const [motionAllowed, setMotionAllowed] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setMotionAllowed(!media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return <PlaybackContext.Provider value={{ paused, motionAllowed, togglePause: () => setPaused((value) => !value) }}>{children}</PlaybackContext.Provider>;
}

export function useDemoPlayback() {
  return useContext(PlaybackContext);
}

export function DemoPauseButton({ name }: { name: string }) {
  const playback = useDemoPlayback();
  if (!playback?.motionAllowed) return null;
  const label = `${playback.paused ? "Reprendre" : "Mettre en pause"} la démonstration de ${name}`;

  return <button type="button" className="demo-pause-control" onClick={playback.togglePause} aria-label={label} title={label}>
    {playback.paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
    <span className="demo-pause-label">{playback.paused ? "Reprendre" : "Pause"}</span>
  </button>;
}
