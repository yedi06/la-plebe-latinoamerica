'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import {
  BANCOS,
  BILLETERAS,
  FRENTES,
  MONTOS_MENSUAL,
  MONTOS_UNICO,
  PASARELAS,
  impactoDeMonto,
  impactoGeneral,
  type Frente,
} from '@/lib/data';
import { QrMock } from '@/components/brand/QrMock';
import { FilaLogos, LogoPago } from '@/components/brand/LogoPago';
import { IconoFrente } from '@/components/brand/Marca';
import { LOGOS_INTERNACIONAL, LOGOS_TARJETAS } from '@/lib/data';
import { BotonPrincipal, BotonSecundario } from '@/components/ui/Boton';
import { EASE, SPRING } from '@/components/motion';

export type Frecuencia = 'unica' | 'mensual';

const HAIRLINE = 'border-[rgb(var(--line)/var(--line-a))]';

/* ==========================================================================
   Campo copiable — el dato manda, la acción es secundaria
   ========================================================================== */
export function CampoCopiable({
  etiqueta,
  valor,
  className = '',
}: {
  etiqueta: string;
  valor: string;
  className?: string;
}) {
  const [copiado, setCopiado] = useState(false);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(valor.replace(/\s/g, ''));
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1800);
    } catch {
      /* si el navegador bloquea el portapapeles, el número igual está visible */
    }
  };

  return (
    <div className={`flex items-end justify-between gap-4 border-b ${HAIRLINE} pb-2.5 ${className}`}>
      <div className="min-w-0">
        <p className="text-[11px] text-[rgb(var(--fg-muted))]">{etiqueta}</p>
        <p className="truncate font-mono text-[15px] font-semibold tabular-nums">{valor}</p>
      </div>
      <button
        type="button"
        onClick={copiar}
        className="shrink-0 pb-0.5 text-[11.5px] font-semibold text-[rgb(var(--accent))] underline decoration-[rgb(var(--accent))]/35 underline-offset-4 transition hover:decoration-[rgb(var(--accent))]"
      >
        {copiado ? 'Copiado' : 'Copiar'}
      </button>
    </div>
  );
}

/* ==========================================================================
   Frecuencia
   ========================================================================== */
export function FrecuenciaToggle({
  valor,
  onChange,
  className = '',
}: {
  valor: Frecuencia;
  onChange: (v: Frecuencia) => void;
  className?: string;
}) {
  const opciones: { id: Frecuencia; label: string }[] = [
    { id: 'unica', label: 'Una vez' },
    { id: 'mensual', label: 'Cada mes' },
  ];

  return (
    <div
      role="radiogroup"
      aria-label="Frecuencia de la donación"
      className={`grid grid-cols-2 gap-1 rounded-xl border ${HAIRLINE} p-1 ${className}`}
    >
      {opciones.map((o, i) => {
        const activo = valor === o.id;
        return (
          <button
            key={o.id}
            role="radio"
            aria-checked={activo}
            type="button"
            onClick={() => onChange(o.id)}
            className="relative isolate rounded-lg py-2.5 text-[13px] font-semibold transition-colors"
          >
            {activo && (
              <motion.span
                layoutId="freq-pill"
                className="absolute inset-0 -z-10 rounded-lg bg-[rgb(var(--accent-fill))]"
                transition={SPRING}
              />
            )}
            <span className={activo ? 'text-ink' : 'text-[rgb(var(--fg-muted))]'}>
              {o.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ==========================================================================
   Monto
   ========================================================================== */
export function SelectorMonto({
  frecuencia,
  monto,
  onChange,
  className = '',
}: {
  frecuencia: Frecuencia;
  monto: number;
  onChange: (v: number) => void;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const montos = frecuencia === 'mensual' ? MONTOS_MENSUAL : MONTOS_UNICO;
  const [otro, setOtro] = useState('');

  return (
    <div className={className}>
      <div role="radiogroup" aria-label="Monto a donar" className="grid grid-cols-4 gap-2">
        {montos.map((m, i) => {
          const activo = monto === m && otro === '';
          return (
            <motion.button
              key={m}
              type="button"
              role="radio"
              aria-checked={activo}
              onClick={() => {
                setOtro('');
                onChange(m);
              }}
              animate={activo && !reduce ? { y: [0, -5, 0] } : { y: 0 }}
              transition={{ duration: 0.38, ease: EASE }}
              className={`rounded-xl border py-3.5 font-display text-[17px] leading-none transition-all sm:text-[19px] ${
                activo
                  ? 'border-transparent bg-[rgb(var(--accent-fill))] text-ink shadow-glow'
                  : `${HAIRLINE} text-[rgb(var(--fg))] hover:border-[rgb(var(--accent-fill)/.6)]`
              }`}
            >
              <span className="opacity-60">S/</span> {m}
            </motion.button>
          );
        })}
      </div>

      <div className={`mt-2 flex items-center gap-2 rounded-xl border ${HAIRLINE} px-3.5 py-3 transition focus-within:border-[rgb(var(--accent-fill))]`}>
        <span className="font-display text-[15px] text-[rgb(var(--fg-muted))]">S/</span>
        <input
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="Otro monto"
          value={otro}
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, '').slice(0, 6);
            setOtro(v);
            if (v) onChange(Number(v));
          }}
          aria-label="Otro monto en soles"
          className="w-full bg-transparent text-[15px] font-semibold outline-none placeholder:font-normal placeholder:text-[rgb(var(--fg-muted))]"
        />
      </div>
    </div>
  );
}

/* ==========================================================================
   Frente de ayuda
   ========================================================================== */
export function SelectorFrente({
  valor,
  onChange,
  className = '',
}: {
  valor: Frente['id'];
  onChange: (v: Frente['id']) => void;
  className?: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Frente de ayuda al que va tu donación"
      className={`grid grid-cols-3 border ${HAIRLINE} ${className}`}
    >
      {FRENTES.map((f, i) => {
        const activo = valor === f.id;
        return (
          <button
            key={f.id}
            type="button"
            role="radio"
            aria-checked={activo}
            onClick={() => onChange(f.id)}
            className={`px-2 py-3 text-center transition-colors ${
              i > 0 ? `border-l ${HAIRLINE}` : ''
            } ${
              activo
                ? 'bg-[rgb(var(--accent-fill))] text-ink'
                : 'text-[rgb(var(--fg-muted))] hover:bg-[rgb(var(--fg)/.06)]'
            }`}
          >
            <span className="mx-auto mb-1 block w-fit">
              <IconoFrente tipo={f.icono} className="h-5 w-5" />
            </span>
            <span className="block text-[11.5px] font-semibold leading-tight text-balance">
              {f.nombreCorto}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ==========================================================================
   Lectura de impacto
   ========================================================================== */
export function LecturaImpacto({
  monto,
  frente,
  frecuencia,
  className = '',
}: {
  monto: number;
  frente?: Frente['id'];
  frecuencia: Frecuencia;
  className?: string;
}) {
  return (
    <div className={`rounded-xl bg-[rgb(var(--accent-fill)/.12)] px-4 py-3.5 ${className}`}>
      <p className="text-[11px] text-[rgb(var(--fg-muted))]">Tu donación se convierte en</p>
      <AnimatePresence mode="wait">
        <motion.p
          key={`${monto}-${frente}-${frecuencia}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.26, ease: EASE }}
          className="font-display text-[clamp(1.1rem,4.5vw,1.5rem)] uppercase leading-tight"
        >
          {impactoGeneral(monto)}
          {frecuencia === 'mensual' && (
            <span className="ml-2 font-sans text-[12px] font-semibold normal-case text-[rgb(var(--fg-muted))]">
              cada mes
            </span>
          )}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

/* ==========================================================================
   Billetera (Yape / Plin)
   ========================================================================== */
function Billetera({ id }: { id: 'yape' | 'plin' }) {
  const b = BILLETERAS.find((x) => x.id === id)!;
  return (
    <div className={`flex gap-5 border-t ${HAIRLINE} pt-5`}>
      <div className="w-[104px] shrink-0 bg-white p-2.5 sm:w-[124px]">
        <QrMock seed={b.id} className="h-auto w-full text-ink" label={`Código QR de ${b.nombre}`} />
      </div>
      <div className="min-w-0 flex-1">
        <LogoPago id={b.id} nombre={b.nombre} alto="h-7" />
        <p className="mt-1.5 text-[11.5px] leading-snug text-[rgb(var(--fg-muted))]">{b.nota}</p>
        <CampoCopiable etiqueta="Número" valor={b.numero} className="mt-3" />
        <p className="mt-2 text-[11px] text-[rgb(var(--fg-muted))]">{b.titular}</p>
      </div>
    </div>
  );
}

/* ==========================================================================
   Bancos — pestañas con subrayado, sin fondos de color
   ========================================================================== */
export function TabsBancos({ className = '' }: { className?: string }) {
  const [activo, setActivo] = useState(BANCOS[0].id);
  const banco = BANCOS.find((b) => b.id === activo)!;

  return (
    <div className={className}>
      <div className={`flex items-baseline justify-between gap-4 border-b ${HAIRLINE} pb-2`}>
        <h4 className="font-display text-[15px] uppercase tracking-tight">Transferencia bancaria</h4>
        <span className="text-[11px] text-[rgb(var(--fg-muted))]">{banco.moneda}</span>
      </div>

      {/* Pestañas con el logo del banco: se reconoce antes por la marca que por el nombre. */}
      <div role="tablist" aria-label="Elige tu banco" className="flex flex-wrap gap-2.5 pt-3.5">
        {BANCOS.map((b) => {
          const on = b.id === activo;
          return (
            <button
              key={b.id}
              role="tab"
              type="button"
              aria-selected={on}
              onClick={() => setActivo(b.id)}
              aria-label={b.nombre}
              className={`relative rounded-[5px] p-0.5 transition-all ${
                on
                  ? 'ring-2 ring-[rgb(var(--accent-fill))]'
                  : 'opacity-55 ring-1 ring-transparent hover:opacity-100'
              }`}
            >
              <LogoPago id={b.id} nombre={b.nombre} alto="h-8" />
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={banco.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25, ease: EASE }}
          className={`space-y-3 border-t ${HAIRLINE} pt-4`}
        >
          <CampoCopiable etiqueta="Cuenta corriente" valor={banco.cuenta} />
          <CampoCopiable etiqueta="Código interbancario (CCI)" valor={banco.cci} />
        </motion.div>
      </AnimatePresence>

      <p className="mt-3 text-[11.5px] leading-snug text-[rgb(var(--fg-muted))]">
        Cuentas a nombre de La Plebe Latinoamérica. Envía tu constancia al WhatsApp para que aparezca
        en el reporte de la campaña.
      </p>
    </div>
  );
}

/* ==========================================================================
   QR interoperable
   ========================================================================== */
export function QrUnificado({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-5 ${className}`}>
      <div className="w-[124px] shrink-0 bg-white p-3 sm:w-[150px]">
        <QrMock seed="interoperable" className="h-auto w-full text-ink" label="QR interoperable Yape y Plin" />
      </div>
      <div className="min-w-0">
        <h3 className="font-display text-[clamp(1.3rem,5vw,1.9rem)] uppercase leading-[0.95] tracking-tight">
          Escanea y dona
        </h3>
        <p className="mt-2 max-w-[34ch] text-[13px] leading-relaxed text-[rgb(var(--fg-muted))]">
          QR interoperable: funciona desde Yape, Plin y la app de cualquier banco. Es la forma más
          rápida de donar.
        </p>
      </div>
    </div>
  );
}

/* ==========================================================================
   Tarjeta y PayPal
   ========================================================================== */
export function TarjetaYPaypal({ className = '' }: { className?: string }) {
  return (
    <div className={`grid gap-6 sm:grid-cols-2 ${className}`}>
      <div className={`flex flex-col border-t ${HAIRLINE} pt-5`}>
        <h4 className="font-display text-[15px] uppercase tracking-tight">Tarjeta de crédito o débito</h4>
        <p className="mt-2 text-[12.5px] leading-relaxed text-[rgb(var(--fg-muted))]">
          Pago seguro con 3D Secure. Débito automático disponible para la donación mensual.
        </p>
        <FilaLogos items={LOGOS_TARJETAS} className="mt-3.5" alto="h-6" />
        <p className="mt-3 text-[11.5px] text-[rgb(var(--fg-muted))]">
          Pasarela por definir: {PASARELAS.map((p) => p.nombre).join(' · ')}
        </p>
        <BotonPrincipal tamano="md" className="mt-4">
          Donar con tarjeta
        </BotonPrincipal>
      </div>

      <div className={`flex flex-col border-t ${HAIRLINE} pt-5`}>
        <div className="flex items-baseline justify-between gap-3">
          <h4 className="font-display text-[15px] uppercase tracking-tight">Desde el extranjero</h4>
          <span className="text-[11px] text-[rgb(var(--fg-muted))]">USD · EUR</span>
        </div>
        <p className="mt-2 text-[12.5px] leading-relaxed text-[rgb(var(--fg-muted))]">
          Para la comunidad peruana fuera del Perú y donantes internacionales.
        </p>
        <FilaLogos items={LOGOS_INTERNACIONAL} className="mt-3.5" alto="h-6" />
        <BotonSecundario className="mt-auto pt-3.5">Donar con PayPal</BotonSecundario>
      </div>
    </div>
  );
}

/* ==========================================================================
   Bloque completo de medios
   ========================================================================== */
export function MediosDeDonacion({
  className = '',
  mostrarQrUnificado = true,
  soloBilleteras = false,
}: {
  className?: string;
  mostrarQrUnificado?: boolean;
  soloBilleteras?: boolean;
}) {
  if (soloBilleteras) {
    return (
      <>
        <Billetera id="yape" />
        <Billetera id="plin" />
      </>
    );
  }

  return (
    <div className={`space-y-7 ${className}`}>
      {mostrarQrUnificado && <QrUnificado />}
      <div className="grid gap-7 sm:grid-cols-2">
        <Billetera id="yape" />
        <Billetera id="plin" />
      </div>
      <TabsBancos className={`border-t ${HAIRLINE} pt-5`} />
      <TarjetaYPaypal />
      <p className="text-[11px] text-[rgb(var(--fg-muted))]">
        Los códigos QR son de ejemplo y los nombres de los medios de pago están en tipografía: en
        producción se reemplazan por los QR y logotipos oficiales.
      </p>
    </div>
  );
}
