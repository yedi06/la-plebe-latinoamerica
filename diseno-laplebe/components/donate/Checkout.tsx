'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { BANCOS, BILLETERAS, LOGOS_TARJETAS } from '@/lib/data';
import { LogoPago } from '@/components/brand/LogoPago';
import { QrMock } from '@/components/brand/QrMock';
import { BotonPrincipal } from '@/components/ui/Boton';
import { CampoCopiable } from './DonacionUI';
import { EASE } from '@/components/motion';

const HAIRLINE = 'border-[rgb(var(--line)/var(--line-a))]';

type Medio = 'yape' | 'plin' | 'transferencia' | 'tarjeta' | 'paypal';

const MEDIOS: { id: Medio; nombre: string; logo: string }[] = [
  { id: 'yape', nombre: 'Yape', logo: 'yape' },
  { id: 'plin', nombre: 'Plin', logo: 'plin' },
  { id: 'transferencia', nombre: 'Banco', logo: 'transferencia' },
  { id: 'tarjeta', nombre: 'Tarjeta', logo: 'visa' },
  { id: 'paypal', nombre: 'PayPal', logo: 'applepay' },
];

/* ========================================================================== */
/*  Campo de formulario                                                       */
/* ========================================================================== */
function Campo({
  etiqueta,
  placeholder,
  inputMode = 'text',
  maxLength,
  sufijo,
  className = '',
}: {
  etiqueta: string;
  placeholder: string;
  inputMode?: 'text' | 'numeric' | 'email';
  maxLength?: number;
  sufijo?: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-[11px] text-[rgb(var(--fg-muted))]">{etiqueta}</span>
      <span
        className={`flex items-center gap-2 border ${HAIRLINE} px-3.5 py-3 transition focus-within:border-[rgb(var(--accent-fill))]`}
      >
        <input
          type={inputMode === 'email' ? 'email' : 'text'}
          inputMode={inputMode === 'email' ? 'email' : inputMode}
          placeholder={placeholder}
          maxLength={maxLength}
          autoComplete="off"
          className="w-full bg-transparent text-[15px] font-medium outline-none placeholder:font-normal placeholder:text-[rgb(var(--fg-muted))]"
        />
        {sufijo}
      </span>
    </label>
  );
}

/* ========================================================================== */
/*  Selector de medio de pago                                                 */
/* ========================================================================== */
export function Checkout({
  monto,
  frecuencia,
  frente,
  className = '',
}: {
  monto: number;
  frecuencia: 'unica' | 'mensual';
  frente: string;
  className?: string;
}) {
  const [medio, setMedio] = useState<Medio>('yape');
  const [banco, setBanco] = useState(BANCOS[0].id);
  const b = BANCOS.find((x) => x.id === banco)!;
  const billetera = BILLETERAS.find((x) => x.id === medio);

  const sufijoMensual = frecuencia === 'mensual' ? ' al mes' : '';

  return (
    <div className={className}>
      {/* ---------------- Elección de medio ---------------- */}
      <p className="mb-2.5 text-[11px] text-[rgb(var(--fg-muted))]">¿Cómo quieres donar?</p>
      <div role="radiogroup" aria-label="Medio de pago" className="grid grid-cols-5 gap-1.5">
        {MEDIOS.map((m) => {
          const on = medio === m.id;
          return (
            <button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => setMedio(m.id)}
              className={`flex min-w-0 flex-col items-center gap-1.5 border px-1.5 pb-2 pt-2.5 transition ${
                on
                  ? 'border-[rgb(var(--accent-fill))] bg-[rgb(var(--accent-fill)/.1)]'
                  : `${HAIRLINE} opacity-55 hover:opacity-100`
              }`}
            >
              <span className="flex h-9 w-full items-center justify-center">
                <LogoPago id={m.logo} nombre={m.nombre} cubrir />
              </span>
              <span className="w-full truncate text-[9.5px] font-semibold leading-tight">{m.nombre}</span>
            </button>
          );
        })}
      </div>

      {/* ---------------- Contenido del medio elegido ---------------- */}
      <AnimatePresence mode="wait">
        <motion.div
          key={medio}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.24, ease: EASE }}
          className="mt-5"
        >
          {/* ---- Yape / Plin ---- */}
          {billetera && (
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
              <div className="w-[150px] shrink-0 bg-white p-3">
                <QrMock
                  seed={billetera.id}
                  className="h-auto w-full text-ink"
                  label={`Código QR de ${billetera.nombre}`}
                />
              </div>
              <div className="w-full min-w-0">
                <CampoCopiable etiqueta={`Número ${billetera.nombre}`} valor={billetera.numero} />
                <p className="mt-2.5 text-[12px] leading-relaxed text-[rgb(var(--fg-muted))]">
                  Titular: {billetera.titular}. Escanea el QR desde la app o copia el número y
                  yapea <strong className="font-semibold text-[rgb(var(--fg))]">S/ {monto}</strong>
                  {sufijoMensual}.
                </p>
              </div>
            </div>
          )}

          {/* ---- Transferencia ---- */}
          {medio === 'transferencia' && (
            <div>
              <div className="flex flex-wrap gap-2">
                {BANCOS.map((x) => {
                  const on = x.id === banco;
                  return (
                    <button
                      key={x.id}
                      type="button"
                      onClick={() => setBanco(x.id)}
                      aria-label={x.nombre}
                      aria-pressed={on}
                      className={`flex h-11 w-[86px] items-center justify-center border p-1.5 transition ${
                        on
                          ? 'border-[rgb(var(--accent-fill))] bg-[rgb(var(--accent-fill)/.1)]'
                          : `${HAIRLINE} opacity-55 hover:opacity-100`
                      }`}
                    >
                      <LogoPago id={x.id} nombre={x.nombre} cubrir />
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 space-y-3">
                <CampoCopiable etiqueta={`Cuenta ${b.nombre} · ${b.moneda}`} valor={b.cuenta} />
                <CampoCopiable etiqueta="Código interbancario (CCI)" valor={b.cci} />
              </div>
              <p className="mt-3 text-[11.5px] leading-snug text-[rgb(var(--fg-muted))]">
                A nombre de La Plebe Latinoamérica. Envíanos la constancia por WhatsApp para
                incluirte en el reporte de la campaña.
              </p>
            </div>
          )}

          {/* ---- Tarjeta ---- */}
          {medio === 'tarjeta' && (
            <div>
              <div className="grid gap-3.5">
                <Campo
                  etiqueta="Número de tarjeta"
                  placeholder="0000 0000 0000 0000"
                  inputMode="numeric"
                  maxLength={19}
                  sufijo={
                    <span className="flex shrink-0 items-center gap-1">
                      {LOGOS_TARJETAS.map((t) => (
                        <LogoPago key={t.id} id={t.id} nombre={t.nombre} alto="h-5" />
                      ))}
                    </span>
                  }
                />
                <div className="grid grid-cols-2 gap-3.5">
                  <Campo etiqueta="Vencimiento" placeholder="MM / AA" inputMode="numeric" maxLength={7} />
                  <Campo etiqueta="CVV" placeholder="123" inputMode="numeric" maxLength={4} />
                </div>
                <Campo etiqueta="Correo (para tu comprobante)" placeholder="tu@correo.com" inputMode="email" />
              </div>

              <BotonPrincipal tamano="md" className="mt-5">
                Donar S/ {monto}
                {sufijoMensual}
              </BotonPrincipal>

              <p className="mt-3 text-[11px] leading-snug text-[rgb(var(--fg-muted))]">
                Los datos de tu tarjeta los procesa la pasarela con 3D Secure. No pasan por los
                servidores de La Plebe.
              </p>
            </div>
          )}

          {/* ---- PayPal y billeteras del móvil ---- */}
          {medio === 'paypal' && (
            <div>
              <p className="text-[13px] leading-relaxed text-[rgb(var(--fg-muted))]">
                Para donar desde el extranjero, en dólares o euros. También disponible con Apple Pay
                y Google Pay desde el celular.
              </p>
              <div className="mt-3.5 flex gap-2">
                {[
                  { id: 'applepay', nombre: 'Apple Pay' },
                  { id: 'googlepay', nombre: 'Google Pay' },
                ].map((m) => (
                  <span key={m.id} className="flex h-10 w-[84px] items-center justify-center">
                    <LogoPago id={m.id} nombre={m.nombre} cubrir />
                  </span>
                ))}
              </div>
              <BotonPrincipal tamano="md" className="mt-5">
                Continuar · S/ {monto}
                {sufijoMensual}
              </BotonPrincipal>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Resumen siempre a la vista */}
      <p className={`mt-5 border-t ${HAIRLINE} pt-3 text-[11.5px] text-[rgb(var(--fg-muted))]`}>
        Donas <strong className="font-semibold text-[rgb(var(--fg))]">S/ {monto}</strong>
        {sufijoMensual} a {frente}. Cada entrega se publica con evidencia audiovisual.
      </p>
    </div>
  );
}
