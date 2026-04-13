import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { CollegeResults } from "@/components/dashboard/CollegeResults";
import { AISidebar } from "@/components/dashboard/AISidebar";
import { ApiError, getEligibleCutoffs } from "@/lib/api";
import type { CollegeResult, CutoffRequest } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import gsap from "gsap";
import { SiteBackdrop } from "@/components/effects/SiteBackdrop";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { downloadCollegeListPdf } from "@/lib/collegePdf";
import type { UserDetails } from "@/lib/api";

const ListGenerator = () => {
  const { user } = useAuth(); // Access the authenticated user
  const [results, setResults] = useState<CollegeResult[]>([]);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [lastFilters, setLastFilters] = useState<CutoffRequest | null>(null);
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
    setLastFilters(filters);
    console.log("[ListGenerator] handleSearch called with filters:", JSON.stringify(filters, null, 2));
    try {
      // 1. Fetch data from your backend
      const { results: list, user_details } = await getEligibleCutoffs(filters);
      console.log("[ListGenerator] getEligibleCutoffs returned", list.length, "results");
      setResults(list);
      setUserDetails(user_details);
      
      if (list.length === 0) {
        console.warn("[ListGenerator] Empty results — showing 'No results' toast");
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
      console.error("[ListGenerator] Error in handleSearch:", err);
      toast({
        title: "Error",
        description:
          err instanceof ApiError && err.detail
            ? err.detail
            : "Failed to fetch results. The server might be starting up - try again in a moment.",
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
      await downloadCollegeListPdf({ results, filters: lastFilters, userDetails });
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
      <div className="relative z-10 mx-auto max-w-7xl px-3 pb-24 pt-24 sm:px-4 sm:pb-12 sm:pt-28">
        <div ref={headerRef} className="mb-8">
          
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">

            
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
