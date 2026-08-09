import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projectsData } from "@/lib/portfolio-data";
import { ProjectDetailClient } from "@/components/portfolio/ProjectDetailClient";

type PageProps = {
  params: Promise<{ slug: string }>;
};

/**
 * Pre-render all project pages at build time.
 */
export function generateStaticParams() {
  return projectsData.map((p) => ({ slug: p.id }));
}

/**
 * Per-project metadata (title, description, OG/Twitter cards) for SEO
 * and social-share previews. The OG image is generated dynamically by
 * the `opengraph-image.tsx` route in this same directory, so we only
 * need to provide title + description here — Next.js wires the OG image
 * automatically via the file convention.
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projectsData.find((p) => p.id === slug);
  if (!project) {
    return {
      title: "Project not found — Faisal Khan",
    };
  }

  const siteUrl = "https://faisalkhan01.vercel.app";
  const url = `${siteUrl}/projects/${project.id}`;
  const description =
    project.overview.length > 155
      ? project.overview.slice(0, 152) + "…"
      : project.overview;

  return {
    title: `${project.title} — Case Study`,
    description,
    keywords: [
      project.tag,
      "Case Study",
      "Faisal Khan",
      "Full-stack Developer",
      ...project.techStack,
    ],
    authors: [{ name: "Faisal Khan" }],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${project.title} — Case Study`,
      description,
      url,
      siteName: "Faisal Khan Portfolio",
      type: "article",
      locale: "en_US",
      // OG image is auto-wired from ./opengraph-image.tsx
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — Case Study`,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = projectsData.find((p) => p.id === slug);
  if (!project) {
    notFound();
  }
  return <ProjectDetailClient project={project} />;
}
