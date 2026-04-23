"use client";

import { motion, useReducedMotion } from "framer-motion";

export type ServiceItem = {
  title: string;
  description: string;
};

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export function ServiceGrid({ services }: { services: ServiceItem[] }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((s) => (
          <div
            key={s.title}
            className="rounded-2xl border border-honey/15 bg-honey-panel/80 p-6 shadow-[0_0_0_1px_rgba(245,194,66,0.04)]"
          >
            <h3 className="text-lg font-medium tracking-tight text-parchment">
              {s.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-parchment/65">
              {s.description}
            </p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px" }}
    >
      {services.map((s) => (
        <motion.article
          key={s.title}
          variants={item}
          whileHover={{
            y: -3,
            transition: { duration: 0.2 },
          }}
          className="rounded-2xl border border-honey/15 bg-honey-panel/80 p-6 shadow-[0_0_0_1px_rgba(245,194,66,0.04)]"
        >
          <h3 className="text-lg font-medium tracking-tight text-parchment">
            {s.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-parchment/65">
            {s.description}
          </p>
        </motion.article>
      ))}
    </motion.div>
  );
}
