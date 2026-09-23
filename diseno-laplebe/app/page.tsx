'use client';

import { useReducedMotion } from 'framer-motion';
import { useCallback, useRef, useState } from 'react';
import {
  BRAND,
  FRENTES,
  HISTORIA,
  PROMESAS,
  TARJETAS,
  TIKTOKS,
  type Frente,
  type TarjetaAccion,
} from '@/lib/data';
import {
  Claim,
  IconMail,
  IconTikTok,
  IconWhatsApp,
  IconoFrente,
  ThemeToggle,
} from '@/components/brand/Marca';
import { MediaPlaceholder } from '@/components/brand/MediaPlaceholder';
import { rutaPublica } from '@/lib/ruta';
import { LogosEnBoton } from '@/components/brand/LogoPago';
import { useTemaVariante } from '@/components/brand/useTemaVariante';
import { DonationSheet } from '@/components/donate/DonationSheet';
import { Checkout } from '@/components/donate/Checkout';
import { GrillaTikTok } from '@/components/media/TikTokEmbed';
import { TarjetaAccionUI } from '@/components/nav/TarjetaAccion';
import { BotonPrincipal, BotonSecundario } from '@/components/ui/Boton';
import { BloqueEmpresas, PieDePagina } from '@/components/secciones/Comunes';
import { CountUp } from '@/components/motion';

const HAIRLINE = 'border-[rgb(var(--line)/var(--line-a))]';

/* -------------------------------------------------------------------------- */
/*  Navegación                                                                 */
/* -------------------------------------------------------------------------- */

type Icono = 'inicio' | 'gente' | 'mano' | 'maletin';

const SECCIONES: { nombre: string; icono: Icono }[] = [
  { nombre: 'Inicio', icono: 'inicio' },
  { nombre: 'Nosotros', icono: 'gente' },
  { nombre: 'Donar', icono: 'mano' },
  { nombre: 'Empresas', icono: 'maletin' },
];

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

/**
 * PROPUESTA 03 — «Cortina»
 * Índice numerado con iconos. Al elegir una sección, una cortina de marca
 * barre la pantalla, cambia el contenido debajo y se retira por el otro lado.
 */
export default function V3() {
  useTemaVariante('light');
  const reduce = useReducedMotion();
  const [seccion, setSeccion] = useState(0);
  const [cortina, setCortina] = useState(false);
  const ocupado = useRef(false);

  const [sheet, setSheet] = useState(false);
  const [frenteSel, setFrenteSel] = useState<Frente['id']>('alimentacion');
  const [montoSel, setMontoSel] = useState(50);

  const abrir = (f?: Frente['id'], m?: number) => {
    if (f) setFrenteSel(f);
    if (m) setMontoSel(m);
    setSheet(true);
  };
  const desdeTarjeta = (t: TarjetaAccion) => abrir(t.frente, t.monto);

  const cambiar = useCallback(
    (i: number) => {
      if (i === seccion || ocupado.current) return;
      if (reduce) {
        setSeccion(i);
        return;
      }
      ocupado.current = true;
      setCortina(true);
      setTimeout(() => setSeccion(i), 360);
      setTimeout(() => {
        setCortina(false);
        ocupado.current = false;
      }, 420);
    },
    [seccion, reduce],
  );

  /* ------------------------------------------------------------ 0 INICIO */
  const inicio = (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-14">
      {/*
        Portada: en móvil la foto ocupa todo el ancho como en la página de
        referencia, con el nombre encima. En escritorio pasa a columna.
      */}
      {/*
        En móvil la foto va pegada al borde superior: el -mt-16 cancela el
        padding del contenedor con scroll y los controles flotantes quedan
        encima de la imagen, como en la referencia.
      */}
      <div className="relative -mx-5 -mt-16 sm:-mx-10 lg:mx-0 lg:mt-0">
        <div className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[16/10] lg:aspect-[4/5]">
          <img
            src={rutaPublica("/perfil-laplebe.jpg")}
            alt="Equipo de La Plebe Latinoamérica"
            width={1080}
            height={1080}
            loading="eager"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-[50%_28%]"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-transparent"
          />
          {/* Velo superior: mantiene legibles los controles flotantes sobre la foto. */}
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ink/55 to-transparent lg:hidden"
          />
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
            {/* Montserrat ExtraBold es ~18% más ancha que una condensada:
                los tamaños están calibrados para que "LATINOAMÉRICA" entre. */}
            <h1 className="font-display text-[clamp(1.45rem,6.2vw,2.35rem)] uppercase leading-[0.9] tracking-[-.03em] text-cream">
              La Plebe
              <br />
              Latinoamérica
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              <a
                href={BRAND.tiktok}
                className="inline-flex items-center gap-1.5 text-[12.5px] text-cream/75 transition hover:text-cream"
              >
                <IconTikTok className="h-4 w-4" />
                {BRAND.handle}
              </a>
              <span className="text-[12px] text-cream/55">
                <CountUp to={20} prefix="+" suffix="K" /> de comunidad
              </span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <Claim className="text-[clamp(1.4rem,5.5vw,2.1rem)]" />
        <p className="mt-3 max-w-[46ch] text-[14px] leading-relaxed text-[rgb(var(--fg-muted))] text-pretty">
          {BRAND.misionCorta} Cada entrega se publica con evidencia audiovisual.
        </p>

        <div className="mt-6">
          <BotonPrincipal
            onClick={() => setSheet(true)}
            bajada={<LogosEnBoton />}
          >
            Donar ahora
          </BotonPrincipal>
        </div>

        <div className={`mt-5 border-b ${HAIRLINE}`}>
          {TARJETAS.slice(1).map((t) => (
            <TarjetaAccionUI key={t.id} tarjeta={t} onDonar={desdeTarjeta} />
          ))}
        </div>
      </div>

      {/*
        Historias en video, debajo de todo lo demás del inicio. Solo cuatro:
        el resto vive en «Nosotros». Un muro de doce videos en la portada
        compite con el botón de donar, que es lo que esta pantalla debe lograr.
      */}
      <div className="lg:col-span-2">
        <div className={`mt-4 border-t ${HAIRLINE} pt-6`}>
          <h2 className="font-display text-[clamp(1.35rem,5.2vw,2.3rem)] uppercase leading-[0.95] tracking-[-.03em]">
            Míralo tú mismo
          </h2>
          <p className="mt-2 max-w-[54ch] text-[13.5px] leading-relaxed text-[rgb(var(--fg-muted))]">
            No hay nada que contar que no puedas ver. Cada entrega queda grabada.
          </p>

          <GrillaTikTok videos={TIKTOKS} limite={4} className="mt-5" />

          <button
            type="button"
            onClick={() => cambiar(1)}
            className={`group mt-6 flex w-full items-center justify-between gap-4 border ${HAIRLINE} px-5 py-4 text-left transition hover:border-[rgb(var(--accent-fill))]`}
          >
            <span>
              <span className="block font-display text-[17px] uppercase leading-none tracking-tight">
                Conócenos más
              </span>
              <span className="mt-1.5 block text-[12px] text-[rgb(var(--fg-muted))]">
                Nuestra historia y las {TIKTOKS.length} historias completas
              </span>
            </span>
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 shrink-0 text-[rgb(var(--accent))] transition-transform duration-300 group-hover:translate-x-1.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M5 12h13M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  /* --------------------------------------------------------- 1 NOSOTROS */
  const nosotros = (
    <div>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,.85fr)] lg:gap-12">
        <div>
          <Claim
            texto="Todo lo que ves, pasó de verdad."
            highlight="pasó de verdad."
            className="text-[clamp(1.1rem,4.2vw,1.6rem)] text-[rgb(var(--fg))]"
          />
          <h2 className="mt-2 font-display text-[clamp(1.35rem,5.2vw,2.3rem)] uppercase leading-[0.95] tracking-[-.03em]">
            Quiénes somos
          </h2>
          <p className="mt-4 max-w-[54ch] text-[14.5px] leading-relaxed text-[rgb(var(--fg-muted))] text-pretty">
            {BRAND.mision}
          </p>

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
                  <p className="mt-1 text-[12.5px] leading-relaxed text-[rgb(var(--fg-muted))]">
                    {h.texto}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <MediaPlaceholder
            label="Espacio para foto — el equipo completo en una brigada"
            ratio="4/5"
            tone="dark"
          />
          <div className={`mt-6 border-t ${HAIRLINE}`}>
            {PROMESAS.map((p) => (
              <div key={p.titulo} className={`border-b ${HAIRLINE} py-3.5`}>
                <p className="font-display text-[14px] uppercase leading-tight tracking-tight">
                  {p.titulo}
                </p>
                <p className="mt-1 text-[12px] leading-relaxed text-[rgb(var(--fg-muted))]">
                  {p.texto}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Qué hacemos: los tres frentes, en una línea cada uno */}
      <div className="mt-10">
        <h3 className="font-display text-[clamp(1.05rem,3.8vw,1.45rem)] uppercase leading-tight tracking-[-.02em]">
          Qué hacemos
        </h3>
        <div className={`mt-4 grid gap-0 border-t ${HAIRLINE} sm:grid-cols-3 sm:gap-8 sm:border-t-0`}>
          {FRENTES.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => abrir(f.id, f.montoAncla)}
              className={`group flex items-start gap-4 border-b ${HAIRLINE} py-4 text-left transition-colors hover:bg-[rgb(var(--fg)/.04)] sm:block sm:border-b-0 sm:border-t sm:pt-4 sm:hover:bg-transparent`}
            >
              <span className="shrink-0 text-[rgb(var(--accent))] sm:mb-3 sm:block">
                <IconoFrente tipo={f.icono} className="h-6 w-6" />
              </span>
              <span className="min-w-0">
                <span className="block font-display text-[15px] uppercase leading-tight tracking-tight text-balance">
                  {f.nombre}
                </span>
                <span className="mt-1 block text-[12px] leading-relaxed text-[rgb(var(--fg-muted))]">
                  {f.descripcion}
                </span>
                <span className="mt-2 block font-display text-[13px] uppercase tracking-tight text-[rgb(var(--accent))] transition-colors group-hover:text-[rgb(var(--fg))]">
                  {f.impacto}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Evidencia */}
      <div className="mt-10">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h3 className="font-display text-[clamp(1.05rem,3.8vw,1.45rem)] uppercase leading-tight tracking-[-.02em]">
            Todas las historias
          </h3>
          <a
            href={BRAND.tiktok}
            className="inline-flex items-center gap-1.5 text-[12.5px] text-[rgb(var(--fg-muted))] transition hover:text-[rgb(var(--fg))]"
          >
            <IconTikTok className="h-4 w-4" />
            Ver el canal
          </a>
        </div>
        <GrillaTikTok
          videos={TIKTOKS}
          conDescripcion
          columnas="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          className="mt-5"
        />
      </div>

      <div className="mt-8 max-w-[420px]">
        <BotonPrincipal onClick={() => setSheet(true)} tamano="md">
          Quiero ayudar
        </BotonPrincipal>
      </div>
    </div>
  );

  /* ------------------------------------------------------------ 2 DONAR */
  const donar = (
    <div>
      <Claim
        texto="Ayudar toma menos de lo que crees."
        highlight="menos de lo que crees."
        className="text-[clamp(1.1rem,4.2vw,1.6rem)] text-[rgb(var(--fg))]"
      />
      <h2 className="mt-2 font-display text-[clamp(1.35rem,5.2vw,2.3rem)] uppercase leading-[0.95] tracking-[-.03em]">
        Todas las cuentas, a la vista
      </h2>
      <div className="mt-5 max-w-[460px]">
        <BotonPrincipal
          onClick={() => setSheet(true)}
          tamano="md"
          bajada="Elige monto y frente sin salir de la página"
        >
          Elegir monto
        </BotonPrincipal>
      </div>
      <div className="mt-7 max-w-[560px]">
        <Checkout monto={montoSel} frecuencia="unica" frente="el frente que elijas" />
      </div>
    </div>
  );

  /* --------------------------------------------------------- 3 EMPRESAS */
  const empresas = (
    <div>
      <BloqueEmpresas className="border-t-0 pt-0" />
      <MediaPlaceholder
        label="Espacio para foto — entrega con marca aliada visible en el empaque"
        ratio="21/9"
        tone="dark"
        className="mt-8"
      />
      <div className="mt-8 grid gap-2.5 sm:max-w-[520px] sm:grid-cols-2">
        <BotonSecundario href={BRAND.whatsappLink} icono={<IconWhatsApp className="h-4 w-4" />}>
          WhatsApp
        </BotonSecundario>
        <BotonSecundario
          href={`mailto:${BRAND.email}?subject=Alianza%20corporativa`}
          icono={<IconMail className="h-4 w-4" />}
        >
          Correo
        </BotonSecundario>
      </div>
      <PieDePagina className="mt-8" />
    </div>
  );

  const contenido = [inicio, nosotros, donar, empresas];

  return (
    <main className="relative flex h-[100svh] overflow-hidden">
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

      <div className="fixed right-4 top-4 z-40 flex items-center gap-2 sm:right-8 sm:top-5">
        <ThemeToggle />
      </div>

      {/* Índice vertical — escritorio */}
      <nav
        aria-label="Secciones"
        className={`hidden w-[230px] shrink-0 flex-col justify-center border-r ${HAIRLINE} px-8 lg:flex`}
      >
        {SECCIONES.map((s, i) => {
          const on = i === seccion;
          return (
            <button
              key={s.nombre}
              type="button"
              onClick={() => cambiar(i)}
              aria-current={on ? 'true' : undefined}
              className="group relative py-3.5 text-left"
            >
              <span className="flex items-center gap-3">
                <span
                  className={`transition-colors ${
                    on
                      ? 'text-[rgb(var(--accent))]'
                      : 'text-[rgb(var(--fg-muted))] group-hover:text-[rgb(var(--fg))]'
                  }`}
                >
                  <IconoNav tipo={s.icono} />
                </span>
                <span
                  className={`font-display text-[19px] uppercase leading-none tracking-tight transition-colors ${
                    on
                      ? 'text-[rgb(var(--fg))]'
                      : 'text-[rgb(var(--fg-muted))] group-hover:text-[rgb(var(--fg))]'
                  }`}
                >
                  {s.nombre}
                </span>
                <span className="ml-auto font-display text-[11px] tabular-nums text-[rgb(var(--fg-muted))]">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </span>
              <span
                className={`mt-2.5 block h-px origin-left bg-[rgb(var(--accent-fill))] transition-transform duration-500 ${
                  on ? 'scale-x-100' : 'scale-x-0'
                }`}
              />
            </button>
          );
        })}
      </nav>

      {/* Contenido */}
      <div className="relative flex min-w-0 flex-1 flex-col">
        <div className="hide-scrollbar flex min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-28 pt-16 sm:px-10 lg:pb-10 lg:pt-10">
          <div key={seccion} className="m-auto w-full max-w-[1000px]">
            {contenido[seccion]}
          </div>
        </div>

        {/* Índice inferior — móvil */}
        <nav
          aria-label="Secciones"
          className={`absolute inset-x-0 bottom-0 z-30 flex border-t ${HAIRLINE} bg-[rgb(var(--bg)/.92)] backdrop-blur-xl lg:hidden`}
        >
          {SECCIONES.map((s, i) => {
            const on = i === seccion;
            return (
              <button
                key={s.nombre}
                type="button"
                onClick={() => cambiar(i)}
                aria-current={on ? 'true' : undefined}
                className="relative flex-1 pb-[max(.7rem,env(safe-area-inset-bottom))] pt-3"
              >
                {/* Marca de sección activa */}
                <span
                  aria-hidden
                  className={`absolute inset-x-5 top-0 h-[2px] origin-center bg-[rgb(var(--accent-fill))] transition-transform duration-300 ${
                    on ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
                <span
                  className={`mx-auto flex h-[22px] w-[22px] items-center justify-center transition-colors ${
                    on ? 'text-[rgb(var(--accent))]' : 'text-[rgb(var(--fg-muted))]'
                  }`}
                >
                  <IconoNav tipo={s.icono} />
                </span>
                <span
                  className={`mt-1.5 block text-[10.5px] font-semibold transition-colors ${
                    on ? 'text-[rgb(var(--fg))]' : 'text-[rgb(var(--fg-muted))]'
                  }`}
                >
                  {s.nombre}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      <DonationSheet
        abierto={sheet}
        onClose={() => setSheet(false)}
        frenteInicial={frenteSel}
        montoInicial={montoSel}
      />
    </main>
  );
}
