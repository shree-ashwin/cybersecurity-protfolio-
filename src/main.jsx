import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { createRoot } from "react-dom/client";
import CinematicLoader from "./CinematicLoader.jsx";
import { contact, journey, missionMapNodes, projects, roadmap, skillGroups, skillMap } from "./data/portfolio.js";
import "./styles.css";

const navigation = [
  ["Home", "#top"],
  ["About", "#about"],
  ["Projects", "#work"],
  ["Skills", "#skills"],
  ["Terminal", "#terminal"],
  ["Achievements", "#achievements"],
  ["Contact", "#contact"],
];

const projectCategories = ["All", ...new Set(projects.map((project) => project.category))];
const skillCategories = ["All", ...skillGroups.map((group) => group.id)];
const journeyCategories = ["All", "Achievement", "Project", "Learning"];

function CursorEffects() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const trailRefs = useRef([]);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const trail = trailRefs.current;
    let pointerX = 0;
    let pointerY = 0;
    let ringX = 0;
    let ringY = 0;
    let animationFrame = 0;
    let lastTrailX = 0;
    let lastTrailY = 0;
    let trailIndex = 0;
    let magneticTarget = null;

    const resetMagneticTarget = () => {
      if (!magneticTarget) return;
      magneticTarget.style.removeProperty("--magnetic-x");
      magneticTarget.style.removeProperty("--magnetic-y");
      magneticTarget = null;
    };

    const setCursorState = (target) => {
      const isInteractive = Boolean(target?.closest?.("a, button, input, textarea, select, [role='button']"));
      ring.dataset.state = isInteractive ? "interactive" : "default";
      dot.dataset.state = isInteractive ? "interactive" : "default";
    };

    const animateRing = () => {
      ringX += (pointerX - ringX) * 0.2;
      ringY += (pointerY - ringY) * 0.2;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;

      if (Math.abs(pointerX - ringX) > 0.15 || Math.abs(pointerY - ringY) > 0.15) {
        animationFrame = requestAnimationFrame(animateRing);
      } else {
        animationFrame = 0;
      }
    };

    const addTrailMark = (x, y) => {
      if (reducedMotion.matches || Math.hypot(x - lastTrailX, y - lastTrailY) < 12) return;
      const mark = trail[trailIndex % trail.length];
      trailIndex += 1;
      lastTrailX = x;
      lastTrailY = y;
      mark.classList.remove("is-active");
      mark.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      void mark.offsetWidth;
      mark.classList.add("is-active");
    };

    const onPointerMove = (event) => {
      if (event.pointerType === "touch") return;
      if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;

      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!document.body.classList.contains("has-custom-cursor")) {
        ringX = pointerX;
        ringY = pointerY;
        document.body.classList.add("has-custom-cursor");
      }
      dot.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0) translate(-50%, -50%)`;
      if (reducedMotion.matches) {
        ring.style.transform = dot.style.transform;
      } else if (!animationFrame) {
        animationFrame = requestAnimationFrame(animateRing);
      }

      setCursorState(event.target);
      addTrailMark(pointerX, pointerY);

      const nextMagneticTarget = event.target.closest?.("[data-magnetic]");
      if (nextMagneticTarget !== magneticTarget) {
        resetMagneticTarget();
        magneticTarget = nextMagneticTarget;
      }
      if (magneticTarget && !reducedMotion.matches) {
        const bounds = magneticTarget.getBoundingClientRect();
        const x = (event.clientX - (bounds.left + bounds.width / 2)) / bounds.width;
        const y = (event.clientY - (bounds.top + bounds.height / 2)) / bounds.height;
        magneticTarget.style.setProperty("--magnetic-x", `${(x * 5).toFixed(1)}px`);
        magneticTarget.style.setProperty("--magnetic-y", `${(y * 4).toFixed(1)}px`);
      }
    };

    const onPointerOut = (event) => {
      if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
      const nextTarget = event.relatedTarget;
      setCursorState(nextTarget);
      if (magneticTarget && !nextTarget?.closest?.("[data-magnetic]")) resetMagneticTarget();
      if (nextTarget) return;

      document.body.classList.remove("has-custom-cursor");
      ring.dataset.state = "default";
      dot.dataset.state = "default";
      resetMagneticTarget();
      cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    };

    const onMotionPreferenceChange = () => {
      if (!reducedMotion.matches) return;
      cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      resetMagneticTarget();
      if (document.body.classList.contains("has-custom-cursor")) {
        ring.style.transform = dot.style.transform;
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerout", onPointerOut);
    reducedMotion.addEventListener?.("change", onMotionPreferenceChange);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerout", onPointerOut);
      reducedMotion.removeEventListener?.("change", onMotionPreferenceChange);
      cancelAnimationFrame(animationFrame);
      resetMagneticTarget();
      document.body.classList.remove("has-custom-cursor");
    };
  }, []);

  return createPortal(
    <div className="cursor-effects" aria-hidden="true">
      {Array.from({ length: 8 }, (_, index) => (
        <span
          className={`cursor-trail-mark${index % 3 === 0 ? " cursor-trail-accent" : ""}`}
          key={index}
          ref={(element) => { trailRefs.current[index] = element; }}
        />
      ))}
      <span className="custom-cursor-ring" ref={ringRef} data-state="default" />
      <span className="custom-cursor-dot" ref={dotRef} data-state="default" />
    </div>,
    document.body,
  );
}

function PageTransition({ phase, onAnimationComplete }) {
  const transitionRef = useRef(null);

  useEffect(() => {
    const transition = transitionRef.current;
    if (!transition) return undefined;

    transition.addEventListener("animationcancel", onAnimationComplete);
    return () => transition.removeEventListener("animationcancel", onAnimationComplete);
  }, [onAnimationComplete, phase]);

  if (phase === "idle") return null;

  return createPortal(
    <div
      ref={transitionRef}
      className={`page-transition page-transition-${phase}`}
      aria-hidden="true"
      onAnimationEnd={onAnimationComplete}
    >
      <span className="page-transition-panel page-transition-primary" />
      <span className="page-transition-panel page-transition-secondary" />
      <span className="page-transition-panel page-transition-accent" />
    </div>,
    document.body,
  );
}

function updatePointerResponse(event) {
  if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const bounds = event.currentTarget.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width;
  const y = (event.clientY - bounds.top) / bounds.height;
  const target = event.currentTarget.style;

  target.setProperty("--pointer-x", `${Math.round(x * 100)}%`);
  target.setProperty("--pointer-y", `${Math.round(y * 100)}%`);
  if (event.currentTarget.classList.contains("pointer-reactive")) {
    target.setProperty("--pointer-active", "1");
  }
  if (event.currentTarget.classList.contains("project-card") && !reducedMotion) {
    target.setProperty("--tilt-x", `${((0.5 - y) * 3).toFixed(2)}deg`);
    target.setProperty("--tilt-y", `${((x - 0.5) * 3).toFixed(2)}deg`);
  }

  if (event.currentTarget.classList.contains("hero-grid") && !reducedMotion) {
    target.setProperty("--ink-shift-x", `${((x - 0.5) * 8).toFixed(1)}px`);
    target.setProperty("--ink-shift-y", `${((y - 0.5) * 6).toFixed(1)}px`);
  } else if (event.currentTarget.classList.contains("hero-grid")) {
    target.setProperty("--ink-shift-x", "0px");
    target.setProperty("--ink-shift-y", "0px");
  }
}

function resetPointerResponse(event) {
  const target = event.currentTarget.style;
  target.setProperty("--pointer-x", "50%");
  target.setProperty("--pointer-y", "50%");
  target.setProperty("--pointer-active", "0");
  target.setProperty("--tilt-x", "0deg");
  target.setProperty("--tilt-y", "0deg");
  target.setProperty("--ink-shift-x", "0px");
  target.setProperty("--ink-shift-y", "0px");
}

function SectionIndex({ number, label }) {
  return (
    <p className="section-index">
      <span>{number}</span> / {label}
    </p>
  );
}

function Monogram() {
  return (
    <svg
      className="monogram-mark"
      viewBox="0 0 250 150"
      role="img"
      aria-labelledby="monogram-title"
    >
      <title id="monogram-title">A G monogram</title>
      <path className="monogram-a" d="M13 137 67 13l54 124M34 91h66" />
      <path className="monogram-g" d="M226 44c-13-20-29-29-50-29-36 0-59 27-59 63s23 61 58 61c21 0 38-8 51-24V82h-47" />
      <path className="monogram-cut" d="M163 115h39" />
    </svg>
  );
}

function InkPanel() {
  return (
    <div className="hero-ink-panel" aria-hidden="true">
      <svg viewBox="0 0 440 280" preserveAspectRatio="xMidYMid meet">
        <path className="ink-burst" d="m219 8 21 43 35-38-4 55 52-24-22 51 59-3-41 38 54 24-56 6 29 48-53-22-4 57-37-40-29 49-8-57-46 35 17-55-57 9 37-42-52-28 57-2-20-54 48 28 13-54 25 47z" />
        <path className="ink-slice" d="m205 64 35 7 30-37-8 50 47-14-36 39 46 19-55-1 14 49-35-40-28 46 10-55-53 15 40-37-43-26 55 7z" />
        <path className="ink-accent" d="m274 64 48-30-30 50 55-6-49 27" />
        <path className="ink-speed" d="M48 41h105M22 56h116M70 71h82M295 216h94M318 231h74M290 246h115" />
      </svg>
      <span>FORM / SIGNAL / STRUCTURE</span>
    </div>
  );
}

function ProjectDialog({ project, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, [project]);

  return (
    <dialog
      className="project-dialog"
      ref={dialogRef}
      aria-labelledby={`${project.id}-title`}
      onClose={onClose}
      onCancel={(event) => {
        event.preventDefault();
        dialogRef.current?.close();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") dialogRef.current?.close();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) dialogRef.current.close();
      }}
    >
      <div className="dialog-topline">
        <span>PROJECT / {project.index}</span>
        <button type="button" className="dialog-close" onClick={() => dialogRef.current?.close()}>
          CLOSE <span aria-hidden="true">×</span>
        </button>
      </div>
      <p className="dialog-type">{project.type} <span>·</span> {project.status}</p>
      <h2 id={`${project.id}-title`}>{project.title}</h2>
      <div className="dialog-grid">
        <div>
          <h3>Problem</h3>
          <p>{project.problem}</p>
        </div>
        <div>
          <h3>Contribution</h3>
          <p>{project.contribution}</p>
        </div>
        <div>
          <h3>Technologies</h3>
          {project.tools.length > 0 ? (
            <ul className="dialog-tools">
              {project.tools.map((tool) => <li key={tool}>{tool}</li>)}
            </ul>
          ) : (
            <p>Technologies are not documented.</p>
          )}
        </div>
        <div>
          <h3>Outcome / scope</h3>
          <p>{project.outcome}</p>
        </div>
      </div>
      {project.images?.length > 0 && (
        <div className="dialog-images" aria-label="Project screenshots">
          {project.images.map((image) => (
            <figure key={image.src}>
              <img src={image.src} alt={image.alt} loading="lazy" />
              {image.caption && <figcaption>{image.caption}</figcaption>}
            </figure>
          ))}
        </div>
      )}
      {project.repositoryUrl ? (
        <a className="dialog-link" href={project.repositoryUrl} target="_blank" rel="noreferrer">
          OPEN PROJECT <span aria-hidden="true">↗</span>
        </a>
      ) : (
        <p className="dialog-missing-link">REPOSITORY LINK NOT PROVIDED</p>
      )}
    </dialog>
  );
}

function ProjectCard({ project, onSelect }) {
  return (
    <button
      className={`project-card pointer-reactive project-card-${project.index} reveal`}
      type="button"
      onClick={() => onSelect(project)}
      onPointerMove={updatePointerResponse}
      onPointerLeave={resetPointerResponse}
      aria-haspopup="dialog"
      aria-label={`${project.title}. ${project.summary} Status: ${project.status}. Open project details.`}
    >
      <span className="project-card-ink-mark" aria-hidden="true" />
      <span className="project-card-meta">
        <span>SELECTED WORK / {project.index}</span>
        <span className="project-card-open" aria-hidden="true">↗</span>
      </span>
      <span className="project-card-type">{project.type}</span>
      <span className="project-card-title">{project.title}</span>
      <span className="project-card-summary">{project.summary}</span>
      <span className="project-card-attributes">
        <span className="project-card-status">{project.status}</span>
        <span className="project-card-tools">
          {project.tools.length ? project.tools.join(" / ") : "TECHNOLOGIES NOT DOCUMENTED"}
        </span>
      </span>
      <span className="project-reveal" aria-hidden="true">
        <span className="project-card-detail">{project.contribution}</span>
        <span className="project-card-cta">OPEN PROJECT NOTES <span>↗</span></span>
      </span>
    </button>
  );
}

function JourneyCard({ item, index, isOpen, onToggle }) {
  const detailId = `journey-detail-${item.id}`;

  return (
    <article className={`journey-card journey-card-${item.category.toLowerCase()} reveal`}>
      <span className="journey-marker" aria-hidden="true" />
      <button
        type="button"
        className="journey-toggle"
        aria-expanded={isOpen}
        aria-controls={detailId}
        onClick={onToggle}
      >
        <span className="journey-card-meta">
          <span>NOTE / {String(index + 1).padStart(2, "0")} · {item.category.toUpperCase()}</span>
          <span>{item.date}</span>
        </span>
        <span className="journey-card-title">{item.title}</span>
        <span className="journey-card-summary">{item.summary}</span>
        <span className={`journey-status journey-status-${item.category.toLowerCase()}`}>
          {item.status}
        </span>
        <span className="journey-card-action" aria-hidden="true">
          {isOpen ? "CLOSE NOTE −" : "OPEN NOTE +"}
        </span>
      </button>
      <div className="journey-card-detail" id={detailId} hidden={!isOpen}>
        <p>{item.detail}</p>
        {item.notes && <p className="journey-card-notes">{item.notes}</p>}
        {item.link && (
          <a href={item.link} target="_blank" rel="noreferrer">
            {item.category === "Achievement" ? "READ WRITE-UP" : "OPEN PROJECT"} ↗
          </a>
        )}
      </div>
    </article>
  );
}

function SkillMap() {
  const [selectedId, setSelectedId] = useState(null);
  const selectedNode = missionMapNodes.find((node) => node.id === selectedId);
  const relatedIds = selectedNode?.related ?? [];
  const edges = [];
  const edgeKeys = new Set();
  const addEdge = (from, to, type) => {
    const key = [from.id, to.id].sort().join(":");
    if (edgeKeys.has(key)) return;
    edgeKeys.add(key);
    edges.push({ from, to, type, key });
  };

  missionMapNodes.forEach((node) => {
    addEdge({ id: "cybersecurity", x: 500, y: 410 }, { id: node.id, ...node.position }, "spoke");
    node.related.forEach((relatedId) => {
      const related = missionMapNodes.find((candidate) => candidate.id === relatedId);
      if (related) addEdge({ id: node.id, ...node.position }, { id: related.id, ...related.position }, "related");
    });
  });

  return (
    <div className="skill-map-wrap">
      <div className="skill-map" role="group" aria-label="Cybersecurity mission map">
        <svg className="skill-map-lines" viewBox="0 0 1000 820" preserveAspectRatio="none" aria-hidden="true">
          {edges.map((edge) => (
            <path
              key={edge.key}
              className={`skill-map-line skill-map-line-${edge.type}${edge.from.id === selectedId || edge.to.id === selectedId ? " is-selected" : ""}`}
              data-from={edge.from.id}
              data-to={edge.to.id}
              d={`M${edge.from.x} ${edge.from.y} L${edge.to.x} ${edge.to.y}`}
            />
          ))}
        </svg>
        <div className="skill-map-grid">
          {missionMapNodes.map((node) => (
            <button
              className={`skill-map-node skill-map-node-${node.kind}${selectedId === node.id ? " is-selected" : ""}${relatedIds.includes(node.id) ? " is-related" : ""}`}
              type="button"
              key={node.id}
              data-node-id={node.id}
              style={{ "--node-x": `${node.position.x / 10}%`, "--node-y": `${node.position.y / 8.2}%` }}
              aria-label={`${node.title}. ${node.kind}. ${node.status}. Show details.`}
              aria-pressed={selectedId === node.id}
              aria-controls="skill-map-detail"
              onClick={() => setSelectedId(node.id)}
            >
              <span className="skill-map-node-kind">{node.kind}</span>
              <span className="skill-map-node-title">{node.title}</span>
              <span className="skill-map-level">{node.status}</span>
            </button>
          ))}
          <div className="skill-map-center" aria-label="Central category: Cybersecurity">
            <span>CYBERSECURITY</span>
            <span className="skill-map-center-note">FIELD / INDEX</span>
          </div>
        </div>
      </div>
      <section
        className="skill-map-detail"
        id="skill-map-detail"
        aria-live="polite"
        aria-labelledby="skill-map-detail-title"
        hidden={!selectedNode}
      >
        <div className="skill-map-detail-heading">
          <div>
            <span className="skill-map-detail-label">
              MAP NOTE{selectedNode ? ` / ${selectedNode.kind.toUpperCase()} · ${selectedNode.status.toUpperCase()}` : ""}
            </span>
            <h3 id="skill-map-detail-title">{selectedNode?.title ?? "Select a destination"}</h3>
          </div>
          <button className="skill-map-close" type="button" onClick={() => setSelectedId(null)}>
            CLOSE <span aria-hidden="true">×</span>
          </button>
        </div>
        {selectedNode && (
          <>
            <p>{selectedNode.description}</p>
            <p className="skill-map-activity">{selectedNode.detail}</p>
            {selectedNode.tools.length > 0 && (
              <p className="skill-map-node-tools">
                {selectedNode.kind === "achievement" ? "AREAS RECORDED" : "DOCUMENTED TECHNOLOGIES"}: {selectedNode.tools.join(" / ")}
              </p>
            )}
            {relatedIds.length > 0 && (
              <div className="skill-map-related">
                <span>CONNECTED DESTINATIONS</span>
                {relatedIds.map((relatedId) => {
                  const related = missionMapNodes.find((node) => node.id === relatedId);
                  return related ? (
                    <button type="button" key={relatedId} onClick={() => setSelectedId(relatedId)}>
                      {related.title}
                    </button>
                  ) : null;
                })}
              </div>
            )}
            {selectedNode.link && (
              <a className="skill-map-destination-link" href={selectedNode.link} target="_blank" rel="noreferrer">
                OPEN VERIFIED LINK ↗
              </a>
            )}
          </>
        )}
      </section>
    </div>
  );
}

function getTerminalOutput(command) {
  switch (command) {
    case "help":
      return [
        "Available commands:",
        "about  — portfolio introduction",
        "skills — documented skills and learning levels",
        "projects — projects currently listed in the portfolio",
        "journey — recorded achievements and learning milestones",
        "contact — configured contact details",
        "clear  — clear terminal history",
      ];
    case "about":
      return [
        "SHREE ASHWIN A G",
        "Aspiring Threat Hunter | Cybersecurity Student",
        "A cybersecurity student building practical foundations in defensive security and threat hunting.",
        "Learning through projects, CTF practice, and clear documentation of what the evidence supports.",
      ];
    case "skills":
      return skillMap.map((skill) => `${skill.title} — ${skill.level}`);
    case "projects":
      return projects.map((project) => `${project.title} — ${project.status}. ${project.summary}`);
    case "journey":
      return journey.map((item) =>
        `[${item.category} / ${item.status}] ${item.title} — ${item.date}. ${item.summary}`,
      );
    case "contact": {
      const details = [
        contact.email && `Email: ${contact.email}`,
        contact.githubUrl && `GitHub: ${contact.githubUrl}`,
        contact.linkedinUrl && `LinkedIn: ${contact.linkedinUrl}`,
      ].filter(Boolean);
      return details.length
        ? details
        : ["No contact details have been configured in the portfolio yet."];
    }
    default:
      return [`I don't recognize "${command}". Type "help" to see available commands.`];
  }
}

function FieldTerminal() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const nextEntryId = useRef(0);

  const runCommand = (event) => {
    event.preventDefault();
    const command = input.trim().toLowerCase();
    if (!command) return;

    setInput("");
    if (command === "clear") {
      setHistory([]);
      return;
    }

    setHistory((entries) => [
      ...entries,
      {
        id: nextEntryId.current++,
        command,
        output: getTerminalOutput(command),
      },
    ]);
  };

  return (
    <div className="field-terminal">
      <div className="terminal-topline">
        <span>FIELD TERMINAL // SIMULATION</span>
        <span>PORTFOLIO DATA ONLY</span>
      </div>
      <div className="terminal-intro">
        <p>Read-only portfolio interface. No system commands are executed.</p>
        <p>Type <code>help</code> to see available commands.</p>
      </div>
      <div className="terminal-output" role="log" aria-live="polite" aria-relevant="additions">
        {history.map((entry) => (
          <div className="terminal-entry" key={entry.id}>
            <p className="terminal-command"><span aria-hidden="true">&gt;</span> {entry.command}</p>
            <div className="terminal-response">
              {entry.output.map((line, index) => <p key={`${entry.id}-${index}`}>{line}</p>)}
            </div>
          </div>
        ))}
      </div>
      <form className="terminal-form" onSubmit={runCommand}>
        <label className="terminal-prompt" htmlFor="terminal-input">
          <span aria-hidden="true">&gt;</span>
          <span className="terminal-caret" aria-hidden="true" />
        </label>
        <input
          id="terminal-input"
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder='try "help"'
          autoComplete="off"
          autoCapitalize="none"
          spellCheck="false"
          aria-label="Enter a portfolio command"
        />
        <button type="submit">RUN <span aria-hidden="true">↵</span></button>
      </form>
    </div>
  );
}

function App() {
  const shellRef = useRef(null);
  const journeyLineRef = useRef(null);
  const transitionLockRef = useRef(false);
  const transitionDestinationRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeSection, setActiveSection] = useState("top");
  const [transitionPhase, setTransitionPhase] = useState("idle");
  const [projectFilter, setProjectFilter] = useState("All");
  const [projectQuery, setProjectQuery] = useState("");
  const [skillFilter, setSkillFilter] = useState("All");
  const [journeyFilter, setJourneyFilter] = useState("All");
  const [openJourney, setOpenJourney] = useState(null);
  const [openRoadmap, setOpenRoadmap] = useState(roadmap.find((item) => item.status === "Learning")?.id ?? null);
  const [copyMessage, setCopyMessage] = useState("");

  useEffect(() => {
    const targets = document.querySelectorAll(".reveal, .ink-transition");
    if (!("IntersectionObserver" in window)) {
      targets.forEach((target) => target.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [projectFilter, projectQuery, skillFilter, journeyFilter]);

  useEffect(() => {
    const sections = navigation
      .map(([, href]) => document.querySelector(href))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-18% 0px -62% 0px", threshold: [0, 0.15, 0.35, 0.6] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    let frame = 0;

    const updateScrollShift = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        shell.style.setProperty("--scroll-shift", `${Math.max(-22, Math.min(0, -window.scrollY * 0.025))}px`);
      });
    };

    window.addEventListener("scroll", updateScrollShift, { passive: true });
    updateScrollShift();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateScrollShift);
    };
  }, []);

  useEffect(() => {
    const timeline = journeyLineRef.current;
    if (!timeline) return undefined;
    let frame = 0;

    const updateProgress = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const bounds = timeline.getBoundingClientRect();
        const progress = Math.max(0, Math.min(
          1,
          (window.innerHeight * 0.78 - bounds.top) / Math.max(bounds.height, 1),
        ));
        timeline.style.setProperty("--journey-progress", progress.toFixed(3));
      });
    };
    const resizeObserver = new ResizeObserver(updateProgress);

    updateProgress();
    resizeObserver.observe(timeline);
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [journeyFilter]);

  useEffect(() => () => {
    document.documentElement.classList.remove("page-transitioning");
    transitionLockRef.current = false;
    transitionDestinationRef.current = null;
  }, []);

  const handleInternalNavigation = (event) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) return;

    const link = event.target.closest?.("a[href]");
    if (!link || link.target || link.hasAttribute("download")) return;
    const destinationUrl = new URL(link.href, window.location.href);
    if (
      destinationUrl.origin !== window.location.origin ||
      destinationUrl.pathname !== window.location.pathname ||
      destinationUrl.search !== window.location.search ||
      !destinationUrl.hash
    ) return;

    const destination = document.getElementById(decodeURIComponent(destinationUrl.hash.slice(1)));
    if (!destination || destination.id === "main") return;

    event.preventDefault();
    setMenuOpen(false);
    if (transitionLockRef.current) return;

    transitionLockRef.current = true;
    transitionDestinationRef.current = { destination, hash: destinationUrl.hash };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      completeSectionNavigation();
      return;
    }
    document.documentElement.classList.add("page-transitioning");
    setTransitionPhase("cover");
  };

  const completeSectionNavigation = () => {
    const navigationTarget = transitionDestinationRef.current;
    if (!navigationTarget) return;

    if (window.location.hash !== navigationTarget.hash) {
      window.history.pushState(null, "", navigationTarget.hash);
    }
    navigationTarget.destination.scrollIntoView({ block: "start", behavior: "instant" });
    const heading = navigationTarget.destination.querySelector(
      ".hero-title, .about-content h2, .section-heading h2, .contact-content h2",
    );
    if (heading && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      heading.classList.remove("section-arrival-motion");
      void heading.offsetWidth;
      heading.classList.add("section-arrival-motion");
    }
    transitionDestinationRef.current = null;
    document.documentElement.classList.remove("page-transitioning");
    transitionLockRef.current = false;
  };

  const handleTransitionAnimation = (event) => {
    if (
      !event.target.classList.contains("page-transition-primary") ||
      !["panel-cover", "panel-reveal"].includes(event.animationName)
    ) return;

    if (transitionPhase === "cover" && event.animationName === "panel-cover") {
      completeSectionNavigation();
      setTransitionPhase("reveal");
    } else if (transitionPhase === "reveal" && event.animationName === "panel-reveal") {
      setTransitionPhase("idle");
    }
  };

  const handleSectionRevealEnd = (event) => {
    if (event.target.classList.contains("section-arrival-motion")) {
      event.target.classList.remove("section-arrival-motion");
    }
  };

  const closeMenu = () => setMenuOpen(false);
  const normalizedQuery = projectQuery.trim().toLowerCase();
  const visibleProjects = projects.filter((project) => {
    const matchesCategory = projectFilter === "All" || project.category === projectFilter;
    const searchable = [
      project.title,
      project.summary,
      project.category,
      project.type,
      project.problem,
      project.contribution,
      ...project.tools,
    ].join(" ").toLowerCase();
    return matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery));
  });
  const visibleJourney = journey.filter(
    (item) => journeyFilter === "All" || item.category === journeyFilter,
  );
  const copyEmail = async () => {
    if (!contact.email) return;
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopyMessage("Email address copied.");
    } catch {
      setCopyMessage("Could not access the clipboard. Select the email address to copy it.");
    }
  };

  return (
    <div
      className="site-shell"
      data-theme={theme}
      ref={shellRef}
      onClickCapture={handleInternalNavigation}
      onAnimationEndCapture={handleSectionRevealEnd}
    >
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header">
        <a className="header-monogram" href="#top" aria-label="A G Studio, back to top">
          <span>A/G</span>
        </a>
        <nav className={`primary-nav${menuOpen ? " nav-open" : ""}`} id="primary-navigation" aria-label="Main navigation">
          {navigation.map(([label, href], index) => (
            <a key={href} href={href} onClick={closeMenu} aria-current={activeSection === href.slice(1) ? "location" : undefined}>
              <span className="nav-index">0{index + 1}</span>
              {label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <button
            className="theme-toggle"
            type="button"
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
            aria-pressed={theme === "dark"}
            onClick={() => setTheme((current) => current === "light" ? "dark" : "light")}
          >
            <span className="theme-icon" aria-hidden="true">{theme === "light" ? "◐" : "◑"}</span>
            <span>{theme === "light" ? "DARK" : "LIGHT"}</span>
          </button>
          <button
            className="menu-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? "CLOSE" : "MENU"} <span aria-hidden="true">{menuOpen ? "−" : "+"}</span>
          </button>
        </div>
      </header>

      <main id="main">
        <section className="hero light-section" id="top" aria-labelledby="hero-title">
          <div className="hero-register">
            <span>PERSONAL SECURITY PRACTICE</span>
            <span>SHREE ASHWIN A G <i>·</i> INDIA</span>
            <span>PORTFOLIO / 2026</span>
          </div>
          <div
            className="hero-grid"
            onPointerMove={updatePointerResponse}
            onPointerLeave={resetPointerResponse}
          >
            <SectionIndex number="01" label="A PRACTICE OF ATTENTION" />
            <InkPanel />
            <h1 className="hero-title" id="hero-title">
              <span>SECURITY IS A</span>
              <span>WAY OF <em>SEEING.</em></span>
            </h1>
            <div className="hero-mark">
              <Monogram />
              <span className="mark-caption">A / G<br />PERSONAL MARK</span>
            </div>
            <div
              className="hero-nameplate pointer-reactive"
              onPointerMove={updatePointerResponse}
              onPointerLeave={resetPointerResponse}
            >
              <div className="identity-card-heading">
                <span className="nameplate-label">CYBERSECURITY / PROFILE</span>
                <span className="identity-card-mark" aria-hidden="true">A/G</span>
              </div>
              <p>SHREE ASHWIN A G</p>
              <span className="nameplate-role">ASPIRING THREAT HUNTER | CYBERSECURITY STUDENT</span>
              <div className="identity-interests" aria-label="Career interests">
                <span>Threat Hunting</span>
                <span>Blue Team</span>
                <span>Incident Response</span>
                <span>CTF</span>
              </div>
              <p className="identity-focus">
                <span>LEARNING NOW</span>
                <span className="identity-focus-title">Threat hunting foundations</span>
              </p>
              <div className="identity-links" aria-label="Professional profiles">
                {contact.githubUrl
                  ? <a href={contact.githubUrl} target="_blank" rel="noreferrer">GITHUB ↗</a>
                  : <span>GITHUB / ADD URL</span>}
                {contact.linkedinUrl
                  ? <a href={contact.linkedinUrl} target="_blank" rel="noreferrer">LINKEDIN ↗</a>
                  : <span>LINKEDIN / ADD URL</span>}
              </div>
            </div>
            <div className="hero-introduction">
              <p>I learn cybersecurity by analysing systems, experimenting with code, and documenting practical work. I’m building toward defensive security and threat hunting.</p>
              <blockquote>“Every Journey Forges a Warrior.”</blockquote>
            </div>
            <div className="hero-links">
              <a className="action-link action-primary" data-magnetic href="#work">
                View Projects <span aria-hidden="true">↘</span>
              </a>
              {contact.resumeUrl ? (
                <a className="action-link action-secondary" data-magnetic href={contact.resumeUrl} target="_blank" rel="noreferrer">
                  View Resume <span aria-hidden="true">↗</span>
                </a>
              ) : (
                <button className="action-link action-secondary action-unavailable" type="button" disabled title="Add a real resume file URL in src/data/portfolio.js">
                  Resume unavailable
                </button>
              )}
              <a className="action-link action-tertiary" data-magnetic href="#contact">
                Contact Me <span aria-hidden="true">↘</span>
              </a>
            </div>
          </div>
          <div className="hero-foot">
            <span>INDEPENDENT LEARNING / PRACTICAL CURIOSITY</span>
            <a href="#about" aria-label="Scroll to About Me">SCROLL TO EXPLORE ↓</a>
            <span>01—08</span>
          </div>
        </section>

        <section className="about-section dark-section section-grid" id="about">
          <div className="section-rail">
            <SectionIndex number="02" label="ABOUT" />
            <span className="rail-note">STUDENT / BUILDER / LEARNER</span>
          </div>
          <div className="about-content reveal">
            <h2>
              Attention is a<br />
              <span>technical skill.</span>
            </h2>
            <div className="about-copy">
              <p className="about-lead">I’m a cybersecurity student building practical foundations in defensive security and threat hunting.</p>
              <p>I learn by making small projects, taking part in CTF practice, and being clear about what evidence supports—and what it doesn’t. My current goals include incident response, security operations, and careful investigation.</p>
              <ul className="interest-list" aria-label="Areas of interest">
                <li>Threat Hunting</li>
                <li>Blue Team</li>
                <li>Incident Response</li>
                <li>CTF Learning</li>
              </ul>
            </div>
          </div>
          <div className="about-footer">
            <span>METHOD / OBSERVE · TEST · EXPLAIN</span>
            <a href="#learning">LEARNING ROADMAP <span aria-hidden="true">↘</span></a>
          </div>
        </section>

        <section className="work-section light-section section-grid ink-transition" id="work">
          <div className="section-rail">
            <SectionIndex number="03" label="SELECTED WORK" />
            <span className="rail-note">PROJECTS / 02</span>
          </div>
          <div className="section-content">
            <div className="section-heading reveal">
              <h2>Made to<br /><em>understand.</em></h2>
              <p>
                A couple of security ideas, at their documented scope. Select a
                project for its notes and technologies.
              </p>
            </div>
            <div className="project-controls" aria-label="Project search and filters">
              <label className="project-search">
                <span>SEARCH PROJECTS</span>
                <input
                  type="search"
                  value={projectQuery}
                  onChange={(event) => setProjectQuery(event.target.value)}
                  placeholder="Name, tool, topic..."
                />
              </label>
              <div className="filter-set" role="group" aria-label="Filter projects by category">
                {projectCategories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className={projectFilter === category ? "filter-chip is-active" : "filter-chip"}
                    aria-pressed={projectFilter === category}
                    onClick={() => setProjectFilter(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <p className="filter-result" aria-live="polite">
                {visibleProjects.length} {visibleProjects.length === 1 ? "project" : "projects"}
              </p>
            </div>
            <div className="project-gallery">
              {visibleProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onSelect={setSelectedProject}
                />
              ))}
            </div>
            {visibleProjects.length === 0 && (
              <p className="empty-state">No projects match that search. Try another topic or clear the search.</p>
            )}
            <p className="project-footnote">
              Project status and outcomes are limited to what the existing
              portfolio describes. Links were not provided.
            </p>
          </div>
        </section>

        <section className="skills-section light-section section-grid" id="skills">
          <div className="section-rail">
            <SectionIndex number="04" label="SKILLS & TOOLS" />
            <span className="rail-note">PRACTISED / LEARNING</span>
          </div>
          <div className="section-content">
            <div className="section-heading reveal">
              <h2>Skills in<br /><em>context.</em></h2>
              <p>
                A distinction between tools used in project work and topics
                currently being learned.
              </p>
            </div>
            <div className="skills-legend">
              <span><i className="legend-dot legend-used" /> USED / PRACTISED</span>
              <span><i className="legend-dot legend-learning" /> LEARNING</span>
            </div>
            <div className="skill-map-heading">
              <span>MISSION MAP / SELECT DESTINATION</span>
              <span>VERIFIED PROJECTS · LEARNING · ACHIEVEMENT</span>
            </div>
            <SkillMap />
            <div className="skill-filters" role="group" aria-label="Filter skill groups">
              {skillCategories.map((category) => {
                const label = category === "All"
                  ? "All"
                  : skillGroups.find((group) => group.id === category)?.title ?? category;
                return (
                  <button
                    key={category}
                    type="button"
                    className={skillFilter === category ? "filter-chip is-active" : "filter-chip"}
                    aria-pressed={skillFilter === category}
                    onClick={() => setSkillFilter(category)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <div className="skill-groups">
              {skillGroups.filter((group) => skillFilter === "All" || group.id === skillFilter).map((group) => (
                <article className="skill-group reveal" key={group.index}>
                  <span className="skill-group-index">{group.index}</span>
                  <h3>{group.title}</h3>
                  <ul>
                    {group.skills.map((skill) => (
                      <li key={skill.name}>
                        <span>{skill.name}</span>
                        <span className={`skill-level skill-${skill.kind}`}>{skill.level}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="terminal-section dark-section section-grid ink-transition" id="terminal">
          <div className="section-rail">
            <SectionIndex number="05" label="FIELD TERMINAL" />
            <span className="rail-note">PORTFOLIO / READ ONLY</span>
          </div>
          <div className="section-content">
            <div className="section-heading reveal">
              <h2>A small<br /><span>command line.</span></h2>
              <p>Explore the information already recorded in this portfolio. Commands only read local page data.</p>
            </div>
            <FieldTerminal />
          </div>
        </section>

        <section className="learning-section moss-section section-grid" id="learning">
          <div className="section-rail">
            <SectionIndex number="06" label="ROADMAP" />
            <span className="rail-note">THREAT HUNTING / LEARNING</span>
          </div>
          <div className="section-content">
            <div className="section-heading reveal">
              <h2>Keep a direction.<br /><span>Stay curious.</span></h2>
              <p>
                An editable roadmap, not a list of credentials. Open an item to
                see the current focus.
              </p>
            </div>
            <div className="roadmap-list">
              {roadmap.map((item) => {
                const expanded = openRoadmap === item.id;
                return (
                  <article className={`roadmap-item${expanded ? " roadmap-expanded" : ""}`} key={item.id}>
                    <span className="roadmap-number">{item.number}</span>
                    <span className={`roadmap-status roadmap-${item.status.toLowerCase().replace(" ", "-")}`}>{item.status}</span>
                    <div className="roadmap-title">
                      <h3>{item.title}</h3>
                      <p>{item.summary}</p>
                    </div>
                    <button
                      type="button"
                      className="roadmap-toggle"
                      aria-expanded={expanded}
                      aria-controls={`roadmap-${item.id}`}
                      aria-label={`${expanded ? "Collapse" : "Expand"} ${item.title}`}
                      onClick={() => setOpenRoadmap((open) => open === item.id ? null : item.id)}
                    >
                      {expanded ? "−" : "+"}
                    </button>
                    <p className="roadmap-detail" id={`roadmap-${item.id}`} hidden={!expanded}>
                      {item.detail}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="timeline-section dark-section section-grid ink-transition" id="achievements">
          <div className="section-rail">
            <SectionIndex number="07" label="THE JOURNEY" />
            <span className="rail-note">MILESTONES / LEARNING</span>
          </div>
          <div className="section-content">
            <div className="section-heading reveal">
              <h2>The journey.<br /><span>Still in motion.</span></h2>
              <p>A record of the verified achievement, documented projects, and learning areas currently in progress.</p>
            </div>
            <div className="journey-controls">
              <div className="filter-set" role="group" aria-label="Filter journey milestones">
                {journeyCategories.map((category) => (
                  <button
                    className={`filter-chip${journeyFilter === category ? " is-active" : ""}`}
                    type="button"
                    key={category}
                    aria-pressed={journeyFilter === category}
                    onClick={() => {
                      setJourneyFilter(category);
                      setOpenJourney(null);
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <p className="filter-result" aria-live="polite">
                {visibleJourney.length} MILESTONES
              </p>
            </div>
            <div className="journey-timeline" ref={journeyLineRef}>
              <span className="journey-line-track" aria-hidden="true" />
              <span className="journey-line-fill" aria-hidden="true" />
              <div className="journey-list">
                {visibleJourney.map((item, index) => (
                  <JourneyCard
                    key={item.id}
                    item={item}
                    index={index}
                    isOpen={openJourney === item.id}
                    onToggle={() => setOpenJourney((open) => open === item.id ? null : item.id)}
                  />
                ))}
              </div>
            </div>
            {visibleJourney.length === 0 && <p className="empty-state">No milestones in this category yet.</p>}
          </div>
        </section>

        <footer className="contact-section dark-section section-grid" id="contact">
          <div className="section-rail">
            <SectionIndex number="08" label="CONTACT" />
            <span className="rail-note">OPEN TO CONVERSATION</span>
          </div>
          <div className="contact-content reveal">
            <div>
              <h2>Start with<br /><span>a question.</span></h2>
              <p>
                Open to cybersecurity internships, collaborative learning, and
                thoughtful conversations about defensive security.
              </p>
              <div className="contact-actions">
                {contact.email ? (
                  <a className="contact-primary" href={`mailto:${contact.email}?subject=Cybersecurity%20portfolio`}>
                    CONTACT ME <span aria-hidden="true">↗</span>
                  </a>
                ) : (
                  <span className="contact-primary contact-unavailable">
                    ADD EMAIL TO ENABLE CONTACT LINK
                  </span>
                )}
                <a className="back-to-top" href="#top">BACK TO TOP <span aria-hidden="true">↑</span></a>
              </div>
            </div>
            <div className="contact-details">
              <p className="contact-label">CONTACT DETAILS / EDIT BEFORE PUBLISHING</p>
              <div>
                <span>GITHUB</span>
                {contact.githubUrl
                  ? <a href={contact.githubUrl} target="_blank" rel="noreferrer">VIEW PROFILE ↗</a>
                  : <b>Profile URL not provided</b>}
              </div>
              <div>
                <span>LINKEDIN</span>
                {contact.linkedinUrl
                  ? <a href={contact.linkedinUrl} target="_blank" rel="noreferrer">VIEW PROFILE ↗</a>
                  : <b>Profile URL not provided</b>}
              </div>
              <div>
                <span>EMAIL</span>
                {contact.email
                  ? <a href={`mailto:${contact.email}`}>{contact.email}</a>
                  : <b>Email address not provided</b>}
              </div>
              <div>
                <span>RESUME</span>
                {contact.resumeUrl
                  ? <a href={contact.resumeUrl} target="_blank" rel="noreferrer">OPEN RESUME ↗</a>
                  : <b>Resume file not provided</b>}
              </div>
              {contact.email && (
                <button className="copy-email" type="button" onClick={copyEmail}>
                  COPY EMAIL ADDRESS <span aria-hidden="true">□</span>
                </button>
              )}
              <p className="copy-status" role="status" aria-live="polite">{copyMessage}</p>
              <p className="contact-edit-note">
                Add your actual contact details in <code>src/data/portfolio.js</code>.
              </p>
            </div>
          </div>
          <div className="contact-footer">
            <span>SHREE ASHWIN A G / A—G</span>
            <span>EVERY JOURNEY FORGES A WARRIOR.</span>
            <span>© 2026</span>
          </div>
        </footer>
      </main>
      {selectedProject && (
        <ProjectDialog
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
      <PageTransition phase={transitionPhase} onAnimationComplete={handleTransitionAnimation} />
      <CursorEffects />
    </div>
  );
}

function PortfolioExperience() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <div inert={isLoading} aria-hidden={isLoading ? "true" : undefined}>
        <App />
      </div>
      {isLoading && <CinematicLoader onComplete={() => setIsLoading(false)} />}
    </>
  );
}

createRoot(document.getElementById("root")).render(<PortfolioExperience />);
