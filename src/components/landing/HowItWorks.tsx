import { motion } from "framer-motion";
import { UserCheck, SlidersHorizontal, GraduationCap } from "lucide-react";

const steps = [
  {
    icon: UserCheck,
    title: "Enter Your Profile",
    description: "Provide your percentile, category, home university, and preferences.",
  },
  {
    icon: SlidersHorizontal,
    title: "AI Analyzes & Filters",
    description: "Our engine cross-references 4L+ cutoff records against CET Cell allocation rules.",
  },
  {
    icon: GraduationCap,
    title: "Get Ranked Recommendations",
    description: "Receive a probability-ranked college list personalized for your profile.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How It <span className="text-gradient">Works</span>
          </h2>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-border" />

          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                className="relative flex items-start gap-6 pl-2"
              >
                <div className="relative z-10 w-14 h-14 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center shrink-0">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="pt-2">
                  <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                    Step {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
