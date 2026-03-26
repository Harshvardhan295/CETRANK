import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FloatingParticles } from "@/components/effects/FloatingParticles";
import { AuroraBackground } from "@/components/effects/AuroraBackground";
import gsap from "gsap";

const stats = [
  { value: "4L+", numericValue: 400000, label: "Data Points" },
  { value: "500+", numericValue: 500, label: "Colleges" },
  { value: "3", numericValue: 3, label: "CAP Rounds" },
];

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 2.5,
      delay: 1,
      ease: "power2.out",
      onUpdate: () => {
        if (ref.current) {
          if (target >= 100000) {
            ref.current.textContent = Math.round(obj.val / 100000) + "L" + suffix;
          } else if (target >= 1000) {
            ref.current.textContent = Math.round(obj.val).toString() + suffix;
          } else {
            ref.current.textContent = Math.round(obj.val).toString() + suffix;
          }
        }
      },
    });
  }, [target, suffix]);

  return <span ref={ref}>0</span>;
}

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100vh] flex items-center justify-center overflow-hidden"
    >
      {/* Background layers */}
      <div className="absolute inset-0 grid-pattern" />
      <AuroraBackground />

      {/* Floating Particles */}
      <FloatingParticles count={40} />

      {/* Content */}
      <motion.div
        style={{ y: textY, opacity: textOpacity, scale }}
        className="relative z-10 max-w-5xl mx-auto px-4 text-center"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass mb-8 text-sm font-medium text-muted-foreground"
        >
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="w-4 h-4 text-primary" />
          </motion.div>
          <span>Powered by AI</span>
          <span className="w-1 h-1 rounded-full bg-primary/50" />
          <span>4 Lakh+ Data Points</span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          className="text-5xl sm:text-6xl md:text-8xl font-extrabold tracking-tight mb-6 leading-[1.05] font-['Outfit']"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.span
            initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="block"
          >
            Your Admission
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="block text-gradient"
          >
            Intelligence Engine
          </motion.span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Navigate Maharashtra CET counselling with{" "}
          <span className="text-foreground font-medium">AI-powered predictions</span>,
          real-time cutoff analysis, and personalized college recommendations.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/dashboard">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="lg"
                className="text-base px-8 py-6 rounded-2xl glow-primary animate-glow-pulse group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </Button>
            </motion.div>
          </Link>
          <a href="#features">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 py-6 rounded-2xl glass border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all"
              >
                Explore Features
              </Button>
            </motion.div>
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-20 grid grid-cols-3 gap-8 max-w-md mx-auto"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center"
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="text-3xl md:text-4xl font-bold text-gradient-static font-mono-display tabular-nums">
                <AnimatedCounter
                  target={stat.numericValue}
                  suffix={stat.value.includes("+") ? "+" : ""}
                />
              </div>
              <div className="text-xs md:text-sm text-muted-foreground mt-1.5 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs text-muted-foreground font-medium tracking-wider uppercase">
            Scroll
          </span>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </motion.div>
      </motion.div>
    </section>
  );
}
