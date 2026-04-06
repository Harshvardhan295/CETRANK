import { Link, useLocation } from "react-router-dom";
import { Menu, ArrowRight, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useMagicArea } from "./effects/MagicArea";
import { Button } from "./ui/button";
import { AppLogo } from "./AppLogo";

type NavLink = {
  label: string;
  to: string;
  active: boolean;
};

export function Navbar() {
  const location = useLocation();
  const isListGenerator = location.pathname === "/list-generator";
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handler = () => {
      setScrolled(window.scrollY > 20);

      const doc = document.documentElement;
      const maxScroll = doc.scrollHeight - window.innerHeight;
      setScrollProgress(maxScroll > 0 ? window.scrollY / maxScroll : 0);
    };

    handler();
    window.addEventListener("scroll", handler, { passive: true });
    window.addEventListener("resize", handler);

    return () => {
      window.removeEventListener("scroll", handler);
      window.removeEventListener("resize", handler);
    };
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname, location.hash]);

  const navLinks: NavLink[] = isListGenerator
    ? [
        { label: "Home", to: "/", active: location.pathname === "/" && !location.hash },
        {
          label: "Features",
          to: "/#features",
          active: location.pathname === "/" && location.hash === "#features",
        },
        {
          label: "How It Works",
          to: "/#how-it-works",
          active: location.pathname === "/" && location.hash === "#how-it-works",
        },
      ]
    : [
        {
          label: "Features",
          to: "/#features",
          active: location.pathname === "/" && location.hash === "#features",
        },
        {
          label: "How It Works",
          to: "/#how-it-works",
          active: location.pathname === "/" && location.hash === "#how-it-works",
        },
        { label: "List Generator", to: "/list-generator", active: isListGenerator },
      ];

  const { containerRef: magicContainerRef, magicRef } = useMagicArea({
    tweenBack: true,
  });

  const headerStatus = isListGenerator ? "AI shortlist workspace" : "AI-guided admissions";

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 transition-all duration-500 sm:px-4"
      >
        <div
          className={`mx-auto max-w-7xl overflow-hidden rounded-[30px] border transition-all duration-500 ${
            scrolled
              ? "glass-strong border-white/20 shadow-[0_24px_80px_rgba(2,6,23,0.45)]"
              : "border-white/10 bg-background/60 shadow-[0_16px_48px_rgba(2,6,23,0.28)] backdrop-blur-xl"
          }`}
        >
          <div
            className="h-px origin-left bg-gradient-to-r from-primary via-cyan-300 to-teal-300 transition-transform duration-300"
            style={{ transform: `scaleX(${Math.max(scrollProgress, 0.08)})` }}
          />

          <div className="flex items-center justify-between gap-3 px-3 py-3 sm:px-5">
            <div className="flex items-center gap-3">
              <AppLogo imageClassName="h-12 w-12 rounded-[20px]" />
              <div className="hidden lg:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-primary/90">
                <Sparkles className="h-3.5 w-3.5" />
                {headerStatus}
              </div>
            </div>

            <div
              ref={magicContainerRef}
              className="relative hidden items-center gap-1 rounded-full border border-white/10 bg-background/60 p-1 shadow-inner md:flex"
            >
              <div
                ref={magicRef}
                className="c-magic-area c-magic-area--menu"
                aria-hidden="true"
              />

              {navLinks.map((link) => (
                <motion.div
                  key={link.label}
                  whileHover={{ y: -1 }}
                  style={{ position: "relative", zIndex: 1 }}
                >
                  <Link
                    to={link.to}
                    className={`magic-item block rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${
                      link.active
                        ? "active text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="hidden items-center gap-3 md:flex">
              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-muted-foreground">
                4L+ cutoffs mapped
              </div>

              {!isListGenerator ? (
                <Button
                  asChild
                  className="rounded-full px-5 shadow-[0_16px_36px_rgba(59,130,246,0.24)]"
                >
                  <Link to="/list-generator">
                    Open Generator
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              ) : null}
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <div className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-primary">
                Live
              </div>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="rounded-2xl border border-white/10 bg-background/70 p-2.5 shadow-sm transition-colors hover:bg-primary/5"
                aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
              aria-label="Close mobile menu"
            />

            <motion.div
              initial={{ opacity: 0, y: -18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -18, scale: 0.98 }}
              transition={{ duration: 0.22 }}
              className="fixed left-3 right-3 top-24 z-50 overflow-hidden rounded-[30px] border border-white/15 bg-background/95 p-4 shadow-[0_30px_80px_rgba(2,6,23,0.55)] backdrop-blur-2xl md:hidden"
            >
              <div className="mb-4 rounded-[26px] border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between gap-3">
                  <AppLogo imageClassName="h-11 w-11" textClassName="text-left" />
                  <div className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-primary">
                    Menu
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Move through the platform faster with direct jumps to the main decision points.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className={`block rounded-2xl border px-4 py-3.5 text-sm font-semibold transition-colors ${
                        link.active
                          ? "border-primary/20 bg-primary/10 text-foreground"
                          : "border-transparent text-foreground hover:border-primary/10 hover:bg-primary/5"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 rounded-[24px] border border-white/10 bg-gradient-to-r from-primary/10 to-teal-400/10 p-4">
                <div className="flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  {headerStatus}
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  A focused experience for analysing colleges, shortlisting options, and refining CAP-round choices.
                </p>
                {!isListGenerator ? (
                  <Button asChild className="mt-4 h-12 w-full rounded-2xl">
                    <Link to="/list-generator" onClick={() => setMobileOpen(false)}>
                      Open Generator
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                ) : null}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
