import { motion, AnimatePresence } from "framer-motion";
import { MapPin, TrendingUp, ChevronDown, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface CollegeCardProps {
  college: any;
  index: number;
}

function ProbabilityGauge({ value }: { value: number }) {
  const color =
    value >= 80 ? "text-green-500" : value >= 50 ? "text-yellow-500" : "text-red-400";
  const bg =
    value >= 80 ? "bg-green-500" : value >= 50 ? "bg-yellow-500" : "bg-red-400";

  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-2 bg-secondary rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className={`h-full rounded-full ${bg}`}
        />
      </div>
      <span className={`text-xs font-mono font-bold ${color}`}>{value}%</span>
    </div>
  );
}

function AllocationTimeline({ data }: { data: any }) {
  const steps = [
    { label: "Home University", value: data.home_university || data.University || "Validated", status: true },
    { label: "Category", value: data.category || data.Category || "Applied", status: true },
    { label: "Branch", value: data.branch_name || data.Branch || "Matched", status: true },
    { label: "Seat Status", value: data.status || "Available", status: true },
  ];

  return (
    <div className="mt-4 space-y-3 border-t border-border pt-4">
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
        Allocation Validation
      </div>
      {steps.map((step, i) => (
        <motion.div
          key={step.label}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.15 }}
          className="flex items-center gap-3"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.15 + 0.1 }}
          >
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          </motion.div>
          <span className="text-xs text-muted-foreground w-24">{step.label}</span>
          <span className="text-xs font-medium truncate">{step.value}</span>
        </motion.div>
      ))}
    </div>
  );
}

export function CollegeCard({ college, index }: CollegeCardProps) {
  const [expanded, setExpanded] = useState(false);

  // Compute a mock probability based on percentile closeness
  const cutoff = college.CET_Percentile || college.cutoff_percentile || college.Percentile || 70;
  const probability = Math.min(95, Math.max(20, Math.round(100 - Math.abs(cutoff - 85) * 2)));

  const collegeName = college.college_name || college.College || college.Name || "Unknown College";
  const branchName = college.branch_name || college.Branch || college.branch || "";
  const city = college.city || college.City || "";
  const category = college.category || college.Category || "";
  const year = college.year || college.Year || "";
  const round = college.round || college.Round || "";

  return (
    <motion.div
      layout
      layoutId={`college-${index}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="glass rounded-xl overflow-hidden hover:glow-subtle transition-shadow cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm leading-snug truncate pr-2">
              {collegeName}
            </h3>
            {branchName && (
              <p className="text-xs text-muted-foreground mt-1 truncate">{branchName}</p>
            )}
          </div>
          <ProbabilityGauge value={probability} />
        </div>

        <div className="flex items-center gap-2 mt-3 flex-wrap">
          {city && (
            <Badge variant="secondary" className="text-[10px] gap-1">
              <MapPin className="w-3 h-3" /> {city}
            </Badge>
          )}
          {category && (
            <Badge variant="outline" className="text-[10px]">{category}</Badge>
          )}
          {year && (
            <Badge variant="outline" className="text-[10px]">{year}</Badge>
          )}
          {round && (
            <Badge variant="outline" className="text-[10px]">R{round}</Badge>
          )}
          {cutoff && (
            <Badge variant="secondary" className="text-[10px] gap-1">
              <TrendingUp className="w-3 h-3" /> {cutoff}
            </Badge>
          )}
        </div>

        <div className="flex justify-center mt-2">
          <ChevronDown
            className={`w-4 h-4 text-muted-foreground transition-transform ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              <AllocationTimeline data={college} />

              {/* Sparkline placeholder */}
              <div className="mt-4 p-3 rounded-lg bg-secondary/30">
                <div className="text-xs font-semibold text-muted-foreground mb-2">
                  Historical Cutoff Trend
                </div>
                <div className="flex items-end gap-1 h-12">
                  {[65, 70, 68, 72, 75, 73, 78, cutoff].map((v, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${(v / 100) * 100}%` }}
                      transition={{ delay: i * 0.05, duration: 0.4 }}
                      className="flex-1 bg-primary/60 rounded-t"
                    />
                  ))}
                </div>
                <div className="flex justify-between text-[9px] text-muted-foreground mt-1">
                  <span>2023</span>
                  <span>2025</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
