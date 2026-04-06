import { Navbar } from "@/components/Navbar";
import { ScrollHero } from "@/components/landing/ScrollHero";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { ArrowRight, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { AppLogo } from "@/components/AppLogo";
import { SiteBackdrop } from "@/components/effects/SiteBackdrop";

function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section ref={ref} className="px-4 py-28 relative overflow-hidden">
      <div className="mx-auto max-w-5xl relative">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="panel-surface relative overflow-hidden rounded-[36px] noise"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_32%),radial-gradient(circle_at_80%_20%,_rgba(45,212,191,0.16),_transparent_28%)]" />
          <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent)] lg:block" />

          <div className="relative grid gap-8 p-8 md:p-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:p-16">
            <div className="text-center lg:text-left">
              <div className="section-badge mb-6">
                <Sparkles className="h-3.5 w-3.5" />
                Ready To Launch
              </div>
              <AppLogo
                className="mx-auto mb-6 w-fit lg:mx-0"
                imageClassName="h-16 w-16 rounded-[24px]"
                textClassName="text-left"
              />

              <h2 className="section-title max-w-2xl">
                Turn raw cutoff data into a <span className="text-gradient">confident shortlist</span>.
              </h2>
              <p className="section-copy mt-4 max-w-xl text-center lg:text-left">
                Start exploring personalised recommendations, probability-led college matches, and a cleaner counselling workflow built for speed.
              </p>

              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
                <Link to="/list-generator">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-block"
                  >
                    <Button
                      size="lg"
                      className="group relative h-14 rounded-2xl px-8 text-base glow-primary overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        Launch List Generator
                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </span>
                      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    </Button>
                  </motion.div>
                </Link>

                <div className="hero-chip">
                  <ShieldCheck className="h-4 w-4 text-emerald-300" />
                  Built for CAP-round decision making
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {[
                {
                  icon: TrendingUp,
                  label: "Data confidence",
                  value: "4L+ records analysed",
                },
                {
                  icon: ShieldCheck,
                  label: "Rule-aware logic",
                  value: "Category and quota sensitive",
                },
                {
                  icon: Sparkles,
                  label: "Shortlist quality",
                  value: "Faster compare, clearer next step",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[26px] border border-white/10 bg-white/5 p-5"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/12">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        {item.label}
                      </div>
                      <div className="mt-1 text-sm font-semibold text-foreground">
                        {item.value}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

function Footer() {
  return (
    <footer className="relative px-4 pb-10 pt-6">
      <div className="mx-auto max-w-6xl rounded-[32px] border border-white/10 bg-white/5 px-6 py-8 backdrop-blur-xl md:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <AppLogo imageClassName="h-10 w-10 rounded-[18px]" />
            <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">
              CETRANK helps students move from uncertainty to a shortlist they can actually use during counselling.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
            <Link to="/#features" className="transition-colors hover:text-foreground">
              Features
            </Link>
            <Link to="/#how-it-works" className="transition-colors hover:text-foreground">
              How It Works
            </Link>
            <Link to="/list-generator" className="transition-colors hover:text-foreground">
              List Generator
            </Link>
          </div>

          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            2026 CETRANK.IN
          </p>
        </div>
      </div>
    </footer>
  );
}

const Index = () => {
  return (
    <div className="app-shell">
      <SiteBackdrop particleCount={14} />
      <div className="relative z-10">
        <Navbar />
        <ScrollHero />
        <FeaturesGrid />
        <HowItWorks />
        <TestimonialsSection />
        <CTASection />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
