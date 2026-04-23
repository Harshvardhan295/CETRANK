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
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { downloadCollegeListPdf } from "@/lib/collegePdf";
import type { UserDetails } from "@/lib/api";
import { Button } from "@/components/ui/button";

const ListGenerator = () => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [results, setResults] = useState<CollegeResult[]>([]);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [lastFilters, setLastFilters] = useState<CutoffRequest | null>(null);
  
  // Subscription / Credit States
  const [availableCredits, setAvailableCredits] = useState<number | null>(null);
  const [showPricingModal, setShowPricingModal] = useState(false);

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

  // Fetch User Credits on Mount
  useEffect(() => {
    const fetchCredits = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from("user_credits")
        .select("available_credits")
        .eq("user_id", user.id)
        .single();

      // If no row exists (PGRST116), create one with 0 credits
      if (error && error.code === 'PGRST116') {
        await supabase.from("user_credits").insert({ user_id: user.id, available_credits: 0 });
        setAvailableCredits(0);
      } else if (data) {
        setAvailableCredits(data.available_credits);
      }
    };
    fetchCredits();
  }, [user]);

  // Simulate Payment Success (Replace with Razorpay/Stripe webhook logic later)
  const simulatePayment = async (creditsToAdd: number) => {
    if (!user) return;
    const newTotal = (availableCredits || 0) + creditsToAdd;
    
    await supabase
      .from("user_credits")
      .update({ available_credits: newTotal })
      .eq("user_id", user.id);
      
    setAvailableCredits(newTotal);
    setShowPricingModal(false);
    toast({
      title: "Payment Successful",
      description: `Added ${creditsToAdd} list credits to your account!`,
    });
  };

  const handleSearch = async (filters: CutoffRequest) => {
    // 1. Check Credits BEFORE searching
    if (availableCredits !== null && availableCredits <= 0) {
      setShowPricingModal(true);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    setLastFilters(filters);
    
    try {
      const { results: list, user_details } = await getEligibleCutoffs(filters);
      setResults(list);
      setUserDetails(user_details);
      
      if (list.length === 0) {
        toast({
          title: "No results",
          description: "Try adjusting your filters for more options.",
        });
        return; 
      }

      if (user && list.length > 0) {
        // 2. Deduct 1 Credit
        const newCreditBalance = (availableCredits || 1) - 1;
        await supabase
          .from("user_credits")
          .update({ available_credits: newCreditBalance })
          .eq("user_id", user.id);
        setAvailableCredits(newCreditBalance);

        // 3. Save List to History
        const { error } = await supabase
          .from("college_lists")
          .insert({
            user_id: user.id,
            list_data: list 
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
            description: `List generated! You have ${newCreditBalance} credits remaining.`,
          });
        }
      }

    } catch (err) {
      console.error("[ListGenerator] Error in handleSearch:", err);
      toast({
        title: "Error",
        description: err instanceof ApiError && err.detail ? err.detail : "Failed to fetch results. Try again.",
        variant: "destructive",
      });
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (results.length === 0) return;
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
      <SiteBackdrop particleCount={isMobile ? 0 : 12} variant="focused" />
      <Navbar />
      
      <div className="relative z-10 mx-auto max-w-7xl px-3 pb-24 pt-24 sm:px-4 sm:pb-12 sm:pt-28">
        <div ref={headerRef} className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Admission Engine</h1>
            {user && (
              <div className="bg-primary/10 text-primary px-4 py-2 rounded-full font-medium text-sm">
                Credits Remaining: {availableCredits !== null ? availableCredits : "..."}
              </div>
            )}
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

      {/* Pricing Modal Overlay */}
      {showPricingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-background border rounded-xl shadow-2xl p-6 max-w-3xl w-full relative">
            <button 
              onClick={() => setShowPricingModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold text-center mb-2">Unlock Your College Lists</h2>
            <p className="text-center text-muted-foreground mb-8">
              You are out of credits. Choose a tier to generate highly accurate, AI-filtered college prediction lists.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Tier 1 */}
              <div className="border rounded-lg p-6 flex flex-col items-center hover:border-primary transition-colors">
                <h3 className="text-xl font-semibold">Basic</h3>
                <div className="text-3xl font-bold mt-4 mb-2">₹49</div>
                <p className="text-muted-foreground text-sm mb-6">1 List Generation</p>
                <Button className="w-full mt-auto" onClick={() => simulatePayment(1)}>Buy 1 Credit</Button>
              </div>
              
              {/* Tier 2 */}
              <div className="border-2 border-primary rounded-lg p-6 flex flex-col items-center relative transform md:-translate-y-4 bg-primary/5 shadow-lg">
                <div className="absolute top-0 transform -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                  Most Popular
                </div>
                <h3 className="text-xl font-semibold">Standard</h3>
                <div className="text-3xl font-bold mt-4 mb-2">₹129</div>
                <p className="text-muted-foreground text-sm mb-6">3 List Generations</p>
                <Button className="w-full mt-auto" onClick={() => simulatePayment(3)}>Buy 3 Credits</Button>
              </div>

              {/* Tier 3 */}
              <div className="border rounded-lg p-6 flex flex-col items-center hover:border-primary transition-colors">
                <h3 className="text-xl font-semibold">Pro</h3>
                <div className="text-3xl font-bold mt-4 mb-2">₹199</div>
                <p className="text-muted-foreground text-sm mb-6">5 List Generations</p>
                <Button className="w-full mt-auto" onClick={() => simulatePayment(5)}>Buy 5 Credits</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListGenerator;