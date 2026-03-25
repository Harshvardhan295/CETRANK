import { motion, AnimatePresence } from "framer-motion";
import { CollegeCard } from "./CollegeCard";
import { Skeleton } from "@/components/ui/skeleton";
import { GraduationCap } from "lucide-react";

interface CollegeResultsProps {
  results: any[];
  isLoading: boolean;
  hasSearched: boolean;
}

export function CollegeResults({ results, isLoading, hasSearched }: CollegeResultsProps) {
  if (isLoading) {
    return (
      <div className="space-y-3 relative">
        {/* Scanner animation */}
        <motion.div
          initial={{ top: 0 }}
          animate={{ top: "100%" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent z-10 rounded-full"
        />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="glass rounded-xl p-4 space-y-3">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-3 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-12 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!hasSearched) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <GraduationCap className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Configure Your Profile</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Set your filters above and click "Find Colleges" to see personalized recommendations.
        </p>
      </motion.div>
    );
  }

  if (results.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <p className="text-muted-foreground">No results found. Try adjusting your filters.</p>
      </motion.div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-muted-foreground">
          {results.length} college{results.length !== 1 ? "s" : ""} found
        </span>
      </div>
      <AnimatePresence mode="popLayout">
        <div className="space-y-3">
          {results.slice(0, 50).map((college, index) => (
            <CollegeCard key={index} college={college} index={index} />
          ))}
        </div>
      </AnimatePresence>
      {results.length > 50 && (
        <p className="text-xs text-muted-foreground text-center mt-4">
          Showing top 50 of {results.length} results
        </p>
      )}
    </div>
  );
}
