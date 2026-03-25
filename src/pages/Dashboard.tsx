import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { CollegeResults } from "@/components/dashboard/CollegeResults";
import { AISidebar } from "@/components/dashboard/AISidebar";
import { ReportCenter } from "@/components/dashboard/ReportCenter";
import { getEligibleCutoffs } from "@/lib/api";
import type { CutoffRequest } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (filters: CutoffRequest) => {
    setIsLoading(true);
    setHasSearched(true);
    try {
      const data = await getEligibleCutoffs(filters);
      const list = Array.isArray(data) ? data : data?.results || data?.colleges || [];
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
        description: "Failed to fetch results. The server might be starting up — try again in a moment.",
        variant: "destructive",
      });
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid-pattern">
      <Navbar />
      <div className="pt-20 pb-12 px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl md:text-3xl font-bold">
            Prediction <span className="text-gradient">Dashboard</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure your profile and discover eligible colleges.
          </p>
        </motion.div>

        <div className="space-y-6">
          <FilterBar onSearch={handleSearch} isLoading={isLoading} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CollegeResults
                results={results}
                isLoading={isLoading}
                hasSearched={hasSearched}
              />
            </div>
            <div>
              <ReportCenter hasResults={hasSearched && results.length > 0} />
            </div>
          </div>
        </div>
      </div>

      <AISidebar />
    </div>
  );
};

export default Dashboard;
