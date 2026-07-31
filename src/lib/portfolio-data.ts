import { create } from "zustand";

export type ProjectDetail = {
  id: string;
  title: string;
  description: string;
  image: string;
  gallery: string[];
  tag: string;
  year: string;
  client: string;
  duration: string;
  role: string;
  overview: string;
  challenge: string;
  solution: string;
  techStack: string[];
  results: { label: string; value: string }[];
  liveUrl: string;
  repoUrl: string;
};

export type ArticleDetail = {
  id: string;
  title: string;
  excerpt: string;
  content: string[];
  tag: string;
  date: string;
  readTime: string;
  author: string;
};

export const projectsData: ProjectDetail[] = [
  {
    id: "kafka-golang",
    title: "The simplest example is kafka + golang",
    description:
      "This article presents a simple way to implement a microservice architecture using Kafka, Golang and Docker.",
    image: "/project-1.jpg",
    gallery: ["/project-1.jpg", "/project-2.jpg", "/project-3.jpg"],
    tag: "Microservices",
    year: "2024",
    client: "Open Source",
    duration: "3 months",
    role: "Lead Engineer",
    overview:
      "A minimal yet production-ready microservice architecture demonstrating how Kafka and Golang work together to build scalable, fault-tolerant distributed systems.",
    challenge:
      "Most Kafka + Golang tutorials either oversimplify or bury the reader in configuration. The goal was to build the simplest possible example that still reflects real production concerns: retries, dead-letter queues, and graceful shutdown.",
    solution:
      "Built a two-service pipeline (producer + consumer) using Gin for HTTP, GORM for persistence, and the segmentio/kafka-go client. Containerized with Docker Compose so the whole stack boots with a single command.",
    techStack: ["Golang", "Kafka", "Docker", "Gin", "GORM", "PostgreSQL"],
    results: [
      { label: "Throughput", value: "12k msg/s" },
      { label: "Latency p99", value: "48ms" },
      { label: "Uptime", value: "99.98%" },
    ],
    liveUrl: "#",
    repoUrl: "#",
  },
  {
    id: "nest-rest-apis",
    title: "Building scalable REST APIs with Nest.js",
    description:
      "A comprehensive guide to building production-ready REST APIs with Nest.js, TypeORM and PostgreSQL with proper authentication and authorization.",
    image: "/project-2.jpg",
    gallery: ["/project-2.jpg", "/project-3.jpg", "/project-1.jpg"],
    tag: "Backend",
    year: "2024",
    client: "Fintech Startup",
    duration: "6 months",
    role: "Senior Backend Engineer",
    overview:
      "A modular, well-tested REST API backbone used by a fintech platform handling payments, KYC flows, and transaction history for 50k+ users.",
    challenge:
      "The legacy API was a monolithic Express app with no clear boundaries, slow tests, and frequent regressions. We needed to migrate to a layered architecture without downtime.",
    solution:
      "Adopted Nest.js with strict module boundaries, TypeORM with migrations, JWT + refresh token auth, RBAC, and OpenAPI docs auto-generated from decorators. Added a CI pipeline with 85% coverage gate.",
    techStack: ["Nest.js", "TypeORM", "PostgreSQL", "Redis", "JWT", "Docker"],
    results: [
      { label: "Test coverage", value: "87%" },
      { label: "API response", value: "62ms avg" },
      { label: "Deploy time", value: "4 min" },
    ],
    liveUrl: "#",
    repoUrl: "#",
  },
  {
    id: "realtime-dashboard",
    title: "Real-time data visualization dashboard",
    description:
      "Creating an interactive real-time dashboard with React, WebSocket and D3.js for monitoring microservices infrastructure and performance metrics.",
    image: "/project-3.jpg",
    gallery: ["/project-3.jpg", "/project-1.jpg", "/project-2.jpg"],
    tag: "Frontend",
    year: "2023",
    client: "DevOps Tooling Co.",
    duration: "4 months",
    role: "Frontend Lead",
    overview:
      "A real-time observability dashboard rendering 200+ live charts with sub-100ms updates, used by SRE teams to monitor microservice health.",
    challenge:
      "Existing dashboards lagged behind reality by 30+ seconds and froze when many metrics were on screen. We needed smooth 60fps rendering with backpressure-aware data ingestion.",
    solution:
      "Built a React + D3.js layer with a custom WebSocket multiplexer, requestAnimationFrame-batched renders, and off-main-thread data parsing via Web Workers. Canvas fallback for high-density charts.",
    techStack: ["React", "D3.js", "WebSocket", "Web Workers", "Canvas", "Zustand"],
    results: [
      { label: "Render fps", value: "60fps" },
      { label: "Data lag", value: "<100ms" },
      { label: "Charts", value: "240 live" },
    ],
    liveUrl: "#",
    repoUrl: "#",
  },
];

export const articlesData: ArticleDetail[] = [
  {
    id: "kafka-golang-article",
    title: "The simplest example is kafka + golang",
    excerpt:
      "This article presents a simple way to implement a microservice architecture using Kafka, Golang and Docker.",
    tag: "Microservices",
    date: "Mar 14, 2024",
    readTime: "8 min",
    author: "Nikita Khvatov",
    content: [
      "When teams first approach Kafka, the complexity of brokers, topics, partitions, and consumer groups can feel overwhelming. This walkthrough strips the stack down to the absolute minimum: one producer, one consumer, and a single topic — but with production concerns baked in from the start.",
      "We use Golang because its concurrency model maps cleanly onto Kafka's consumer-group semantics. Goroutines become consumers, channels become the back-pressure boundary, and context cancellation gives us graceful shutdown for free.",
      "The producer is a thin Gin HTTP endpoint that accepts JSON, validates it, and writes to Kafka. The consumer reads in a loop, persists to PostgreSQL via GORM, and commits offsets only after the write succeeds — guaranteeing at-least-once delivery.",
      "Retries use a dead-letter topic. After three failed attempts the message is forwarded to kafka.dlq and an alert fires. This keeps the main pipeline moving while preserving the failing payload for later inspection.",
      "The whole stack — Kafka, PostgreSQL, producer, consumer — boots with a single docker compose up. That reproducibility is what makes this example genuinely useful for onboarding new engineers.",
    ],
  },
  {
    id: "grpc-vs-rest",
    title: "Why I switched from REST to gRPC for internal services",
    excerpt:
      "A practical comparison between REST and gRPC, and how protocol buffers transformed our service-to-service communication.",
    tag: "Backend",
    date: "Jan 22, 2024",
    readTime: "12 min",
    author: "Nikita Khvatov",
    content: [
      "REST is the lingua franca of the web, but for internal service-to-service communication it carries hidden costs: ambiguous payload shapes, hand-rolled client code, and JSON parsing overhead on every hop.",
      "gRPC flips the contract: you define messages and services in Protocol Buffers, then generate strongly-typed clients and servers in any language. The contract is the source of truth, not a post-hoc documentation effort.",
      "Binary protobuf encoding is dramatically smaller than JSON — in our case, internal payloads shrank by 60% on average, and CPU spent on serialization dropped by 4x.",
      "HTTP/2 multiplexing means a single TCP connection carries many concurrent streams. For a mesh of 30+ microservices, this reduced connection churn and improved tail latency noticeably.",
      "The trade-off is tooling and browser support. gRPC-Web requires a proxy, and debugging binary payloads is harder. We kept REST for public-facing APIs and adopted gRPC strictly for internal traffic — a hybrid that has held up well.",
    ],
  },
  {
    id: "redux-vs-zustand",
    title: "State management in 2024: Redux Toolkit vs Zustand",
    excerpt:
      "An in-depth look at modern state management solutions for React applications and when to choose each one.",
    tag: "Frontend",
    date: "Nov 05, 2023",
    readTime: "10 min",
    author: "Nikita Khvatov",
    content: [
      "State management is one of the most bikeshedded topics in React, and the landscape has shifted dramatically. Redux Toolkit (RTK) and Zustand represent two philosophies that are both legitimate in 2024.",
      "RTK keeps the Redux mental model — a single store, dispatched actions, derived selectors — but removes the boilerplate that made classic Redux painful. If your team already thinks in Redux, RTK is a strict upgrade with no conceptual cost.",
      "Zustand takes the opposite bet: a tiny hook-based store with no actions, no reducers, no providers. You mutate state directly with set, and subscribe with a selector. For greenfield projects this is often all you need.",
      "The deciding factor is team size and long-term maintainability. RTK's structure pays off when 10+ engineers touch the same store — the action log and time-travel debugging are genuinely valuable. Zustand shines in smaller teams where ceremony slows you down.",
      "Our rule of thumb: if the app has fewer than 5 engineers and no complex async orchestration, reach for Zustand. If you need redux-saga-style flows or have a large team, RTK + RTK Query remains the safer bet.",
    ],
  },
];

type ModalState = {
  activeProject: ProjectDetail | null;
  activeArticle: ArticleDetail | null;
  contactOpen: boolean;
  shortcutsOpen: boolean;
  setProject: (p: ProjectDetail | null) => void;
  setArticle: (a: ArticleDetail | null) => void;
  setContact: (open: boolean) => void;
  setShortcuts: (open: boolean) => void;
};

export const useModalStore = create<ModalState>((set) => ({
  activeProject: null,
  activeArticle: null,
  contactOpen: false,
  shortcutsOpen: false,
  setProject: (p) => set({ activeProject: p }),
  setArticle: (a) => set({ activeArticle: a }),
  setContact: (open) => set({ contactOpen: open }),
  setShortcuts: (open) => set({ shortcutsOpen: open }),
}));
