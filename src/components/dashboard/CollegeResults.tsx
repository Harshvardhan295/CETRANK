import { motion, AnimatePresence } from "framer-motion";
import { CollegeCard } from "./CollegeCard";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpRight, GraduationCap, MapPin, Search, Sparkles, TrendingUp } from "lucide-react";
import type { CollegeResult } from "@/lib/api";

interface CollegeResultsProps {
  results: CollegeResult[];
  isLoading: boolean;
  hasSearched: boolean;
}

export function CollegeResults({ results, isLoading, hasSearched }: CollegeResultsProps) {
  const strongestMatch = results.reduce((best, college) => {
    const cutoff =
      college.CET_Percentile ??
      college.cet_percentile ??
      college.cutoff_percentile ??
      college.Percentile ??
      college.percentile ??
      0;

    return cutoff > best ? cutoff : best;
  }, 0);

  const uniqueCities = new Set(
    results.map((college) => college.city || college.City).filter(Boolean),
  ).size;
  const topCollege = results[0];
  const topCollegeName =
    topCollege?.college_name || topCollege?.College || topCollege?.Name || topCollege?.name;
  const topBranch = topCollege?.branch_name || topCollege?.Branch || topCollege?.branch;
  const topCity = topCollege?.city || topCollege?.City;

  if (isLoading) {
    return (
      <div className="space-y-3 relative">
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
        className="glass rounded-[32px] border border-white/10 flex flex-col items-center justify-center py-24 px-6 text-center"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600/10 to-teal-500/10 flex items-center justify-center mb-6 shadow-lg shadow-blue-600/5">
            <GraduationCap className="w-10 h-10 text-primary" />
          </div>
        </motion.div>
        <h3 className="text-xl font-bold mb-2 font-['Outfit']">Start Building Your List</h3>
        <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
          Set your filters above and click <span className="text-primary font-medium">Find Colleges</span>
          to generate a cleaner shortlist with realistic options.
        </p>
      </motion.div>
    );
  }

  if (results.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-[32px] border border-white/10 flex flex-col items-center justify-center py-24 px-6 text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center mb-4">
          <Search className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground max-w-md leading-relaxed">
          No results found for the current profile. Try widening your percentile range or enabling more branches.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-3 md:grid-cols-3">
        <div className="glass rounded-[26px] border border-white/10 p-4">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            Total Results
          </div>
          <div className="mt-2 text-2xl font-bold text-foreground">{results.length}</div>
        </div>
        <div className="glass rounded-[26px] border border-white/10 p-4">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            <TrendingUp className="w-3.5 h-3.5 text-primary" />
            Highest Cutoff Match
          </div>
          <div className="mt-2 text-2xl font-bold text-foreground">{strongestMatch || "-"}</div>
        </div>
        <div className="glass rounded-[26px] border border-white/10 p-4">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            <GraduationCap className="w-3.5 h-3.5 text-primary" />
            Cities Covered
          </div>
          <div className="mt-2 text-2xl font-bold text-foreground">{uniqueCities || 1}</div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm text-muted-foreground font-medium">
            {results.length} college{results.length !== 1 ? "s" : ""} found
          </span>
        </div>
      </div>

      {topCollegeName ? (
        <div className="rounded-[30px] border border-white/10 bg-gradient-to-r from-primary/12 to-teal-400/10 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Top spotlight
              </div>
              <h3 className="mt-2 text-xl font-semibold text-foreground">{topCollegeName}</h3>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-200/85">
                {topBranch ? (
                  <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                    {topBranch}
                  </div>
                ) : null}
                {topCity ? (
                  <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 inline-flex items-center gap-1.5">
                    <MapPin className="h-3 w-3" />
                    {topCity}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-slate-950/45 px-4 py-3 text-sm text-muted-foreground">
              Start with the strongest match, then compare nearby options before locking the shortlist.
              <div className="mt-2 inline-flex items-center gap-1.5 text-primary font-medium">
                Review the first cards
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      ) : null}

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
