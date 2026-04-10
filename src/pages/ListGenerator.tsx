import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { CollegeResults } from "@/components/dashboard/CollegeResults";
import { AISidebar } from "@/components/dashboard/AISidebar";
import { getEligibleCutoffs } from "@/lib/api";
import type { CollegeResult, CutoffRequest } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { BrainCircuit, ClipboardList, Sparkles, Target } from "lucide-react";
import gsap from "gsap";
import { SiteBackdrop } from "@/components/effects/SiteBackdrop";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { downloadCollegeListPdf } from "@/lib/collegePdf";

const ListGenerator = () => {
  const { user } = useAuth(); // Access the authenticated user
  const [results, setResults] = useState<CollegeResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [lastFilters, setLastFilters] = useState<CutoffRequest | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  
  const totalResults = results.length;
  const topCity =
    results
      .map((college) => college.city || college.City)
      .filter(Boolean)
      .reduce<Record<string, number>>((acc, city) => {
        acc[city] = (acc[city] || 0) + 1;
        return acc;
      }, {});
      
  const leadingCity =
    Object.entries(topCity).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Awaiting results";
    
  const topBranchMap =
    results
      .map((college) => college.branch_name || college.Branch || college.branch)
      .filter(Boolean)
      .reduce<Record<string, number>>((acc, branch) => {
        acc[branch] = (acc[branch] || 0) + 1;
        return acc;
      }, {});
      
  const leadingBranch =
    Object.entries(topBranchMap).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Branch mix updates after search";

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
    setLastFilters(filters);
    try {
      // 1. Fetch data from your backend
      const list = await getEligibleCutoffs(filters);
      setResults(list);
      
      if (list.length === 0) {
        toast({
          title: "No results",
          description: "Try adjusting your filters for more options.",
        });
        return; // Exit early if no results
      }

      // 2. Save the successful results to Supabase history
      if (user && list.length > 0) {
        const { error } = await supabase
          .from("college_lists")
          .insert({
            user_id: user.id,
            list_data: list // Saving the array of objects as JSONB
          });

        if (error) {
          console.error("Failed to save list to history:", error);
          toast({
            title: "History update failed",
            description: "Generated successfully, but couldn't save to your profile history.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Success",
            description: "List generated and saved securely to your profile!",
          });
        }
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

  const handleDownloadPdf = async () => {
    if (results.length === 0) {
      return;
    }

    setIsDownloadingPdf(true);

    try {
      downloadCollegeListPdf({ results, filters: lastFilters });
      toast({
        title: "PDF downloaded",
        description: `Saved ${results.length} college${results.length !== 1 ? "s" : ""} as a PDF.`,
      });
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      toast({
        title: "PDF export failed",
        description: "We couldn't generate the PDF for this list. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <div className="app-shell">
      <SiteBackdrop particleCount={12} variant="focused" />

      <Navbar />
      <div className="relative z-10 pt-28 pb-12 px-4 max-w-7xl mx-auto">
        <div ref={headerRef} className="mb-8">
          <div className="section-badge mb-5">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Live List Engine
          </div>
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="panel-surface p-6 md:p-8">
              <h1 className="text-3xl md:text-5xl font-bold font-['Outfit'] leading-tight tracking-tight">
                Build a sharper <span className="text-gradient">college shortlist</span>
              </h1>
              <p className="text-sm md:text-base text-muted-foreground mt-3 max-w-2xl leading-7">
                Configure your profile once, scan realistic options faster, and review a shortlist that feels more like a decision workspace than a spreadsheet.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  {
                    icon: BrainCircuit,
                    label: "Profile-aware",
                    value: "Category + branch logic",
                  },
                  {
                    icon: Target,
                    label: "Current status",
                    value: hasSearched ? `${totalResults} results loaded` : "Ready to search",
                  },
                  {
                    icon: ClipboardList,
                    label: "Best coverage",
                    value: leadingCity,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-border/70 bg-white/75 p-4"
                  >
                    <item.icon className="w-4 h-4 text-primary mb-3" />
                    <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      {item.label}
                    </div>
                    <div className="mt-1 text-sm font-semibold text-foreground">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-[28px] border border-border/70 bg-slate-50/90 p-5">
                <div className="flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  Current signal
                </div>
                <div className="mt-2 text-lg font-semibold text-foreground">
                  {leadingBranch}
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Use the filter controls below to tighten the shortlist, then compare result cards for fit, probability, and trend context.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {[
                {
                  title: "1. Set Filters",
                  description: "Start with category, university, percentile and branch preferences.",
                },
                {
                  title: "2. Review Matches",
                  description: "Scan strongest colleges first, then expand cards for details.",
                },
                {
                  title: "3. Refine Fast",
                  description: "Adjust percentile or branch toggles to tighten the final shortlist.",
                },
              ].map((step, index) => (
                <div
                  key={step.title}
                  className="glass rounded-[28px] border border-border/70 p-5"
                >
                  <div className="flex items-center gap-2 text-primary mb-3">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-[11px] font-semibold uppercase tracking-[0.22em]">
                      Step {index + 1}
                    </span>
                  </div>
                  <h2 className="text-base font-semibold">{step.title}</h2>
                  <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <FilterBar onSearch={handleSearch} isLoading={isLoading} />

          <motion.div layout className="space-y-4">
            <CollegeResults
              results={results}
              isLoading={isLoading}
              hasSearched={hasSearched}
              onDownloadPdf={handleDownloadPdf}
              isDownloadingPdf={isDownloadingPdf}
            />
          </motion.div>
        </div>
      </div>

      <AISidebar />
    </div>
  );
};

export default ListGenerator;
