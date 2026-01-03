"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export default function AnimatedButton({
  children,
  onClick,
  className = "",
  type = "button",
}: AnimatedButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!btnRef.current) return;

    const btn = btnRef.current;

    const onMouseEnter = () => {
      gsap.to(btn, {
        scale: 1.05,
        duration: 0.2,
      });
    };

    const onMouseLeave = () => {
      gsap.to(btn, {
        scale: 1,
        duration: 0.2,
      });
    };

    const onMouseDown = () => {
      gsap.to(btn, {
        scale: 0.98,
        duration: 0.1,
      });
    };

    const onMouseUp = () => {
      gsap.to(btn, {
        scale: 1.05,
        duration: 0.1,
      });
    };

    btn.addEventListener("mouseenter", onMouseEnter);
    btn.addEventListener("mouseleave", onMouseLeave);
    btn.addEventListener("mousedown", onMouseDown);
    btn.addEventListener("mouseup", onMouseUp);

    return () => {
      btn.removeEventListener("mouseenter", onMouseEnter);
      btn.removeEventListener("mouseleave", onMouseLeave);
      btn.removeEventListener("mousedown", onMouseDown);
      btn.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return (
    <button
      ref={btnRef}
      type={type}
      onClick={onClick}
      className={`transform transition-all ${className}`}
    >
      {children}
    </button>
  );
}
