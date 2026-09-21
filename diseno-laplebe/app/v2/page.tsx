'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { BRAND, FRENTES, TARJETAS, type Frente, type TarjetaAccion } from '@/lib/data';
import {
  AvatarMarca,
  Claim,
  IconTikTok,
  IconoFrente,
  ThemeToggle,
  Titulo,
} from '@/components/brand/Marca';
import { MediaPlaceholder } from '@/components/brand/MediaPlaceholder';
import { useTemaVariante } from '@/components/brand/useTemaVariante';
import { DonationSheet } from '@/components/donate/DonationSheet';
import { MediosDeDonacion } from '@/components/donate/DonacionUI';
import { TarjetaAccionUI } from '@/components/nav/TarjetaAccion';
import { BloqueEmpresas, PieDePagina } from '@/components/secciones/Comunes';
import { EASE, Reveal, ScrollProgress } from '@/components/motion';

const HAIRLINE = 'border-[rgb(var(--line)/var(--line-a))]';

/**
 * PROPUESTA 02 — «Scroll natural»
 * Un solo recorrido hacia abajo, sin trucos de navegación y sin secciones de relleno.
 */
export default function V2() {
  useTemaVariante('dark');
  const reduce = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const [sheet, setSheet] = useState(false);
  const [frenteSel, setFrenteSel] = useState<Frente['id']>('alimentacion');
  const [montoSel, setMontoSel] = useState(50);
  const [pasoHero, setPasoHero] = useState(false);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const heroFade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => setPasoHero(v > 0.5));
    return () => unsub();
  }, [scrollYProgress]);

  const abrir = (f?: Frente['id'], m?: number) => {
    if (f) setFrenteSel(f);
    if (m) setMontoSel(m);
    setSheet(true);
  };
  const desdeTarjeta = (t: TarjetaAccion) => abrir(t.frente, t.monto);

  return (
    <main className="relative overflow-x-hidden">
      <ScrollProgress />

      <div className="fixed right-4 top-4 z-40 flex items-center gap-2 sm:right-8 sm:top-5">
        <ThemeToggle />
      </div>

      {/* ---------------------------------------------------------- HERO */}
      <section ref={heroRef} className="relative isolate flex h-[100svh] min-h-[580px] flex-col">
        <motion.div style={reduce ? undefined : { y: heroY }} className="absolute inset-0 -z-10">
          <MediaPlaceholder
            fill
            label="Espacio para video de impacto — brigada llegando a la comunidad · dos encuadres: 9:16 móvil y 16:9 escritorio"
            ratio="9/16"
            tone="dark"
          />
        </motion.div>
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage:
              'linear-gradient(190deg, rgba(10,10,10,.25) 0%, rgba(10,10,10,.55) 45%, rgba(10,10,10,.96) 100%)',
          }}
        />
        {/* Funde el hero (siempre oscuro, va sobre el video) con el fondo de la
            página, que en modo claro es crema. Sin esto queda un corte duro. */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-[rgb(var(--bg))] to-transparent"
        />

        <motion.div
          style={reduce ? undefined : { opacity: heroFade }}
          className="relative z-10 flex items-center gap-3 px-5 pr-28 pt-5 sm:px-8 sm:pr-56"
        >
          <AvatarMarca size="sm" ring={false} />
          <div className="min-w-0">
            <p className="font-display text-[15px] uppercase leading-none tracking-tight text-cream">
              {BRAND.nombre}
            </p>
            <a
              href={BRAND.tiktok}
              className="mt-1 inline-flex items-center gap-1.5 text-[11px] text-cream/60 hover:text-cream"
            >
              <IconTikTok className="h-3 w-3" />
              {BRAND.handle}
            </a>
          </div>
        </motion.div>

        <div className="relative z-10 mt-auto px-5 pb-10 sm:px-8 sm:pb-14">
          <div className="mx-auto w-full max-w-[1080px]">
            <Reveal y={22}>
              <h1 className="font-display text-[clamp(2.4rem,11vw,6rem)] uppercase leading-[0.82] tracking-[-.02em] text-cream text-balance">
                Tu donación
                <br />
                llega hoy
              </h1>
            </Reveal>
            <Reveal delay={0.1} y={14} className="mt-4">
              <Claim className="text-[clamp(1.3rem,5vw,2rem)] text-cream" />
            </Reveal>
            <Reveal delay={0.18} className="mt-7 max-w-[420px]">
              <button
                type="button"
                onClick={() => setSheet(true)}
                className="group relative isolate w-full overflow-hidden px-6 py-5 text-ink transition active:scale-[.99]"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 -z-10 bg-gradient-to-r from-turq via-lime to-turq bg-[length:220%_auto] motion-safe:animate-gradient-pan"
                />
                <span className="flex items-center justify-between gap-3">
                  <span className="font-display text-[clamp(1.2rem,5vw,1.6rem)] uppercase leading-none tracking-tight">
                    Donar ahora
                  </span>
                  <svg viewBox="0 0 24 24" className="h-5 w-5 transition-transform group-hover:translate-x-1.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M5 12h13M13 6l6 6-6 6" />
                  </svg>
                </span>
              </button>
              <p className="mt-3 text-[12px] text-cream/60">
                Yape · Plin · Transferencia · Tarjeta · PayPal — menos de 30 segundos
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <div className="relative mx-auto max-w-[1080px] px-5 sm:px-8">
        {/* --------------------------------------------------- ACCIONES */}
        <section className="pt-12 sm:pt-16">
          <div className={`border-b ${HAIRLINE}`}>
            {TARJETAS.slice(1).map((t) => (
              <Reveal key={t.id} y={14}>
                <TarjetaAccionUI tarjeta={t} onDonar={desdeTarjeta} />
              </Reveal>
            ))}
          </div>
        </section>

        {/* --------------------------------------------------- FRENTES */}
        <section className="pt-14 sm:pt-20">
          <Titulo numero="01" bajada="Tres frentes, una brigada. Cada entrega queda grabada.">
            Frentes de ayuda
          </Titulo>
          <div className="mt-7 grid gap-8 sm:grid-cols-3">
            {FRENTES.map((f, i) => (
              <Reveal key={f.id} delay={i * 0.06}>
                <article className={`border-t ${HAIRLINE} pt-4`}>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-[17px] uppercase leading-tight tracking-tight text-balance">
                      {f.nombre}
                    </h3>
                    <span className="shrink-0 text-[rgb(var(--accent))]">
                      <IconoFrente tipo={f.icono} className="h-6 w-6" />
                    </span>
                  </div>
                  <MediaPlaceholder label={f.medioLabel} ratio="4/3" tone="dark" compact className="mt-3.5" />
                  <p className="mt-3.5 text-[12.5px] leading-relaxed text-[rgb(var(--fg-muted))]">
                    {f.descripcion}
                  </p>
                  <p className="mt-3 font-display text-[15px] uppercase leading-tight tracking-tight">
                    {f.impacto}
                  </p>
                  <button
                    type="button"
                    onClick={() => abrir(f.id, f.montoAncla)}
                    className={`mt-4 w-full border ${HAIRLINE} py-3.5 font-display text-[14px] uppercase tracking-tight transition hover:border-[rgb(var(--fg)/.45)]`}
                  >
                    Donar a este frente
                  </button>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* --------------------------------------------------- MEDIOS */}
        <section id="medios" className="scroll-mt-16 pt-14 sm:pt-20">
          <Titulo numero="02" bajada="Copia el número o escanea. Sin salir de esta página.">
            Cómo donar
          </Titulo>
          <div className="mt-7">
            <MediosDeDonacion />
          </div>
        </section>

        {/* --------------------------------------------------- EMPRESAS */}
        <BloqueEmpresas className="mt-14 sm:mt-20" />
        <PieDePagina className="mt-10 pb-24 sm:pb-10" />
      </div>

      {/* Barra persistente */}
      <motion.div
        initial={false}
        animate={pasoHero ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(.9rem,env(safe-area-inset-bottom))]"
      >
        <button
          type="button"
          onClick={() => setSheet(true)}
          className="relative isolate mx-auto block w-full max-w-[420px] overflow-hidden py-4 font-display text-[17px] uppercase leading-none tracking-tight text-ink shadow-lift transition active:scale-[.99]"
        >
          <span
            aria-hidden
            className="absolute inset-0 -z-10 bg-gradient-to-r from-turq via-lime to-turq bg-[length:220%_auto] motion-safe:animate-gradient-pan"
          />
          Donar ahora
        </button>
      </motion.div>

      <DonationSheet
        abierto={sheet}
        onClose={() => setSheet(false)}
        frenteInicial={frenteSel}
        montoInicial={montoSel}
      />
    </main>
  );
}
