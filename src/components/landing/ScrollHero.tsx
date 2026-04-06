import { useRef, useEffect, useCallback, useState } from "react";
import { ArrowRight, Database, FileText, Radar, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SiteBackdrop } from "@/components/effects/SiteBackdrop";

const SECTIONS = [
  {
    id: "intelligence",
    title: "CETRANK",
    subtitle: "The admission intelligence layer",
    description:
      "Navigate Maharashtra CET counselling with a product that converts dense cutoff data into a calmer, clearer shortlist workflow.",
    stats: "4 Lakh+ Data Points",
    highlights: ["Profile-aware ranking", "Faster shortlist building", "Confidence-first UX"],
    metrics: [
      { label: "Coverage", value: "4L+ records" },
      { label: "Audience", value: "Engineering + Pharmacy" },
      { label: "Focus", value: "Actionable CAP decisions" },
    ],
  },
  {
    id: "logic",
    title: "Rule-Aware",
    subtitle: "Mirrors CET cell logic",
    description:
      "The engine reasons through category priorities, quota rules, and fallback paths so your recommendations feel reliable, not random.",
    stats: "RAG-Powered Accuracy",
    highlights: ["Quota-sensitive matching", "Priority and fallback aware", "Explainable decision trail"],
    metrics: [
      { label: "Validation", value: "Seat-type aware" },
      { label: "Logic", value: "Rule-first filtering" },
      { label: "Outcome", value: "Cleaner eligible set" },
    ],
  },
  {
    id: "counsellor",
    title: "Digital Counsellor",
    subtitle: "Adaptive round strategy",
    description:
      "From aspirational early-round exploration to realistic final-round choices, the experience stays aligned with how students actually decide.",
    stats: "3 CAP Rounds Supported",
    highlights: ["Ambitious to safe balancing", "Round-by-round adjustments", "Less guesswork under pressure"],
    metrics: [
      { label: "CAP rounds", value: "Round 1 to 3" },
      { label: "Mode", value: "Guided refinement" },
      { label: "Benefit", value: "Reduced shortlist fatigue" },
    ],
  },
  {
    id: "features",
    title: "Precision Reports",
    subtitle: "Engineering and pharmacy ready",
    description:
      "Capture ranked options, branch context, and supporting signals in a format that feels closer to a professional decision brief than a raw table.",
    stats: "Multi-Stream Support",
    highlights: ["Readable result cards", "Branch-level context", "Professional presentation"],
    metrics: [
      { label: "Exports", value: "Decision-ready summaries" },
      { label: "Streams", value: "B.E. / B.Tech / B.Pharm" },
      { label: "Signal", value: "Historical cutoff framing" },
    ],
  },
  {
    id: "hero-cta",
    title: "Ready to",
    subtitle: "Refine your rank?",
    description: "",
    stats: "",
    isCTA: true,
    highlights: ["Start with your profile", "Explore realistic options", "Refine faster with confidence"],
    metrics: [
      { label: "Setup", value: "Under a minute" },
      { label: "Flow", value: "Search, review, refine" },
      { label: "Goal", value: "Shortlist with clarity" },
    ],
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
        <SiteBackdrop particleCount={10} className="opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.06),transparent_18%),radial-gradient(circle_at_80%_28%,rgba(45,212,191,0.08),transparent_20%)]" />

        <div className="relative flex h-full items-center justify-center p-6 pt-28">
          <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="max-w-3xl text-center lg:text-left">
              <div className="section-badge mb-6">
                <Sparkles className="h-3.5 w-3.5" />
                {section.stats || "Interactive counselling flow"}
              </div>

              <h2 className="font-['Outfit'] text-5xl font-black tracking-[-0.05em] md:text-7xl lg:text-[5.5rem]">
                <span className="block text-foreground">{section.title}</span>
                <span className="block text-gradient">{section.subtitle}</span>
              </h2>

              {section.description && (
                <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground md:text-[1.35rem] lg:mx-0 mx-auto">
                  {section.description}
                </p>
              )}

              <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
                {section.highlights.map((item) => (
                  <div key={item} className="hero-chip">
                    <ShieldCheck className="h-4 w-4 text-teal-300" />
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
                {isCTASection ? (
                  <Link to="/list-generator">
                    <Button
                      size="lg"
                      className="group h-14 rounded-2xl px-8 text-base glow-primary animate-glow-pulse"
                    >
                      Launch List Generator
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                ) : (
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white/5 px-5 py-2 text-sm text-primary">
                    <Zap className="h-4 w-4" />
                    {section.stats}
                  </div>
                )}

                <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-muted-foreground">
                  Product-led counselling for focused, faster decisions
                </div>
              </div>
            </div>

            <div className="panel-surface relative overflow-hidden rounded-[36px] p-5 sm:p-6">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.14),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent)]" />
              <div className="relative">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-primary">
                    {isCTASection ? <Radar className="h-3.5 w-3.5" /> : <Database className="h-3.5 w-3.5" />}
                    Experience Layer
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-muted-foreground">
                    {section.id.replace("-", " ")}
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {section.metrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="rounded-[24px] border border-white/10 bg-white/5 p-4"
                    >
                      <div className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        {metric.label}
                      </div>
                      <div className="mt-2 text-sm font-semibold text-foreground">
                        {metric.value}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-[28px] border border-white/10 bg-slate-950/60 p-5">
                  <div className="flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-primary">
                    <FileText className="h-3.5 w-3.5" />
                    What this screen improves
                  </div>
                  <div className="mt-4 space-y-3">
                    {section.highlights.map((item, index) => (
                      <div
                        key={item}
                        className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
                      >
                        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[0.7rem] font-semibold text-primary">
                          {index + 1}
                        </div>
                        <p className="text-sm leading-6 text-slate-200/90">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
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
        className="fixed left-8 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-3 transition-opacity duration-500 lg:flex"
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

      <div
        className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4 transition-opacity duration-500 lg:hidden"
        style={{ opacity: heroVisible ? 1 : 0 }}
      >
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/70 px-3 py-2 backdrop-blur-xl">
          {SECTIONS.map((_, i) => (
            <button
              key={i}
              onClick={() => snapTo(i)}
              className={`rounded-full transition-all duration-500 ${
                i === activeIndex ? "h-2 w-8 bg-primary" : "h-2 w-2 bg-white/25"
              }`}
            />
          ))}
        </div>
      </div>

      {SECTIONS.map((section) => (
        <HeroPanel key={section.id} section={section} />
      ))}
    </div>
  );
}
