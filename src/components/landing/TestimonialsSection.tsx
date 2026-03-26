import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Quote, Star } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    name: "Priya Sharma",
    college: "COEP, Pune",
    branch: "Computer Engineering",
    text: "CETRANK predicted my exact college with 92% accuracy. The AI counselor helped me understand my options when I was confused about the counselling process.",
    rating: 5,
    avatar: "PS",
    color: "from-blue-500 to-blue-700",
  },
  {
    name: "Arjun Patil",
    college: "VJTI, Mumbai",
    branch: "Electronics & Telecom",
    text: "The probability gauges were incredibly helpful. I could see exactly where I stood for each college and made informed decisions during each CAP round.",
    rating: 5,
    avatar: "AP",
    color: "from-sky-500 to-cyan-600",
  },
  {
    name: "Sneha Kulkarni",
    college: "WCE, Sangli",
    branch: "Information Technology",
    text: "What sets CETRANK apart is the explainable reports. I didn't just get recommendations — I understood WHY each college was suggested.",
    rating: 5,
    avatar: "SK",
    color: "from-emerald-500 to-teal-600",
  },
];

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".testimonial-card", {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-28 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial opacity-30 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-semibold text-primary uppercase tracking-wider mb-6">
            Testimonials
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 font-['Outfit']">
            Loved by <span className="text-gradient">Students</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-lg">
            See how CETRANK has helped students navigate their admission journey.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="testimonial-card glass rounded-2xl p-6 relative group card-beam"
            >
              {/* Quote icon */}
              <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="w-10 h-10" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star
                    key={j}
                    className="w-4 h-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                "{t.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-xs font-bold`}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {t.college} · {t.branch}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
