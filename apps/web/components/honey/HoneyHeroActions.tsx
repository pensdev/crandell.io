"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

export function HoneyHeroActions() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="mt-12 flex flex-wrap items-center gap-4">
      <motion.div whileHover={reduceMotion ? undefined : { y: -2 }}>
        <Link
          href="#contact"
          className="inline-flex items-center rounded-full bg-honey px-7 py-3.5 text-sm font-semibold text-honey-void transition-colors hover:bg-honey-bright"
        >
          Schedule a consultation
        </Link>
      </motion.div>
      <motion.div whileHover={reduceMotion ? undefined : { y: -2 }}>
        <Link
          href="tel:+15550000000"
          className="inline-flex items-center rounded-full border border-parchment/25 px-7 py-3.5 text-sm font-medium text-parchment/90 transition-colors hover:border-honey/40 hover:text-parchment"
        >
          Call the studio
        </Link>
      </motion.div>
    </div>
  );
}
