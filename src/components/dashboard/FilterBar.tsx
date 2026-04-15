import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronDown,
  RotateCcw,
  SlidersHorizontal,
  Gauge,
  X,
  Check,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { BRANCH_FILTERS, CATEGORIES, HOME_UNIVERSITIES, getMetadata } from "@/lib/api";
import type { CutoffRequest } from "@/lib/api";

interface FilterBarProps {
  onSearch: (filters: CutoffRequest) => void;
  isLoading: boolean;
}

type BranchFilters = Pick<
  CutoffRequest,
  "is_tech" | "is_electronic" | "is_other" | "is_civil" | "is_mechanical" | "is_electrical"
>;

const CATEGORY_API_MAP: Record<string, string> = {
  GOPEN: "OPEN",
  LOPEN: "OPEN",
  GOBCH: "OBC",
  LOBCH: "OBC",
  GOBC: "OBC",
  LOBC: "OBC",
  GSEBC: "SEBC",
  LSEBC: "SEBC",
  GSC: "SC",
  LSC: "SC",
  GST: "ST",
  LST: "ST",
  GVJN: "VJNT",
  LVJN: "VJNT",
  GNT1: "NT1",
  LNT1: "NT1",
  GNT2: "NT2",
  LNT2: "NT2",
  GNT3: "NT3",
  LNT3: "NT3",
  GEWS: "EWS",
  LEWS: "EWS",
  TFWS: "TFWS",
};

const GENDER_API_MAP: Record<string, string> = {
  Male: "Male",
  Female: "Female",
};

const RELIGION_OPTIONS = ["Muslim", "Jain", "Christian"] as const;

const LANGUAGE_OPTIONS = [
  "Gujarathi",
  "Gujar",
  "Hindi",
  "Sindhi",
  "Punjabi",
  "Tamil",
  "Malyalam",
  "Roman",
] as const;

const normalizeCategoryOption = (value: string) => {
  if (value === "GOBCH" || value === "LOBCH") {
    return "OBC";
  }

  if (value.length > 1 && ["G", "L"].includes(value[0])) {
    return value.slice(1);
  }

  return value;
};

const formatPercentile = (value: number) => {
  if (!Number.isFinite(value)) {
    return "0";
  }

  return Number.isInteger(value) ? String(value) : value.toFixed(2);
};

/* ── Reusable chip for selected multi-select items ── */
function SelectedChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-medium leading-tight max-w-[160px]">
      <span className="truncate">{label}</span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="flex-shrink-0 hover:bg-primary/20 rounded-full p-0.5 transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}

/* ── Reusable multi-select dropdown item ── */
function MultiSelectItem({
  label,
  selected,
  onClick,
}: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`w-full text-left px-3 py-2.5 text-sm hover:bg-primary/10 transition-colors flex items-center gap-2 ${
        selected ? "text-primary font-medium bg-primary/5" : ""
      }`}
    >
      <div
        className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
          selected ? "bg-primary border-primary" : "border-border/80"
        }`}
      >
        {selected && <Check className="w-3 h-3 text-white" />}
      </div>
      <span className="truncate">{label}</span>
    </button>
  );
}

/* ── Card wrapper for filter sections ── */
function FilterCard({
  children,
  className = "",
}: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-[26px] border border-border/70 bg-white/80 p-4 ${className}`}>
      {children}
    </div>
  );
}

export function FilterBar({ onSearch, isLoading }: FilterBarProps) {
  const emptyBranches: BranchFilters = {
    is_tech: false,
    is_electronic: false,
    is_other: false,
    is_civil: false,
    is_mechanical: false,
    is_electrical: false,
  };

  const [expanded, setExpanded] = useState(true);
  const [category, setCategory] = useState("");
  const [university, setUniversity] = useState("");
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedReligions, setSelectedReligions] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedDivisions, setSelectedDivisions] = useState<string[]>([]);
  const [gender, setGender] = useState("");
  const [percentile, setPercentile] = useState(75);
  const [jeePercentile, setJeePercentile] = useState(0);
  const [branches, setBranches] = useState<BranchFilters>(emptyBranches);
  const [isEws, setIsEws] = useState(false);

  /* search terms */
  const [categorySearch, setCategorySearch] = useState("");
  const [uniSearch, setUniSearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [religionSearch, setReligionSearch] = useState("");
  const [languageSearch, setLanguageSearch] = useState("");
  const [divisionSearch, setDivisionSearch] = useState("");

  /* dropdown visibility */
  const [showCatDropdown, setShowCatDropdown] = useState(false);
  const [showUniDropdown, setShowUniDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showReligionDropdown, setShowReligionDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showDivisionDropdown, setShowDivisionDropdown] = useState(false);

  /* data lists */
  const [universities, setUniversities] = useState(HOME_UNIVERSITIES);
  const [cities, setCities] = useState<string[]>([]);
  const [divisions, setDivisions] = useState<string[]>([]);

  const [pulseKey, setPulseKey] = useState(0);

  /* refs */
  const categoryRef = useRef<HTMLDivElement>(null);
  const universityRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);
  const religionRef = useRef<HTMLDivElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);
  const divisionRef = useRef<HTMLDivElement>(null);

  /* derived filtered lists */
  const uniqueCategories = Array.from(
    new Set(CATEGORIES.map(normalizeCategoryOption).filter((c) => c !== "TFWS")),
  );
  const filteredCategories = uniqueCategories.filter((c) =>
    c.toLowerCase().includes(categorySearch.toLowerCase()),
  );
  const filteredUniversities = universities.filter((u) =>
    u.toLowerCase().includes(uniSearch.toLowerCase()),
  );
  const filteredCities = cities.filter((c) =>
    c.toLowerCase().includes(citySearch.toLowerCase()),
  );
  const filteredReligions = RELIGION_OPTIONS.filter((r) =>
    r.toLowerCase().includes(religionSearch.toLowerCase()),
  );
  const filteredLanguages = LANGUAGE_OPTIONS.filter((l) =>
    l.toLowerCase().includes(languageSearch.toLowerCase()),
  );
  const filteredDivisions = divisions.filter((d) =>
    d.toLowerCase().includes(divisionSearch.toLowerCase()),
  );

  /* ── Close dropdowns on outside click ── */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (categoryRef.current && !categoryRef.current.contains(target))
        setShowCatDropdown(false);
      if (universityRef.current && !universityRef.current.contains(target))
        setShowUniDropdown(false);
      if (cityRef.current && !cityRef.current.contains(target))
        setShowCityDropdown(false);
      if (religionRef.current && !religionRef.current.contains(target))
        setShowReligionDropdown(false);
      if (languageRef.current && !languageRef.current.contains(target))
        setShowLanguageDropdown(false);
      if (divisionRef.current && !divisionRef.current.contains(target))
        setShowDivisionDropdown(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ── Load metadata ── */
  useEffect(() => {
    let isMounted = true;

    const loadMetadata = async () => {
      try {
        const metadata = await getMetadata();
        if (!isMounted) return;
        if (metadata.universities.length > 0) setUniversities(metadata.universities);
        if (metadata.cities.length > 0) setCities(metadata.cities);
        if (metadata.divisions.length > 0) setDivisions(metadata.divisions);
      } catch (error) {
        console.warn("Unable to load live filter metadata. Using fallback options.", error);
      }
    };

    void loadMetadata();
    return () => {
      isMounted = false;
    };
  }, []);

  /* ── Helpers ── */
  const closeOtherDropdowns = (keep: string) => {
    if (keep !== "cat") setShowCatDropdown(false);
    if (keep !== "uni") setShowUniDropdown(false);
    if (keep !== "city") setShowCityDropdown(false);
    if (keep !== "religion") setShowReligionDropdown(false);
    if (keep !== "language") setShowLanguageDropdown(false);
    if (keep !== "division") setShowDivisionDropdown(false);
  };

  const toggleArrayItem = (
    arr: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    item: string,
  ) => {
    setter(arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item]);
  };

  /* ── Search handler ── */
  const handleSearch = () => {
    setPulseKey((k) => k + 1);

    const filters: CutoffRequest = {
      user_category: CATEGORY_API_MAP[category] ?? category,
      user_minority_list: [...selectedReligions, ...selectedLanguages],
      user_home_university: university,
      user_gender: GENDER_API_MAP[gender] ?? gender,
      city: selectedCities.length > 0 ? selectedCities : null,
      division: selectedDivisions.length > 0 ? selectedDivisions : null,
      percentile_cet: percentile,
      percentile_ai: jeePercentile,
      ...branches,
      is_ews: isEws,
    };

    console.log("[FilterBar] Sending filters:", JSON.stringify(filters, null, 2));
    onSearch(filters);
  };

  /* ── Reset ── */
  const resetFilters = () => {
    setCategory("");
    setUniversity("");
    setSelectedCities([]);
    setSelectedReligions([]);
    setSelectedLanguages([]);
    setSelectedDivisions([]);
    setGender("");
    setPercentile(75);
    setJeePercentile(0);
    setBranches(emptyBranches);
    setIsEws(false);
    setCategorySearch("");
    setUniSearch("");
    setCitySearch("");
    setReligionSearch("");
    setLanguageSearch("");
    setDivisionSearch("");
    setShowReligionDropdown(false);
    setShowLanguageDropdown(false);
    setShowUniDropdown(false);
    setShowCityDropdown(false);
    setShowCatDropdown(false);
    setShowDivisionDropdown(false);
  };

  const canSearch = Boolean(category && university && gender);

  /* ── Percentile change handler (clamped 0–100) ── */
  const handlePercentileChange = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    raw: string,
  ) => {
    const parsed = Number.parseFloat(raw);
    if (Number.isNaN(parsed)) {
      setter(0);
      return;
    }
    setter(Math.min(100, Math.max(0, parsed)));
  };

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

      {/* ── Header ── */}
      <div className="p-5 md:p-6 flex flex-col gap-4 border-b border-border/70 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/10">
            <SlidersHorizontal className="w-5 h-5 text-primary" />
          </div>
          <div>
            <span className="font-semibold text-base block">Intelligent Filters</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
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

      {/* ── Collapsible body ── */}
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

              {/* ── Row 1: Category · University · Gender ── */}
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

                {/* Category (single select) */}
                <div ref={categoryRef} className="relative">
                  <FilterCard>
                    <Label className="mb-2 flex items-center gap-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Category
                    </Label>
                    <div
                      className="relative cursor-pointer"
                      onClick={() => {
                        closeOtherDropdowns("cat");
                        setShowCatDropdown(!showCatDropdown);
                      }}
                    >
                      <Input
                        placeholder="Select category"
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
                          className="absolute z-30 top-full mt-2 left-0 right-0 max-h-48 overflow-y-auto rounded-2xl glass-strong shadow-2xl border border-border/50"
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
                  </FilterCard>
                </div>

                {/* University (single select) */}
                <div ref={universityRef} className="relative">
                  <FilterCard>
                    <Label className="mb-2 flex items-center gap-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Home University
                    </Label>
                    <div
                      className="relative cursor-pointer"
                      onClick={() => {
                        closeOtherDropdowns("uni");
                        setShowUniDropdown(!showUniDropdown);
                      }}
                    >
                      <Input
                        placeholder="Select home university"
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
                          className="absolute z-30 top-full mt-2 left-0 right-0 max-h-48 overflow-y-auto rounded-2xl glass-strong shadow-2xl border border-border/50"
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
                  </FilterCard>
                </div>

                {/* Gender (single select buttons) */}
                <FilterCard>
                  <Label className="mb-2 flex items-center gap-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Gender
                  </Label>
                  <div className="flex gap-2">
                    {[
                      { label: "Male", value: "Male" },
                      { label: "Female", value: "Female" },
                    ].map((g) => (
                      <Button
                        key={g.label}
                        variant={gender === g.value ? "default" : "outline"}
                        size="sm"
                        className={`flex-1 rounded-xl transition-all ${
                          gender === g.value ? "glow-subtle" : ""
                        }`}
                        onClick={() => setGender(g.value)}
                      >
                        {g.label}
                      </Button>
                    ))}
                  </div>
                </FilterCard>
              </div>

              {/* ── Row 2: City (multi) · Minority (multi) · Division (multi) ── */}
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

                {/* City — multi-select */}
                <div ref={cityRef} className="relative">
                  <FilterCard>
                    <Label className="mb-2 flex items-center gap-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Preferred City
                      {selectedCities.length > 0 && (
                        <span className="ml-auto text-primary font-bold">{selectedCities.length}</span>
                      )}
                    </Label>

                    {/* Selected chips */}
                    {selectedCities.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {selectedCities.map((c) => (
                          <SelectedChip
                            key={c}
                            label={c}
                            onRemove={() =>
                              setSelectedCities((prev) => prev.filter((x) => x !== c))
                            }
                          />
                        ))}
                      </div>
                    )}

                    <div
                      className="relative cursor-pointer"
                      onClick={() => {
                        closeOtherDropdowns("city");
                        setShowCityDropdown(!showCityDropdown);
                      }}
                    >
                      <Input
                        placeholder={cities.length > 0 ? "Search cities…" : "Type city name"}
                        value={citySearch}
                        onChange={(e) => {
                          setCitySearch(e.target.value);
                          if (!showCityDropdown) setShowCityDropdown(true);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="pr-8 rounded-2xl border-border/80 bg-white/90 focus-visible:ring-primary/40"
                      />
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    </div>

                    <AnimatePresence>
                      {showCityDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -5, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -5, scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                          className="absolute z-30 top-full mt-2 left-0 right-0 max-h-48 overflow-y-auto rounded-2xl glass-strong shadow-2xl border border-border/50"
                        >
                          {filteredCities.length > 0 ? (
                            filteredCities.map((c) => (
                              <MultiSelectItem
                                key={c}
                                label={c}
                                selected={selectedCities.includes(c)}
                                onClick={() =>
                                  toggleArrayItem(selectedCities, setSelectedCities, c)
                                }
                              />
                            ))
                          ) : citySearch ? (
                            <div className="px-3 py-3 text-sm text-muted-foreground text-center">
                              No matching cities
                            </div>
                          ) : null}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </FilterCard>
                </div>

                {/* Religion — multi-select */}
                <div ref={religionRef} className="relative">
                  <FilterCard>
                    <Label className="mb-2 flex items-center gap-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Religion
                      {selectedReligions.length > 0 && (
                        <span className="ml-auto text-primary font-bold">
                          {selectedReligions.length}
                        </span>
                      )}
                    </Label>

                    {selectedReligions.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {selectedReligions.map((r) => (
                          <SelectedChip
                            key={r}
                            label={r}
                            onRemove={() =>
                              setSelectedReligions((prev) => prev.filter((x) => x !== r))
                            }
                          />
                        ))}
                      </div>
                    )}

                    <div
                      className="relative cursor-pointer"
                      onClick={() => {
                        closeOtherDropdowns("religion");
                        setShowReligionDropdown(!showReligionDropdown);
                      }}
                    >
                      <Input
                        placeholder="Select religion"
                        value={religionSearch}
                        onChange={(e) => {
                          setReligionSearch(e.target.value);
                          if (!showReligionDropdown) setShowReligionDropdown(true);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="pr-8 rounded-2xl border-border/80 bg-white/90 focus-visible:ring-primary/40"
                      />
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    </div>

                    <AnimatePresence>
                      {showReligionDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -5, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -5, scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                          className="absolute z-30 top-full mt-2 left-0 right-0 max-h-48 overflow-y-auto rounded-2xl glass-strong shadow-2xl border border-border/50"
                        >
                          {filteredReligions.map((r) => (
                            <MultiSelectItem
                              key={r}
                              label={r}
                              selected={selectedReligions.includes(r)}
                              onClick={() => toggleArrayItem(selectedReligions, setSelectedReligions, r)}
                            />
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </FilterCard>
                </div>

                {/* Language — multi-select */}
                <div ref={languageRef} className="relative">
                  <FilterCard>
                    <Label className="mb-2 flex items-center gap-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider text-wrap">
                      Language / Ethnicity
                      {selectedLanguages.length > 0 && (
                        <span className="ml-auto text-primary font-bold">
                          {selectedLanguages.length}
                        </span>
                      )}
                    </Label>

                    {selectedLanguages.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {selectedLanguages.map((l) => (
                          <SelectedChip
                            key={l}
                            label={l}
                            onRemove={() =>
                              setSelectedLanguages((prev) => prev.filter((x) => x !== l))
                            }
                          />
                        ))}
                      </div>
                    )}

                    <div
                      className="relative cursor-pointer"
                      onClick={() => {
                        closeOtherDropdowns("language");
                        setShowLanguageDropdown(!showLanguageDropdown);
                      }}
                    >
                      <Input
                        placeholder="Select language"
                        value={languageSearch}
                        onChange={(e) => {
                          setLanguageSearch(e.target.value);
                          if (!showLanguageDropdown) setShowLanguageDropdown(true);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="pr-8 rounded-2xl border-border/80 bg-white/90 focus-visible:ring-primary/40"
                      />
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    </div>

                    <AnimatePresence>
                      {showLanguageDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -5, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -5, scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                          className="absolute z-30 top-full mt-2 left-0 right-0 max-h-48 overflow-y-auto rounded-2xl glass-strong shadow-2xl border border-border/50"
                        >
                          {filteredLanguages.map((l) => (
                            <MultiSelectItem
                              key={l}
                              label={l}
                              selected={selectedLanguages.includes(l)}
                              onClick={() => toggleArrayItem(selectedLanguages, setSelectedLanguages, l)}
                            />
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </FilterCard>
                </div>
              </div>

              {/* ── Row 3: Division · CET Percentile · JEE Percentile ── */}
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {/* Division — multi-select */}
                <div ref={divisionRef} className="relative">
                  <FilterCard>
                    <Label className="mb-2 flex items-center gap-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Division
                      {selectedDivisions.length > 0 && (
                        <span className="ml-auto text-primary font-bold">{selectedDivisions.length}</span>
                      )}
                    </Label>

                    {selectedDivisions.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {selectedDivisions.map((d) => (
                          <SelectedChip
                            key={d}
                            label={d}
                            onRemove={() =>
                              setSelectedDivisions((prev) => prev.filter((x) => x !== d))
                            }
                          />
                        ))}
                      </div>
                    )}

                    <div
                      className="relative cursor-pointer"
                      onClick={() => {
                        closeOtherDropdowns("division");
                        setShowDivisionDropdown(!showDivisionDropdown);
                      }}
                    >
                      <Input
                        placeholder={divisions.length > 0 ? "Search divisions…" : "No divisions loaded"}
                        value={divisionSearch}
                        onChange={(e) => {
                          setDivisionSearch(e.target.value);
                          if (!showDivisionDropdown) setShowDivisionDropdown(true);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="pr-8 rounded-2xl border-border/80 bg-white/90 focus-visible:ring-primary/40"
                      />
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    </div>

                    <AnimatePresence>
                      {showDivisionDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -5, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -5, scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                          className="absolute z-30 top-full mt-2 left-0 right-0 max-h-48 overflow-y-auto rounded-2xl glass-strong shadow-2xl border border-border/50"
                        >
                          {filteredDivisions.length > 0 ? (
                            filteredDivisions.map((d) => (
                              <MultiSelectItem
                                key={d}
                                label={d}
                                selected={selectedDivisions.includes(d)}
                                onClick={() =>
                                  toggleArrayItem(selectedDivisions, setSelectedDivisions, d)
                                }
                              />
                            ))
                          ) : divisionSearch ? (
                            <div className="px-3 py-3 text-sm text-muted-foreground text-center">
                              No matching divisions
                            </div>
                          ) : null}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </FilterCard>
                </div>

                <FilterCard className="md:p-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-3">
                    <Label className="flex items-center gap-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      <Gauge className="h-3.5 w-3.5" />
                      CET Percentile
                    </Label>
                    <span className="text-sm font-mono font-bold text-primary tabular-nums">
                      {formatPercentile(percentile)}
                    </span>
                  </div>
                  <Input
                    type="text"
                    inputMode="decimal"
                    value={percentile}
                    onChange={(e) => handlePercentileChange(setPercentile, e.target.value)}
                    className="rounded-2xl border-border/80 bg-white/90 focus-visible:ring-primary/40"
                  />
                </FilterCard>

                <FilterCard className="md:p-5">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <Label className="flex items-center gap-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      <Gauge className="h-3.5 w-3.5" />
                      JEE Percentile
                    </Label>
                    <span className="text-sm font-mono font-bold text-primary tabular-nums">
                      {formatPercentile(jeePercentile)}
                    </span>
                  </div>
                  <Input
                    type="text"
                    inputMode="decimal"
                    value={jeePercentile}
                    onChange={(e) => handlePercentileChange(setJeePercentile, e.target.value)}
                    className="rounded-2xl border-border/80 bg-white/90 focus-visible:ring-primary/40"
                  />
                </FilterCard>
              </div>

              {/* ── Row 4: Branch Filters ── */}
              <FilterCard className="md:p-5">
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
              </FilterCard>

              {/* ── Row 5: EWS + Generate ── */}
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
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="md:text-right"
                >
                  <Button
                    onClick={handleSearch}
                    disabled={isLoading || !canSearch}
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
                        Generate List
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
