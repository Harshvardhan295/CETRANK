import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Brain, Filter, FileText, BarChart3, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: BarChart3,
    title: "Prediction Engine",
    description:
      "AI-powered probability gauges with historical cutoff analysis across 3 years of CET data.",
    gradient: "from-blue-500/20 to-blue-600/20",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-600",
    tag: "Core",
  },
  {
    icon: Brain,
    title: "AI Counselor",
    description:
      "RAG-powered digital counselor that reasons through admission rules step-by-step.",
    gradient: "from-sky-500/20 to-cyan-500/20",
    iconBg: "bg-sky-500/10",
    iconColor: "text-sky-500",
    tag: "AI-Powered",
  },
  {
    icon: Filter,
    title: "Smart Filters",
    description:
      "Intelligent filtering by category, university, city, branch — recalculates 4L+ data points in real-time.",
    gradient: "from-teal-500/20 to-emerald-500/20",
    iconBg: "bg-teal-500/10",
    iconColor: "text-teal-500",
    tag: "Real-time",
  },
  {
    icon: FileText,
    title: "Explainable Reports",
    description:
      "Transparent recommendations with clear reasoning. Download detailed PDF reports for counselling.",
    gradient: "from-amber-500/20 to-orange-500/20",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-500",
    tag: "Transparent",
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
      {/* Subtle bg gradient */}
      <div className="absolute inset-0 bg-gradient-radial opacity-50 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        {/* Section header */}
        <div className="features-title text-center mb-16">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-semibold text-primary uppercase tracking-wider mb-6"
          >
            Features
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 font-['Outfit']">
            Built for{" "}
            <span className="text-gradient">Precision</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Every feature designed to eliminate uncertainty from your admission journey.
          </p>
        </div>

        {/* Cards grid */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="feature-card group relative rounded-2xl glass card-beam p-8 cursor-pointer"
            >
              {/* Gradient border on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 p-[1px]"
                style={{ 
                  background: `linear-gradient(135deg, hsl(var(--primary) / 0.2), transparent, hsl(var(--glow-secondary) / 0.2))`,
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                  padding: '1px',
                  borderRadius: '1rem',
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

              <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Learn more
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
