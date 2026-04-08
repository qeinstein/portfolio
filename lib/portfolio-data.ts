export type Experience = {
  company: string;
  role: string;
  period: string;
  summary: string;
  details: string[];
  blogSlug?: string;
  featured?: boolean;
};

export const portfolio = {
  meta: {
    name: "Toheeb Ogunade",
    titles: "Software Engineer · Quantum Computing · AI Researcher",
    email: "ogunadetoheeb4@gmail.com",
    linkedin: "https://www.linkedin.com/in/toheeb-ogunade-442051287/",
    github: "https://github.com/qeinstein",
    githubDirect: "https://github.com/qeinstein",
    x: "https://x.com/Lil_Tee18",
    location: "Lagos, Nigeria",
    education: "BSc Computer Science, University of Lagos (Expected Jan 2028)"
  },
  hero: {
    headline: "Toheeb Ogunade",
    subheadline: "I build high-concurrency backend systems, AI pipelines, and research-driven software. Currently: deterministic reasoning infrastructure for autonomous agents."
  },
  about:
    "I am a Software and AI Engineer building the infrastructure of today to enable the breakthroughs of tomorrow. With a deep foundation in Go, Python, and CSP-based high-concurrency systems, I architect scalable backends that bridge the gap between engineering and AI research. My ultimate goal is to innovate at the intersection of AI/ML and quantum computing, pushing the boundaries of how we process and understand information.",
  experience: [
    {
      company: "Velarix",
      role: "Founder",
      period: "2025 - Present",
      summary:
        "Building deterministic reasoning infrastructure for autonomous agents, with state, provenance, and safe invalidation designed into the core.",
      details: [
        "Shaping Velarix as a startup around a Go-based epistemic kernel that models facts, justification sets, and causal invalidation instead of treating agent memory like a flat cache.",
        "Designed the platform around tenant isolation, actor attribution, auditability, and controlled write paths so the system can serve production workflows rather than demo-only agent loops.",
        "Built the current foundation with a versioned API, Badger-backed persistence, hybrid snapshot and journal recovery, and console-facing contracts for a usable product surface.",
        "Using the project as the base for a broader product vision: durable reasoning for autonomous software, high-trust agent workflows, and explainable state transitions."
      ],
      blogSlug: "velarix",
      featured: true
    },
    {
      company: "Oyster Skin",
      role: "AI/ML & Backend Integration Engineer",
      period: "July 2025 - Jan 2026",
      summary:
        "Worked across production APIs, recommendation systems, and deployment workflows for live backend and ML features.",
      details: [
        "Architected and deployed live production RESTful APIs and machine learning models for recommendation engines using Python and FastAPI.",
        "Optimized data pipelines and PostgreSQL relational schemas, reducing processing latency and model retraining cycles by 30%.",
        "Maintained high-availability cloud deployments via automated CI/CD workflows and Docker."
      ],
      featured: true
    },
    {
      company: "NITDA ICT Hub",
      role: "Software & Backend Engineer",
      period: "Jan 2025 - Aug 2025",
      summary:
        "Built internal backend systems and containerized services with an emphasis on maintainable infrastructure and database performance.",
      details: [
        "Containerized distributed RESTful microservices using Docker, reducing integration overhead by 25%.",
        "Designed and optimized scalable PostgreSQL architectures for high-volume read/write operations.",
        "Architected production-ready internal tools utilizing React and Node.js/Express."
      ]
    },
    {
      company: "Curacel",
      role: "AI & API Engineering Intern",
      period: "Apr 2025 - May 2025",
      summary:
        "Contributed to ML-assisted claims and fraud workflows, focusing on service performance and data-heavy API paths.",
      details: [
        "Engineered ML modules for automated claims processing and high-precision fraud detection.",
        "Optimized microservices architecture to handle high-volume health data streams, significantly reducing API latency."
      ]
    },
    {
      company: "Codetech IT",
      role: "Machine Learning Intern",
      period: "Jul 2024 - Dec 2024",
      summary:
        "Worked on applied ML integrations for client systems, improving inference reliability and decision automation.",
      details: [
        "Integrated AI-driven APIs into client architectures to automate data-driven decisions.",
        "Fine-tuned supervised learning models to improve inference reliability."
      ]
    }
  ] satisfies Experience[],
  skills: {
    Languages: [
      "Go (Golang)",
      "Python",
      "TypeScript",
      "SQL (PostgreSQL)",
      "PHP",
      "JavaScript"
    ],
    "AI/ML": [
      "PyTorch",
      "TensorFlow",
      "Scikit-Learn",
      "NLP",
      "Computer Vision",
      "Autonomous Agents"
    ],
    "Backend & Frameworks": [
      "FastAPI",
      "Go Fiber",
      "Node.js/Express",
      "React",
      "Laravel"
    ],
    Infrastructure: [
      "Docker",
      "Git",
      "Linux",
      "CI/CD",
      "RESTful APIs",
      "JSON-RPC",
      "Webhooks"
    ]
  },
  blogIntro:
    "My Thoughts."
} as const;
