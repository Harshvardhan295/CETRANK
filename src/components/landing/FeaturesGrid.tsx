import { motion } from "framer-motion";
import { Brain, Filter, FileText, BarChart3 } from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Prediction Engine",
    description: "AI-powered probability gauges with historical cutoff analysis across 3 years of CET data.",
  },
  {
    icon: Brain,
    title: "AI Counselor",
    description: "RAG-powered digital counselor that reasons through admission rules step-by-step.",
  },
  {
    icon: Filter,
    title: "Smart Filters",
    description: "Intelligent filtering by category, university, city, branch — recalculates 4L+ data points in real-time.",
  },
  {
    icon: FileText,
    title: "Explainable Reports",
    description: "Transparent recommendations with clear reasoning. Download detailed PDF reports for counselling.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function FeaturesGrid() {
  return (
    <section id="features" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Built for <span className="text-gradient">Precision</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Every feature designed to eliminate uncertainty from your admission journey.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              whileHover={{ scale: 1.02, y: -4 }}
              className="group relative rounded-2xl glass p-8 hover:glow-subtle transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
