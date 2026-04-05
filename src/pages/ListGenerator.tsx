import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { CollegeResults } from "@/components/dashboard/CollegeResults";
import { AISidebar } from "@/components/dashboard/AISidebar";
import { getEligibleCutoffs } from "@/lib/api";
import type { CutoffRequest } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import gsap from "gsap";

const ListGenerator = () => {
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!headerRef.current) return;
    gsap.from(headerRef.current.children, {
      y: 30,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: "power3.out",
    });
  }, []);

  const handleSearch = async (filters: CutoffRequest) => {
    setIsLoading(true);
    setHasSearched(true);
    try {
      const list = await getEligibleCutoffs(filters);
      setResults(list);
      if (list.length === 0) {
        toast({
          title: "No results",
          description: "Try adjusting your filters for more options.",
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description:
          "Failed to fetch results. The server might be starting up - try again in a moment.",
        variant: "destructive",
      });
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 grid-pattern pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-b from-primary/3 via-transparent to-transparent pointer-events-none" />

      <Navbar />
      <div className="relative pt-24 pb-12 px-4 max-w-6xl mx-auto">
        <div ref={headerRef} className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-semibold text-primary uppercase tracking-wider mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Live Engine
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-['Outfit']">
            Prediction <span className="text-gradient">List Generator</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-lg">
            Configure your profile, discover eligible colleges, and get AI-powered
            probability assessments.
          </p>
        </div>

        <div className="space-y-6">
          <FilterBar onSearch={handleSearch} isLoading={isLoading} />

          <motion.div layout>
            <CollegeResults
              results={results}
              isLoading={isLoading}
              hasSearched={hasSearched}
            />
          </motion.div>
        </div>
      </div>

      <AISidebar />
    </div>
  );
};

export default ListGenerator;
