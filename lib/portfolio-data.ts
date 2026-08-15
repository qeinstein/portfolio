export type Experience = {
  company: string;
  role: string;
  period: string;
  summary: string;
  details: string[];
  blogSlug?: string;
  featured?: boolean;
};

export type Publication = {
  title: string;
  authors: string;
  journal: string;
  date: string;
  link: string;
  codeLink?: string;
  summary: string;
  findings: string[];
};

export const portfolio = {
  meta: {
    name: "Toheeb Goodluck Ogunade",
    titles: "Software Engineer · AI Researcher · Quantum Computing",
    email: "ogunadetoheeb4@gmail.com",
    linkedin: "https://www.linkedin.com/in/toheeb-ogunade",
    github: "https://github.com/qeinstein",
    githubDirect: "https://github.com/qeinstein",
    x: "https://x.com/uqnautm",
    location: "Lagos, Nigeria",
    education: "BSc Computer Science, University of Lagos (Expected Jan 2028)"
  },
  hero: {
    headline: "Toheeb Goodluck Ogunade",
    subheadline: "Hi, I'm Toheeb. I'm a software engineer and researcher building at the intersection of scalable backend systems, AI agents, and quantum computing."
  },
  about:
    "I like understanding things deeply. Sometimes that means building software, sometimes it means following a mathematical idea, and sometimes it means sitting with a question long enough to discover that the first answer was wrong. Most of what I work on begins with curiosity and ends, if I\u2019m lucky, with something I can build, test, or explain.",
  experience: [
    {
      company: "Moniepoint",
      role: "Software Engineering Intern (Fraud Monitoring Team)",
      period: "Jun 2026 – Dec 2026",
      summary:
        "Building observability infrastructure for the fraud monitoring team, from OpenTelemetry pipelines to cross-environment deployments.",
      details: [
        "Engineered and integrated an OpenTelemetry (OTel) observability pipeline using NestJS and Node.js, deploying over 1,400 lines of infrastructure code to enable full-stack traceability for core operations.",
        "Developed a centralized observability service that processed 500+ unique telemetry events per second, directly feeding compressed data into New Relic for immediate anomaly detection.",
        "Implemented a global HTTP trace interceptor and console logger, embedding trace IDs directly into every log line to streamline cross-service debugging and reduce root-cause analysis bottlenecks by 40%.",
        "Orchestrated secure cross-environment deployments across 3 active environments by managing Docker ConfigMaps and environment variables, accelerating development speed and ensuring zero disruption to existing CI/CD pipelines."
      ],
      featured: true
    },
    {
      company: "NITDA ICT Hub",
      role: "Full-Stack & Backend Engineer",
      period: "May 2025 – Dec 2025",
      summary:
        "Designed and shipped production-ready internal tools, microservices containerization pipelines, and transactional database schemas.",
      details: [
        "Built and shipped production-ready internal tooling using React and Node.js/Express across fast-paced sprint cycles, owning features end-to-end.",
        "Containerized RESTful microservices using Docker, reducing integration overhead by 25% and enforcing deployment determinism across CI/CD pipelines.",
        "Designed normalized PostgreSQL schemas supporting high-throughput read/write operations across distributed application layers."
      ],
      featured: true
    },
    {
      company: "Codetech IT",
      role: "Machine Learning Intern",
      period: "Jul 2024 – Dec 2024",
      summary:
        "Integrated AI APIs into business workflows and optimized supervised model performance.",
      details: [
        "Integrated AI-driven APIs into client architectures to automate data-driven decisions.",
        "Fine-tuned supervised learning models to improve inference reliability."
      ],
      featured: false
    }
  ] satisfies Experience[],
  publications: [
    {
      title: "A Matched Spectral Benchmark of Quantum Inspired Feature Maps",
      authors: "Toheeb Goodluck Ogunade, Taofeek Kassim, Etinosa Osaro",
      journal: "arXiv:2605.24324",
      date: "May 2026",
      link: "https://arxiv.org/abs/2605.24324",
      codeLink: "https://github.com/qeinstein",
      summary: "Designed and executed a 10-dataset, 110+-run empirical benchmark comparing amplitude, angle, and basis Quantum Information Encoding (QIE) techniques against 5 matched classical baselines under controlled parameters using PyTorch and TensorFlow.",
      findings: [
        "Ran 30 paired statistical comparisons (t-test + Wilcoxon + Cohen’s d): 27/30 significantly worse, 0 wins.",
        "Attributed QIE failures via spectral diagnostics: amplitude rank collapse (erank ↓ 1.04, κ ↑ 5.7 × 10^9), angle geometric equivalence to linear feature spaces (CKA ≥ 0.95 on 7/10 datasets), and basis Hamming geometry mismatch.",
        "Confirmed a falsifiable boundary condition: when condition number κ ≈ 2 and effective rank is high, amplitude encoding achieves near-parity with the best classical baseline (d = −0.03, p = 0.96)."
      ]
    },
    {
      title: "Context Collapse in LLMs: Semantic Interference vs. Context Length",
      authors: "Toheeb Goodluck Ogunade",
      journal: "Published on Medium",
      date: "Mar 2026",
      link: "https://medium.com/@ogunadetoheeb4/context-collapse-why-semantic-interference-breaks-llms-before-token-limits-do-ce48a23b29d2",
      codeLink: "https://github.com/qeinstein/context_collapse",
      summary: "Ran 560 controlled trials across arithmetic, retrieval, logic, and instruction-following tasks to examine how random background context versus semantically related noise impacts LLM precision.",
      findings: [
        "Random context up to ~4,000 words reduced LLM accuracy by only 1.3% (98.8% → 97.5%), whereas just 1,000 words of semantically interfering noise drove accuracy down to 82.5%.",
        "Identified 'distractor adoption' as the primary mechanism of failure: 24% of retrieval errors under semantic noise were values sourced directly from irrelevant context.",
        "Showed that 100% instruction compliance was maintained throughout, isolating answer selection—not instruction dilution—as the failure mode."
      ]
    }
  ] satisfies Publication[],
  skills: {
    Languages: [
      "Go (Golang)",
      "Python",
      "TypeScript",
      "SQL (PostgreSQL)",
      "JavaScript",
      "HTML/CSS"
    ],
    "AI/ML & Coref": [
      "PyTorch",
      "TensorFlow",
      "Scikit-Learn",
      "NLP Pipelines",
      "GLiNER",
      "coreferee & spaCy",
      "LLM Evaluation",
      "RAG Systems"
    ],
    "Backend & Concurrency": [
      "FastAPI",
      "Go Fiber",
      "Node.js/Express",
      "React",
      "CSP Concurrency Model",
      "G-M-P Scheduler Optimization"
    ],
    "Infrastructure & Systems": [
      "Docker",
      "Git / GitHub Workflows",
      "Linux Systems",
      "RunPod GPU Cloud",
      "CI/CD Pipelines",
      "JSON-RPC 2.0 & Webhooks"
    ]
  },
  awards: [
    {
      title: "Winner, Best AI Innovation",
      issuer: "Curacel Hackathon",
      year: "2024",
      description: "Awarded for designing and building a multilingual healthcare AI assistant featuring real-time NLP-driven anomaly detection."
    },
    {
      title: "8th Place Overall",
      issuer: "National Mathematics Olympiad",
      year: "2023",
      description: "Ranked 8th nationally in a rigorous multi-stage mathematics competition testing advanced problem-solving, number theory, and analysis."
    }
  ]
} as const;
