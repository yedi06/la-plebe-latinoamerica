'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { FRENTES, MONTOS_MENSUAL, MONTOS_UNICO, type Frente } from '@/lib/data';
import { EASE, SPRING } from '@/components/motion';
import { BotonPrincipal } from '@/components/ui/Boton';
import { Checkout } from './Checkout';
import {
  FrecuenciaToggle,
  LecturaImpacto,
  SelectorMonto,
  type Frecuencia,
} from './DonacionUI';

const HAIRLINE = 'border-[rgb(var(--line)/var(--line-a))]';

/**
 * Selector de donación en capa superpuesta.
 * Móvil: hoja inferior arrastrable. Escritorio: panel centrado.
 * Dos pasos y nada más: cuánto → cómo. Nunca saca al usuario de la página.
 */
export function DonationSheet({
  abierto,
  onClose,
  frenteInicial = 'alimentacion',
  montoInicial = 50,
  frecuenciaInicial = 'unica',
}: {
  abierto: boolean;
  onClose: () => void;
  frenteInicial?: Frente['id'];
  montoInicial?: number;
  frecuenciaInicial?: Frecuencia;
}) {
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const [paso, setPaso] = useState<1 | 2>(1);
  const [frecuencia, setFrecuencia] = useState<Frecuencia>(frecuenciaInicial);
  const [monto, setMonto] = useState(montoInicial);
  const [frente, setFrente] = useState<Frente['id']>(frenteInicial);

  useEffect(() => {
    if (abierto) {
      setFrente(frenteInicial);
      setMonto(montoInicial);
      setFrecuencia(frecuenciaInicial);
      setPaso(1);
    }
  }, [abierto, frenteInicial, montoInicial, frecuenciaInicial]);

  useEffect(() => {
    if (!abierto) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [abierto, onClose]);

  const nombreFrente = FRENTES.find((f) => f.id === frente)!.nombreCorto;

  /*
    Cada frecuencia tiene sus propios montos sugeridos. Al cambiar de una a otra
    el monto anterior podía no existir en la lista nueva (S/ 25 es mensual, no
    existe en "una vez"), y entonces ningún botón quedaba marcado aunque el
    total sí mostrara esa cifra. Se recoloca en el equivalente de la otra lista.
  */
  const cambiarFrecuencia = (nueva: Frecuencia) => {
    const antes = frecuencia === 'mensual' ? MONTOS_MENSUAL : MONTOS_UNICO;
    const ahora = nueva === 'mensual' ? MONTOS_MENSUAL : MONTOS_UNICO;
    const i = antes.indexOf(monto as never);
    if (i !== -1) setMonto(ahora[i]);
    setFrecuencia(nueva);
  };

  return (
    <AnimatePresence>
      {abierto && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center">
          <motion.button
            type="button"
            aria-label="Cerrar"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-ink/75 backdrop-blur-sm"
          />

          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label="Elige tu donación"
            initial={reduce ? { opacity: 0 } : { y: '100%', opacity: 0.6 }}
            animate={reduce ? { opacity: 1 } : { y: 0, opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { y: '100%', opacity: 0 }}
            transition={reduce ? { duration: 0.2 } : SPRING}
            drag={reduce ? false : 'y'}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 140 || info.velocity.y > 700) onClose();
            }}
            className={`relative flex max-h-[92svh] w-full max-w-[520px] flex-col overflow-hidden rounded-t-[22px] border ${HAIRLINE} bg-[rgb(var(--bg))] shadow-lift sm:max-h-[86svh] sm:rounded-[22px]`}
          >
            {/* Cabecera única: marca, progreso y título en una sola banda.
                Antes eran tres franjas apiladas y el modal se veía fragmentado. */}
            <div className="shrink-0 bg-ink px-5 pb-5 pt-5 sm:pt-4">
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 mx-auto mt-2.5 h-1 w-10 rounded-full bg-cream/30 sm:hidden"
              />
              <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-display text-[13px] uppercase leading-none tracking-[.02em] text-cream/90">
                    La Plebe Latinoamérica
                  </p>
                  <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-cream/55">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-lime" fill="currentColor" aria-hidden>
                      <path d="M12 1.8 4 5v6.2c0 4.9 3.4 9.4 8 10.6 4.6-1.2 8-5.7 8-10.6V5z" />
                    </svg>
                    Donación segura · 100% trazable
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Cerrar"
                  className="-mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-cream/55 transition hover:bg-cream/10 hover:text-cream"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="m6 6 12 12M18 6 6 18" />
                  </svg>
                </button>
              </div>

              <h2 className="mt-5 font-display text-[clamp(1.4rem,5.5vw,1.85rem)] uppercase leading-none tracking-[-.02em] text-cream">
                {paso === 1 ? 'Cuánto quieres donar' : 'Cómo lo envías'}
              </h2>

              <div className="mt-4 flex items-center gap-2.5">
                <div className="flex flex-1 gap-1.5">
                  {[1, 2].map((n) => (
                    <span key={n} className="h-[3px] flex-1 overflow-hidden rounded-full bg-cream/20">
                      <span
                        className={`block h-full rounded-full bg-lime transition-all duration-500 ${
                          paso >= n ? 'w-full' : 'w-0'
                        }`}
                      />
                    </span>
                  ))}
                </div>
                <span className="shrink-0 text-[10.5px] tabular-nums text-cream/45">
                  {paso} de 2
                </span>
              </div>
            </div>

            {/* Cuerpo */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5">
              {/*
                Sin AnimatePresence ni animación de salida. Con `mode="wait"` el
                contenido nuevo solo se monta cuando termina la salida del viejo;
                si esa salida se interrumpe, el paso 2 queda en blanco. En un
                flujo de donación eso es perder al donante, así que el contenido
                se monta siempre y la transición es solo de entrada.
              */}
              <div>
                {paso === 1 ? (
                  <motion.div
                    key="p1"
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.28, ease: EASE }}
                    className="space-y-5"
                  >
                    <FrecuenciaToggle valor={frecuencia} onChange={cambiarFrecuencia} />
                    <SelectorMonto frecuencia={frecuencia} monto={monto} onChange={setMonto} />
                    <LecturaImpacto monto={monto} frente={frente} frecuencia={frecuencia} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="p2"
                    initial={{ opacity: 0, x: 14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.28, ease: EASE }}
                    className="space-y-6"
                  >
                    <div className={`flex items-baseline justify-between gap-3 border-b ${HAIRLINE} pb-3`}>
                      <p className="font-display text-[17px] uppercase leading-none">
                        S/ {monto}
                        <span className="ml-2 font-sans text-[11.5px] font-normal normal-case text-[rgb(var(--fg-muted))]">
                          {frecuencia === 'mensual' ? 'cada mes' : 'una vez'}
                        </span>
                      </p>
                      <button
                        type="button"
                        onClick={() => setPaso(1)}
                        className="shrink-0 text-[11.5px] font-semibold text-[rgb(var(--accent))] underline underline-offset-4"
                      >
                        Cambiar
                      </button>
                    </div>
                    <Checkout monto={monto} frecuencia={frecuencia} frente={nombreFrente} />
                  </motion.div>
                )}
              </div>
            </div>

            {/* Pie */}
            {paso === 1 && (
              <div className={`shrink-0 border-t ${HAIRLINE} px-5 pb-[max(1.1rem,env(safe-area-inset-bottom))] pt-4`}>
                <BotonPrincipal
                  tamano="md"
                  onClick={() => setPaso(2)}
                  bajada={frecuencia === 'mensual' ? 'Cada mes, hasta que lo canceles' : 'Una sola vez'}
                >
                  Continuar · S/ {monto}
                </BotonPrincipal>
                <ul className="mt-3.5 grid grid-cols-3 gap-2 text-center text-[10px] leading-tight text-[rgb(var(--fg-muted))]">
                  <li className="flex flex-col items-center gap-1.5">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-[rgb(var(--accent))]" fill="currentColor" aria-hidden>
                      <path d="M17 9V7a5 5 0 0 0-10 0v2H5.6v12h12.8V9zm-8-2a3 3 0 0 1 6 0v2H9z" />
                    </svg>
                    Pago cifrado
                  </li>
                  <li className="flex flex-col items-center gap-1.5">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-[rgb(var(--accent))]" fill="currentColor" aria-hidden>
                      <path d="M12 1.8 4 5v6.2c0 4.9 3.4 9.4 8 10.6 4.6-1.2 8-5.7 8-10.6V5z" />
                    </svg>
                    Evidencia de cada entrega
                  </li>
                  <li className="flex flex-col items-center gap-1.5">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-[rgb(var(--accent))]" fill="currentColor" aria-hidden>
                      <path d="M6 2h9l5 5v15H6zm8 1.5V8h4.5z" />
                    </svg>
                    Recibes constancia
                  </li>
                </ul>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
