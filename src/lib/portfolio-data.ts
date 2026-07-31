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
    id: "esm-school-management",
    title: "Electronic School Management System",
    description:
      "A full-stack school management portal with interactive 3D UI elements and a Node.js/Express.js backend, featuring role-based modules for admin, teacher, and student workflows.",
    image: "/project-1.jpg",
    gallery: ["/project-1.jpg", "/project-2.jpg", "/project-3.jpg"],
    tag: "Full-Stack",
    year: "2025",
    client: "Education",
    duration: "In Progress",
    role: "Full-Stack Developer",
    overview:
      "Building a comprehensive school management portal with interactive 3D UI elements using Three.js and a Node.js/Express.js backend. Designing role-based modules for admin, teacher, and student workflows with a Next.js frontend.",
    challenge:
      "Creating an intuitive and engaging school management system that goes beyond traditional interfaces by integrating 3D interactive elements while maintaining performance and usability across different user roles.",
    solution:
      "Built with Next.js for the frontend, Three.js for interactive 3D experiences, and Node.js/Express.js for the backend. Implemented role-based access control with dedicated modules for admins, teachers, and students.",
    techStack: ["Next.js", "Three.js", "Node.js", "Express.js", "Tailwind CSS"],
    results: [
      { label: "Status", value: "In Progress" },
      { label: "Modules", value: "3 Roles" },
      { label: "Stack", value: "Full-Stack" },
    ],
    liveUrl: "#",
    repoUrl: "#",
  },
  {
    id: "ilmexa-ai",
    title: "Ilmexa AI — Educational Platform",
    description:
      "An AI-powered educational platform offering multiple AI-driven tools for personalized, interactive student learning.",
    image: "/project-2.jpg",
    gallery: ["/project-2.jpg", "/project-3.jpg", "/project-1.jpg"],
    tag: "AI / Full-Stack",
    year: "2025",
    client: "EdTech",
    duration: "3 months",
    role: "Full-Stack Developer",
    overview:
      "Built and launched an AI-powered educational platform offering multiple AI-driven tools for personalized, interactive student learning. The platform integrates GPT and other AI models to provide adaptive learning experiences.",
    challenge:
      "Creating an educational platform that leverages AI to provide truly personalized learning experiences while maintaining fast response times and an intuitive user interface for students of all ages.",
    solution:
      "Developed with Next.js and React for the frontend, FastAPI for the backend API layer, and PostgreSQL for data persistence. Integrated AI models (GPT, Claude, Gemini) for adaptive learning tools and personalized content generation.",
    techStack: ["Next.js", "React", "FastAPI", "PostgreSQL", "AI Integration"],
    results: [
      { label: "Platform", value: "Live" },
      { label: "AI Tools", value: "Multiple" },
      { label: "Stack", value: "Full-Stack" },
    ],
    liveUrl: "https://ilmexa.vercel.app",
    repoUrl: "#",
  },
  {
    id: "kenetics-therapy",
    title: "Kenetics Therapy — Clinic Platform",
    description:
      "A therapy clinic platform with separate doctor and patient portals, featuring AI chatbot support and secure patient communication.",
    image: "/project-3.jpg",
    gallery: ["/project-3.jpg", "/project-1.jpg", "/project-2.jpg"],
    tag: "AI / Full-Stack",
    year: "2025",
    client: "Healthcare",
    duration: "2 months",
    role: "Full-Stack Developer",
    overview:
      "Built a therapy clinic platform with separate doctor and patient portals, featuring AI chatbot support and secure patient communication. The platform streamlines appointment scheduling and patient-doctor interactions.",
    challenge:
      "Developing a healthcare platform that maintains strict security and privacy standards while providing an intuitive experience for both doctors and patients, plus integrating AI-powered chatbot support for initial consultations.",
    solution:
      "Built with React.js and Next.js for the frontend, FastAPI for the backend, and integrated AI chatbot capabilities. Implemented separate portals for doctors and patients with role-based access control and secure messaging.",
    techStack: ["React.js", "Next.js", "FastAPI", "AI Integration", "Tailwind CSS"],
    results: [
      { label: "Portals", value: "Doctor + Patient" },
      { label: "AI", value: "Chatbot" },
      { label: "Stack", value: "Full-Stack" },
    ],
    liveUrl: "#",
    repoUrl: "#",
  },
];

export const articlesData: ArticleDetail[] = [
  {
    id: "nextjs-threejs-3d",
    title: "Building interactive 3D experiences with Next.js and Three.js",
    excerpt:
      "A practical guide to integrating Three.js into your Next.js applications for immersive 3D web experiences.",
    tag: "Frontend",
    date: "Mar 14, 2025",
    readTime: "8 min",
    author: "Faisal Khan",
    content: [
      "Three.js has become the go-to library for creating 3D experiences on the web. When combined with Next.js, you get the best of both worlds: server-side rendering for performance and a powerful 3D engine for interactive visuals.",
      "The key challenge is integrating Three.js with React's component model. Using React Three Fiber (R3F), we can declaratively compose Three.js scenes using JSX, making the code more maintainable and easier to reason about.",
      "In my recent project — an Electronic School Management System — I used Three.js to create interactive 3D UI elements that make the dashboard more engaging. The 3D elements respond to user interactions and provide visual feedback.",
      "Performance is critical. Using Next.js dynamic imports with ssr: false for Three.js components prevents hydration mismatches. Lazy loading 3D scenes and using Suspense boundaries ensures the page remains interactive while 3D assets load.",
      "The combination of Next.js and Three.js opens up possibilities for creating web applications that go beyond traditional flat interfaces, making them more engaging and memorable for users.",
    ],
  },
  {
    id: "fastapi-nextjs-fullstack",
    title: "Building full-stack apps with Next.js and FastAPI",
    excerpt:
      "Why combining Next.js on the frontend with FastAPI on the backend creates a powerful and developer-friendly full-stack architecture.",
    tag: "Full-Stack",
    date: "Jan 22, 2025",
    readTime: "10 min",
    author: "Faisal Khan",
    content: [
      "The combination of Next.js and FastAPI has become my go-to stack for full-stack development. Next.js provides an excellent frontend framework with SSR, routing, and API routes, while FastAPI delivers blazing-fast Python backend services with automatic OpenAPI documentation.",
      "FastAPI's async-first design and automatic request validation using Pydantic models make it incredibly productive. You define your data models once, and FastAPI handles validation, serialization, and documentation automatically.",
      "In my AI-powered educational platform (Ilmexa AI), I used FastAPI as the backend API layer to integrate AI models. The async support was crucial for handling concurrent AI API calls without blocking.",
      "The architecture is straightforward: Next.js handles the UI and client-side logic, while FastAPI serves as the API layer for complex business logic, AI integrations, and database operations. Communication happens via REST APIs.",
      "This stack is particularly powerful when you need AI integration. Python's ecosystem for AI/ML is unmatched, and FastAPI makes it trivial to expose AI capabilities as REST endpoints that your Next.js frontend can consume.",
    ],
  },
  {
    id: "ai-integration-web-apps",
    title: "Integrating AI into web applications: A practical approach",
    excerpt:
      "How to effectively integrate AI capabilities like GPT, Claude, and Gemini into your full-stack web applications.",
    tag: "AI",
    date: "Nov 05, 2024",
    readTime: "12 min",
    author: "Faisal Khan",
    content: [
      "AI integration is no longer a nice-to-have — it's becoming a core feature of modern web applications. From chatbots to content generation to personalized recommendations, AI can dramatically enhance user experience.",
      "The key is choosing the right AI model for the task. GPT excels at conversational interactions and content generation. Claude is great for analysis and structured outputs. Gemini offers strong multimodal capabilities. Each has its strengths.",
      "In my projects, I've found that the best approach is to use AI as an augmentation layer, not a replacement. The AI enhances the user experience, but the core application logic remains deterministic and reliable.",
      "Prompt engineering is critical. Well-crafted prompts with clear instructions, examples, and constraints produce dramatically better results. I always include system prompts that define the AI's role and boundaries.",
      "Error handling is essential. AI APIs can be slow, return unexpected results, or fail entirely. Always implement fallbacks, timeouts, and graceful degradation. The user should never be stuck waiting for an AI response that never comes.",
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
