import { useLayoutEffect, useRef, useState } from "react";
import "./cinematic-loader.css";

const statusMessages = [
  "Initializing interface...",
  "Preparing case files...",
  "Loading mission map...",
  "Preparing your experience...",
];

const standardArrivalDurationMs = 400;
const standardInitializationDurationMs = 1300;
const reducedArrivalDurationMs = 180;
const reducedInitializationDurationMs = 800;
const inkTransitionFallbackMs = 760;

function InkArtwork() {
  return (
    <svg
      className="cinematic-loader-art"
      viewBox="0 0 560 520"
      role="img"
      aria-label="Abstract ink illustration with a vermilion sun and signal tower"
    >
      <defs>
        <pattern id="loader-halftone" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1" fill="currentColor" />
        </pattern>
      </defs>
      <circle className="cinematic-loader-sun" cx="355" cy="174" r="112" />
      <circle className="cinematic-loader-sun-grain" cx="355" cy="174" r="105" />
      <path
        className="cinematic-loader-ink-shape"
        d="M260 463 273 399 251 369 276 354 265 303 294 283 282 242 312 226 303 179 331 198 349 137 370 205 400 183 391 235 426 247 403 278 430 303 397 327 415 358 381 374 396 418 361 420 367 466 334 447 312 484 292 450 263 475 274 436z"
      />
      <path
        className="cinematic-loader-gate"
        d="M309 448 320 277l34-114 33 114 12 171M319 331h75M315 370h82M313 408h87M354 163v285"
      />
      <path
        className="cinematic-loader-brush"
        d="m122 385 120-30m-105 48 92-23m204-199 79-42m-65 58 54-28M199 183l68-27m-62 43 47-18"
      />
      <path
        className="cinematic-loader-ground"
        d="m185 468 78-16m124 21 77-17m-302 32 64-13m178 4 54-12"
      />
      <path
        className="cinematic-loader-signal"
        d="m355 88 0-30m-21 16c11-11 31-11 42 0m-59-17c21-21 55-21 76 0"
      />
      <rect
        className="cinematic-loader-halftone"
        x="78"
        y="91"
        width="118"
        height="142"
        fill="url(#loader-halftone)"
      />
    </svg>
  );
}

function InkSplash() {
  return (
    <svg className="cinematic-loader-splash" viewBox="0 0 1000 1000" aria-hidden="true">
      <path d="m500 50 44 296 102-256-22 280 226-200-166 240 266-70-240 145 240 90-250 39 210 205-270-135 72 270-216-201-31 297-74-290-153 253 25-300-248 180 135-266-285 39 250-142-250-101 280-31-206-218 264 146-62-273 197 227z" />
    </svg>
  );
}

export default function CinematicLoader({ onComplete }) {
  const loaderRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState("arrival");
  const [statusIndex, setStatusIndex] = useState(0);

  useLayoutEffect(() => {
    const loader = loaderRef.current;
    if (!loader) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const arrivalDuration = reducedMotion.matches ? reducedArrivalDurationMs : standardArrivalDurationMs;
    const initializationDuration = reducedMotion.matches
      ? reducedInitializationDurationMs
      : standardInitializationDurationMs;
    const previousBodyOverflow = document.body.style.overflow;
    const previousRootOverflow = document.documentElement.style.overflow;
    let intervalId = 0;
    let transitionFallbackId = 0;
    let finished = false;

    document.documentElement.classList.add("cinematic-loading");
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    loader.focus();

    const finish = () => {
      if (finished) return;
      finished = true;
      onComplete();
    };

    const startTime = performance.now();
    intervalId = window.setInterval(() => {
      const elapsed = performance.now() - startTime;
      if (elapsed < arrivalDuration) return;

      setPhase("initialize");
      const ratio = Math.min((elapsed - arrivalDuration) / initializationDuration, 1);
      const easedProgress = Math.round((1 - (1 - ratio) ** 2) * 100);

      setProgress(easedProgress);
      setStatusIndex(Math.min(Math.floor(ratio * statusMessages.length), statusMessages.length - 1));

      if (ratio === 1) {
        window.clearInterval(intervalId);
        setPhase("wipe");
        transitionFallbackId = window.setTimeout(finish, inkTransitionFallbackMs);
      }
    }, 32);

    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(transitionFallbackId);
      document.documentElement.classList.remove("cinematic-loading");
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousRootOverflow;
    };
  }, [onComplete]);

  const handleAnimationEnd = (event) => {
    if (phase === "wipe" && event.target.classList.contains("cinematic-loader-splash")) {
      onComplete();
    }
  };

  return (
    <div
      className={`cinematic-loader cinematic-loader-${phase}`}
      ref={loaderRef}
      onAnimationEnd={handleAnimationEnd}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cinematic-loader-heading"
      tabIndex={-1}
    >
      <div className="cinematic-loader-frame">
        <header className="cinematic-loader-header">
          <span className="cinematic-loader-mark">A/G</span>
          <span className="cinematic-loader-header-note">PERSONAL SECURITY PRACTICE</span>
          <span className="cinematic-loader-edition">PORTFOLIO / 2026</span>
        </header>

        <div className="cinematic-loader-composition">
          <div className="cinematic-loader-copy">
            <p className="cinematic-loader-kicker">
              <span className="cinematic-loader-live-mark" />
              INITIALIZING <span>— 0{statusIndex + 1} / 04</span>
            </p>
            <h1 className="cinematic-loader-title" id="cinematic-loader-heading">
              <span className="cinematic-loader-title-first">CYBER</span>
              <span>REALM<i>.</i></span>
            </h1>
            <div className="cinematic-loader-identity">
              <span className="cinematic-loader-rule" />
              <p>SHREE ASHWIN A G</p>
              <blockquote>Every Journey Forges a Warrior.</blockquote>
            </div>
            <p className="cinematic-loader-caption">A FIELD GUIDE TO DEFENSIVE SECURITY</p>
          </div>

          <div className="cinematic-loader-art-wrap">
            <InkArtwork />
            <span className="cinematic-loader-art-index">FIG. 01 / SIGNAL IN INK</span>
          </div>
        </div>

        <footer className="cinematic-loader-footer">
          <p className="cinematic-loader-status">
            <span>LOCAL INTERFACE</span>
            <span role="status" aria-live="polite" aria-atomic="true">
              {statusMessages[statusIndex]}
            </span>
          </p>
          <div
            className="cinematic-loader-progress"
            role="progressbar"
            aria-label="Portfolio loading progress"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={progress}
          >
            <span style={{ transform: `scaleX(${progress / 100})` }} />
          </div>
          <p className="cinematic-loader-progress-label">{String(progress).padStart(3, "0")}%</p>
        </footer>
      </div>
      {phase === "wipe" && <InkSplash />}
    </div>
  );
}
