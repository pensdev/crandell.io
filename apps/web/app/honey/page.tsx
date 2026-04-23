import Link from "next/link";
import { HoneyHeader } from "@/components/honey/HoneyHeader";
import { HoneyHeroActions } from "@/components/honey/HoneyHeroActions";
import { MotionSection } from "@/components/honey/MotionSection";
import { ServiceGrid, type ServiceItem } from "@/components/honey/ServiceGrid";

const services: ServiceItem[] = [
  {
    title: "Diagnostic survey",
    description:
      "Measured assessment of assembly, drainage, and wear — documented with clarity before any recommendation.",
  },
  {
    title: "Restoration",
    description:
      "Targeted repairs that honor existing structure: flashing, penetrations, and detail work executed to spec.",
  },
  {
    title: "Full replacement",
    description:
      "Complete envelope projects with layered protection, ventilation balance, and materials chosen for longevity.",
  },
  {
    title: "Ongoing care",
    description:
      "Seasonal reviews and aftercare so performance stays quiet and predictable year after year.",
  },
];

export default function HoneyHomePage() {
  return (
    <>
      <HoneyHeader />
      <main>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <MotionSection className="pt-24 pb-28 sm:pt-28 sm:pb-32 lg:pt-32 lg:pb-40">
            <div className="rounded-[2rem] border border-honey/15 bg-gradient-to-br from-honey-panel/90 via-honey-void to-honey-void p-10 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.75)] sm:p-12 lg:p-16 lg:px-20">
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-honey/90">
                Residential roofing atelier
              </p>
              <h1 className="mt-8 max-w-4xl text-4xl font-light leading-[1.08] tracking-tight text-parchment sm:text-5xl lg:text-6xl lg:leading-[1.06]">
                Rooflines composed with the same care as the rooms beneath them.
              </h1>
              <p className="mt-8 max-w-2xl text-lg leading-relaxed text-parchment/70">
                Honey Roofing is a prototype concept for discerning homeowners
                who expect discretion, precise craft, and materials chosen for
                decades — not seasons.
              </p>
              <HoneyHeroActions />
            </div>
          </MotionSection>

          <MotionSection
            id="expertise"
            aria-labelledby="expertise-heading"
            className="pb-24 lg:pb-32"
          >
            <div className="rounded-[2rem] border border-honey/12 bg-honey-panel/40 p-10 sm:p-12 lg:p-14">
              <div className="max-w-3xl">
                <h2
                  id="expertise-heading"
                  className="text-xs font-medium uppercase tracking-[0.28em] text-honey/85"
                >
                  Expertise
                </h2>
                <p className="mt-4 text-3xl font-light tracking-tight text-parchment sm:text-4xl">
                  A calm, editorial approach to protection overhead.
                </p>
                <p className="mt-6 max-w-2xl text-base leading-relaxed text-parchment/65">
                  Each engagement begins with listening — to the architecture,
                  the climate, and how you live. Deliverables are spare;
                  execution is exhaustive.
                </p>
              </div>
              <div className="mt-14">
                <ServiceGrid services={services} />
              </div>
            </div>
          </MotionSection>

          <MotionSection
            id="process"
            aria-labelledby="process-heading"
            className="pb-24 lg:pb-32"
          >
            <div className="rounded-[2rem] border border-honey/12 bg-honey-void p-10 sm:p-12 lg:p-14">
              <h2
                id="process-heading"
                className="text-xs font-medium uppercase tracking-[0.28em] text-honey/85"
              >
                Process
              </h2>
              <p className="mt-4 max-w-2xl text-3xl font-light tracking-tight text-parchment sm:text-4xl">
                Four quiet movements from first conversation to handoff.
              </p>
              <ol className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
                {[
                  {
                    step: "01",
                    title: "Site dialogue",
                    body: "Walk the roof plane together; note detail, sun, and drainage in real conditions.",
                  },
                  {
                    step: "02",
                    title: "Specification",
                    body: "A single written scope — layers, products, and sequence — without ambiguity.",
                  },
                  {
                    step: "03",
                    title: "Installation",
                    body: "Crews trained to our standard; supervision present until the last fastener is seated.",
                  },
                  {
                    step: "04",
                    title: "Archive",
                    body: "Photo log, warranty registry, and a concise care note for your records.",
                  },
                ].map((row) => (
                  <li key={row.step} className="relative pl-14">
                    <span
                      className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-honey/25 text-xs font-semibold text-honey-bright"
                      aria-hidden
                    >
                      {row.step}
                    </span>
                    <h3 className="text-lg font-medium text-parchment">
                      {row.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-parchment/60">
                      {row.body}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </MotionSection>

          <MotionSection
            id="proof"
            aria-labelledby="proof-heading"
            className="pb-24 lg:pb-32"
          >
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-[2rem] border border-honey/12 bg-honey-panel/50 p-10 lg:p-12">
                <h2
                  id="proof-heading"
                  className="text-xs font-medium uppercase tracking-[0.28em] text-honey/85"
                >
                  Proof
                </h2>
                <figure className="mt-10">
                  <blockquote className="text-xl font-light leading-snug text-parchment sm:text-2xl">
                    “No drama on site. The crew moved like a practiced studio —
                    and the ridge line has never looked so composed.”
                  </blockquote>
                  <figcaption className="mt-8 text-sm text-parchment/50">
                    — Private residence, Pacific Northwest
                    <span className="text-parchment/35"> · prototype quote</span>
                  </figcaption>
                </figure>
              </div>
              <div className="flex flex-col justify-between rounded-[2rem] border border-honey/12 bg-honey-panel/30 p-10 lg:p-12">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.28em] text-honey/85">
                    Credentials
                  </p>
                  <ul className="mt-8 space-y-4 text-sm leading-relaxed text-parchment/65">
                    <li className="flex gap-3">
                      <span className="text-honey" aria-hidden>
                        ·
                      </span>
                      Licensed, bonded, insured — placeholder credentials for
                      this demo.
                    </li>
                    <li className="flex gap-3">
                      <span className="text-honey" aria-hidden>
                        ·
                      </span>
                      Manufacturer partnerships available on request.
                    </li>
                    <li className="flex gap-3">
                      <span className="text-honey" aria-hidden>
                        ·
                      </span>
                      Warranty documentation delivered at closeout.
                    </li>
                  </ul>
                </div>
                <p className="mt-10 text-xs leading-relaxed text-parchment/40">
                  This page is a design prototype only; Honey Roofing is not a
                  live business entity on this domain.
                </p>
              </div>
            </div>
          </MotionSection>

          <MotionSection
            id="contact"
            aria-labelledby="contact-heading"
            className="pb-28 lg:pb-36"
          >
            <div className="rounded-[2rem] border border-honey/20 bg-gradient-to-br from-amber-deep/25 via-honey-panel/60 to-honey-void p-10 sm:p-12 lg:p-14">
              <h2
                id="contact-heading"
                className="text-xs font-medium uppercase tracking-[0.28em] text-honey-bright"
              >
                Contact
              </h2>
              <p className="mt-6 max-w-2xl text-3xl font-light tracking-tight text-parchment sm:text-4xl">
                Begin with a conversation — not a sales pitch.
              </p>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-parchment/70">
                For this prototype, reach out via placeholder channels. On a
                production site, this panel would anchor a short form or
                calendar link.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="mailto:hello@honeyroofing.example"
                  className="inline-flex items-center rounded-full bg-parchment px-7 py-3.5 text-sm font-semibold text-honey-void transition-opacity hover:opacity-90"
                >
                  hello@honeyroofing.example
                </Link>
                <Link
                  href="tel:+15550000000"
                  className="inline-flex items-center rounded-full border border-parchment/30 px-7 py-3.5 text-sm font-medium text-parchment transition-colors hover:border-honey/45"
                >
                  +1 (555) 000-0000
                </Link>
              </div>
            </div>
          </MotionSection>
        </div>
      </main>

      <footer className="border-t border-honey/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-12 text-sm text-parchment/45 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>© {new Date().getFullYear()} Honey Roofing — concept prototype.</p>
          <Link
            href="/"
            className="text-parchment/55 underline-offset-4 transition-colors hover:text-honey/90 hover:underline"
          >
            crandell.io — main site
          </Link>
        </div>
      </footer>
    </>
  );
}
