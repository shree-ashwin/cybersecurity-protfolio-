export const contact = {
  githubUrl: "",
  linkedinUrl: "",
  email: "",
  resumeUrl: "",
};

export const projects = [
  {
    id: "usb-trust",
    index: "01",
    title: "USB Device Trust Manager",
    category: "Defensive security",
    type: "DEFENSIVE TOOL",
    status: "Status not documented",
    summary: "A small utility exploring identity and trust decisions for removable devices.",
    problem:
      "How can a removable device be identified consistently, and how can a trust decision be recorded?",
    tools: ["Python", "SQLite", "VID / PID / serial", "SHA-256-derived record"],
    contribution:
      "The project description says it fingerprints USB devices using their identifiers, supports trust decisions, and logs events.",
    outcome:
      "The source notes describe the intended functionality. They do not document validation, measured results, or a release.",
    mapPosition: { x: 900, y: 530 },
    relatedMapIds: ["python"],
    repositoryUrl: "",
    images: [],
  },
  {
    id: "fraud-sentinel",
    index: "02",
    title: "FraudSentinel AI",
    category: "Security concept",
    type: "HACKATHON CONCEPT",
    status: "Concept",
    summary: "An explainability-focused concept for making fraud patterns easier to understand.",
    problem:
      "Explore how suspicious patterns across payment activity, fake jobs, and online scams might be easier to understand.",
    tools: [],
    contribution:
      "Existing portfolio notes describe a hackathon concept centered on explainability. Implementation details are not recorded.",
    outcome:
      "No implemented system, technical findings, or outcomes are documented in the source.",
    mapPosition: { x: 125, y: 575 },
    relatedMapIds: [],
    repositoryUrl: "",
    images: [],
  },
];

export const skillGroups = [
  {
    index: "01",
    id: "programming",
    title: "Programming & scripting",
    skills: [
      { name: "Python", level: "Used in project notes", kind: "practised" },
      { name: "SQLite", level: "Used in project notes", kind: "practised" },
    ],
  },
  {
    index: "02",
    id: "fundamentals",
    title: "Cybersecurity fundamentals",
    skills: [
      { name: "CTF problem-solving", level: "Practised", kind: "practised" },
      { name: "Cryptography exercises", level: "Practised", kind: "practised" },
      { name: "Reverse-engineering exercises", level: "Practised", kind: "practised" },
      { name: "Threat hunting", level: "Learning", kind: "learning" },
      { name: "Incident response", level: "Learning", kind: "learning" },
      { name: "Blue Team / security operations", level: "Learning", kind: "learning" },
    ],
  },
  {
    index: "03",
    id: "tools",
    title: "Security tools & analysis",
    skills: [
      { name: "VID / PID / serial device identifiers", level: "Used in project notes", kind: "practised" },
      { name: "SHA-256-derived device record", level: "Used in project notes", kind: "practised" },
      { name: "Strings & file inspection", level: "Learning", kind: "learning" },
      { name: "Ghidra & basic debugging", level: "Learning", kind: "learning" },
      { name: "Logs & detection thinking", level: "Learning", kind: "learning" },
    ],
  },
  {
    index: "04",
    id: "systems",
    title: "Operating systems & labs",
    skills: [
      { name: "Linux", level: "Learning", kind: "learning" },
      { name: "Cloud security concepts", level: "Future learning", kind: "learning" },
    ],
  },
];

export const skillMap = [
  {
    id: "threat-hunting",
    title: "Threat Hunting",
    level: "Learning",
    mapPosition: { x: 100, y: 200 },
    description: "Learning to ask testable questions about security activity and reason carefully from available evidence.",
    activity: "Current learning area in the portfolio roadmap; no completed investigation is claimed.",
    related: ["blue-team", "incident-response", "security-fundamentals"],
    projectIds: [],
  },
  {
    id: "blue-team",
    title: "Blue Team",
    level: "Learning",
    mapPosition: { x: 300, y: 180 },
    description: "Building foundational understanding of defensive security and security operations.",
    activity: "Listed as a current learning interest; no professional operations experience is claimed.",
    related: ["threat-hunting", "incident-response", "security-fundamentals"],
    projectIds: [],
  },
  {
    id: "incident-response",
    title: "Incident Response",
    level: "Learning",
    mapPosition: { x: 750, y: 180 },
    description: "Exploring the steps used to understand and respond to a security incident.",
    activity: "Current learning area, with a focus on evidence, analysis, conclusions, and limitations.",
    related: ["threat-hunting", "blue-team", "security-fundamentals"],
    projectIds: [],
  },
  {
    id: "security-fundamentals",
    title: "Security Fundamentals",
    level: "Learning",
    mapPosition: { x: 115, y: 400 },
    description: "Strengthening core security concepts and the habit of explaining conclusions clearly.",
    activity: "Marked Learning in the roadmap; this is an area of study, not a claim of expertise.",
    related: ["threat-hunting", "blue-team", "incident-response", "ctf-practice"],
    projectIds: [],
  },
  {
    id: "python",
    title: "Python",
    level: "Project Experience",
    mapPosition: { x: 885, y: 400 },
    description: "Python is documented as a technology used in the USB Device Trust Manager project notes.",
    activity: "The portfolio records Python in the project technologies; no proficiency rating is claimed.",
    related: [],
    projectIds: ["usb-trust"],
  },
  {
    id: "ctf-practice",
    title: "CTF Practice",
    level: "Practising",
    mapPosition: { x: 170, y: 690 },
    description: "Practising problem-solving through capture-the-flag challenges.",
    activity: "A runner-up placement is recorded for the OWASP SREC Chapter CTF; date not specified.",
    related: ["cryptography", "reverse-engineering", "security-fundamentals", "achievement-owasp-srec-ctf"],
    projectIds: [],
  },
  {
    id: "cryptography",
    title: "Cryptography",
    level: "Practising",
    mapPosition: { x: 415, y: 735 },
    description: "Cryptography practice is recorded among the areas explored during the CTF.",
    activity: "The existing CTF notes mention cryptography practice; no specific challenge or write-up is recorded.",
    related: ["ctf-practice", "reverse-engineering", "achievement-owasp-srec-ctf"],
    projectIds: [],
  },
  {
    id: "reverse-engineering",
    title: "Reverse Engineering",
    level: "Practising",
    mapPosition: { x: 735, y: 690 },
    description: "Reverse-engineering practice is recorded among the areas explored during the CTF.",
    activity: "The existing CTF notes mention reverse-engineering practice; no specific challenge or write-up is recorded.",
    related: ["ctf-practice", "cryptography", "achievement-owasp-srec-ctf"],
    projectIds: [],
  },
];

export const roadmap = [
  {
    id: "fundamentals",
    number: "01",
    title: "Security fundamentals",
    summary: "Strengthen core security concepts and careful problem-solving.",
    detail: "Current focus: reinforce core terminology and practice explaining security concepts clearly.",
    status: "Learning",
  },
  {
    id: "linux-networking",
    number: "02",
    title: "Linux and networking",
    summary: "Build practical familiarity with Linux systems and network basics.",
    detail: "Current focus: develop hands-on familiarity with command-line workflows and networking foundations.",
    status: "Learning",
  },
  {
    id: "logs-telemetry",
    number: "03",
    title: "Logs and telemetry",
    summary: "Understand event data and how to reason from available records.",
    detail: "Current focus: learn what common records can show, and document gaps before drawing conclusions.",
    status: "Learning",
  },
  {
    id: "siem-detection",
    number: "04",
    title: "SIEM and detection fundamentals",
    summary: "Explore how security events are collected and detection logic is formed.",
    detail: "Planned focus: learn basic event collection, queries, and detection logic before attempting more advanced hunts.",
    status: "Not Started",
  },
  {
    id: "mitre-attack",
    number: "05",
    title: "MITRE ATT&CK",
    summary: "Learn the ATT&CK knowledge base as a framework for describing adversary behavior.",
    detail: "Planned focus: study the framework as a vocabulary for describing behavior, not as evidence that an attack occurred.",
    status: "Not Started",
  },
  {
    id: "threat-hunting",
    number: "06",
    title: "Threat hunting and incident investigation",
    summary: "Practice asking testable questions and documenting evidence and limitations.",
    detail: "Planned focus: build from a clear question through evidence review, analysis, conclusion, and limitations.",
    status: "Not Started",
  },
  {
    id: "cloud-security",
    number: "07",
    title: "Cloud security foundations",
    summary: "A future learning area; no cloud experience is claimed.",
    detail: "Future learning goal: study cloud-security fundamentals. No practical or professional cloud experience is claimed.",
    status: "Not Started",
  },
];

export const events = [
  {
    id: "owasp-srec-ctf",
    name: "OWASP SREC Chapter CTF",
    date: "Date not provided",
    organizer: "OWASP SREC Chapter",
    achievement: "Runner-up",
    areas: ["Cryptography practice", "Reverse-engineering practice"],
    detail:
      "The existing portfolio notes participation at Sri Ramakrishna Engineering College, with crypto and reverse-engineering practice mentioned.",
    mapPosition: { x: 500, y: 55 },
    related: ["ctf-practice", "cryptography", "reverse-engineering"],
    writeupUrl: "",
  },
];

const learningTopics = skillGroups.flatMap((group) =>
  group.skills
    .filter((skill) => skill.kind === "learning")
    .map((skill) => skill.name),
);

export const journey = [
  ...events.map((event) => ({
    id: `achievement-${event.id}`,
    category: "Achievement",
    title: event.name,
    summary: `${event.achievement} · ${event.organizer}`,
    date: event.date === "Date not provided" ? "Date not specified" : event.date,
    status: "Verified achievement",
    detail: event.detail,
    notes: event.areas.length ? `Areas recorded: ${event.areas.join(" / ")}` : "",
    link: event.writeupUrl,
  })),
  ...projects.map((project) => ({
    id: `project-${project.id}`,
    category: "Project",
    title: project.title,
    summary: project.summary,
    date: "Date not specified",
    status: project.status,
    detail: `Problem: ${project.problem} Contribution: ${project.contribution} Outcome: ${project.outcome}`,
    notes: project.tools.length ? `Technologies recorded: ${project.tools.join(" / ")}` : "",
    link: project.repositoryUrl,
  })),
  {
    id: "learning-security-practice",
    category: "Learning",
    title: "Security practice in progress",
    summary: "Threat hunting, incident response, and Blue Team / security operations.",
    date: "Date not specified",
    status: "Learning",
    detail: "These topics are marked as learning areas in the portfolio skills data; no professional experience or completed investigations are claimed.",
    notes: learningTopics.length ? `Learning areas: ${learningTopics.join(" / ")}` : "",
    link: "",
  },
  ...roadmap
    .filter((stage) => stage.status === "Learning")
    .map((stage) => ({
      id: `learning-${stage.id}`,
      category: "Learning",
      title: stage.title,
      summary: stage.summary,
      date: "Date not specified",
      status: stage.status,
      detail: stage.detail,
      notes: "",
      link: "",
    })),
];

export const missionMapNodes = [
  ...skillMap.map((skill) => ({
    id: skill.id,
    title: skill.title,
    kind: "learning",
    status: skill.level,
    description: skill.description,
    detail: skill.activity,
    tools: [],
    related: skill.related,
    position: skill.mapPosition,
    link: "",
  })),
  ...projects.map((project) => ({
    id: `project-${project.id}`,
    title: project.title,
    kind: "project",
    status: project.status,
    description: project.summary,
    detail: `Problem: ${project.problem} Contribution: ${project.contribution} Outcome: ${project.outcome}`,
    tools: project.tools,
    related: project.relatedMapIds,
    position: project.mapPosition,
    link: project.repositoryUrl,
  })),
  ...events.map((event) => ({
    id: `achievement-${event.id}`,
    title: event.name,
    kind: "achievement",
    status: event.achievement,
    description: `${event.organizer} · ${event.date === "Date not provided" ? "Date not specified" : event.date}`,
    detail: event.detail,
    tools: event.areas,
    related: event.related,
    position: event.mapPosition,
    link: event.writeupUrl,
  })),
];
