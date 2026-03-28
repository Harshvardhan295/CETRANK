import { useState, useCallback, useEffect } from "react";
import { ArrowRight } from "lucide-react";

/* ── Slide data ── */
const SLIDES = [
  {
    id: "intelligence",
    name: "Intelligence",
    quote:
      "Processing 4–5 lakh students across ~2 lakh seats annually using historical cutoff precision.",
    emoji: "🧠",
    stats: [
      { label: "DATA PTS", value: "4L+" },
      { label: "ACCURACY", value: "99%" },
      { label: "SPEED",    value: "Instant" },
    ],
  },
  {
    id: "precision",
    name: "Precision",
    quote:
      "GenAI + RAG reasoning applies every CET Cell quota and category rule — no shortcuts.",
    emoji: "⚡",
    stats: [
      { label: "ENGINE",  value: "RAG" },
      { label: "QUOTAS",  value: "All" },
      { label: "ROUNDS",  value: "3 CAP" },
    ],
  },
  {
    id: "coverage",
    name: "Coverage",
    quote:
      "Separate recommendation logic for Engineering and Pharmacy with 500+ institutes covered.",
    emoji: "📄",
    stats: [
      { label: "STREAMS",  value: "2" },
      { label: "COLLEGES", value: "500+" },
      { label: "REPORTS",  value: "PDF" },
    ],
  },
] as const;

type Slide = (typeof SLIDES)[number];

/* ── Sub-component: one slide's content layer ── */
function SlideContent({
  slide,
  previous,
}: {
  slide: Slide;
  previous?: boolean;
}) {
  const count = slide.stats.length;

  return (
    <div
      className="slide"
      style={{ "--stats": count } as React.CSSProperties}
      data-previous={previous || undefined}
    >
      {/* Orbital stat pills */}
      {slide.stats.map((stat, i) => (
        <div
          key={stat.label}
          className="slide-stat"
          style={{ "--i": i } as React.CSSProperties}
        >
          <div
            style={{
              background: "hsl(var(--card) / 0.75)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid hsl(var(--primary) / 0.2)",
              borderRadius: "0.875rem",
              padding: "0.5rem 0.875rem",
              textAlign: "center",
              minWidth: "72px",
            }}
          >
            <div
              style={{
                fontSize: "0.6rem",
                fontWeight: 700,
                letterSpacing: "0.2em",
                color: "hsl(var(--primary))",
                textTransform: "uppercase",
                opacity: 0.8,
                marginBottom: "2px",
              }}
            >
              {stat.label}
            </div>
            <div
              style={{
                fontSize: "1.15rem",
                fontWeight: 900,
                fontFamily: "'JetBrains Mono', monospace",
                color: "hsl(var(--foreground))",
              }}
            >
              {stat.value}
            </div>
          </div>
        </div>
      ))}

      {/* Quote card */}
      <div className="slide-quote">{slide.quote}</div>

      {/* Centre icon circle */}
      <div
        style={{
          width: "clamp(140px, 18vw, 190px)",
          height: "clamp(140px, 18vw, 190px)",
          borderRadius: "9999px",
          background:
            "linear-gradient(135deg, hsl(var(--primary)/0.15), hsl(var(--accent)/0.1))",
          border: "2px solid hsl(var(--primary) / 0.3)",
          boxShadow:
            "0 0 40px hsl(var(--primary)/0.15), 0 20px 60px rgba(0,0,0,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "clamp(3rem, 5vw, 4.5rem)",
        }}
      >
        {slide.emoji}
      </div>

      {/* Big name below */}
      <div className="slide-name">{slide.name}</div>
    </div>
  );
}

/* ── Main export ── */
export function CircularFeatures() {
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);

  // Clear the outgoing slide from the DOM after the fade-out animation finishes
  // so both .slide-name elements are never rendered at the same time.
  useEffect(() => {
    if (prevIndex === null) return;
    const timer = setTimeout(() => setPrevIndex(null), 750); // matches --slider-duration
    return () => clearTimeout(timer);
  }, [prevIndex]);

  const next = useCallback(() => {
    setIndex((prev) => {
      const nextIdx = (prev + 1) % SLIDES.length;
      setPrevIndex(prev);
      return nextIdx;
    });
  }, []);

  const goTo = useCallback(
    (i: number) => {
      setIndex((prev) => {
        if (i === prev) return prev;
        setPrevIndex(prev);
        return i;
      });
    },
    []
  );

  return (
    <div className="circular-slider-app" style={{ minHeight: 640 }}>
      {/* Spinning dashed orbit ring */}
      <svg
        viewBox="0 0 100 100"
        className="dashes"
        fill="none"
        strokeDasharray="2 4 4 3 2 3 8 2 3 5"
        aria-hidden="true"
      >
        <circle r="45" cx="50" cy="50" />
      </svg>

      {/* Active slide */}
      <SlideContent slide={SLIDES[index]} key={`active-${index}`} />

      {/* Outgoing slide cross-fades out */}
      {prevIndex !== null && (
        <SlideContent
          slide={SLIDES[prevIndex]}
          key={`prev-${prevIndex}`}
          previous
        />
      )}

      {/* Next button */}
      <button
        onClick={next}
        className="group"
        style={{
          position: "absolute",
          bottom: "2.5rem",
          right: "2rem",
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          background: "hsl(var(--card)/0.6)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid hsl(var(--primary)/0.2)",
          borderRadius: "9999px",
          padding: "0.65rem 1.25rem",
          cursor: "pointer",
          zIndex: 10,
          transition: "background 0.2s, box-shadow 0.2s",
          color: "hsl(var(--foreground))",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background =
            "hsl(var(--primary)/0.12)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow =
            "0 0 20px hsl(var(--primary)/0.2)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background =
            "hsl(var(--card)/0.6)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
        }}
      >
        <span
          style={{
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          Next Capability
        </span>
        <ArrowRight
          style={{
            width: "0.9rem",
            height: "0.9rem",
            transition: "transform 0.2s",
            color: "hsl(var(--primary))",
          }}
        />
      </button>
    </div>
  );
}
