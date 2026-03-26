import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useGSAPScrollReveal(options?: {
  y?: number;
  duration?: number;
  stagger?: number;
  delay?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const children = containerRef.current.querySelectorAll("[data-gsap]");
    if (children.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.from(children, {
        y: options?.y ?? 60,
        opacity: 0,
        duration: options?.duration ?? 1,
        stagger: options?.stagger ?? 0.15,
        delay: options?.delay ?? 0,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          end: "bottom 15%",
          toggleActions: "play none none reverse",
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [options?.y, options?.duration, options?.stagger, options?.delay]);

  return containerRef;
}

export function useGSAPParallax(speed: number = 0.3) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        y: () => speed * 100,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [speed]);

  return ref;
}

export function useGSAPTextReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      const chars = ref.current?.querySelectorAll(".char");
      if (!chars || chars.length === 0) return;

      gsap.from(chars, {
        y: 120,
        opacity: 0,
        rotateX: -80,
        stagger: 0.03,
        duration: 0.8,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return ref;
}

export function useGSAPCounter(
  endValue: number,
  options?: { duration?: number; suffix?: string }
) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      const obj = { val: 0 };
      gsap.to(obj, {
        val: endValue,
        duration: options?.duration ?? 2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
        onUpdate: () => {
          if (ref.current) {
            const formatted =
              endValue >= 1000
                ? Math.round(obj.val / 1000) + (endValue >= 100000 ? "L" : "K")
                : Math.round(obj.val).toString();
            ref.current.textContent = formatted + (options?.suffix ?? "");
          }
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [endValue, options?.duration, options?.suffix]);

  return ref;
}

export function useGSAPMagnetic() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      gsap.to(el, {
        x: x * 0.2,
        y: y * 0.2,
        duration: 0.4,
        ease: "power2.out",
      });
    };

    const handleLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.3)",
      });
    };

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);

    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return ref;
}
