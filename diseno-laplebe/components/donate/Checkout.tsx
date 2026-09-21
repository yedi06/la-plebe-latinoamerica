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

type Medio = 'billeteras' | 'transferencia' | 'tarjeta' | 'paypal' | 'efectivo' | 'otras';

/**
 * Seis familias, no dieciséis logos sueltos.
 *
 * Yape, Plin y BIM son billeteras digitales y se agrupan bajo un solo icono,
 * igual que los cinco bancos se agrupan bajo «Banco»: primero eliges la familia
 * y recién entonces la marca concreta. Así la primera pantalla tiene seis
 * decisiones en vez de dieciséis.
 */
const MEDIOS: { id: Medio; nombre: string; logo: string }[] = [
  { id: 'billeteras', nombre: 'Billeteras', logo: 'billeteras' },
  { id: 'transferencia', nombre: 'Banco', logo: 'transferencia' },
  { id: 'tarjeta', nombre: 'Tarjeta', logo: 'visa' },
  { id: 'paypal', nombre: 'PayPal', logo: 'paypal' },
  { id: 'efectivo', nombre: 'Efectivo', logo: 'pagoefectivo' },
  { id: 'otras', nombre: 'Otras', logo: 'applepay' },
];

/** Casilla de una marca concreta dentro de una familia. */
function Casilla({
  id,
  nombre,
  activo,
  onClick,
}: {
  id: string;
  nombre: string;
  activo: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={nombre}
      aria-pressed={activo}
      className={`flex h-14 w-[100px] items-center justify-center border p-2 transition ${
        activo
          ? 'border-[rgb(var(--accent-fill))]'
          : `${HAIRLINE} opacity-45 hover:opacity-100`
      }`}
    >
      <LogoPago id={id} nombre={nombre} cubrir />
    </button>
  );
}

function Campo({
  etiqueta,
  placeholder,
  inputMode = 'text',
  maxLength,
  sufijo,
}: {
  etiqueta: string;
  placeholder: string;
  inputMode?: 'text' | 'numeric' | 'email';
  maxLength?: number;
  sufijo?: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] text-[rgb(var(--fg-muted))]">{etiqueta}</span>
      <span
        className={`flex items-center gap-2 rounded-xl border ${HAIRLINE} px-3.5 py-3 transition focus-within:border-[rgb(var(--accent-fill))]`}
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
  const [medio, setMedio] = useState<Medio>('billeteras');
  const [billetera, setBilletera] = useState(BILLETERAS[0].id);
  const [banco, setBanco] = useState(BANCOS[0].id);

  const w = BILLETERAS.find((x) => x.id === billetera)!;
  const b = BANCOS.find((x) => x.id === banco)!;
  const mes = frecuencia === 'mensual' ? ' al mes' : '';

  return (
    <div className={className}>
      <p className="mb-2.5 text-[11px] text-[rgb(var(--fg-muted))]">¿Cómo quieres donar?</p>

      <div
        role="radiogroup"
        aria-label="Medio de pago"
        className="grid max-w-[460px] grid-cols-3 gap-2"
      >
        {MEDIOS.map((m) => {
          const on = medio === m.id;
          return (
            <button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => setMedio(m.id)}
              className={`flex min-w-0 flex-col items-center gap-2 border px-2 pb-2.5 pt-3 transition ${
                on
                  ? 'border-[rgb(var(--accent-fill))]'
                  : `${HAIRLINE} opacity-45 hover:opacity-100`
              }`}
            >
              <span className="flex h-11 w-full items-center justify-center">
                <LogoPago id={m.logo} nombre={m.nombre} cubrir />
              </span>
              <span className="w-full truncate text-[10.5px] font-semibold leading-tight">
                {m.nombre}
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={medio}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.24, ease: EASE }}
          className="mt-5"
        >
          {/* ---------------- Billeteras digitales ---------------- */}
          {medio === 'billeteras' && (
            <div>
              <div className="flex flex-wrap gap-2">
                {BILLETERAS.map((x) => (
                  <Casilla
                    key={x.id}
                    id={x.id}
                    nombre={x.nombre}
                    activo={x.id === billetera}
                    onClick={() => setBilletera(x.id)}
                  />
                ))}
              </div>

              <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                <div className="w-[150px] shrink-0 bg-white p-3">
                  <QrMock
                    seed={w.id}
                    className="h-auto w-full text-ink"
                    label={`Código QR de ${w.nombre}`}
                  />
                </div>
                <div className="w-full min-w-0">
                  <CampoCopiable etiqueta={`Número ${w.nombre}`} valor={w.numero} />
                  <p className="mt-2.5 text-[12px] leading-relaxed text-[rgb(var(--fg-muted))]">
                    Titular: {w.titular}. Escanea el QR desde la app o copia el número y envía{' '}
                    <strong className="font-semibold text-[rgb(var(--fg))]">S/ {monto}</strong>
                    {mes}.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ---------------- Transferencia bancaria ---------------- */}
          {medio === 'transferencia' && (
            <div>
              <div className="flex flex-wrap gap-2">
                {BANCOS.map((x) => (
                  <Casilla
                    key={x.id}
                    id={x.id}
                    nombre={x.nombre}
                    activo={x.id === banco}
                    onClick={() => setBanco(x.id)}
                  />
                ))}
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

          {/* ---------------- Tarjeta ---------------- */}
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
                  <Campo
                    etiqueta="Vencimiento"
                    placeholder="MM / AA"
                    inputMode="numeric"
                    maxLength={7}
                  />
                  <Campo etiqueta="CVV" placeholder="123" inputMode="numeric" maxLength={4} />
                </div>
                <Campo
                  etiqueta="Correo (para tu comprobante)"
                  placeholder="tu@correo.com"
                  inputMode="email"
                />
              </div>
              <BotonPrincipal tamano="md" className="mt-5">
                Donar S/ {monto}
                {mes}
              </BotonPrincipal>
              <p className="mt-3 text-[11px] leading-snug text-[rgb(var(--fg-muted))]">
                Los datos de tu tarjeta los procesa la pasarela con 3D Secure. No pasan por los
                servidores de La Plebe.
              </p>
            </div>
          )}

          {/* ---------------- PayPal ---------------- */}
          {medio === 'paypal' && (
            <div>
              <p className="text-[13px] leading-relaxed text-[rgb(var(--fg-muted))]">
                Para donar desde el extranjero, en dólares o euros. Es la vía más cómoda para la
                comunidad peruana fuera del Perú.
              </p>
              <BotonPrincipal tamano="md" className="mt-5">
                Continuar con PayPal · S/ {monto}
                {mes}
              </BotonPrincipal>
            </div>
          )}

          {/* ---------------- Efectivo ---------------- */}
          {medio === 'efectivo' && (
            <div>
              <p className="text-[13px] leading-relaxed text-[rgb(var(--fg-muted))]">
                Para donar sin tarjeta ni cuenta bancaria. Generamos un código y lo pagas en
                efectivo en agentes, bodegas afiliadas, farmacias o bancos.
              </p>
              <BotonPrincipal tamano="md" className="mt-5">
                Generar código · S/ {monto}
                {mes}
              </BotonPrincipal>
              <p className="mt-3 text-[11px] leading-snug text-[rgb(var(--fg-muted))]">
                El código vence a las 24 horas. Guarda el comprobante del agente.
              </p>
            </div>
          )}

          {/* ---------------- Otras opciones ---------------- */}
          {medio === 'otras' && (
            <div>
              <p className="text-[13px] leading-relaxed text-[rgb(var(--fg-muted))]">
                Paga con la billetera que ya tienes configurada en tu celular, sin escribir ningún
                dato.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Casilla id="applepay" nombre="Apple Pay" activo />
                <Casilla id="googlepay" nombre="Google Pay" activo />
              </div>
              <BotonPrincipal tamano="md" className="mt-5">
                Continuar · S/ {monto}
                {mes}
              </BotonPrincipal>
              <p className="mt-3 text-[11px] leading-snug text-[rgb(var(--fg-muted))]">
                Disponible según tu dispositivo y la pasarela que se contrate.
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <p className={`mt-5 border-t ${HAIRLINE} pt-3 text-[11.5px] text-[rgb(var(--fg-muted))]`}>
        Donas <strong className="font-semibold text-[rgb(var(--fg))]">S/ {monto}</strong>
        {mes} a {frente}. Cada entrega se publica con evidencia audiovisual.
      </p>
    </div>
  );
}
