import { ImageResponse } from "next/og";
import { projectsData } from "@/lib/portfolio-data";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Dynamic per-project OG image (1200x630), wired automatically by
 * Next.js's `opengraph-image` file convention.
 *
 * Renders a branded dark card with:
 *  - Tag pill (top-left), "Case Study · YEAR" eyebrow (top-right)
 *  - Optional "★ Featured Project" eyebrow
 *  - Large multi-line title + description
 *  - Author byline + tech stack mini-pills (bottom row)
 *
 * Falls back to a 404 image if the slug doesn't match a project.
 */
export default async function OpengraphImage({
  params,
}: {
  params: { slug: string };
}) {
  const project = projectsData.find((p) => p.id === params.slug);

  if (!project) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#0a0a0a",
            color: "#fafafa",
            fontSize: "48px",
          }}
        >
          Project not found
        </div>
      ),
      { ...size }
    );
  }

  const tagColor =
    project.tag === "AI"
      ? "#a78bfa"
      : project.tag === "Automation"
      ? "#fbbf24"
      : "#34d399";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "radial-gradient(circle at 80% 0%, rgba(52,211,153,0.18), transparent 55%), radial-gradient(circle at 0% 100%, rgba(167,139,250,0.14), transparent 55%), #0a0a0a",
          color: "#fafafa",
          padding: "64px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Top row: tag pill + case-study eyebrow */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "8px 18px",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.06)",
              border: `1.5px solid ${tagColor}`,
              fontSize: "18px",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: tagColor,
            }}
          >
            {project.tag}
          </div>
          <div
            style={{
              fontSize: "16px",
              fontFamily: "monospace",
              color: "rgba(255,255,255,0.45)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            Case Study · {project.year}
          </div>
        </div>

        {/* Middle: project title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            maxWidth: "980px",
          }}
        >
          {project.featured && (
            <div
              style={{
                fontSize: "20px",
                fontWeight: 600,
                color: "#34d399",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              ★ Featured Project
            </div>
          )}
          <div
            style={{
              fontSize: project.title.length > 60 ? "52px" : "64px",
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            {project.title}
          </div>
          <div
            style={{
              fontSize: "26px",
              color: "rgba(255,255,255,0.7)",
              maxWidth: "940px",
              lineHeight: 1.35,
            }}
          >
            {project.description.length > 130
              ? project.description.slice(0, 127) + "…"
              : project.description}
          </div>
        </div>

        {/* Bottom: byline + tech stack mini-pills */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            <div
              style={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#fafafa",
              }}
            >
              Faisal Khan
            </div>
            <div
              style={{
                fontSize: "16px",
                color: "rgba(255,255,255,0.5)",
                fontFamily: "monospace",
              }}
            >
              Full-stack Developer
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              maxWidth: "640px",
              justifyContent: "flex-end",
            }}
          >
            {project.techStack.slice(0, 4).map((tech) => (
              <div
                key={tech}
                style={{
                  fontSize: "16px",
                  fontFamily: "monospace",
                  padding: "6px 14px",
                  borderRadius: "999px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                {tech}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
