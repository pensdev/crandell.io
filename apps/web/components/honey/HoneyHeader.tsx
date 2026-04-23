"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

const nav = [
  { href: "#expertise", label: "Expertise" },
  { href: "#process", label: "Process" },
  { href: "#proof", label: "Proof" },
  { href: "#contact", label: "Contact" },
];

export function HoneyHeader() {
  const reduceMotion = useReducedMotion();

  return (
    <header className="sticky top-0 z-50 border-b border-honey/10 bg-honey-void/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5 lg:px-8">
        <Link
          href="/honey/"
          className="text-sm font-medium tracking-[0.2em] text-parchment uppercase"
        >
          Honey
          <span className="text-honey"> · </span>
          <span className="font-normal tracking-[0.14em] text-parchment/90">
            Roofing
          </span>
        </Link>
        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="Primary"
        >
          {nav.map(({ href, label }) => (
            <motion.div key={href} whileHover={reduceMotion ? undefined : { y: -1 }}>
              <Link
                href={href}
                className="text-sm text-parchment/70 transition-colors hover:text-parchment"
              >
                {label}
              </Link>
            </motion.div>
          ))}
        </nav>
        <motion.div whileHover={reduceMotion ? undefined : { scale: 1.02 }}>
          <Link
            href="#contact"
            className="inline-flex items-center rounded-full border border-honey/35 bg-honey/10 px-5 py-2.5 text-sm font-medium text-honey-bright transition-colors hover:border-honey/55 hover:bg-honey/15"
          >
            Request a visit
          </Link>
        </motion.div>
      </div>
    </header>
  );
}
