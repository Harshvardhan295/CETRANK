import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
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

  const filteredCategories = CATEGORIES.filter((c) =>
    c.toLowerCase().includes(categorySearch.toLowerCase())
  );
  const filteredUniversities = HOME_UNIVERSITIES.filter((u) =>
    u.toLowerCase().includes(uniSearch.toLowerCase())
  );

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

  const activeBranchCount = Object.values(branches).filter(Boolean).length;

  return (
    <motion.div
      layout
      className="glass rounded-2xl overflow-hidden relative"
    >
      {/* Pulse overlay on search */}
      <AnimatePresence>
        {pulseKey > 0 && (
          <motion.div
            key={pulseKey}
            initial={{ opacity: 0.4, scale: 1 }}
            animate={{ opacity: 0, scale: 1.01 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 border-2 border-primary rounded-2xl pointer-events-none z-20"
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div>
            <span className="font-semibold text-sm block">Intelligent Filters</span>
            <span className="text-[10px] text-muted-foreground">
              {category} · {activeBranchCount} branches
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setExpanded(!expanded)}
          className="rounded-lg"
        >
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </Button>
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
            <div className="px-4 pb-5 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Category Selector */}
                <div className="relative">
                  <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                    Category
                  </Label>
                  <div
                    className="relative cursor-pointer"
                    onClick={() => { setShowCatDropdown(!showCatDropdown); setShowUniDropdown(false); }}
                  >
                    <Input
                      placeholder="Search category..."
                      value={showCatDropdown ? categorySearch : category}
                      onChange={(e) => setCategorySearch(e.target.value)}
                      className="pr-8 rounded-xl"
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
                        className="absolute z-30 top-full mt-1 w-full max-h-48 overflow-y-auto rounded-xl glass-strong shadow-2xl border border-border/50"
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

                {/* University Selector */}
                <div className="relative">
                  <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                    Home University
                  </Label>
                  <div
                    className="relative cursor-pointer"
                    onClick={() => { setShowUniDropdown(!showUniDropdown); setShowCatDropdown(false); }}
                  >
                    <Input
                      placeholder="Search university..."
                      value={showUniDropdown ? uniSearch : university.split(" ").slice(0, 3).join(" ") + "..."}
                      onChange={(e) => setUniSearch(e.target.value)}
                      className="pr-8 text-ellipsis rounded-xl"
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
                        className="absolute z-30 top-full mt-1 w-full max-h-48 overflow-y-auto rounded-xl glass-strong shadow-2xl border border-border/50"
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

                {/* Gender */}
                <div>
                  <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
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

              {/* Percentile Range */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    CET Percentile Range
                  </Label>
                  <span className="text-sm font-mono font-bold text-primary tabular-nums">
                    {percentileRange[0]} — {percentileRange[1]}
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
              </div>

              {/* Branch Toggles */}
              <div>
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

              {/* EWS + Search Button */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-3">
                  <Switch checked={isEws} onCheckedChange={setIsEws} />
                  <Label className="text-xs text-muted-foreground font-medium">EWS Quota</Label>
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    onClick={handleSearch}
                    disabled={isLoading}
                    className="rounded-xl px-8 glow-primary relative overflow-hidden group"
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
