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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.16),_transparent_34%),radial-gradient(circle_at_80%_18%,_rgba(20,184,166,0.14),_transparent_26%),linear-gradient(180deg,_rgba(248,251,255,0.98)_0%,_rgba(237,245,255,1)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:84px_84px] opacity-60" />
      <AuroraBackground />
      <FloatingParticles count={particleCount} />

      <div
        className={cn(
          "absolute left-1/2 top-[-22%] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-primary/12 blur-[160px]",
          variant === "focused" && "top-[10%] h-[24rem] w-[24rem] bg-teal-400/10 blur-[120px]",
        )}
      />
      <div className="absolute bottom-[-14%] right-[-10%] h-[24rem] w-[24rem] rounded-full bg-cyan-400/8 blur-[160px]" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/55 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background via-background/70 to-transparent" />
    </div>
  );
}
