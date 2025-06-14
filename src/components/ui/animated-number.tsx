"use client";

import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";

interface AnimatedNumberProps {
  value: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export function AnimatedNumber({
  value,
  suffix = "",
  prefix = "",
  className = "",
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: "0px 0px -100px 0px" });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [motionValue, isInView, value]);

  useEffect(() => {
    springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${Math.floor(latest)}${suffix}`;
      }
    });
  }, [springValue, prefix, suffix]);

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={className}
    >
      {prefix}0{suffix}
    </motion.span>
  );
}
