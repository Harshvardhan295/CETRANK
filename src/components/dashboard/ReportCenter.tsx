import { motion } from "framer-motion";
import { FileText, Download, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export function ReportCenter({ hasResults }: { hasResults: boolean }) {
  const [flipped, setFlipped] = useState(false);

  if (!hasResults) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl overflow-hidden"
    >
      <div className="p-4 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <span className="font-semibold text-sm">Report Center</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setFlipped(!flipped)}
          className="text-xs gap-1"
        >
          <RotateCcw className="w-3 h-3" />
          {flipped ? "Digital View" : "PDF Preview"}
        </Button>
      </div>

      <div className="p-6 relative" style={{ perspective: 1000 }}>
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative"
        >
          {/* Front - Digital */}
          <div
            className={`${flipped ? "invisible" : ""}`}
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="text-center py-8">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">Your Admission Report</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Detailed analysis with recommended colleges, cutoff trends, and allocation reasoning.
              </p>
              <Button
                onClick={() =>
                  toast({
                    title: "Coming Soon! 🚀",
                    description: "PDF report generation will be available in the next release.",
                  })
                }
                className="rounded-xl gap-2"
              >
                <Download className="w-4 h-4" />
                Download Report
              </Button>
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
              <div className="bg-secondary/30 rounded-lg p-6 text-center">
                <div className="space-y-3 max-w-xs mx-auto">
                  <div className="h-3 bg-secondary rounded w-3/4 mx-auto" />
                  <div className="h-2 bg-secondary rounded w-full" />
                  <div className="h-2 bg-secondary rounded w-5/6" />
                  <div className="h-2 bg-secondary rounded w-full" />
                  <div className="h-8 bg-secondary/50 rounded mt-4" />
                  <div className="h-2 bg-secondary rounded w-4/5" />
                  <div className="h-2 bg-secondary rounded w-full" />
                </div>
                <p className="text-xs text-muted-foreground mt-4">PDF Preview (Mockup)</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
