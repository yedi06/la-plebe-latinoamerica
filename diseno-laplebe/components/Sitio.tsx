'use client';

import { useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  BRAND,
  FRENTES,
  HISTORIA,
  MONTO_SUGERIDO,
  MONTOS_PORTADA,
  PROMESAS,
  TARJETAS,
  TIKTOKS,
} from '@/lib/data';
import {
  Claim,
  IconWhatsApp,
  IconoTarjeta,
  RedesSociales,
  ThemeToggle,
} from '@/components/brand/Marca';
import { PrecargaPolaroids } from '@/components/brand/Polaroid';
import { rutaPublica } from '@/lib/ruta';
import { useTemaVariante } from '@/components/brand/useTemaVariante';
import { DonationSheet, FlujoDonacion } from '@/components/donate/DonationSheet';
import { GrillaTikTok } from '@/components/media/TikTokEmbed';
import { RegistroMensual } from '@/components/donate/RegistroMensual';
import { TarjetaAccionUI } from '@/components/nav/TarjetaAccion';
import { LogosEnBoton } from '@/components/brand/LogoPago';
import { BotonPrincipal } from '@/components/ui/Boton';
import { BloqueEmpresas, PieDePagina } from '@/components/secciones/Comunes';

const HAIRLINE = 'border-[rgb(var(--line)/var(--line-a))]';

/* -------------------------------------------------------------------------- */
/*  Navegación                                                                 */
/* -------------------------------------------------------------------------- */

type Icono = 'inicio' | 'gente' | 'mano' | 'maletin';

const SECCIONES: { nombre: string; slug: string; icono: Icono }[] = [
  { nombre: 'Inicio', slug: 'inicio', icono: 'inicio' },
  { nombre: 'Nosotros', slug: 'nosotros', icono: 'gente' },
  { nombre: 'Donar', slug: 'donar', icono: 'mano' },
  { nombre: 'Empresas', slug: 'empresas', icono: 'maletin' },
];

/** Cada sección tiene una dirección propia y limpia: laplebelatam.org/donar. */
export function rutaDe(slug: string) {
  return slug === 'inicio' ? '/' : `/${slug}`;
}

/** Lee la sección de la dirección, o del antiguo #donar de enlaces ya compartidos. */
function seccionDelEnlace() {
  const porAlmohadilla = SECCIONES.findIndex((s) => `#${s.slug}` === window.location.hash);
  if (porAlmohadilla !== -1) return porAlmohadilla;
  const ruta = window.location.pathname.slice(rutaPublica('').length).replace(/\/+$/, '') || '/';
  const i = SECCIONES.findIndex((s) => rutaDe(s.slug) === ruta);
  return i === -1 ? 0 : i;
}

/** Iconos de navegación, sólidos — mismo peso visual que los del kit media. */
function IconoNav({ tipo, className = 'h-[19px] w-[19px]' }: { tipo: Icono; className?: string }) {
  if (tipo === 'inicio')
    return (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
        <path d="M12 2.8 1.9 11.2h2.8v9a.9.9 0 0 0 .9.9h4.1v-6.3h4.6v6.3h4.1a.9.9 0 0 0 .9-.9v-9h2.8z" />
      </svg>
    );
  if (tipo === 'gente')
    return (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
        <circle cx="8.7" cy="7.9" r="3.5" />
        <path d="M8.7 12.9c-3.6 0-6.5 2.5-6.5 5.6v1.9a.8.8 0 0 0 .8.8h11.4a.8.8 0 0 0 .8-.8v-1.9c0-3.1-2.9-5.6-6.5-5.6z" />
        <circle cx="17.3" cy="8.9" r="2.8" />
        <path d="M17.3 13.1c-.7 0-1.3.1-1.9.3a7.9 7.9 0 0 1 2.4 5.5v2.3h3.2a.8.8 0 0 0 .8-.8v-1.9c0-2.9-2-5.4-4.5-5.4z" />
      </svg>
    );
  if (tipo === 'mano')
    return (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
        {/* Corazón sobre mano abierta: dar, no solo pagar */}
        <path d="M12 9.9S7.8 7.3 7.8 4.6A2.4 2.4 0 0 1 12 3.2a2.4 2.4 0 0 1 4.2 1.4c0 2.7-4.2 5.3-4.2 5.3z" />
        <path d="M2.2 14.1a1.2 1.2 0 0 1 1.6-.7l3 1.3h4.6a1.5 1.5 0 0 1 0 3H8.6v1.7h2.8a3.2 3.2 0 0 0 2.6-1.3l3.6-4.7a1.4 1.4 0 0 1 2.3 1.7l-3.9 5.3a4.9 4.9 0 0 1-3.9 2H6.2l-3.3-1.7z" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M9.6 3.2h4.8a2.6 2.6 0 0 1 2.6 2.6v1.4h-2.2V5.8a.4.4 0 0 0-.4-.4H9.6a.4.4 0 0 0-.4.4v1.4H7V5.8a2.6 2.6 0 0 1 2.6-2.6z" />
      <path d="M2.4 8.8h19.2v3.4H2.4zM2.4 13.9h19.2v5.3a1.6 1.6 0 0 1-1.6 1.6H4a1.6 1.6 0 0 1-1.6-1.6z" />
    </svg>
  );
}

/** Este grabado es un bloque negro: en oscuro se muestra tal cual, sin invertirlo. */
function Manos({ alt, className = '' }: { alt: string; className?: string }) {
  return (
    <span className={`block ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={rutaPublica('/img/manos-640.webp')}
        alt={alt}
        width={640}
        height={616}
        className="grabado h-auto w-full dark:hidden"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={rutaPublica('/img/manos-oscuro-640.webp')}
        alt={alt}
        width={640}
        height={650}
        loading="lazy"
        className="hidden h-auto w-full dark:block"
      />
    </span>
  );
}

/**
 * PROPUESTA 03 — «Cortina»
 * Índice con iconos. Al elegir una sección, una cortina de marca
 * barre la pantalla, cambia el contenido debajo y se retira por el otro lado.
 */
export function Sitio({ inicial = 0 }: { inicial?: number }) {
  useTemaVariante('light');
  const reduce = useReducedMotion();
  const [seccion, setSeccion] = useState(inicial);
  const [cortina, setCortina] = useState(false);
  const ocupado = useRef(false);
  const destino = useRef(inicial);
  const scroller = useRef<HTMLDivElement>(null);
  const contenidoRef = useRef<HTMLDivElement>(null);
  const primeraVez = useRef(true);

  const [sheet, setSheet] = useState(false);
  const [registro, setRegistro] = useState(false);

  const [montoInicio, setMontoInicio] = useState<number>(MONTO_SUGERIDO);
  const [pasoSheet, setPasoSheet] = useState<1 | 2>(1);

  const abrirDonar = (paso: 1 | 2 = 1) => {
    setPasoSheet(paso);
    setSheet(true);
  };

  const abrirMensual = useCallback(() => {
    setSheet(false);
    setRegistro(true);
  }, []);

  const cambiar = useCallback(
    (i: number) => {
      // Un toque durante la cortina no se pierde: cambia adónde va a terminar. Si se
      // ignorara, la sección quedaría en la anterior con otro botón ya marcado.
      destino.current = i;
      if (ocupado.current || i === seccion) return;
      // Cada sección tiene su propio enlace, y Atrás vuelve a la anterior en vez
      // de sacar a la persona de la web. También permite enlazar /donar desde TikTok.
      const mostrar = () => {
        window.history.pushState(null, '', rutaPublica(rutaDe(SECCIONES[destino.current].slug)));
        setSeccion(destino.current);
      };
      if (reduce) {
        mostrar();
        return;
      }
      ocupado.current = true;
      setCortina(true);
      setTimeout(mostrar, 360);
      setTimeout(() => {
        setCortina(false);
        ocupado.current = false;
      }, 420);
    },
    [seccion, reduce],
  );

  useEffect(() => {
    const i = seccionDelEnlace();
    // Un enlace antiguo con #donar se reescribe a la dirección limpia, sin recargar.
    if (window.location.hash) window.history.replaceState(null, '', rutaPublica(rutaDe(SECCIONES[i].slug)));
    setSeccion(i);
    const alVolver = () => setSeccion(seccionDelEnlace());
    window.addEventListener('popstate', alVolver);
    return () => window.removeEventListener('popstate', alVolver);
  }, []);

  // El título de la pestaña acompaña a la dirección, también al navegar sin recargar.
  useEffect(() => {
    const s = SECCIONES[seccion];
    document.title =
      s.slug === 'inicio'
        ? 'La Plebe Latinoamérica — Dona y llega donde otros no llegan'
        : `${s.nombre} · La Plebe Latinoamérica`;
  }, [seccion]);

  // Cada sección empieza desde arriba: el contenedor con scroll es el mismo para
  // todas y, si no, se heredaba la posición de la anterior. El foco va al
  // contenido nuevo para que el teclado y los lectores de pantalla sigan el cambio.
  useEffect(() => {
    if (primeraVez.current) {
      primeraVez.current = false;
      return;
    }
    scroller.current?.scrollTo(0, 0);
    contenidoRef.current?.focus({ preventScroll: true });
  }, [seccion]);

  /* ------------------------------------------------------------ 0 INICIO */
  const srcEntrega = [480, 800, 1040].map((a) => `${rutaPublica(`/img/entrega-${a}.webp`)} ${a}w`).join(', ');
  const inicio = (
    <>
      {/*
        Móvil: se usa como una app. La foto a pantalla completa cuenta qué hace La
        Plebe sin texto, y donar es elegir un monto y tocar: el botón lleva directo
        al número. Todo cabe en una pantalla, sin hacer scroll.
      */}
      <div className="lg:hidden">
        <div className="relative -mx-5 -mt-12 h-[56svh] min-h-[260px] overflow-hidden sm:-mx-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={rutaPublica('/img/entrega-1040.webp')}
            srcSet={srcEntrega}
            sizes="100vw"
            alt="Integrante de La Plebe con el chaleco de la organización, de la mano de una señora mayor que sonríe, junto a una bolsa de víveres"
            width={1040}
            height={1300}
            fetchPriority="high"
            className="absolute inset-0 h-full w-full bg-[#d9d5cc] object-cover object-[45%_18%]"
          />
          <div aria-hidden className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ink/70 to-transparent" />
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-ink/90 via-ink/45 to-transparent" />

          <div className="absolute inset-x-0 top-0 flex items-center justify-between py-1 pl-4 pr-11 text-cream">
            <h1 className="flex min-w-0 items-center gap-2 font-display text-[12.5px] uppercase leading-none tracking-tight">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={rutaPublica('/perfil-laplebe.jpg')} alt="" width={28} height={28} className="h-7 w-7 rounded-full object-cover ring-1 ring-cream/60" />
              La Plebe Latinoamérica
            </h1>
            <RedesSociales />
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={rutaPublica('/img/claim-blanco-800.webp')}
            alt={BRAND.claim}
            width={800}
            height={632}
            className="absolute bottom-7 left-4 h-auto w-[min(52vw,23svh)]"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={rutaPublica('/img/rasgado.webp')}
            alt=""
            width={1000}
            height={160}
            className="absolute -bottom-px -left-[3%] h-auto w-[106%] max-w-none dark:hidden"
          />
          {/* En oscuro, el mismo rasgado recortado en el color del fondo, con un filo claro detrás. */}
          <div
            aria-hidden
            style={{
              WebkitMaskImage: `url(${rutaPublica('/img/rasgado.webp')})`,
              maskImage: `url(${rutaPublica('/img/rasgado.webp')})`,
              WebkitMaskSize: '100% 100%',
              maskSize: '100% 100%',
            }}
            className="absolute bottom-[2px] -left-[3%] hidden aspect-[1000/158] w-[106%] bg-cream/80 dark:block"
          />
          <div
            aria-hidden
            style={{
              WebkitMaskImage: `url(${rutaPublica('/img/rasgado.webp')})`,
              maskImage: `url(${rutaPublica('/img/rasgado.webp')})`,
              WebkitMaskSize: '100% 100%',
              maskSize: '100% 100%',
            }}
            className="absolute -bottom-px -left-[3%] hidden aspect-[1000/158] w-[106%] bg-[rgb(var(--bg))] dark:block"
          />
        </div>

        <div role="group" aria-label="Elige cuánto donar" className="mt-3 grid grid-cols-5 gap-1.5">
          {MONTOS_PORTADA.map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={montoInicio === m}
              onClick={() => setMontoInicio(m)}
              className={`h-14 border font-display text-[16px] leading-none transition active:scale-[.97] ${
                montoInicio === m
                  ? 'border-transparent bg-[rgb(var(--accent-fill))] text-ink'
                  : `${HAIRLINE} text-[rgb(var(--fg))]`
              }`}
            >
              <span className="text-[12px] opacity-70">S/</span> {m}
            </button>
          ))}
          <button
            type="button"
            onClick={() => abrirDonar(1)}
            className={`h-14 border ${HAIRLINE} text-[14px] font-semibold transition active:scale-[.97]`}
          >
            Otro
          </button>
        </div>

        <BotonPrincipal
          className="mt-2"
          onClick={() => abrirDonar(2)}
          bajada={
            <span className="flex items-center gap-2">
              <LogosEnBoton />
              Copias el número y listo
            </span>
          }
        >
          Donar S/ {montoInicio}
        </BotonPrincipal>

        <button
          type="button"
          onClick={abrirMensual}
          className="mx-auto mt-1 flex min-h-11 items-center gap-2 text-[13.5px] font-semibold text-[rgb(var(--fg-muted))] transition hover:text-[rgb(var(--fg))]"
        >
          <IconoTarjeta tipo="repetir" className="h-4 w-4 text-[rgb(var(--accent))]" />
          Prefiero ayudar cada mes
        </button>
      </div>

      <div className="hidden items-center lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)] lg:gap-14">
        <figure className="foto-tema order-last w-full rotate-[2deg] bg-white p-3.5 pb-5 shadow-[0_1px_2px_rgba(10,10,10,.08),0_32px_56px_-28px_rgba(10,10,10,.55)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={rutaPublica('/img/entrega-1040.webp')}
            srcSet={srcEntrega}
            sizes="400px"
            alt="Integrante de La Plebe con el chaleco de la organización, de la mano de una señora mayor que sonríe, junto a una bolsa de víveres"
            width={1040}
            height={1300}
            loading="lazy"
            className="h-auto w-full bg-[#d9d5cc]"
          />
          <figcaption className="pt-4 font-marker text-[28px] leading-none text-ink/80">
            Así llega tu ayuda.
          </figcaption>
        </figure>

        <div>
          <p className="font-display text-[1.9rem] uppercase leading-none tracking-[-.03em]">
            La Plebe Latinoamérica
          </p>
          <a
            href={BRAND.tiktok}
            target="_blank"
            rel="noopener"
            className="mt-1 inline-flex min-h-11 items-center gap-2 text-[13px] text-[rgb(var(--fg-muted))] transition hover:text-[rgb(var(--fg))]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={rutaPublica('/perfil-laplebe.jpg')} alt="" width={28} height={28} className="h-7 w-7 rounded-full object-cover" />
            {BRAND.handle} · +20K seguidores
          </a>

          {/* Se declara con <picture> para que el móvil no descargue este lettering. */}
          <picture className="mt-5 block w-[300px] dark:hidden">
            <source media="(min-width: 1024px)" srcSet={rutaPublica('/img/claim-tinta-800.webp')} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
              alt={BRAND.claim}
              width={800}
              height={632}
              className="h-auto w-full"
            />
          </picture>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={rutaPublica('/img/claim-blanco-800.webp')}
            alt=""
            width={800}
            height={632}
            className="mt-5 hidden h-auto w-[300px] dark:block"
          />
          <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-[rgb(var(--fg-muted))] text-pretty">
            {BRAND.misionCorta} Cada entrega se publica con evidencia audiovisual.
          </p>

          <div className="mt-4 max-w-[480px]">
            <BotonPrincipal
              onClick={() => abrirDonar()}
              bajada={
                <span className="flex items-center gap-2">
                  <LogosEnBoton />
                  Eliges el monto y copias el número
                </span>
              }
            >
              Donar ahora
            </BotonPrincipal>
            <div className={`mt-2 border-b ${HAIRLINE}`}>
              {TARJETAS.map((t) => (
                <TarjetaAccionUI key={t.id} tarjeta={t} onDonar={abrirMensual} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  /* --------------------------------------------------------- 1 NOSOTROS */
  const nosotros = (
    <div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={rutaPublica('/img/fundadores-1200.webp')}
        srcSet={[640, 1200].map((a) => `${rutaPublica(`/img/fundadores-${a}.webp`)} ${a}w`).join(', ')}
        sizes="(min-width: 1024px) 1000px, 100vw"
        alt="Los fundadores de La Plebe, con polera negra y lentes oscuros, frente a un pueblo de la sierra"
        width={1200}
        height={600}
        className="foto-tema mb-7 -ml-5 -mt-12 h-auto w-[calc(100%+2.5rem)] max-w-none sm:-ml-10 sm:w-[calc(100%+5rem)] lg:ml-0 lg:mt-0 lg:w-full"
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,.85fr)] lg:gap-12">
        <div>
          <Claim
            texto="Todo lo que ves, pasó de verdad."
            highlight="pasó de verdad."
            className="text-[clamp(1.1rem,4.2vw,1.6rem)] text-[rgb(var(--fg))]"
          />
          <h2 className="mt-2 font-display text-[clamp(1.35rem,5.2vw,2.3rem)] uppercase leading-[0.95] tracking-[-.03em]">
            Quiénes somos
          </h2>
          <p className="mt-3 text-[15px] leading-snug text-[rgb(var(--fg-muted))] text-pretty lg:hidden">
            {BRAND.misionCorta}
          </p>
          <p className="mt-4 hidden max-w-[54ch] text-[15px] leading-relaxed text-[rgb(var(--fg-muted))] text-pretty lg:block">
            {BRAND.mision}
          </p>

          {HISTORIA.length > 0 && (
            <div className={`mt-7 border-t ${HAIRLINE}`}>
              {HISTORIA.map((h) => (
                <div key={h.año} className={`flex gap-5 border-b ${HAIRLINE} py-4`}>
                  <span className="w-12 shrink-0 font-display text-[13px] tabular-nums text-[rgb(var(--accent))]">
                    {h.año}
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-[15px] uppercase leading-tight tracking-tight">
                      {h.titulo}
                    </p>
                    <p className="mt-1 text-[13px] leading-relaxed text-[rgb(var(--fg-muted))]">
                      {h.texto}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Móvil: tres imágenes que se entienden de un vistazo. Escritorio: la lista. */}
          <div className="mt-5 grid grid-cols-3 gap-3 lg:hidden">
            {PROMESAS.map((p) => (
              <div key={p.corto} className="text-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={rutaPublica(`/img/${p.imagen}.webp`)}
                  alt=""
                  width={480}
                  height={480}
                  loading="lazy"
                  className="grabado mx-auto aspect-square h-auto w-full object-contain"
                />
                <p className="mt-1.5 font-display text-[12.5px] uppercase leading-tight tracking-tight">{p.corto}</p>
              </div>
            ))}
          </div>
          <div className={`mt-7 hidden border-t ${HAIRLINE} lg:block`}>
            {PROMESAS.map((p) => (
              <div key={p.titulo} className={`border-b ${HAIRLINE} py-3.5`}>
                <p className="font-display text-[14px] uppercase leading-tight tracking-tight">
                  {p.titulo}
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-[rgb(var(--fg-muted))]">
                  {p.texto}
                </p>
              </div>
            ))}
          </div>
        </div>

        <figure className="lg:pt-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={rutaPublica('/img/marco-brigada-1100.webp')}
            srcSet={[640, 1100].map((a) => `${rutaPublica(`/img/marco-brigada-${a}.webp`)} ${a}w`).join(', ')}
            sizes="(min-width: 1024px) 440px, 100vw"
            alt="Una mano sostiene un marco con la foto de la brigada de La Plebe, con sus poleras negras, en una zona rural de la sierra"
            width={1100}
            height={735}
            className="h-auto w-full"
          />
          <figcaption className="mt-2 font-marker text-[24px] leading-none">La brigada, en campo.</figcaption>
        </figure>
      </div>

      {/* Qué hacemos: los tres frentes, en una línea cada uno */}
      <div className="mt-10">
        <h3 className="font-display text-[clamp(1.05rem,3.8vw,1.45rem)] uppercase leading-tight tracking-[-.02em]">
          Qué hacemos
        </h3>
        <div className="carrusel mt-4 lg:grid-cols-3 lg:gap-8">
          {FRENTES.map((f) => (
            <div key={f.id} className={`w-[62vw] max-w-[260px] lg:w-auto lg:max-w-none lg:border-t ${HAIRLINE} lg:pt-4`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={rutaPublica(`/img/frente-${f.id}-640.webp`)}
                alt=""
                width={640}
                height={640}
                loading="lazy"
                className="grabado mb-2 aspect-square h-auto w-full object-contain lg:mb-3"
              />
              <span className="min-w-0">
                <span className="block font-display text-[15px] uppercase leading-tight tracking-tight text-balance">
                  {f.nombre}
                </span>
                <span className="mt-1 hidden text-[13px] leading-relaxed text-[rgb(var(--fg-muted))] lg:block">
                  {f.descripcion}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Ilustración, no evidencia: lo documental de esta web son las fotos y los videos. */}
      <figure className="mt-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={rutaPublica('/img/camino-1200.webp')}
          srcSet={[640, 1200].map((a) => `${rutaPublica(`/img/camino-${a}.webp`)} ${a}w`).join(', ')}
          sizes="(min-width: 1024px) 1000px, 100vw"
          alt="Ilustración en grabado de una camioneta cargada subiendo por un camino de tierra en la sierra"
          width={1200}
          height={595}
          loading="lazy"
          className="h-auto w-full grabado"
        />
        <figcaption className="mt-3 font-marker text-[clamp(1.4rem,4.5vw,2rem)] leading-none">
          Hasta donde haga falta.
        </figcaption>
      </figure>

      <div className="mt-6 hidden max-w-[420px] lg:block">
        <BotonPrincipal onClick={() => abrirDonar()} tamano="md">
          Quiero ayudar
        </BotonPrincipal>
      </div>

      {/* Evidencia */}
      <div className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-x-3">
          <h3 className="font-display text-[clamp(1.05rem,3.8vw,1.45rem)] uppercase leading-tight tracking-[-.02em]">
            Todas las historias
          </h3>
          <div className="flex items-center gap-1 text-[13px] text-[rgb(var(--fg-muted))]">
            Síguenos
            <RedesSociales className="-mr-3" />
          </div>
        </div>
        <GrillaTikTok
          videos={TIKTOKS}
          conDescripcion
          carrusel
          className="mt-5"
        />
      </div>

      <div className="mt-8 hidden max-w-[420px] lg:block">
        <BotonPrincipal onClick={() => abrirDonar()} tamano="md">
          Quiero ayudar
        </BotonPrincipal>
      </div>
    </div>
  );

  /* ------------------------------------------------------------ 2 DONAR */
  const donar = (
    <div className="grid lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)] lg:items-center lg:gap-14">
      <div>
        <div className="flex items-center justify-between gap-3 lg:block">
          <div>
            <Claim
              texto="Ayudar toma menos de lo que crees."
              highlight="menos de lo que crees."
              className="text-[clamp(1.1rem,4.2vw,1.6rem)] text-[rgb(var(--fg))]"
            />
            <h2 className="mt-2 font-display text-[clamp(1.5rem,6.4vw,2.3rem)] uppercase leading-[0.95] tracking-[-.03em]">
              Elige cuánto y envíalo
            </h2>
          </div>
          <Manos alt="" className="w-[108px] shrink-0 lg:hidden" />
        </div>
        <FlujoDonacion className="mt-5 lg:mt-6" onMensual={abrirMensual} />
      </div>
      <figure className="hidden lg:block">
        <Manos
          alt="Grabado de dos manos: una entrega a la otra una bolsa con víveres"
          className="w-full max-w-[400px]"
        />
      </figure>
    </div>
  );

  /* --------------------------------------------------------- 3 EMPRESAS */
  const empresas = (
    <div>
      <BloqueEmpresas className="border-t-0 pt-0" />
      <PieDePagina className="mt-8" />
    </div>
  );

  const contenido = [inicio, nosotros, donar, empresas];

  return (
    <main
      className="papel relative flex h-[100svh] overflow-hidden"
      style={{ backgroundImage: `url(${rutaPublica('/img/papel.webp')})`, backgroundSize: '500px' }}
    >
      <PrecargaPolaroids />
      {/*
        Cortina de transición. Va con transición CSS y no con Framer Motion a
        propósito: al depender de requestAnimationFrame, una animación
        interrumpida puede dejarla cubriendo la pantalla.
      */}
      <div
        aria-hidden
        style={{
          transform: `scaleX(${cortina ? 1 : 0})`,
          transformOrigin: cortina ? 'left' : 'right',
        }}
        className="pointer-events-none fixed inset-0 z-50 bg-gradient-to-r from-turq via-lime to-turq transition-transform duration-[360ms] ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:hidden"
      />

      <div className="fixed right-8 top-5 z-40 hidden items-center gap-2 lg:flex">
        <ThemeToggle />
      </div>

      {/* Índice vertical — escritorio */}
      <nav
        aria-label="Secciones"
        className={`relative hidden w-[230px] shrink-0 flex-col justify-center border-r ${HAIRLINE} px-8 lg:flex`}
      >
        {SECCIONES.map((s, i) => {
          const on = i === seccion;
          return (
            <button
              key={s.nombre}
              type="button"
              onClick={() => cambiar(i)}
              aria-current={on ? 'page' : undefined}
              className={`-mx-3 mb-1.5 flex items-center gap-3 px-3 py-3 text-left transition-colors ${
                on
                  ? 'bg-[rgb(var(--fg))] text-[rgb(var(--bg))]'
                  : 'text-[rgb(var(--fg-muted))] hover:bg-[rgb(var(--fg)/.06)] hover:text-[rgb(var(--fg))]'
              }`}
            >
              <IconoNav tipo={s.icono} />
              <span className="font-display text-[19px] uppercase leading-none tracking-tight">{s.nombre}</span>
            </button>
          );
        })}
        {/* Siempre a la vista en escritorio, sin competir con las secciones. */}
        <RedesSociales className="absolute bottom-5 left-5 text-[rgb(var(--fg-muted))]" />
      </nav>

      {/* Contenido */}
      <div className="relative flex min-w-0 flex-1 flex-col">
        <div
          ref={scroller}
          className="hide-scrollbar flex min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-28 pt-12 sm:px-10 lg:pb-10 lg:pt-10"
        >
          <div ref={contenidoRef} tabIndex={-1} key={seccion} className="relative mx-auto w-full max-w-[1000px] caret-transparent outline-none lg:my-auto">
            {/* En móvil va con el contenido y se desplaza con él: no tapa nada al leer.
                En Inicio queda en la misma fila que las redes, como un ícono más. */}
            <ThemeToggle
              className={`absolute -right-5 -top-[44px] z-20 sm:-right-10 lg:hidden ${
                seccion <= 1
                  ? 'text-cream [filter:drop-shadow(0_1px_3px_rgba(0,0,0,.7))]'
                  : 'text-[rgb(var(--fg))]'
              }`}
            />
            {contenido[seccion]}
          </div>
        </div>

        {/*
          Índice inferior — móvil. El patrón que cualquiera reconoce de sus apps: barra
          de borde a borde, ícono con nombre, y la acción principal redonda y elevada al
          centro. Son cinco lugares para que Donar quede justo en el medio.
        */}
        <nav
          aria-label="Secciones"
          className={`absolute inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t ${HAIRLINE} bg-[rgb(var(--bg))] pb-[env(safe-area-inset-bottom)] lg:hidden`}
        >
          {SECCIONES.map((s, i) => {
            const on = i === seccion;
            const color = on ? 'text-[rgb(var(--accent))]' : 'text-[rgb(var(--fg-muted))]';
            if (s.slug === 'donar')
              return (
                <button
                  key={s.nombre}
                  type="button"
                  onClick={() => cambiar(i)}
                  aria-current={on ? 'page' : undefined}
                  className="relative flex h-[60px] flex-col items-center justify-end pb-2"
                >
                  <span className="absolute -top-5 left-1/2 flex h-[54px] w-[54px] -translate-x-1/2 items-center justify-center rounded-full bg-gradient-to-br from-lime to-turq text-ink shadow-[0_6px_14px_-4px_rgba(10,10,10,.45)] ring-4 ring-[rgb(var(--bg))] transition active:scale-95">
                    <IconoNav tipo={s.icono} className="h-[26px] w-[26px]" />
                  </span>
                  <span className={`text-[11.5px] font-semibold leading-none ${on ? 'text-[rgb(var(--accent))]' : 'text-[rgb(var(--fg))]'}`}>
                    {s.nombre}
                  </span>
                </button>
              );
            return (
              <button
                key={s.nombre}
                type="button"
                onClick={() => cambiar(i)}
                aria-current={on ? 'page' : undefined}
                className={`flex h-[60px] flex-col items-center justify-end gap-1 pb-2 transition-colors ${color}`}
              >
                <IconoNav tipo={s.icono} className="h-[22px] w-[22px]" />
                <span className={`text-[11.5px] leading-none ${on ? 'font-bold' : 'font-medium'}`}>{s.nombre}</span>
              </button>
            );
          })}
          <a
            href={BRAND.whatsappLink}
            target="_blank"
            rel="noopener"
            className="flex h-[60px] flex-col items-center justify-end gap-1 pb-2 text-[rgb(var(--fg-muted))]"
          >
            <IconWhatsApp className="h-[22px] w-[22px]" />
            <span className="text-[11.5px] font-medium leading-none">WhatsApp</span>
          </a>
        </nav>
      </div>

      <DonationSheet
        abierto={sheet}
        onClose={() => setSheet(false)}
        montoInicial={montoInicio}
        pasoInicial={pasoSheet}
        onMensual={abrirMensual}
      />
      <RegistroMensual abierto={registro} onClose={() => setRegistro(false)} />
    </main>
  );
}
