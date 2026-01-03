"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

interface CountUpProps {
  end: number;
  duration?: number;
  suffix?: string;
  delay?: number;
}

export default function CountUp({
  end,
  duration = 2,
  suffix = "",
  delay = 0,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const obj = { count: 0 };

    gsap.to(obj, {
      count: end,
      duration,
      delay,
      ease: "power2.out",
      onUpdate: () => {
        if (ref.current) {
          ref.current.textContent =
            Math.floor(obj.count).toLocaleString() + suffix;
        }
      },
    });
  }, [end, duration, suffix, delay]);

  return <span ref={ref}>0{suffix}</span>;
}
