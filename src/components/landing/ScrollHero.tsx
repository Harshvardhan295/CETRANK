import { useRef, useEffect, useCallback, useState } from "react";
import { ArrowRight, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const SECTIONS = [
  {
    id: "intelligence",
    title: "CETRANK",
    subtitle: "The Admission Intelligence Engine",
    description:
      "Navigate the complex Maharashtra CET counselling process with an AI-based system that simplifies choice-filling for 4-5 lakh annual applicants.",
    stats: "4 Lakh+ Data Points",
  },
  {
    id: "logic",
    title: "Rule-Aware",
    subtitle: "Mimicking CET Cell Logic",
    description:
      "Our GenAI-powered reasoning pipeline accurately applies category priorities, quotas, and official fallback logic to ensure valid recommendations.",
    stats: "RAG-Powered Accuracy",
  },
  {
    id: "counsellor",
    title: "Digital Counsellor",
    subtitle: "Adaptive Round Strategy",
    description:
      "From aspirational choices in early rounds to realistic vacancy-based options in CAP Round 3-get guidance that adapts to every stage.",
    stats: "3 CAP Rounds Supported",
  },
  {
    id: "features",
    title: "Precision Reports",
    subtitle: "Engineering & Pharmacy",
    description:
      "Download comprehensive PDF reports featuring institute codes, ranked college lists, and branch-specific analysis for B.E., B.Tech, and B.Pharm.",
    stats: "Multi-Stream Support",
  },
  {
    id: "hero-cta",
    title: "Ready to",
    subtitle: "Refine Your Rank?",
    description: "",
    stats: "",
    isCTA: true,
  },
];

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function interpolate(p: number, stops: [number, number][]) {
  if (p <= stops[0][0]) return stops[0][1];
  if (p >= stops[stops.length - 1][0]) return stops[stops.length - 1][1];

  for (let i = 0; i < stops.length - 1; i++) {
    if (p >= stops[i][0] && p <= stops[i + 1][0]) {
      const t = (p - stops[i][0]) / (stops[i + 1][0] - stops[i][0]);
      return lerp(stops[i][1], stops[i + 1][1], t);
    }
  }

  return stops[stops.length - 1][1];
}

function computeStyles(raw: number) {
  const p = easeInOut(raw);

  return {
    opacity: 1,
    filter: "none",
    transform: `translate3d(${interpolate(p, [[0, 100], [0.5, 0], [1, -100]])}%, 0, 0)`,
  };
}

function HeroPanel({
  section,
}: {
  section: (typeof SECTIONS)[number];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      const sec = sectionRef.current;
      const con = contentRef.current;
      if (!sec || !con) return;

      const rect = sec.getBoundingClientRect();
      const vh = window.innerHeight;
      const raw = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)));
      const styles = computeStyles(raw);

      con.style.opacity = String(styles.opacity);
      con.style.filter = styles.filter;
      con.style.transform = styles.transform;
      con.style.visibility = raw > 0.02 && raw < 0.98 ? "visible" : "hidden";
      con.style.pointerEvents = raw > 0.35 && raw < 0.65 ? "auto" : "none";
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const isCTASection = "isCTA" in section && section.isCTA;

  return (
    <section ref={sectionRef} data-hero-section style={{ height: "100dvh" }}>
      <div
        ref={contentRef}
        className="fixed inset-0 overflow-hidden bg-background"
        style={{ zIndex: 5, willChange: "transform, opacity, filter" }}
      >
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="flex items-center justify-center h-full p-6 relative">
          <div className="max-w-4xl text-center">
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-4 font-['Outfit']">
              <span className="block text-foreground">{section.title}</span>
              <span className="block text-gradient">{section.subtitle}</span>
            </h2>
            {section.description && (
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                {section.description}
              </p>
            )}
            {isCTASection ? (
              <Link to="/list-generator">
                <Button size="lg" className="rounded-2xl px-12 py-8 text-lg glow-primary animate-glow-pulse group">
                  Launch List Generator
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            ) : section.stats ? (
              <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass border-primary/10 text-primary font-mono-display text-sm">
                <Zap className="w-4 h-4 fill-primary" />
                {section.stats}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ScrollHero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [heroVisible, setHeroVisible] = useState(true);
  const snapIndexRef = useRef(0);
  const isSnappingRef = useRef(false);
  const touchStartYRef = useRef(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const snapTo = useCallback((index: number) => {
    const els = document.querySelectorAll<HTMLElement>("[data-hero-section]");
    if (!els[index]) return;

    isSnappingRef.current = true;
    const top = els[index].getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top, behavior: "smooth" });
    snapIndexRef.current = index;

    setTimeout(() => {
      isSnappingRef.current = false;
    }, 800);
  }, []);

  useEffect(() => {
    const getHeroBounds = () => {
      const els = document.querySelectorAll<HTMLElement>("[data-hero-section]");
      if (!els.length) return { top: 0, bottom: 0 };

      const first = els[0].getBoundingClientRect().top + window.scrollY;
      const last = els[els.length - 1].getBoundingClientRect().bottom + window.scrollY;
      return { top: first, bottom: last };
    };

    const onWheel = (e: WheelEvent) => {
      const { top, bottom } = getHeroBounds();
      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      if (scrollY < top - 10 || scrollY >= bottom - vh + 10) return;

      const els = document.querySelectorAll<HTMLElement>("[data-hero-section]");
      const count = els.length;

      if (isSnappingRef.current) {
        e.preventDefault();
        return;
      }

      const dir = e.deltaY > 0 ? 1 : -1;
      const next = snapIndexRef.current + dir;

      if (next >= 0 && next < count) {
        e.preventDefault();
        snapTo(next);
      } else if (next >= count) {
        isSnappingRef.current = false;
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0].clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      const { top, bottom } = getHeroBounds();
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      if (scrollY < top - 10 || scrollY >= bottom - vh + 10) return;
      if (isSnappingRef.current) return;

      const dy = touchStartYRef.current - e.changedTouches[0].clientY;
      if (Math.abs(dy) < 30) return;

      const els = document.querySelectorAll<HTMLElement>("[data-hero-section]");
      const count = els.length;
      const dir = dy > 0 ? 1 : -1;
      const next = snapIndexRef.current + dir;

      if (next >= 0 && next < count) {
        snapTo(next);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [snapTo]);

  useEffect(() => {
    const onScroll = () => {
      const vh = window.innerHeight;
      const els = document.querySelectorAll("[data-hero-section]");
      let best = 0;
      let bestDist = Infinity;
      let anyVisible = false;

      els.forEach((el, i) => {
        const rect = el.getBoundingClientRect();
        const p = (vh - rect.top) / (vh + rect.height);
        if (p > 0.1 && p < 0.9) anyVisible = true;
        const d = Math.abs(p - 0.5);
        if (d < bestDist && p > 0.05 && p < 0.95) {
          bestDist = d;
          best = i;
        }
      });

      if (!isSnappingRef.current) snapIndexRef.current = best;
      setActiveIndex(best);
      setHeroVisible(anyVisible);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={wrapperRef}>
      <div
        className="fixed left-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3 transition-opacity duration-500"
        style={{ opacity: heroVisible ? 1 : 0 }}
      >
        {SECTIONS.map((_, i) => (
          <button
            key={i}
            onClick={() => snapTo(i)}
            className={`w-2 rounded-full transition-all duration-500 cursor-pointer hover:bg-primary/70 ${
              i === activeIndex ? "h-8 bg-primary" : "h-2 bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>

      {SECTIONS.map((section) => (
        <HeroPanel key={section.id} section={section} />
      ))}
    </div>
  );
}
