"use client";

import { motion, useReducedMotion } from "framer-motion";

type MotionSectionProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
  "aria-labelledby"?: string;
};

export function MotionSection({
  children,
  className,
  id,
  "aria-labelledby": ariaLabelledby,
}: MotionSectionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      id={id}
      aria-labelledby={ariaLabelledby}
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  );
}
