import { motion } from "framer-motion";
import { FileText, Download, RotateCcw, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export function ReportCenter({ hasResults }: { hasResults: boolean }) {
  const [flipped, setFlipped] = useState(false);

  if (!hasResults) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="glass rounded-2xl overflow-hidden"
    >
      <div className="p-4 flex items-center justify-between border-b border-border/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileText className="w-4 h-4 text-primary" />
          </div>
          <span className="font-semibold text-sm">Report Center</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setFlipped(!flipped)}
          className="text-xs gap-1.5 rounded-lg"
        >
          <RotateCcw className="w-3 h-3" />
          {flipped ? "Digital View" : "PDF Preview"}
        </Button>
      </div>

      <div className="p-6 relative" style={{ perspective: 1000 }}>
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative"
        >
          {/* Front - Digital */}
          <div
            className={`${flipped ? "invisible" : ""}`}
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="text-center py-8">
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-primary/5">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
              </motion.div>
              <h3 className="font-bold mb-1.5 text-lg font-['Outfit']">Your Admission Report</h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed max-w-xs mx-auto">
                Detailed analysis with recommended colleges, cutoff trends, and allocation reasoning.
              </p>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  onClick={() =>
                    toast({
                      title: "Coming Soon! 🚀",
                      description:
                        "PDF report generation will be available in the next release.",
                    })
                  }
                  className="rounded-xl gap-2 glow-subtle relative overflow-hidden group"
                >
                  <Download className="w-4 h-4" />
                  Download Report
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Back - PDF Preview */}
          {flipped && (
            <div
              style={{
                transform: "rotateY(180deg)",
                backfaceVisibility: "hidden",
              }}
            >
              <div className="bg-secondary/20 rounded-xl p-6 text-center border border-border/30">
                <div className="space-y-3 max-w-xs mx-auto">
                  <div className="h-3 bg-secondary rounded w-3/4 mx-auto" />
                  <div className="h-2 bg-secondary rounded w-full" />
                  <div className="h-2 bg-secondary rounded w-5/6" />
                  <div className="h-2 bg-secondary rounded w-full" />
                  <div className="h-8 bg-secondary/50 rounded-lg mt-4" />
                  <div className="h-2 bg-secondary rounded w-4/5" />
                  <div className="h-2 bg-secondary rounded w-full" />
                </div>
                <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-muted-foreground">
                  <Sparkles className="w-3 h-3" />
                  <span>PDF Preview (Coming Soon)</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
