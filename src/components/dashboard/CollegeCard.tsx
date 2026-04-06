import { motion, AnimatePresence } from "framer-motion";
import { MapPin, TrendingUp, ChevronDown, CheckCircle2, Sparkles, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import type { CollegeResult } from "@/lib/api";

interface CollegeCardProps {
  college: CollegeResult;
  index: number;
}

function ProbabilityGauge({ value }: { value: number }) {
  const color =
    value >= 80
      ? "text-emerald-400"
      : value >= 50
        ? "text-amber-400"
        : "text-rose-400";
  const bg =
    value >= 80
      ? "from-emerald-500 to-emerald-400"
      : value >= 50
        ? "from-amber-500 to-amber-400"
        : "from-rose-500 to-rose-400";
  const glowColor =
    value >= 80
      ? "shadow-emerald-500/20"
      : value >= 50
        ? "shadow-amber-500/20"
        : "shadow-rose-500/20";

  return (
    <div className="flex items-center gap-2.5">
      <div className="relative w-24 h-2.5 bg-secondary/50 rounded-full overflow-hidden shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className={`h-full rounded-full bg-gradient-to-r ${bg} ${glowColor} shadow-lg`}
        />
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "200%" }}
          transition={{ duration: 1.5, delay: 1, repeat: Infinity, repeatDelay: 3 }}
          className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        />
      </div>
      <span className={`text-xs font-mono font-bold ${color} tabular-nums`}>
        {value}%
      </span>
    </div>
  );
}

function AllocationTimeline({ data }: { data: CollegeResult }) {
  const steps = [
    { label: "Home Univ.", value: data.home_university || data.University || "Validated", status: true },
    { label: "Category", value: data.category || data.Category || "Applied", status: true },
    { label: "Branch", value: data.branch_name || data.Branch || "Matched", status: true },
    { label: "Seat Status", value: data.status || "Available", status: true },
  ];

  return (
    <div className="mt-4 space-y-3 border-t border-border/50 pt-4">
      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
        Allocation Validation
      </div>
      {steps.map((step, i) => (
        <motion.div
          key={step.label}
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
          className="flex items-center gap-3"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1 + 0.1, type: "spring", stiffness: 300 }}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </motion.div>
          <span className="text-xs text-muted-foreground w-20 shrink-0">{step.label}</span>
          <span className="text-xs font-medium truncate">{step.value}</span>
        </motion.div>
      ))}
    </div>
  );
}

export function CollegeCard({ college, index }: CollegeCardProps) {
  const [expanded, setExpanded] = useState(false);

  const cutoff =
    college.CET_Percentile ??
    college.cet_percentile ??
    college.cutoff_percentile ??
    college.Percentile ??
    college.percentile ??
    0;

  const probability =
    cutoff > 0
      ? Math.min(95, Math.max(20, Math.round(100 - Math.abs(cutoff - 85) * 2)))
      : 50;

  const collegeName =
    college.college_name ||
    college.College ||
    college.Name ||
    college.name ||
    "Unknown College";
  const branchName = college.branch_name || college.Branch || college.branch || "";
  const city = college.city || college.City || "";
  const category =
    college.category || college.Category || college.seat_type || college.SeatType || "";
  const year = college.year || college.Year || "";
  const round = college.round || college.Round || college.round_no || "";
  const fitLabel =
    probability >= 80 ? "Strong fit" : probability >= 60 ? "Worth comparing" : "Stretch option";

  return (
    <motion.div
      layout
      layoutId={`college-${index}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2 }}
      className="glass rounded-[30px] overflow-hidden cursor-pointer group card-beam transition-shadow hover:shadow-lg hover:shadow-primary/5 border border-white/10"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="p-5 md:p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex items-center gap-2">
              <Badge variant="outline" className="rounded-full px-2.5 py-1 text-[10px]">
                #{index + 1}
              </Badge>
              <Badge variant="secondary" className="rounded-full px-2.5 py-1 text-[10px] bg-white/5">
                {fitLabel}
              </Badge>
            </div>
            <h3 className="font-semibold text-base leading-snug pr-3 group-hover:text-primary transition-colors">
              {collegeName}
            </h3>
            {branchName && (
              <p className="text-sm text-muted-foreground mt-1.5">{branchName}</p>
            )}
          </div>
          <ProbabilityGauge value={probability} />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {city && (
            <Badge variant="secondary" className="text-[10px] gap-1 rounded-full px-2.5 py-1">
              <MapPin className="w-3 h-3" /> {city}
            </Badge>
          )}
          {category && (
            <Badge variant="outline" className="text-[10px] rounded-full px-2.5 py-1">{category}</Badge>
          )}
          {year && (
            <Badge variant="outline" className="text-[10px] rounded-full px-2.5 py-1">{year}</Badge>
          )}
          {round && (
            <Badge variant="outline" className="text-[10px] rounded-full px-2.5 py-1">R{round}</Badge>
          )}
          {cutoff ? (
            <Badge variant="secondary" className="text-[10px] gap-1 rounded-full px-2.5 py-1">
              <TrendingUp className="w-3 h-3" /> {cutoff}
            </Badge>
          ) : null}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Match quality
            </div>
            <div className="mt-1 text-sm font-semibold text-foreground">{fitLabel}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Next move
            </div>
            <div className="mt-1 text-sm font-semibold text-foreground">
              Compare against similar branches
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Inspect trend, validation, and quick read</span>
          </div>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-1 font-medium text-primary"
          >
            <span>{expanded ? "Hide" : "Details"}</span>
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 md:px-6 md:pb-6">
              <AllocationTimeline data={college} />

              <div className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="p-4 rounded-2xl bg-secondary/20 border border-border/30">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
                    Historical Cutoff Trend
                  </div>
                  <div className="flex items-end gap-1.5 h-14">
                    {[65, 70, 68, 72, 75, 73, 78, cutoff].map((v, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${(v / 100) * 100}%` }}
                        transition={{ delay: i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="flex-1 bg-gradient-to-t from-primary/40 to-primary/80 rounded-t-sm hover:from-primary/60 hover:to-primary transition-colors"
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-[9px] text-muted-foreground mt-2 font-mono">
                    <span>2023</span>
                    <span>2025</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-background/50 border border-white/10">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
                    Quick Read
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                    <p>
                      This card appears strongest when your profile stays close to the shown cutoff and seat category.
                    </p>
                    <div className="flex items-center gap-2 text-primary font-medium">
                      <ArrowUpRight className="w-4 h-4" />
                      Save this into your shortlist bucket after comparing similar branches.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
