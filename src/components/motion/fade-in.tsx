"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** direction the element slides in from */
  from?: "up" | "down" | "left" | "right" | "none";
  once?: boolean;
}

const offset = {
  up: { opacity: 0, y: 24 },
  down: { opacity: 0, y: -24 },
  left: { opacity: 0, x: -24 },
  right: { opacity: 0, x: 24 },
  none: { opacity: 0 },
};

export function FadeIn({ children, className, delay = 0, from = "up", once = true }: FadeInProps) {
  return (
    <motion.div
      className={className}
      initial={offset[from]}
      whileInView={once ? { opacity: 1, x: 0, y: 0 } : undefined}
      animate={once ? undefined : { opacity: 1, x: 0, y: 0 }}
      viewport={once ? { once: true, margin: "-80px" } : undefined}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({ children, className, gap = 0.08 }: { children: ReactNode; className?: string; gap?: number }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{ visible: { transition: { staggerChildren: gap } } }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
      }}
    >
      {children}
    </motion.div>
  );
}