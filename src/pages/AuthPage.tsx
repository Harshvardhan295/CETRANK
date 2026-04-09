import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { AuthError } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type AuthMode = "login" | "signup";

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [mode, setMode] = useState<AuthMode>(
    searchParams.get("mode") === "signup" ? "signup" : "login",
  );
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // The path the user tried to access before being redirected to login
  const from = location.state?.from?.pathname || "/";
  const isLogin = mode === "login";

  useEffect(() => {
    const nextMode = searchParams.get("mode") === "signup" ? "signup" : "login";
    setMode(nextMode);
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [from, navigate, user]);

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setSearchParams(nextMode === "signup" ? { mode: "signup" } : {}, { replace: true });
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });

        if (error) throw error;

        toast.success("Logged in successfully!");
        navigate(from, { replace: true });
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
      });

      if (error) throw error;

      if (data.session) {
        toast.success("Account created and logged in!");
        navigate(from, { replace: true });
      } else {
        toast.success("Signup successful! Please check your email to confirm your account.");
        switchMode("login");
      }
    } catch (error) {
      const message =
        error instanceof AuthError ? error.message : "Authentication failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="w-full max-w-md rounded-lg border bg-card p-8 shadow-sm">
        <h2 className="mb-6 text-2xl font-bold text-center">
          {isLogin ? "Welcome Back" : "Create an Account"}
        </h2>
        <div className="mb-6 grid grid-cols-2 gap-2 rounded-lg bg-muted p-1">
          <Button
            type="button"
            variant={isLogin ? "default" : "ghost"}
            onClick={() => switchMode("login")}
          >
            Sign In
          </Button>
          <Button
            type="button"
            variant={!isLogin ? "default" : "ghost"}
            onClick={() => switchMode("signup")}
          >
            Sign Up
          </Button>
        </div>
        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            className="text-primary hover:underline"
            onClick={() => switchMode(isLogin ? "signup" : "login")}
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
