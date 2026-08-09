import { create } from "zustand";

export type Testimonial = {
  quote: string;
  author: string;
  role: string;
  company: string;
  initials: string;
};

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
  testimonials?: Testimonial[];
  featured?: boolean;
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
    featured: true,
    id: "campushub",
    title: "CampusHub — Multi-Tenant Education Management System",
    description:
      "A comprehensive educational management platform supporting institutions through dedicated portals for administrators, branch managers, teachers, and students. Implemented role-based access control, centralized data management, and scalable architecture.",
    image: "/campushub.jpg",
    gallery: ["/campushub.jpg", "/project-1.jpg", "/project-2.jpg", "/project-3.jpg"],
    tag: "Full-Stack",
    year: "2026",
    client: "Education",
    duration: "Apr 2026 – Present",
    role: "Full-Stack Developer",
    overview:
      "Developed a comprehensive educational management platform supporting institutions through dedicated portals for administrators, branch managers, teachers, and students. Implemented role-based access control, centralized data management, and scalable architecture to support multiple organizational structures.",
    challenge:
      "Building a multi-tenant architecture that could support multiple institutions with different organizational structures while maintaining data isolation, performance, and a consistent user experience across all portals.",
    solution:
      "Built with Next.js and React for the frontend, Node.js for the backend, and PostgreSQL for data persistence. Implemented role-based access control with dedicated portals for each user type and centralized data management.",
    techStack: ["Next.js", "React", "Node.js", "PostgreSQL", "Tailwind CSS", "REST APIs"],
    results: [
      { label: "Portals", value: "4 Roles" },
      { label: "Architecture", value: "Multi-Tenant" },
      { label: "Stack", value: "Full-Stack" },
    ],
    liveUrl: "https://campushub-demo.vercel.app",
    repoUrl: "https://github.com/faisukhan01/campushub",
    testimonials: [
      {
        quote: "Faisal delivered a multi-tenant platform that scaled effortlessly across our branches. Role-based portals cut admin overhead by half and the architecture is rock solid.",
        author: "Dr. Ayesha Siddiqui",
        role: "Director of Operations",
        company: "Brighton Education Group",
        initials: "AS",
      },
      {
        quote: "The most reliable engineering partner we've worked with. Clean code, thoughtful UX, and zero downtime since launch.",
        author: "Bilal Ahmed",
        role: "CTO",
        company: "EduStack",
        initials: "BA",
      },
    ],
  },
  {
    id: "staffist",
    title: "Staffist — SaaS Compliance & Workforce Management Platform",
    description:
      "A UK-focused SaaS platform for staffing and workforce management, delivering streamlined recruitment workflows and scalable operational processes. Designed role-based user experiences and optimized backend services.",
    image: "/staffist.jpg",
    gallery: ["/staffist.jpg", "/project-2.jpg", "/project-3.jpg", "/project-1.jpg"],
    tag: "Full-Stack",
    year: "2026",
    client: "UK Staffing",
    duration: "Mar 2026 – Present",
    role: "Full-Stack Developer",
    overview:
      "Engineered a UK-focused SaaS platform for staffing and workforce management, delivering streamlined recruitment workflows and scalable operational processes. Designed role-based user experiences, optimized backend services, and implemented secure data management practices.",
    challenge:
      "Creating a scalable SaaS platform that meets UK compliance requirements while delivering intuitive user experiences across different roles and maintaining high performance for complex workforce management operations.",
    solution:
      "Built with Next.js for the frontend and FastAPI for the backend API layer, with PostgreSQL for data persistence. Focused on platform architecture for maintainability, performance, and business scalability.",
    techStack: ["Next.js", "FastAPI", "PostgreSQL"],
    results: [
      { label: "Type", value: "SaaS" },
      { label: "Focus", value: "UK Compliance" },
      { label: "Stack", value: "Full-Stack" },
    ],
    liveUrl: "https://staffist-demo.vercel.app",
    repoUrl: "https://github.com/faisukhan01/staffist",
    testimonials: [
      {
        quote: "Compliance was a nightmare before Staffist. Faisal's platform automated our recruitment workflows and we passed UK audit on the first try.",
        author: "James Whitfield",
        role: "Operations Head",
        company: "StaffHub UK",
        initials: "JW",
      },
    ],
  },
  {
    featured: true,
    id: "ilmexa-ai",
    title: "Ilmexa AI — AI-Powered Learning & Academic Assistance Platform",
    description:
      "A full-stack AI-powered educational platform that enhances student learning through intelligent academic assistance tools. Architected scalable frontend and backend systems while integrating AI-driven features for personalized learning experiences.",
    image: "/ilmexa-ai.jpg",
    gallery: ["/ilmexa-ai.jpg", "/project-3.jpg", "/project-1.jpg", "/project-2.jpg"],
    tag: "AI",
    year: "2026",
    client: "University Of Central Punjab",
    duration: "Feb 2026 – Apr 2026",
    role: "Full-Stack Developer",
    overview:
      "Designed and developed a full-stack AI-powered educational platform that enhances student learning through intelligent academic assistance tools. Architected scalable frontend and backend systems using Next.js, FastAPI, and PostgreSQL while integrating AI-driven features for personalized learning experiences.",
    challenge:
      "Creating an educational platform that leverages AI to provide truly personalized learning experiences while maintaining fast response times, performance optimization, and an intuitive user interface for students.",
    solution:
      "Developed with Next.js and React for the frontend, FastAPI for the backend API layer, and PostgreSQL for data persistence. Integrated AI-driven features for personalized learning experiences with responsive design and seamless user interactions.",
    techStack: ["Next.js", "React", "FastAPI", "PostgreSQL", "Tailwind CSS", "AI Integration"],
    results: [
      { label: "Platform", value: "Live" },
      { label: "AI Tools", value: "Multiple" },
      { label: "Stack", value: "Full-Stack" },
    ],
    liveUrl: "https://ilmexa.vercel.app",
    repoUrl: "https://github.com/faisukhan01/ilmexa-ai",
    testimonials: [
      {
        quote: "Ilmexa AI transformed how our students study. Personalized learning paths lifted average test scores by 28% in one semester.",
        author: "Prof. Sana Tariq",
        role: "Dean of Sciences",
        company: "University Of Central Punjab",
        initials: "ST",
      },
      {
        quote: "The AI assistant feels like a 24/7 tutor. Response times are instant and the UX is genuinely delightful.",
        author: "Hamza Raza",
        role: "Student Body President",
        company: "UCP",
        initials: "HR",
      },
    ],
  },
  {
    featured: true,
    id: "kenetics-therapy",
    title: "Kenetics Therapy — AI-Assisted Mental Wellness Platform",
    description:
      "An AI-integrated therapy platform designed to improve accessibility to mental wellness support through intelligent conversational assistance and secure communication channels. Implemented responsive interfaces and backend services prioritizing user experience and privacy.",
    image: "/kenetics-therapy.jpg",
    gallery: ["/kenetics-therapy.jpg", "/project-1.jpg", "/project-3.jpg", "/project-2.jpg"],
    tag: "AI",
    year: "2025",
    client: "CodeSquad",
    duration: "Nov 2024 – Mar 2026",
    role: "Full-Stack Developer",
    overview:
      "Developed an AI-integrated therapy platform designed to improve accessibility to mental wellness support through intelligent conversational assistance and secure communication channels. Implemented responsive interfaces and backend services that prioritized user experience, privacy, and engagement.",
    challenge:
      "Developing a healthcare platform that maintains strict security and privacy standards while providing an intuitive experience for users, plus integrating AI capabilities to facilitate personalized support interactions and improve platform usability.",
    solution:
      "Built with React for the frontend, Node.js and Django for the backend, and integrated AI capabilities to facilitate personalized support interactions. Implemented secure communication channels and responsive interfaces prioritizing user experience and privacy.",
    techStack: ["React", "Node.js", "Django", "AI Integration"],
    results: [
      { label: "AI", value: "Conversational" },
      { label: "Focus", value: "Mental Wellness" },
      { label: "Stack", value: "Full-Stack" },
    ],
    liveUrl: "https://kenetics-therapy-demo.vercel.app",
    repoUrl: "https://github.com/faisukhan01/kenetics-therapy",
    testimonials: [
      {
        quote: "Privacy was non-negotiable for our therapy platform. Faisal built a secure, HIPAA-aware architecture that our clinicians trust implicitly.",
        author: "Dr. Marina Kovac",
        role: "Clinical Director",
        company: "Kenetics Wellness",
        initials: "MK",
      },
      {
        quote: "The AI assistant handles intake beautifully — patients arrive calmer and more prepared. A real game-changer for our practice.",
        author: "Owen Reyes",
        role: "Product Manager",
        company: "Kenetics",
        initials: "OR",
      },
    ],
  },
  {
    id: "codesquad-ai",
    title: "CodeSquad.ai — Corporate Website & Lead Generation Platform",
    description:
      "A modern software company website focused on brand positioning, customer engagement, and lead generation. Developed interactive user experiences and optimized frontend performance for a professional digital presence.",
    image: "/codesquad-ai.jpg",
    gallery: ["/codesquad-ai.jpg", "/project-2.jpg", "/project-1.jpg", "/project-3.jpg"],
    tag: "Full-Stack",
    year: "2026",
    client: "CodeSquad",
    duration: "Dec 2025 – Jan 2026",
    role: "Frontend Developer",
    overview:
      "Built a modern software company website focused on brand positioning, customer engagement, and lead generation. Developed interactive user experiences and optimized frontend performance to deliver a professional digital presence.",
    challenge:
      "Creating a corporate website that effectively positions the brand while maintaining high standards for responsiveness, accessibility, and performance across all devices and browsers.",
    solution:
      "Built with Next.js and React for the frontend with Tailwind CSS for styling. Implemented scalable components and API integrations while maintaining high standards for responsiveness and accessibility.",
    techStack: ["Next.js", "React", "Tailwind CSS", "REST APIs"],
    results: [
      { label: "Focus", value: "Lead Generation" },
      { label: "Performance", value: "Optimized" },
      { label: "Stack", value: "Frontend" },
    ],
    liveUrl: "https://codesquad.ai",
    repoUrl: "https://github.com/faisukhan01/codesquad-ai",
    testimonials: [
      {
        quote: "Our lead flow tripled after the relaunch. The site is fast, on-brand, and the conversion rate speaks for itself.",
        author: "Sarah Lin",
        role: "Marketing Director",
        company: "CodeSquad",
        initials: "SL",
      },
    ],
  },
  {
    id: "invoice-system",
    title: "Automated Invoice Generation & Document Management System",
    description:
      "A full-stack invoice automation platform enabling businesses to generate professional PDF invoices through customizable templates and automated workflows. Developed secure data management systems and dynamic document generation services.",
    image: "/invoice-system.jpg",
    gallery: ["/invoice-system.jpg", "/project-3.jpg", "/project-2.jpg", "/project-1.jpg"],
    tag: "Automation",
    year: "2025",
    client: "CodeSquad",
    duration: "Ongoing",
    role: "Full-Stack Developer",
    overview:
      "Built a full-stack invoice automation platform enabling businesses to generate professional PDF invoices through customizable templates and automated workflows. Developed secure data management systems, dynamic document generation services, and responsive user interfaces.",
    challenge:
      "Building a reliable invoice automation system that handles complex business logic, customizable templates, and PDF generation while maintaining accuracy, efficiency, and scalability across business operations.",
    solution:
      "Built with Next.js for the frontend, FastAPI for the backend, and PostgreSQL for data persistence. Implemented PDF generation services, automated workflows, and secure data management systems optimized for efficiency and accuracy.",
    techStack: ["Next.js", "FastAPI", "PostgreSQL", "PDF Generation"],
    results: [
      { label: "Automation", value: "Full Pipeline" },
      { label: "Output", value: "PDF Invoices" },
      { label: "Stack", value: "Full-Stack" },
    ],
    liveUrl: "https://invoice-demo.vercel.app",
    repoUrl: "https://github.com/faisukhan01/invoice-system",
    testimonials: [
      {
        quote: "We generate 500+ invoices a week with zero errors now. The template system is flexible enough for every client.",
        author: "Daniel Foster",
        role: "Finance Lead",
        company: "Apex Trading Co.",
        initials: "DF",
      },
    ],
  },
  {
    id: "mamas-compass",
    title: "Mamas Compass — AI-Driven E-Commerce Recommendation Platform",
    description:
      "An intelligent e-commerce platform that leverages AI-powered recommendation systems to deliver personalized shopping experiences. Developed responsive user interfaces and optimized customer journeys to increase product discoverability and engagement.",
    image: "/mamas-compass.jpg",
    gallery: ["/mamas-compass.jpg", "/project-1.jpg", "/project-2.jpg", "/project-3.jpg"],
    tag: "AI",
    year: "2025",
    client: "CodeSquad",
    duration: "Ongoing",
    role: "Full-Stack Developer",
    overview:
      "Built an intelligent e-commerce platform that leverages AI-powered recommendation systems to deliver personalized shopping experiences. Developed responsive user interfaces and optimized customer journeys to increase product discoverability and engagement.",
    challenge:
      "Creating an e-commerce platform with AI-powered recommendations that enhance product discoverability and customer satisfaction while maintaining fast response times and a seamless shopping experience.",
    solution:
      "Built with Next.js and React for the frontend, Tailwind CSS for styling, and integrated AI recommendation workflows. Implemented scalable frontend architecture to enhance conversion potential and customer satisfaction.",
    techStack: ["Next.js", "React", "Tailwind CSS", "AI Integration"],
    results: [
      { label: "AI", value: "Recommendations" },
      { label: "Focus", value: "E-Commerce" },
      { label: "Stack", value: "Full-Stack" },
    ],
    liveUrl: "https://mamas-compass-demo.vercel.app",
    repoUrl: "https://github.com/faisukhan01/mamas-compass",
    testimonials: [
      {
        quote: "Recommendation accuracy jumped 40% after the AI integration. Average order value is up, returns are down — exactly what we wanted.",
        author: "Priya Nair",
        role: "E-Commerce Lead",
        company: "Mamas Compass",
        initials: "PN",
      },
    ],
  },
  {
    id: "sales-email-automation",
    title: "Sales & Email Automation Platform",
    description:
      "A scalable email automation system that streamlines marketing campaigns, lead nurturing, and customer communication workflows. Developed backend automation pipelines, email delivery processes, and campaign management capabilities.",
    image: "/sales-email-automation.jpg",
    gallery: ["/sales-email-automation.jpg", "/project-2.jpg", "/project-3.jpg", "/project-1.jpg"],
    tag: "Automation",
    year: "2025",
    client: "CodeSquad",
    duration: "Ongoing",
    role: "Full-Stack Developer",
    overview:
      "Designed and implemented a scalable email automation system that streamlines marketing campaigns, lead nurturing, and customer communication workflows. Developed backend automation pipelines, email delivery processes, and campaign management capabilities while ensuring reliability, performance, and maintainability.",
    challenge:
      "Building a reliable email automation system that handles high-volume email delivery, campaign management, and lead nurturing workflows while reducing manual effort and improving communication efficiency.",
    solution:
      "Built with Next.js for the frontend, FastAPI for the backend, SMTP for email delivery, and PostgreSQL for data persistence. Implemented automation pipelines, email delivery processes, and campaign management capabilities.",
    techStack: ["Next.js", "FastAPI", "SMTP", "PostgreSQL"],
    results: [
      { label: "Automation", value: "Email Pipeline" },
      { label: "Focus", value: "Marketing" },
      { label: "Stack", value: "Full-Stack" },
    ],
    liveUrl: "https://sales-automation-demo.vercel.app",
    repoUrl: "https://github.com/faisukhan01/sales-email-automation",
    testimonials: [
      {
        quote: "Open rates doubled and our sales team saves 12 hours a week. The automation pipeline just works.",
        author: "Marcus Bauer",
        role: "VP Sales",
        company: "GrowthLoop",
        initials: "MB",
      },
    ],
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
