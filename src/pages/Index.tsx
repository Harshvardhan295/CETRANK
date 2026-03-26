import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { Zap, ArrowRight, Github, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FloatingParticles } from "@/components/effects/FloatingParticles";

function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section
      ref={ref}
      className="py-28 px-4 relative overflow-hidden"
    >
      <div className="max-w-3xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple-500/10" />
          <div className="absolute inset-0 glass" />

          <div className="relative p-12 md:p-16 text-center">
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-purple-400 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/25">
                <Zap className="w-7 h-7 text-white" />
              </div>
            </motion.div>

            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-['Outfit']">
              Ready to find your{" "}
              <span className="text-gradient">dream college</span>?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
              Start exploring personalized recommendations powered by AI and
              4L+ data points.
            </p>

            <Link to="/dashboard">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-block"
              >
                <Button
                  size="lg"
                  className="rounded-2xl px-10 py-6 text-base glow-primary group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Launch Dashboard
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </Button>
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/50 py-12 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-400 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold">
              CET<span className="text-gradient-static">RANK</span>
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">
              How It Works
            </a>
            <Link to="/dashboard" className="hover:text-foreground transition-colors">
              Dashboard
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground">
            CETRANK &copy; 2025 — Built with ❤️ for Maharashtra CET aspirants
          </p>
        </div>
      </div>
    </footer>
  );
}

const Index = () => {
  return (
    <div className="min-h-screen relative">
      <Navbar />
      <HeroSection />
      <FeaturesGrid />
      <HowItWorks />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
