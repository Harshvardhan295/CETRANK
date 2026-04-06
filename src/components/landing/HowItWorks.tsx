import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { UserCheck, SlidersHorizontal, GraduationCap, CheckCircle2, Radar, Sparkles } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    icon: UserCheck,
    title: "Enter Your Profile",
    description:
      "Provide your percentile, category, home university, and preferences. Our engine validates your eligibility criteria instantly.",
    color: "from-blue-500 to-blue-700",
    num: "01",
  },
  {
    icon: SlidersHorizontal,
    title: "AI Analyzes & Filters",
    description:
      "Our engine cross-references 4L+ cutoff records against CET Cell allocation rules, generating probability scores for each option.",
    color: "from-sky-500 to-cyan-600",
    num: "02",
  },
  {
    icon: GraduationCap,
    title: "Get Ranked Results",
    description:
      "Receive a probability-ranked college list personalized for your profile, with detailed reasoning and historical trend data.",
    color: "from-teal-500 to-emerald-600",
    num: "03",
  },
];

function StepCard({
  step,
  index,
}: {
  step: (typeof steps)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      <div className="flex items-start gap-6 md:gap-8">
        {/* Number + timeline dot */}
        <div className="relative flex flex-col items-center shrink-0">
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: index * 0.2 + 0.3,
            }}
            className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg relative`}
            style={{
              boxShadow: isInView
                ? `0 8px 30px ${index === 0 ? "rgba(37,99,235,0.3)" : index === 1 ? "rgba(14,165,233,0.3)" : "rgba(20,184,166,0.3)"}`
                : "none",
            }}
          >
            <step.icon className="w-7 h-7 text-white" />

            {/* Pulse ring */}
            <motion.div
              initial={{ scale: 1, opacity: 0.4 }}
              animate={isInView ? { scale: [1, 1.6], opacity: [0.4, 0] } : {}}
              transition={{
                duration: 1.5,
                delay: index * 0.2 + 0.5,
                repeat: Infinity,
                ease: "easeOut",
              }}
              className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.color}`}
            />
          </motion.div>

          {/* Connecting line */}
          {index < steps.length - 1 && (
            <motion.div
              initial={{ height: 0 }}
              animate={isInView ? { height: "100%" } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 + 0.5 }}
              className="w-px bg-gradient-to-b from-border to-transparent mt-4 min-h-[60px]"
            />
          )}
        </div>

        {/* Content */}
        <div className="pt-2 pb-12">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-mono font-bold text-primary tracking-wider">
              STEP {step.num}
            </span>
            <motion.div
              initial={{ width: 0 }}
              animate={isInView ? { width: 40 } : {}}
              transition={{ duration: 0.5, delay: index * 0.2 + 0.4 }}
              className="h-px bg-primary/30"
            />
          </div>
          <h3 className="text-xl md:text-2xl font-bold mb-2">{step.title}</h3>
          <p className="text-muted-foreground leading-relaxed max-w-md">
            {step.description}
          </p>

          {/* Mini checklist */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: index * 0.2 + 0.6 }}
            className="mt-4 flex items-center gap-2 text-xs text-emerald-500 font-medium"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Instant Validation</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".how-title", {
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="how-it-works" ref={sectionRef} className="py-28 px-4 relative">
      <div className="absolute inset-0 dot-pattern opacity-50 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        <div className="how-title text-center mb-16">
          <div className="section-badge mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            Process
          </div>
          <h2 className="section-title">
            How it <span className="text-gradient">works</span>
          </h2>
          <p className="section-copy max-w-2xl mx-auto mt-4">
            The flow keeps the hard parts structured: collect the right inputs, filter them against rule-aware logic, then review results in a format that is actually usable.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div className="relative">
            {steps.map((step, index) => (
              <StepCard key={step.title} step={step} index={index} />
            ))}
          </div>

          <div className="panel-surface sticky top-28 rounded-[34px] p-6">
            <div className="flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-primary">
              <Radar className="h-3.5 w-3.5" />
              Student flow
            </div>
            <h3 className="mt-3 text-2xl font-semibold text-foreground">
              Designed to reduce counselling overload.
            </h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Each step narrows ambiguity instead of adding more tabs, more tables, or more guesswork.
            </p>

            <div className="mt-6 space-y-3">
              {[
                "Collect only the profile signals that actually change eligibility.",
                "Translate those signals into a filtered, rankable result set.",
                "Surface the strongest options with better readability and next-step context.",
              ].map((item, index) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[0.7rem] font-semibold text-primary">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-6 text-slate-200/90">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[26px] border border-white/10 bg-slate-950/55 p-5">
              <div className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Outcome
              </div>
              <div className="mt-2 text-lg font-semibold text-foreground">
                Better shortlists with less second-guessing.
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Cleaner filters", "Readable results", "Faster refinement"].map((item) => (
                  <div
                    key={item}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200/85"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
