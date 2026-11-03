"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { PortfolioDemo, type PortfolioDemoId } from "@/components/portfolio-demo";
import { DemoPauseButton, useDemoPlayback } from "@/components/demo-playback";
import { SelfcampHomePreview } from "@/components/selfcamp-home-preview";

export type PreviewScreen = { label: string; src: string; alt: string; width: number; height: number; videoSrc?: string; mobileVideoSrc?: string; mobilePosterSrc?: string; autoPlay?: boolean; bookingStartAt?: number; bookingPosterSrc?: string; mobileBookingPosterSrc?: string };

function PreviewFilm({ screen, active, startAt = 0 }: { screen: PreviewScreen; active: boolean; startAt?: number }) {
  const video = useRef<HTMLVideoElement>(null);
  const resumeTime = useRef(0);
  const visible = useRef(false);
  const [mobile, setMobile] = useState<boolean | null>(null);
  const playback = useDemoPlayback();
  const source = mobile === null ? undefined : mobile && screen.mobileVideoSrc ? screen.mobileVideoSrc : screen.videoSrc;
  const canRun = active && mobile !== null && !!playback?.motionAllowed && !playback.paused && playback.settled;

  useEffect(() => {
    const breakpoint = window.matchMedia("(max-width: 639px)");
    const sync = () => {
      resumeTime.current = video.current?.currentTime || 0;
      setMobile(breakpoint.matches);
    };
    sync();
    breakpoint.addEventListener("change", sync);
    return () => breakpoint.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const player = video.current;
    if (!player) return;
    let disposed = false;
    const sync = () => {
      if (disposed) return;
      if (!canRun || !visible.current || document.hidden) { player.pause(); return; }
      void player.play().catch(() => { /* Keep the static preview if the browser blocks playback. */ });
    };
    const observer = new IntersectionObserver(([entry]) => { visible.current = entry.isIntersecting; sync(); }, { threshold: 0.15 });
    observer.observe(player);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      disposed = true;
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      player.pause();
    };
  }, [canRun, source]);

  const desktopPoster = startAt && screen.bookingPosterSrc ? screen.bookingPosterSrc : screen.src;
  const mobilePoster = startAt && screen.mobileBookingPosterSrc ? screen.mobileBookingPosterSrc : screen.mobilePosterSrc;
  return <video ref={video} src={source} muted loop={!startAt} playsInline preload="metadata" disablePictureInPicture disableRemotePlayback
    poster={mobile && mobilePoster ? mobilePoster : desktopPoster}
    width={screen.width} height={screen.height} aria-label={screen.alt}
    onLoadedMetadata={(event) => {
      const target = Math.max(startAt, resumeTime.current);
      if (target > 0) event.currentTarget.currentTime = Math.min(target, event.currentTarget.duration || target);
      resumeTime.current = 0;
    }}
    onEnded={(event) => {
      if (!startAt) return;
      const player = event.currentTarget;
      player.currentTime = startAt;
      if (canRun && visible.current && !document.hidden) void player.play().catch(() => { /* Keep the dates poster when playback is unavailable. */ });
    }}>
    <a href={screen.videoSrc}>Voir la vidéo : {screen.label}</a>
  </video>;
}

export function ProjectPreview({ name, screens, priority = false, active = true, demo }: { name: string; screens: readonly PreviewScreen[]; priority?: boolean; active?: boolean; demo?: "selfcamp" | PortfolioDemoId }) {
  const [selected, setSelected] = useState(0);
  const [ready, setReady] = useState(false);
  const [homeOpen, setHomeOpen] = useState(false);
  const [homeRevision, setHomeRevision] = useState(0);
  const [fromBooking, setFromBooking] = useState(false);
  const previewControls = useRef<HTMLDivElement>(null);
  const openEstablishment = useCallback(() => setHomeOpen(true), []);
  const reserve = useCallback(() => { setFromBooking(true); setSelected(1); }, []);
  const video = useRef<HTMLVideoElement>(null);
  const playback = useDemoPlayback();
  useEffect(() => setReady(true), []);
  useEffect(() => { if (!active) video.current?.pause(); }, [active]);
  useEffect(() => {
    if (fromBooking && selected === 1) previewControls.current?.querySelector<HTMLButtonElement>('[aria-pressed="true"]')?.focus({ preventScroll: true });
  }, [fromBooking, selected]);
  const screen = screens[selected];
  const showDemo = !!demo && demo !== "selfcamp" && selected === 0;
  const showHomeArrival = demo === "selfcamp" && selected === 0;
  const canPause = (showDemo || (showHomeArrival && !homeOpen) || !!screen.autoPlay) && playback?.motionAllowed;
  const filmStart = fromBooking ? screen.bookingStartAt ?? 0 : 0;

  return (
    <figure className="project-preview" aria-label={`Aperçu de ${name}`}>
      <div className={`preview-image${screen.videoSrc ? " preview-video" : ""}${showDemo ? " preview-selfcamp preview-demo" : ""}${showHomeArrival ? " preview-home-arrival" : ""}`} data-kind="product" data-embedded-film={!!screen.autoPlay || undefined} data-responsive-film={!!screen.mobileVideoSrc || undefined} data-orientation={screen.width < screen.height ? "portrait" : "landscape"}>
        {demo && demo !== "selfcamp" && <div hidden={!showDemo}><PortfolioDemo id={demo} screen={screens[0]} active={active && showDemo} /></div>}
        {!showDemo && (showHomeArrival ? <SelfcampHomePreview key={homeRevision} screen={screen} active={active} priority={priority} open={homeOpen} onOpen={openEstablishment} onReserve={reserve} /> : screen.videoSrc && screen.autoPlay ? <PreviewFilm key={`${screen.videoSrc}:${filmStart}`} screen={screen} active={active} startAt={filmStart} /> : screen.videoSrc ? <video ref={video} controls playsInline preload="none" poster={screen.src} width={screen.width} height={screen.height} aria-label={screen.alt}>
          <source src={screen.videoSrc} type="video/mp4" />
          <a href={screen.videoSrc}>Voir la vidéo : {screen.label}</a>
        </video> : <Image key={screen.src} src={screen.src} alt={screen.alt} width={screen.width} height={screen.height} priority={priority} sizes={priority ? "(max-width: 959px) 100vw, 880px" : "(max-width: 639px) 100vw, 600px"} />)}
      </div>
      {(screens.length > 1 || canPause) && <figcaption className="preview-caption">
        <span className="preview-caption-text" aria-live="polite">{showHomeArrival && homeOpen ? "Accueil : fiche du Camping du Lac" : screen.label}</span>
        <div ref={previewControls} className="preview-controls" role="group" aria-label={`Commandes de l’aperçu de ${name}`}>
          {canPause && <DemoPauseButton name={name} />}
          {screens.length > 1 && screens.map((item, index) => (
            <button type="button" key={item.src} disabled={!ready} aria-pressed={selected === index} aria-label={`${name} : ${item.label}`} onClick={() => {
              if (index === selected) return;
              setFromBooking(false);
              if (index === 0 && selected !== 0) { setHomeOpen(false); setHomeRevision((value) => value + 1); }
              setSelected(index);
            }}>{item.label}</button>
          ))}
        </div>
      </figcaption>}
      {screen.videoSrc && !showDemo && screens.length === 1 && !canPause && <figcaption className="video-caption">{screen.label}</figcaption>}

    </figure>
  );
}
