export interface ContactLink {
  label: string;
  href: string;
  icon: "github" | "linkedin" | "email";
}

export interface ExperienceEntry {
  org: string;
  role: string;
  location: string;
  dates: string;
  bullets: string[];
  tech?: string[];
}

export interface ProjectEntry {
  name: string;
  dates: string;
  description: string;
  tech: string[];
  repo?: string;
  site?: string;
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface EducationEntry {
  org: string;
  program: string;
  dates: string;
  detail: string;
}

export const profile = {
  name: "John Maliha",
  tagline:
    "Computer engineer building optimization systems, developer tooling, and full-stack products.",
  location: "Montréal, QC",
  summary:
    "Computer engineer with expertise in embedded systems, algorithmic optimization, and full-stack development. Hands-on with hardware and software design; drawn to real-world problems across biomedical engineering, automation, and AI.",
  highlights: [
    "Algorithmic optimization",
    "Embedded systems → full-stack",
    "B.Eng, AI specialization",
    "Bilingual — FR / EN",
  ],
  resumeHref: "/resume.pdf",
  stats: [
    { value: "2025", label: "Joined ELEMISSION" },
    { value: "8+", label: "Portfolio projects" },
    { value: "FR / EN", label: "Bilingual" },
  ],
};

export const contactLinks: ContactLink[] = [
  {
    label: "Email — johnmaliha@hotmail.com",
    href: "mailto:johnmaliha@hotmail.com",
    icon: "email",
  },
  {
    label: "GitHub — github.com/JohnMaliha",
    href: "https://github.com/JohnMaliha",
    icon: "github",
  },
  {
    label: "LinkedIn — linkedin.com/in/john-maliha",
    href: "https://linkedin.com/in/john-maliha",
    icon: "linkedin",
  },
];

export const experience: ExperienceEntry[] = [
  {
    org: "ELEMISSION",
    role: "Computer Engineer/ Cloud engineer",
    location: "Montréal",
    dates: "2026–Present",
    bullets: [
      "Sole developer of the ELEMISSION Portal, a full-stack app managing the entire drill-core scan project lifecycle — upload, validation, approval, and visualization — designed, built, and deployed end to end.",
      "Architected the back end in C#/.NET and front end in Vue 3 + TypeScript, owning the data model, services, containerized dev/prod setup, and deployment.",
      "Architected and implemented a cloud infrastructure on AWS using Terraform, including S3, Lambda, Fargate, and EC2 with scoped IAM roles.",
      "Built a .NET validation pipeline for uploaded .elezip archives: ZIP integrity, folder structure, DZI imagery, JSON/CSV parsing, depth-data consistency.",
      "Designed an event-driven serverless ingestion flow on AWS: S3 upload triggers a Python Lambda that runs validation as a Fargate task.",
      "Integrated core-scan visualization and real-time notifications (SignalR/SSE), proxying the admin dashboard server-side to keep auth secure.",
      "Owned infrastructure and delivery: Docker/Compose, GitHub Actions CI/CD to ECR, EC2 with scoped IAM roles, and Keycloak + MariaDB auth.",
    ],
    tech: [
      "C#/.NET",
      "Vue 3",
      "TypeScript",
      "Python",
      "AWS Lambda",
      "Fargate",
      "S3",
      "EC2",
      "ECR",
      "IAM",
      "Docker",
      "GitHub Actions",
      "Keycloak",
      "MariaDB",
      "DevOps",
    ],
  },
  {
    org: "GIRO",
    role: "Solution Developer (Optimization / Software Engineering)",
    location: "Montréal",
    dates: "Jan 2024–Jan 2026",
    bullets: [
      "C++ optimization algorithms for transit planning, +15% scheduling efficiency.",
      "New C++ features for international transit clients (Golden Gate, NYC, LA, Oakland).",
      "Automated testing with Google Test, Silk, and Jenkins pipelines, −20% QA time.",
      "Geospatial/mapping systems: importing and customizing transit data.",
      "Training and workshops for 5+ transit authorities (MTAB, CTA, LACMTA, GCRTA, SFMTA).",
      "Automation in Bash, PowerShell, and Python, −30% manual processing.",
      "SQL and Oracle databases; Agile with TFS and Git.",
    ],
    tech: [
      "C++",
      "Google Test",
      "Silk",
      "Jenkins",
      "Bash",
      "PowerShell",
      "Python",
      "SQL",
      "Oracle",
      "TFS",
      "Git",
    ],
  },
  {
    org: "Mouvement Desjardins",
    role: "Software Developer / Engineering Intern",
    location: "Montréal",
    dates: "2022–2023",
    bullets: [
      "Migrated an API from C# 6 to C# 10 (performance + security compliance).",
      "Built a Python tool to auto-detect discrepancies in PDF documents, +25% accuracy.",
      "CI/CD with Docker, Azure, and AWS, −25% deploy time.",
      "Extended the internal Quadient Automation API with features adopted company-wide.",
      "Promoted from intern to full-time to technical lead within a year.",
      "Cut code smells 40% via SonarQube; maintained DEV and PROD.",
    ],
    tech: ["C#", "Python", "Docker", "Azure", "AWS", "SonarQube"],
  },
  {
    org: "ASTP, Polytechnique Montréal",
    role: "VP Technology / Web Lead",
    location: "Montréal",
    dates: "2022–2024",
    bullets: [
      "Maintained the WordPress site serving 10+ student technical societies.",
      "Led a new platform in JavaScript, Spring, HTML, and CSS; mentored a small team.",
    ],
    tech: ["WordPress", "JavaScript", "Spring", "HTML", "CSS"],
  },
];

export const projects: ProjectEntry[] = [
  {
    name: "Drone Web Application",
    dates: "Polytechnique, 2022",
    description:
      "Crazyflie firmware in C, swarm simulation in C++ (ARGoS), Python server + Angular/TypeScript client for real-time monitoring, A*/Dijkstra pathfinding, live map visualization.",
    tech: ["C", "C++", "ARGoS", "Python", "Angular", "TypeScript"],
    repo: "https://github.com/JohnMaliha/Crazy-Flie-Drone-app",
  },
  {
    name: "Cloud Computing Platform",
    dates: "2024",
    description:
      "Python + Terraform on AWS, cloud design patterns (Proxy, Gatekeeper, Trusted Host), Flask on EC2, Docker, MySQL cluster, multithreaded request handling.",
    tech: ["Python", "Terraform", "AWS", "Flask", "Docker", "MySQL"],
    repo: "https://github.com/JohnMaliha/LOG8415-Final-Project",
  },
  {
    name: "Lebanese Festival Platform",
    dates: "2023",
    description:
      "Angular + PHP, automated volunteer scheduling, JWT auth.",
    tech: ["Angular", "PHP", "JWT"],
    site: "https://festivallibanais.org/",
  },
  {
    name: "Collaborative Drawing App",
    dates: "Polytechnique, 2021",
    description: "Express.js + Angular, MongoDB.",
    tech: ["Express.js", "Angular", "MongoDB"],
    repo: "https://github.com/JohnMaliha/OnlinePaint",
  },
  {
    name: "Veterinary Clinic Platform",
    dates: "2021",
    description: "Angular + PostgreSQL web/mobile platform.",
    tech: ["Angular", "PostgreSQL"],
    repo: "https://github.com/JohnMaliha/VETOSANSFRONTIERE",
  },
];

export const skills: SkillGroup[] = [
  {
    label: "Languages",
    items: [
      "Python",
      "C++",
      "C",
      "C#",
      "Java",
      "TypeScript",
      "JavaScript",
      "SQL (PostgreSQL, Oracle)",
      "PHP",
      "XML",
      "HL7",
    ],
  },
  {
    label: "Frameworks",
    items: [
      ".NET",
      "Vue 3",
      "Angular",
      "React",
      "Spring",
      "Express.js",
      "D3",
      "Scikit-learn",
      "Apache Spark",
      "REST APIs",
    ],
  },
  {
    label: "Tools & platforms",
    items: [
      "Docker",
      "Kubernetes",
      "Azure",
      "AWS",
      "Git",
      "Jenkins",
      "Jira",
      "SonarQube",
      "JFrog",
      "Terraform",
      "Keycloak",
      "MariaDB",
    ],
  },
  {
    label: "Domains",
    items: [
      "Algorithmic optimization",
      "Embedded systems",
      "CI/CD automation",
      "Data visualization",
      "Applied AI",
      "Biomedical & medical informatics",
    ],
  },
];

export const education: EducationEntry[] = [
  {
    org: "Polytechnique Montréal",
    program: "B.Eng. Computer Engineering — Specialization in Artificial Intelligence",
    dates: "2019–2023",
    detail:
      "Coursework: embedded systems, machine learning, cloud computing, bioinformatics, data structures, databases.",
  },
];
