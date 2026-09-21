'use client';

import Link from 'next/link';
import { BRAND, PROPUESTAS } from '@/lib/data';
import { AvatarMarca, Claim, ThemeToggle } from '@/components/brand/Marca';
import { MeshBackground, Reveal } from '@/components/motion';

const HAIRLINE = 'border-[rgb(var(--line)/var(--line-a))]';

export default function Index() {
  return (
    <main className="relative min-h-svh overflow-hidden">
      <MeshBackground variant="dark" grid={false} />
      <ThemeToggle className="fixed right-4 top-4 z-40 sm:right-8 sm:top-5" />

      <div className="relative mx-auto max-w-[1000px] px-5 py-16 sm:px-8 sm:py-24">
        <Reveal>
          <AvatarMarca size="lg" />
          <h1 className="mt-6 font-display text-[clamp(2.2rem,9vw,4.6rem)] uppercase leading-[0.84] tracking-[-.02em]">
            {BRAND.nombre}
          </h1>
          <Claim className="mt-4 text-[clamp(1.3rem,5vw,2rem)]" />
        </Reveal>

        <Reveal delay={0.1} className="mt-6 max-w-[58ch]">
          <p className="text-[14.5px] leading-relaxed text-[rgb(var(--fg-muted))] text-pretty">
            Tres propuestas de landing de donaciones. Mismo contenido, mismo sistema visual: lo que
            cambia en cada una es la forma de moverse por la página.
          </p>
        </Reveal>

        <div className="mt-12">
          {PROPUESTAS.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.08}>
              <Link
                href={`/${p.slug}`}
                className={`group flex items-start gap-5 border-t ${HAIRLINE} py-7 transition-colors hover:bg-[rgb(var(--fg)/.04)] sm:gap-10 ${
                  i === PROPUESTAS.length - 1 ? `border-b ${HAIRLINE}` : ''
                }`}
              >
                <span className="font-display text-[13px] tabular-nums text-[rgb(var(--fg-muted))]">
                  {p.numero}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-[clamp(1.5rem,6vw,2.4rem)] uppercase leading-none tracking-tight">
                    {p.nombre}
                  </span>
                  <span className="mt-2 block font-marker text-[19px] leading-tight text-[rgb(var(--accent))]">
                    {p.lema}
                  </span>
                  <span className="mt-3 block max-w-[54ch] text-[13px] leading-relaxed text-[rgb(var(--fg-muted))]">
                    {p.resumen}
                  </span>
                  <span className="mt-3 block text-[11.5px] text-[rgb(var(--fg-muted))]">
                    {p.navegacion}
                    <span className="mx-2 opacity-50">/</span>
                    {p.modo}
                  </span>
                </span>
                <svg
                  viewBox="0 0 24 24"
                  className="mt-2 h-5 w-5 shrink-0 text-[rgb(var(--fg-muted))] transition-transform duration-300 group-hover:translate-x-1.5 group-hover:text-[rgb(var(--fg))]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M5 12h13M13 6l6 6-6 6" />
                </svg>
              </Link>
            </Reveal>
          ))}
        </div>

        <p className="mt-10 max-w-[62ch] text-[12px] leading-relaxed text-[rgb(var(--fg-muted))]">
          Las fotos, videos y shorts son espacios reservados con su proporción y medida final. El
          análisis comparativo está en <span className="text-[rgb(var(--fg))]">ANALISIS-UX-UI.md</span>.
        </p>
      </div>
    </main>
  );
}
