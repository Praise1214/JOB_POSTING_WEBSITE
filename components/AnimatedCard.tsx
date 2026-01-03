"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface AnimatedCardProps {
  children: React.ReactNode;
  delay?: number;
}

export default function AnimatedCard({
  children,
  delay = 0,
}: AnimatedCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    // Initial load animation
    gsap.fromTo(
      cardRef.current,
      {
        opacity: 0,
        y: 50,
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        delay,
        ease: "back.out",
      }
    );

    // Hover animation
    const onMouseEnter = () => {
      gsap.to(cardRef.current, {
        y: -5,
        boxShadow: "0 20px 40px rgba(16, 185, 129, 0.2)",
        duration: 0.3,
      });
    };

    const onMouseLeave = () => {
      gsap.to(cardRef.current, {
        y: 0,
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        duration: 0.3,
      });
    };

    const card = cardRef.current;
    card.addEventListener("mouseenter", onMouseEnter);
    card.addEventListener("mouseleave", onMouseLeave);

    return () => {
      card.removeEventListener("mouseenter", onMouseEnter);
      card.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [delay]);

  return (
    <div ref={cardRef} className="transition-all">
      {children}
    </div>
  );
}
