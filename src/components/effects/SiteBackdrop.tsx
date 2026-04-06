import { cn } from "@/lib/utils";
import { AuroraBackground } from "./AuroraBackground";
import { FloatingParticles } from "./FloatingParticles";

interface SiteBackdropProps {
  className?: string;
  particleCount?: number;
  variant?: "default" | "focused";
}

export function SiteBackdrop({
  className,
  particleCount = 18,
  variant = "default",
}: SiteBackdropProps) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.18),_transparent_34%),radial-gradient(circle_at_80%_18%,_rgba(20,184,166,0.16),_transparent_26%),linear-gradient(180deg,_rgba(2,6,23,0.96)_0%,_rgba(2,6,23,1)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:84px_84px] opacity-40" />
      <AuroraBackground />
      <FloatingParticles count={particleCount} />

      <div
        className={cn(
          "absolute left-1/2 top-[-22%] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-primary/18 blur-[160px]",
          variant === "focused" && "top-[10%] h-[24rem] w-[24rem] bg-teal-400/12 blur-[120px]",
        )}
      />
      <div className="absolute bottom-[-14%] right-[-10%] h-[24rem] w-[24rem] rounded-full bg-cyan-400/10 blur-[160px]" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/4 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background via-background/70 to-transparent" />
    </div>
  );
}
