import { motion, AnimatePresence } from "framer-motion";
import { CollegeCard } from "./CollegeCard";
import { Skeleton } from "@/components/ui/skeleton";
import { GraduationCap, Search } from "lucide-react";

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
          transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
          className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent z-10 rounded-full shadow-lg shadow-primary/30"
        />
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-2xl p-5 space-y-3"
          >
            <div className="flex justify-between">
              <Skeleton className="h-4 w-52 rounded-lg" />
              <Skeleton className="h-4 w-24 rounded-lg" />
            </div>
            <Skeleton className="h-3 w-36 rounded-lg" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-14 rounded-full" />
              <Skeleton className="h-5 w-12 rounded-full" />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (!hasSearched) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center justify-center py-24 text-center"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600/10 to-teal-500/10 flex items-center justify-center mb-6 shadow-lg shadow-blue-600/5">
            <GraduationCap className="w-10 h-10 text-primary" />
          </div>
        </motion.div>
        <h3 className="text-xl font-bold mb-2 font-['Outfit']">Configure Your Profile</h3>
        <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
          Set your filters above and click{" "}
          <span className="text-primary font-medium">"Find Colleges"</span>{" "}
          to see personalized recommendations.
        </p>
      </motion.div>
    );
  }

  if (results.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-24 text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center mb-4">
          <Search className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">No results found. Try adjusting your filters.</p>
      </motion.div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm text-muted-foreground font-medium">
            {results.length} college{results.length !== 1 ? "s" : ""} found
          </span>
        </div>
      </div>
      <AnimatePresence mode="popLayout">
        <div className="space-y-3">
          {results.slice(0, 50).map((college, index) => (
            <CollegeCard key={index} college={college} index={index} />
          ))}
        </div>
      </AnimatePresence>
      {results.length > 50 && (
        <p className="text-xs text-muted-foreground text-center mt-6 font-medium">
          Showing top 50 of {results.length} results
        </p>
      )}
    </div>
  );
}
