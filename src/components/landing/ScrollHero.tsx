import { useState, useRef, useEffect, useCallback } from "react";
import { ArrowRight, Sparkles, Database, ShieldCheck, Rocket, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

type Effect = "blink" | "horizontal" | "backwards" | "zoom";

const SECTIONS = [
  {
    id: "hero-1",
    title: "Your Admission",
    subtitle: "Intelligence Engine",
    description: "Navigate Maharashtra CET counselling with AI-powered predictions and real-time cutoff analysis.",
    Icon: Sparkles,
    stats: "4 Lakh+ Data Points",
  },
  {
    id: "hero-2",
    title: "Precision",
    subtitle: "In Every Choice",
    description: "Our engine processes 500+ colleges across 3 CAP rounds to find your perfect match.",
    Icon: Database,
    stats: "500+ Colleges",
  },
  {
    id: "hero-3",
    title: "Trusted by",
    subtitle: "Thousands of Aspirants",
    description: "Built with ❤️ for Maharashtra CET aspirants. Join the community and secure your future.",
    Icon: ShieldCheck,
    stats: "Verified Data",
  },
  {
    id: "hero-cta",
    title: "Ready to",
    subtitle: "Refine Your Rank?",
    description: "",
    Icon: Rocket,
    stats: "",
    isCTA: true,
  },
];

/* ── Math helpers ── */
function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function interpolate(p: number, stops: [number, number][]): number {
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

/* ── Effect styles matching reference keyframes ── */
function computeStyles(raw: number, effect: Effect) {
  const p = easeInOut(raw);
  switch (effect) {
    case "blink":
      return {
        opacity: interpolate(p, [[0, 0], [0.5, 1], [1, 0]]),
        filter: `blur(${interpolate(p, [[0, 8], [0.5, 0], [1, 8]])}px) contrast(${interpolate(p, [[0, 4], [0.5, 1], [1, 4]])})`,
        transform: "none",
      };
    case "horizontal":
      return {
        opacity: 1,
        filter: "none",
        transform: `translate3d(${interpolate(p, [[0, 100], [0.5, 0], [1, -100]])}%, 0, 0)`,
      };
    case "backwards":
      return {
        opacity: 1,
        filter: "none",
        transform: `translate3d(0, ${interpolate(p, [[0, -100], [0.5, 0], [1, 100]])}%, 0)`,
      };
    case "zoom":
    default:
      return {
        opacity: interpolate(p, [[0, 0], [0.5, 1], [1, 0]]),
        filter: `blur(${interpolate(p, [[0, 80], [0.5, 0], [1, 48]])}px)`,
        transform: `scale(${interpolate(p, [[0, 0], [0.5, 1], [1, 1.5]])})`,
      };
  }
}

/* ── Single section panel ── */
function HeroPanel({
  section,
  effect,
}: {
  section: (typeof SECTIONS)[number];
  effect: Effect;
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
      const s = computeStyles(raw, effect);
      con.style.opacity = String(s.opacity);
      con.style.filter = s.filter;
      con.style.transform = s.transform;
      con.style.visibility = raw > 0.02 && raw < 0.98 ? "visible" : "hidden";
      con.style.pointerEvents = raw > 0.35 && raw < 0.65 ? "auto" : "none";
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, [effect]);

  const { Icon } = section;
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
            <div className="flex justify-center mb-8">
              <div className="p-4 rounded-3xl glass-strong border-primary/20">
                <Icon className="w-12 h-12 text-primary" />
              </div>
            </div>
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
              <Link to="/dashboard">
                <Button size="lg" className="rounded-2xl px-12 py-8 text-lg glow-primary animate-glow-pulse group">
                  Launch Dashboard
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

/* ── Main component ── */
export function ScrollHero() {
  const [effect, setEffect] = useState<Effect>("blink");
  const [activeIndex, setActiveIndex] = useState(0);
  const [heroVisible, setHeroVisible] = useState(true);

  // Refs for snap logic
  const snapIndexRef = useRef(0);
  const isSnappingRef = useRef(false);
  const touchStartYRef = useRef(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Programmatic snap to a section by index
  const snapTo = useCallback((index: number) => {
    const els = document.querySelectorAll<HTMLElement>("[data-hero-section]");
    if (!els[index]) return;
    isSnappingRef.current = true;
    const top = els[index].getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top, behavior: "smooth" });
    snapIndexRef.current = index;
    // Release lock after smooth scroll settles
    setTimeout(() => { isSnappingRef.current = false; }, 800);
  }, []);

  // Wheel interceptor — only active when inside the hero range
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

      // Not inside hero range at all — let browser handle it
      if (scrollY < top - 10 || scrollY >= bottom - vh + 10) return;

      const els = document.querySelectorAll<HTMLElement>("[data-hero-section]");
      const count = els.length;

      if (isSnappingRef.current) {
        // Block scroll while snapping animation is running
        e.preventDefault();
        return;
      }

      const dir = e.deltaY > 0 ? 1 : -1;
      const next = snapIndexRef.current + dir;

      if (next >= 0 && next < count) {
        // Snap to next section within hero
        e.preventDefault();
        snapTo(next);
      } else if (next >= count) {
        // Past the last section — release to normal scroll
        // Don't preventDefault; let the browser proceed naturally
        isSnappingRef.current = false;
      }
      // next < 0 means scrolling up past beginning, also release
    };

    // Touch support
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
      if (Math.abs(dy) < 30) return; // ignore small swipes

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

  // Track active section for dots + visibility
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

      // Keep snapIndexRef in sync in case user used keyboard/scrollbar
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
      {/* Effect Toggle */}
      <div
        className="fixed top-24 right-8 z-50 flex flex-col gap-3 glass p-3 rounded-2xl border-primary/20 transition-opacity duration-500"
        style={{ opacity: heroVisible ? 1 : 0, pointerEvents: heroVisible ? "auto" : "none" }}
      >
        {(["blink", "horizontal", "backwards", "zoom"] as const).map((e) => (
          <label key={e} className="flex items-center gap-3 cursor-pointer group">
            <input
              type="radio"
              name="hero-effect"
              className="sr-only"
              checked={effect === e}
              onChange={() => setEffect(e)}
            />
            <div className={`h-3 rounded-full transition-all duration-300 ${effect === e ? "w-6 bg-primary glow-primary" : "w-3 bg-muted"}`} />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
              {e === "horizontal" ? "H-Scroll" : e === "backwards" ? "Reverse" : e}
            </span>
          </label>
        ))}
      </div>

      {/* Progress Dots */}
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

      {/* Sections — 100dvh spacers that drive the fixed-panel animations */}
      {SECTIONS.map((section) => (
        <HeroPanel key={section.id} section={section} effect={effect} />
      ))}
    </div>
  );
}
