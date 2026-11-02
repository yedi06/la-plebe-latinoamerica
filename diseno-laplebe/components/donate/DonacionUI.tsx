'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useRef, useState } from 'react';
import { MONTO_SUGERIDO, MONTOS_UNICO } from '@/lib/data';
import { EASE } from '@/components/motion';

const HAIRLINE = 'border-[rgb(var(--line)/var(--line-a))]';

/**
 * Copia un texto al portapapeles. Dentro del navegador de TikTok la API moderna
 * suele no estar disponible, así que cae al método antiguo antes de rendirse.
 */
export async function copiarTexto(texto: string): Promise<boolean> {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(texto);
      return true;
    }
  } catch {
    /* sigue con el método antiguo */
  }
  const area = document.createElement('textarea');
  area.value = texto;
  area.setAttribute('readonly', '');
  area.style.position = 'fixed';
  area.style.opacity = '0';
  document.body.appendChild(area);
  area.select();
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  }
  area.remove();
  return ok;
}

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
  const [estado, setEstado] = useState<'espera' | 'copiado' | 'fallo'>('espera');

  const copiar = async () => {
    const ok = await copiarTexto(valor.replace(/\s/g, ''));
    setEstado(ok ? 'copiado' : 'fallo');
    setTimeout(() => setEstado('espera'), 2400);
  };

  return (
    <div className={`border-b ${HAIRLINE} pb-1.5 ${className}`}>
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[12px] text-[rgb(var(--fg-muted))]">{etiqueta}</p>
          <p className="truncate select-all font-mono text-[15px] font-semibold tabular-nums">{valor}</p>
        </div>
        <button
          type="button"
          onClick={copiar}
          className="-my-2 min-h-11 shrink-0 px-1 text-[13px] font-semibold text-[rgb(var(--accent))] underline decoration-[rgb(var(--accent))]/35 underline-offset-4 transition hover:decoration-[rgb(var(--accent))]"
        >
          {estado === 'copiado' ? 'Copiado' : 'Copiar'}
        </button>
      </div>
      {estado === 'fallo' && (
        <p role="alert" className="mt-1 text-[12px] text-[#B42318] dark:text-[#FDA29B]">
          No se pudo copiar. Mantén presionado el dato para seleccionarlo.
        </p>
      )}
    </div>
  );
}

/* ==========================================================================
   Monto
   ========================================================================== */
export function SelectorMonto({
  monto,
  onChange,
  onConfirmar,
  className = '',
}: {
  monto: number;
  onChange: (v: number) => void;
  /** Enter en «Otro monto» avanza igual que el botón Continuar. */
  onConfirmar?: () => void;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [otro, setOtro] = useState('');
  // Si la persona borra «Otro monto», se vuelve al último botón que eligió:
  // nunca queda un total en pantalla sin un origen visible.
  const ultimoSugerido = useRef(
    (MONTOS_UNICO as readonly number[]).includes(monto) ? monto : MONTO_SUGERIDO,
  );

  return (
    <div className={className}>
      <div role="group" aria-label="Monto a donar" className="grid grid-cols-3 gap-2">
        {MONTOS_UNICO.map((m) => {
          const activo = monto === m && otro === '';
          return (
            <motion.button
              key={m}
              type="button"
              aria-pressed={activo}
              onClick={() => {
                setOtro('');
                ultimoSugerido.current = m;
                onChange(m);
              }}
              animate={activo && !reduce ? { y: [0, -5, 0] } : { y: 0 }}
              transition={{ duration: 0.38, ease: EASE }}
              className={`border py-4 font-display text-[17px] leading-none transition-all sm:text-[19px] ${
                activo
                  ? 'border-transparent bg-[rgb(var(--accent-fill))] text-ink'
                  : `${HAIRLINE} text-[rgb(var(--fg))] hover:border-[rgb(var(--accent-fill)/.6)]`
              }`}
            >
              <span className="opacity-70">S/</span> {m}
            </motion.button>
          );
        })}
      </div>

      <label className={`mt-2 flex min-h-12 items-center gap-2 border ${HAIRLINE} px-3.5 transition focus-within:border-[rgb(var(--accent-fill))]`}>
        <span className="font-display text-[15px] text-[rgb(var(--fg-muted))]">S/</span>
        <input
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="Otro monto"
          value={otro}
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, '').slice(0, 6);
            setOtro(v);
            onChange(v ? Number(v) : ultimoSugerido.current);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onConfirmar?.();
          }}
          enterKeyHint="next"
          aria-label="Otro monto en soles"
          className="h-12 w-full bg-transparent text-[16px] font-semibold outline-none placeholder:font-normal placeholder:text-[rgb(var(--fg-muted))]"
        />
      </label>
    </div>
  );
}
