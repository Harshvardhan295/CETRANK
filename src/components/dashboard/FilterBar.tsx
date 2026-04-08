import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronDown,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  University,
  UserRound,
  Gauge,
  WandSparkles,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useEffect, useRef, useState } from "react";
import { CATEGORIES, HOME_UNIVERSITIES, BRANCH_FILTERS } from "@/lib/api";
import type { CutoffRequest } from "@/lib/api";

interface FilterBarProps {
  onSearch: (filters: CutoffRequest) => void;
  isLoading: boolean;
}

export function FilterBar({ onSearch, isLoading }: FilterBarProps) {
  const [expanded, setExpanded] = useState(true);
  const [category, setCategory] = useState("GOPEN");
  const [university, setUniversity] = useState("Savitribai Phule Pune University");
  const [gender, setGender] = useState("Male");
  const [percentileRange, setPercentileRange] = useState([50, 100]);
  const [branches, setBranches] = useState<Record<string, boolean>>({
    is_tech: true,
    is_electronic: false,
    is_other: false,
    is_civil: false,
    is_mechanical: false,
    is_electrical: false,
  });
  const [isEws, setIsEws] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [uniSearch, setUniSearch] = useState("");
  const [showCatDropdown, setShowCatDropdown] = useState(false);
  const [showUniDropdown, setShowUniDropdown] = useState(false);
  const [pulseKey, setPulseKey] = useState(0);
  const categoryRef = useRef<HTMLDivElement>(null);
  const universityRef = useRef<HTMLDivElement>(null);

  const filteredCategories = CATEGORIES.filter((c) =>
    c.toLowerCase().includes(categorySearch.toLowerCase()),
  );
  const filteredUniversities = HOME_UNIVERSITIES.filter((u) =>
    u.toLowerCase().includes(uniSearch.toLowerCase()),
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (categoryRef.current && !categoryRef.current.contains(target)) {
        setShowCatDropdown(false);
      }

      if (universityRef.current && !universityRef.current.contains(target)) {
        setShowUniDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    setPulseKey((k) => k + 1);
    onSearch({
      user_category: category,
      user_home_university: university,
      gender,
      min_percentile_cet: percentileRange[0],
      max_percentile_cet: percentileRange[1],
      ...branches,
      is_ews: isEws,
    });
  };

  const resetFilters = () => {
    setCategory("GOPEN");
    setUniversity("Savitribai Phule Pune University");
    setGender("Male");
    setPercentileRange([50, 100]);
    setBranches({
      is_tech: true,
      is_electronic: false,
      is_other: false,
      is_civil: false,
      is_mechanical: false,
      is_electrical: false,
    });
    setIsEws(false);
    setCategorySearch("");
    setUniSearch("");
    setShowCatDropdown(false);
    setShowUniDropdown(false);
  };

  const activeBranchCount = Object.values(branches).filter(Boolean).length;
  const selectedBranchLabels = BRANCH_FILTERS.filter((branch) => branches[branch.key]).map(
    (branch) => branch.label,
  );
  const percentilePresets = [
    { label: "Safe", value: [65, 100] },
    { label: "Balanced", value: [50, 90] },
    { label: "Ambitious", value: [80, 100] },
  ];

  return (
    <motion.div layout className="panel-surface overflow-hidden relative">
      <AnimatePresence>
        {pulseKey > 0 && (
          <motion.div
            key={pulseKey}
            initial={{ opacity: 0.4, scale: 1 }}
            animate={{ opacity: 0, scale: 1.01 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 border-2 border-primary rounded-[30px] pointer-events-none z-20"
          />
        )}
      </AnimatePresence>

      <div className="p-5 md:p-6 flex flex-col gap-4 border-b border-border/70 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/10">
            <SlidersHorizontal className="w-5 h-5 text-primary" />
          </div>
          <div>
            <span className="font-semibold text-base block">Intelligent Filters</span>
            <span className="text-[11px] text-muted-foreground uppercase tracking-[0.18em]">
              {category} / {gender} / {activeBranchCount} active branch{activeBranchCount !== 1 ? "es" : ""}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="rounded-full px-3 py-1 bg-white/80">
            {percentileRange[0]} - {percentileRange[1]} percentile
          </Badge>
          <Badge variant="outline" className="rounded-full px-3 py-1 border-border/80">
            {selectedBranchLabels.length || 1} branch mode
          </Badge>
          <Button variant="ghost" size="sm" onClick={resetFilters} className="rounded-full">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setExpanded(!expanded)}
            className="rounded-full"
          >
            <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </Button>
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
            <div className="px-5 pb-6 pt-5 md:px-6 space-y-6">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="rounded-full px-3 py-1.5">
                  {category}
                </Badge>
                <Badge variant="outline" className="rounded-full px-3 py-1.5">
                  {gender}
                </Badge>
                {isEws ? (
                  <Badge variant="outline" className="rounded-full px-3 py-1.5">
                    EWS enabled
                  </Badge>
                ) : null}
                {selectedBranchLabels.slice(0, 3).map((label) => (
                  <Badge key={label} variant="secondary" className="rounded-full px-3 py-1.5">
                    {label}
                  </Badge>
                ))}
              </div>

              <div className="rounded-[26px] border border-border/70 bg-white/80 p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-primary">
                      <WandSparkles className="h-3.5 w-3.5" />
                      Quick setup
                    </div>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Start with a percentile strategy, then fine-tune category and branch preferences below.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {percentilePresets.map((preset) => (
                      <Button
                        key={preset.label}
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-full border-border/80 bg-white/80"
                        onClick={() => setPercentileRange(preset.value)}
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_1.15fr_0.85fr]">
                <div ref={categoryRef} className="relative rounded-[26px] border border-border/70 bg-white/80 p-4">
                  <Label className="mb-2 flex items-center gap-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    Category
                  </Label>
                  <div
                    className="relative cursor-pointer"
                    onClick={() => {
                      setShowCatDropdown(!showCatDropdown);
                      setShowUniDropdown(false);
                    }}
                  >
                    <Input
                      placeholder="Search category..."
                      value={showCatDropdown ? categorySearch : category}
                      onChange={(e) => setCategorySearch(e.target.value)}
                      className="pr-8 rounded-2xl border-border/80 bg-white/90 focus-visible:ring-primary/40"
                    />
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                  <AnimatePresence>
                    {showCatDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -5, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -5, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-30 top-full mt-2 w-full max-h-48 overflow-y-auto rounded-2xl glass-strong shadow-2xl border border-border/50"
                      >
                        {filteredCategories.map((c) => (
                          <button
                            key={c}
                            onClick={(e) => {
                              e.stopPropagation();
                              setCategory(c);
                              setCategorySearch("");
                              setShowCatDropdown(false);
                            }}
                            className={`w-full text-left px-3 py-2.5 text-sm hover:bg-primary/10 transition-colors ${
                              c === category ? "text-primary font-medium bg-primary/5" : ""
                            }`}
                          >
                            {c}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div ref={universityRef} className="relative rounded-[26px] border border-border/70 bg-white/80 p-4">
                  <Label className="mb-2 flex items-center gap-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    <University className="w-3.5 h-3.5" />
                    Home University
                  </Label>
                  <div
                    className="relative cursor-pointer"
                    onClick={() => {
                      setShowUniDropdown(!showUniDropdown);
                      setShowCatDropdown(false);
                    }}
                  >
                    <Input
                      placeholder="Search university..."
                      value={showUniDropdown ? uniSearch : university}
                      onChange={(e) => setUniSearch(e.target.value)}
                      className="pr-8 rounded-2xl border-border/80 bg-white/90 focus-visible:ring-primary/40"
                    />
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                  <AnimatePresence>
                    {showUniDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -5, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -5, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-30 top-full mt-2 w-full max-h-48 overflow-y-auto rounded-2xl glass-strong shadow-2xl border border-border/50"
                      >
                        {filteredUniversities.map((u) => (
                          <button
                            key={u}
                            onClick={(e) => {
                              e.stopPropagation();
                              setUniversity(u);
                              setUniSearch("");
                              setShowUniDropdown(false);
                            }}
                            className={`w-full text-left px-3 py-2.5 text-sm hover:bg-primary/10 transition-colors ${
                              u === university ? "text-primary font-medium bg-primary/5" : ""
                            }`}
                          >
                            {u}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="rounded-[26px] border border-border/70 bg-white/80 p-4">
                  <Label className="mb-2 flex items-center gap-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    <UserRound className="w-3.5 h-3.5" />
                    Gender
                  </Label>
                  <div className="flex gap-2">
                    {["Male", "Female"].map((g) => (
                      <Button
                        key={g}
                        variant={gender === g ? "default" : "outline"}
                        size="sm"
                        className={`flex-1 rounded-xl transition-all ${
                          gender === g ? "glow-subtle" : ""
                        }`}
                        onClick={() => setGender(g)}
                      >
                        {g}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-[26px] border border-border/70 bg-white/80 p-4 md:p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-3">
                  <Label className="flex items-center gap-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    <Gauge className="h-3.5 w-3.5" />
                    CET Percentile Range
                  </Label>
                  <span className="text-sm font-mono font-bold text-primary tabular-nums">
                    {percentileRange[0]} - {percentileRange[1]}
                  </span>
                </div>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={percentileRange}
                  onValueChange={setPercentileRange}
                  className="py-2"
                />
                <p className="mt-4 text-xs leading-5 text-muted-foreground">
                  Use a wider range for discovery and a narrower range when you are ready to finalise the shortlist.
                </p>
              </div>

              <div className="rounded-[26px] border border-border/70 bg-white/80 p-4 md:p-5">
                <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2.5 block">
                  Branch Filters
                </Label>
                <div className="flex flex-wrap gap-2">
                  {BRANCH_FILTERS.map((b) => (
                    <motion.button
                      key={b.key}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() =>
                        setBranches((prev) => ({ ...prev, [b.key]: !prev[b.key] }))
                      }
                      className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${
                        branches[b.key]
                          ? "bg-primary text-primary-foreground border-primary glow-subtle"
                          : "bg-secondary/30 text-muted-foreground border-border hover:border-primary/40 hover:bg-primary/5"
                      }`}
                    >
                      {b.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4 rounded-[26px] border border-border/70 bg-slate-50/95 p-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <Switch checked={isEws} onCheckedChange={setIsEws} />
                  <div>
                    <Label className="text-xs text-foreground font-medium">EWS Quota</Label>
                    <p className="text-[11px] text-muted-foreground">
                      Include EWS seat consideration in the shortlist.
                    </p>
                  </div>
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="md:text-right">
                  <p className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Run shortlist search
                  </p>
                  <Button
                    onClick={handleSearch}
                    disabled={isLoading}
                    className="rounded-2xl px-8 glow-primary relative overflow-hidden group min-w-[200px] h-12"
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-1.5" />
                        Find Colleges
                      </>
                    )}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
