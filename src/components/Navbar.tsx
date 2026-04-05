import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Menu, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useMagicArea } from "./effects/MagicArea";
import { Button } from "./ui/button";
import { AppLogo } from "./AppLogo";

export function Navbar() {
  const location = useLocation();
  const isListGenerator = location.pathname === "/list-generator";
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = isListGenerator
    ? [{ label: "Home", to: "/" }]
    : [
        { label: "Features", to: "#features" },
        { label: "How It Works", to: "#how-it-works" },
        { label: "List Generator", to: "/list-generator" },
      ];

  const { containerRef: magicContainerRef, magicRef } = useMagicArea({
    tweenBack: true,
  });

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
        className="fixed top-0 left-0 right-0 z-50 px-3 pt-3 transition-all duration-500 sm:px-4"
      >
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between rounded-[28px] border px-3 py-2 transition-all duration-500 sm:px-5 ${
            scrolled
              ? "glass-strong border-white/20 shadow-[0_20px_60px_rgba(15,23,42,0.18)] backdrop-blur-2xl"
              : "border-white/10 bg-background/55 shadow-[0_12px_40px_rgba(15,23,42,0.10)] backdrop-blur-xl"
          }`}
        >
          <div className="flex items-center gap-3">
            <AppLogo imageClassName="h-12 w-12" />
            
          </div>

          <div
            ref={magicContainerRef}
            className="relative hidden md:flex items-center gap-1 rounded-full border border-white/10 bg-background/65 p-1 shadow-inner"
          >
            <div
              ref={magicRef}
              className="c-magic-area c-magic-area--menu"
              aria-hidden="true"
            />

            {navLinks.map((link) => {
              const isActive = link.to === location.pathname;
              const linkClassName = `magic-item block rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${
                isActive
                  ? "active text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`;

              return (
                <motion.div
                  key={link.label}
                  whileHover={{ y: -1 }}
                  style={{ position: "relative", zIndex: 1 }}
                >
                  {link.to.startsWith("#") ? (
                    <a href={link.to} className={linkClassName}>
                      {link.label}
                    </a>
                  ) : (
                    <Link to={link.to} className={linkClassName}>
                      {link.label}
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            {!isListGenerator ? (
              <Button asChild className="rounded-full px-5 shadow-[0_12px_30px_rgba(59,130,246,0.22)]">
                <Link to="/list-generator">Open Generator</Link>
              </Button>
            ) : null}
          </div>

          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-2xl border border-white/10 bg-background/70 p-2.5 shadow-sm transition-colors hover:bg-primary/5"
              aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
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
              className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
              aria-label="Close mobile menu"
            />
            <motion.div
              initial={{ opacity: 0, y: -18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -18, scale: 0.98 }}
              transition={{ duration: 0.22 }}
              className="fixed left-3 right-3 top-24 z-50 overflow-hidden rounded-[28px] border border-white/15 bg-background/92 p-4 shadow-[0_30px_80px_rgba(15,23,42,0.28)] backdrop-blur-2xl md:hidden"
            >
              <div className="mb-4 flex items-center justify-between rounded-2xl bg-primary/5 px-3 py-3">
                <AppLogo imageClassName="h-11 w-11" textClassName="text-left" />
                <div className="rounded-full border border-primary/20 bg-background px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-primary/75">
                  Menu
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 }}
                  >
                    {link.to.startsWith("#") ? (
                      <a
                        href={link.to}
                        onClick={() => setMobileOpen(false)}
                        className="block rounded-2xl border border-transparent px-4 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/10 hover:bg-primary/5"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.to}
                        onClick={() => setMobileOpen(false)}
                        className="block rounded-2xl border border-transparent px-4 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/10 hover:bg-primary/5"
                      >
                        {link.label}
                      </Link>
                    )}
                  </motion.div>
                ))}
              </div>

              {!isListGenerator ? (
                <Button asChild className="mt-4 h-12 w-full rounded-2xl">
                  <Link to="/list-generator" onClick={() => setMobileOpen(false)}>
                    Open Generator
                  </Link>
                </Button>
              ) : null}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
