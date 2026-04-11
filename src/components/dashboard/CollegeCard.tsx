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
      ? "text-emerald-600"
      : value >= 50
        ? "text-amber-500"
        : "text-rose-500";
  const bg =
    value >= 80
      ? "from-emerald-500 to-emerald-400"
      : value >= 50
        ? "from-amber-500 to-amber-400"
        : "from-rose-500 to-rose-400";
  const glowColor =
    value >= 80
      ? "shadow-emerald-500/18"
      : value >= 50
        ? "shadow-amber-500/18"
        : "shadow-rose-500/18";

  return (
    <div className="flex items-center gap-2.5">
      <div className="relative h-2.5 w-20 overflow-hidden rounded-full bg-secondary/50 shadow-inner sm:w-24">
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
      className="glass rounded-[30px] overflow-hidden cursor-pointer group card-beam transition-shadow hover:shadow-lg hover:shadow-primary/5 border border-border/70"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="p-4 sm:p-5 md:p-6">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="rounded-full px-2.5 py-1 text-[10px]">
                #{index + 1}
              </Badge>
              <Badge variant="secondary" className="rounded-full px-2.5 py-1 text-[10px] bg-white/80">
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
          <div className="flex justify-start sm:justify-end">
            <ProbabilityGauge value={probability} />
          </div>
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

      </div>

      
    </motion.div>
  );
}
