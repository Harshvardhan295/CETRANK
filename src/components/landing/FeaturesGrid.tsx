import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Brain, Filter, FileText, BarChart3, ArrowUpRight, Radar, Sparkles } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: BarChart3,
    title: "Prediction Engine",
    description:
      "Confidence-led recommendation cards paired with historical cutoff framing, so every option is easier to evaluate quickly.",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-600",
    tag: "Confidence",
    bullets: ["Probability-led ranking", "Historical context", "Faster compare flow"],
  },
  {
    icon: Brain,
    title: "AI Counselor",
    description:
      "A guided assistant surface that helps translate profile inputs and counselling logic into clearer next actions.",
    iconBg: "bg-sky-500/10",
    iconColor: "text-sky-500",
    tag: "Guided",
    bullets: ["Intent-aware prompts", "Friendly explanations", "Decision support"],
  },
  {
    icon: Filter,
    title: "Smart Filters",
    description:
      "Structured filters keep category, university, percentile, and branch selection in one compact flow instead of scattered controls.",
    iconBg: "bg-teal-500/10",
    iconColor: "text-teal-500",
    tag: "Focused",
    bullets: ["Compact workflow", "Fewer dead ends", "Clearer active state"],
  },
  {
    icon: FileText,
    title: "Explainable Reports",
    description:
      "Results are packaged like a decision brief with readable structure, quick-read insights, and a more professional presentation.",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-500",
    tag: "Readable",
    bullets: ["Clean summaries", "Better information hierarchy", "Presentation-ready"],
  },
];

export function FeaturesGrid() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !cardsRef.current) return;

    const cards = cardsRef.current.querySelectorAll(".feature-card");

    const ctx = gsap.context(() => {
      // Title animation
      gsap.from(sectionRef.current!.querySelector(".features-title"), {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      // Cards stagger
      gsap.from(cards, {
        y: 80,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="features" ref={sectionRef} className="py-28 px-4 relative">
      <div className="absolute inset-0 bg-gradient-radial opacity-50 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        <div className="features-title text-center mb-16">
          <motion.div className="section-badge mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            Features
          </motion.div>
          <h2 className="section-title">
            Built for <span className="text-gradient">precision under pressure</span>
          </h2>
          <p className="section-copy max-w-2xl mx-auto mt-4">
            The product is designed to lower noise, increase confidence, and help students reach better shortlist decisions faster.
          </p>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          {[
            { label: "Cutoff intelligence", value: "4L+ mapped records" },
            { label: "Counselling coverage", value: "3 CAP rounds guided" },
            { label: "Decision style", value: "Fast, readable, profile-aware" },
          ].map((item) => (
            <div key={item.label} className="rounded-[26px] border border-white/10 bg-white/5 p-5">
              <div className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                {item.label}
              </div>
              <div className="mt-2 text-base font-semibold text-foreground">{item.value}</div>
            </div>
          ))}
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="feature-card group relative rounded-[30px] glass card-beam p-8 cursor-pointer"
            >
              <div
                className="absolute inset-0 rounded-[30px] bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 p-[1px]"
                style={{
                  background: `linear-gradient(135deg, hsl(var(--primary) / 0.2), transparent, hsl(var(--glow-secondary) / 0.2))`,
                  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                  padding: "1px",
                  borderRadius: "1.75rem",
                }}
              />

              <div className="flex items-start justify-between mb-5">
                <div
                  className={`w-14 h-14 rounded-2xl ${feature.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground bg-secondary/50 px-2.5 py-1 rounded-full">
                  {feature.tag}
                </span>
              </div>

              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {feature.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {feature.bullets.map((bullet) => (
                  <div
                    key={bullet}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200/85"
                  >
                    {bullet}
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Learn more
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 rounded-[32px] border border-white/10 bg-gradient-to-r from-primary/10 to-teal-400/10 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-primary">
                <Radar className="h-3.5 w-3.5" />
                UX outcome
              </div>
              <h3 className="mt-2 text-xl font-semibold text-foreground">
                A calmer, more professional shortlist experience from landing page to results.
              </h3>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-muted-foreground">
              Better hierarchy, better motion, better decision support.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
