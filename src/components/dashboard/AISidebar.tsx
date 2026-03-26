import { motion, AnimatePresence } from "framer-motion";
import { Bot, ChevronLeft, ChevronRight, Send, Sparkles, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const MOCK_THOUGHTS = [
  "> Loading CET Rule Documents...",
  "> Parsing cutoff data for 2023-2025...",
  "> Applying Home University preference...",
  "> Evaluating category: GOPEN...",
  "> Cross-referencing 4,12,000 records...",
  "> Ranking colleges by eligibility...",
  "> ✓ Analysis complete.",
];

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AISidebar() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm your AI Admission Counselor. Ask me anything about CET admissions, college selection, or counselling strategy.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [thoughts, setThoughts] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thoughts]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    setIsThinking(true);
    setThoughts([]);

    MOCK_THOUGHTS.forEach((thought, i) => {
      setTimeout(() => {
        setThoughts((prev) => [...prev, thought]);
      }, (i + 1) * 400);
    });

    setTimeout(() => {
      setIsThinking(false);
      setThoughts([]);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "This is a preview of the AI Counselor. The full chatbot integration with RAG pipeline will provide detailed, context-aware responses about your admission profile. Stay tuned! 🎓",
        },
      ]);
    }, MOCK_THOUGHTS.length * 400 + 500);
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed right-4 bottom-6 z-40 rounded-2xl p-4 transition-all group"
        style={{
          background: "linear-gradient(135deg, hsl(250 89% 62%), hsl(280 80% 60%))",
          boxShadow: "0 8px 30px rgba(124, 58, 237, 0.35)",
        }}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 1 }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-5 h-5 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="bot"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              className="relative"
            >
              <Bot className="w-5 h-5 text-white" />
              {/* Notification dot */}
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Sidebar */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
              onClick={() => setOpen(false)}
            />

            <motion.div
              initial={{ x: "110%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "110%", opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-96 z-30 flex flex-col"
              style={{
                background: "hsl(var(--card) / 0.95)",
                backdropFilter: "blur(40px)",
                borderLeft: "1px solid hsl(var(--border) / 0.5)",
              }}
            >
              {/* Header */}
              <div className="p-5 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, hsl(250 89% 62% / 0.15), hsl(280 80% 60% / 0.15))",
                    }}
                  >
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold font-['Outfit']">AI Counselor</h3>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <p className="text-[10px] text-muted-foreground font-medium">
                        Powered by RAG + LangGraph
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-2xl rounded-br-md shadow-lg shadow-primary/10"
                          : "bg-secondary/50 text-foreground rounded-2xl rounded-bl-md border border-border/30"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </motion.div>
                ))}

                {/* Thinking stream */}
                {isThinking && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-1"
                  >
                    <div className="rounded-xl bg-secondary/30 p-4 font-mono text-[11px] text-muted-foreground space-y-1.5 border border-border/20">
                      {thoughts.map((t, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center gap-1.5"
                        >
                          <Sparkles className="w-2.5 h-2.5 text-primary shrink-0" />
                          <span>{t}</span>
                        </motion.div>
                      ))}
                      <div className="flex gap-1.5 mt-3">
                        <span className="typing-dot w-1.5 h-1.5 rounded-full bg-primary" />
                        <span className="typing-dot w-1.5 h-1.5 rounded-full bg-primary" />
                        <span className="typing-dot w-1.5 h-1.5 rounded-full bg-primary" />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border/50">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex gap-2"
                >
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about admissions..."
                    className="flex-1 rounded-xl bg-secondary/30 border-border/30 focus:border-primary/50"
                    disabled={isThinking}
                  />
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      type="submit"
                      size="icon"
                      disabled={isThinking || !input.trim()}
                      className="rounded-xl shrink-0 glow-subtle"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </motion.div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
