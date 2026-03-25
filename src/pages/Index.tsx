import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesGrid />
      <HowItWorks />

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-24 px-4 text-center"
      >
        <div className="max-w-2xl mx-auto glass rounded-3xl p-12">
          <Zap className="w-10 h-10 text-primary mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Ready to find your college?
          </h2>
          <p className="text-muted-foreground mb-8">
            Start exploring personalized recommendations now.
          </p>
          <Link to="/dashboard">
            <Button size="lg" className="rounded-xl px-8 py-6 text-base glow-primary">
              Launch Dashboard
            </Button>
          </Link>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <p>CETRANK &copy; 2025 — Built with ❤️ for Maharashtra CET aspirants</p>
      </footer>
    </div>
  );
};

export default Index;
