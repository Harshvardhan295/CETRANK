import { motion, AnimatePresence } from "framer-motion";
import { Bot, ChevronLeft, ChevronRight, Send } from "lucide-react";
import { useState } from "react";
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
      content: "Hi! I'm your AI Admission Counselor. Ask me anything about CET admissions, college selection, or counselling strategy.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [thoughts, setThoughts] = useState<string[]>([]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    setIsThinking(true);
    setThoughts([]);

    // Simulate thinking stream
    MOCK_THOUGHTS.forEach((thought, i) => {
      setTimeout(() => {
        setThoughts((prev) => [...prev, thought]);
      }, (i + 1) * 400);
    });

    // Simulate response
    setTimeout(() => {
      setIsThinking(false);
      setThoughts([]);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "This is a preview of the AI Counselor. The full chatbot integration with RAG pipeline will provide detailed, context-aware responses about your admission profile. Stay tuned! 🎓",
        },
      ]);
    }, MOCK_THOUGHTS.length * 400 + 500);
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40 glass-strong rounded-l-xl p-3 hover:bg-primary/10 transition-colors"
        whileHover={{ x: -4 }}
      >
        {open ? (
          <ChevronRight className="w-5 h-5 text-primary" />
        ) : (
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          </div>
        )}
      </motion.button>

      {/* Sidebar */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-80 md:w-96 z-30 glass-strong border-l border-border flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center gap-3 pt-20">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">AI Counselor</h3>
                <p className="text-[10px] text-muted-foreground">Powered by RAG + LangGraph</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-xl text-sm ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-secondary text-foreground rounded-bl-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {/* Thinking stream */}
              {isThinking && (
                <div className="space-y-1">
                  <div className="rounded-lg bg-secondary/50 p-3 font-mono text-[11px] text-muted-foreground space-y-1">
                    {thoughts.map((t, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        {t}
                      </motion.div>
                    ))}
                    <div className="flex gap-1 mt-2">
                      <span className="typing-dot w-1.5 h-1.5 rounded-full bg-primary" />
                      <span className="typing-dot w-1.5 h-1.5 rounded-full bg-primary" />
                      <span className="typing-dot w-1.5 h-1.5 rounded-full bg-primary" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
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
                  className="flex-1 rounded-xl"
                  disabled={isThinking}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={isThinking || !input.trim()}
                  className="rounded-xl shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
