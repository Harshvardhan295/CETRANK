import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Zap } from "lucide-react";
import { motion } from "framer-motion";

export function Navbar() {
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 glass-strong"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center glow-subtle">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              CET<span className="text-primary">RANK</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {!isDashboard && (
              <Link
                to="/dashboard"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
            )}
            {isDashboard && (
              <Link
                to="/"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </Link>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
