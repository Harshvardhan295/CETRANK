import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Zap, Menu, X } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useState, useEffect } from "react";

export function Navbar() {
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 100], [0, 1]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = isDashboard
    ? [{ label: "Home", to: "/" }]
    : [
        { label: "Features", to: "#features" },
        { label: "How It Works", to: "#how-it-works" },
        { label: "Dashboard", to: "/dashboard" },
      ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "glass-strong shadow-lg shadow-black/5"
            : "bg-transparent border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
                className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-purple-400 flex items-center justify-center shadow-lg shadow-primary/25"
              >
                <Zap className="w-5 h-5 text-white" />
                <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
              <span className="text-lg font-bold tracking-tight font-['Outfit']">
                CET<span className="text-gradient-static">RANK</span>
              </span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <motion.div key={link.label} whileHover={{ y: -1 }}>
                  {link.to.startsWith("#") ? (
                    <a
                      href={link.to}
                      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-lg hover:bg-primary/5"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.to}
                      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-lg hover:bg-primary/5"
                    >
                      {link.label}
                    </Link>
                  )}
                </motion.div>
              ))}
              <div className="ml-2 pl-2 border-l border-border">
                <ThemeToggle />
              </div>
            </div>

            {/* Mobile toggle */}
            <div className="md:hidden flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 rounded-lg hover:bg-primary/5 transition-colors"
              >
                {mobileOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 glass-strong border-b border-border p-4 md:hidden"
          >
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
                      className="block px-4 py-3 text-sm font-medium rounded-lg hover:bg-primary/5 transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className="block px-4 py-3 text-sm font-medium rounded-lg hover:bg-primary/5 transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
