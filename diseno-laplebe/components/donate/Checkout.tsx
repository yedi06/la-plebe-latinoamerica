'use client';

import { useState } from 'react';
import { BANCOS_ACTIVOS, BILLETERAS_ACTIVAS, BRAND, TITULAR_CUENTAS } from '@/lib/data';
import { LogoPago } from '@/components/brand/LogoPago';
import { IconWhatsApp, RedesSociales } from '@/components/brand/Marca';
import { rutaPublica } from '@/lib/ruta';
import { BotonPrincipal, BotonSecundario } from '@/components/ui/Boton';
import { CampoCopiable, copiarTexto } from './DonacionUI';

const HAIRLINE = 'border-[rgb(var(--line)/var(--line-a))]';

export type Medio = 'billetera' | 'banco';

/** Casilla de una marca concreta. Solo aparece cuando hay más de una para elegir. */
function Casilla({
  id,
  nombre,
  activo,
  onClick,
}: {
  id: string;
  nombre: string;
  activo: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={nombre}
      aria-pressed={activo}
      className={`flex h-14 w-[92px] items-center justify-center border bg-white p-2 transition ${
        activo ? 'border-2 border-[rgb(var(--accent-fill))]' : `${HAIRLINE} hover:border-[rgb(var(--fg)/.4)]`
      }`}
    >
      <LogoPago id={id} nombre={nombre} cubrir />
    </button>
  );
}

/**
 * Cómo se envía la donación.
 *
 * En Perú la donación no se cierra en la web, se cierra en la app: el flujo real
 * es copiar el dato, salir a la app y pagar. Por eso el dato y el botón de copiar
 * son la pantalla, y al copiar el siguiente paso pasa a ser el botón principal.
 * Solo se ofrecen medios con datos reales cargados en `lib/data.ts`: un medio sin
 * datos no se muestra, ni como ejemplo.
 */
export function Checkout({
  monto,
  onCambiarMonto,
  onListo,
  className = '',
}: {
  monto: number;
  onCambiarMonto: () => void;
  onListo: (nombreMedio: string) => void;
  className?: string;
}) {
  const hayBilletera = BILLETERAS_ACTIVAS.length > 0;
  const hayBanco = BANCOS_ACTIVOS.length > 0;
  const [medio, setMedio] = useState<Medio>(hayBilletera ? 'billetera' : 'banco');
  const [billetera, setBilletera] = useState(BILLETERAS_ACTIVAS[0]?.id);
  const [banco, setBanco] = useState(BANCOS_ACTIVOS[0]?.id);
  const [estado, setEstado] = useState<'espera' | 'copiado' | 'fallo'>('espera');

  const w = BILLETERAS_ACTIVAS.find((x) => x.id === billetera);
  const b = BANCOS_ACTIVOS.find((x) => x.id === banco);

  const copiar = async () => {
    if (!w) return;
    setEstado((await copiarTexto(w.numero.replace(/\s/g, ''))) ? 'copiado' : 'fallo');
  };

  const nombreMedio = medio === 'billetera' ? w?.nombre ?? 'Yape' : `transferencia ${b?.nombre ?? ''}`.trim();
  const listoPrincipal = medio === 'banco' || estado === 'copiado';

  return (
    <div className={className}>
      <div className={`flex items-center justify-between gap-3 border-b ${HAIRLINE} pb-2`}>
        <p className="font-display text-[22px] uppercase leading-none tabular-nums">
          S/ {monto}
          <span className="ml-2 font-sans text-[13px] font-normal normal-case text-[rgb(var(--fg-muted))]">
            una vez
          </span>
        </p>
        <button
          type="button"
          onClick={onCambiarMonto}
          className="min-h-11 shrink-0 px-1 text-[13px] font-semibold text-[rgb(var(--accent))] underline underline-offset-4"
        >
          Cambiar monto
        </button>
      </div>

      {hayBilletera && hayBanco && (
        <div role="group" aria-label="Cómo quieres enviarlo" className="mt-4 grid grid-cols-2 border border-[rgb(var(--fg))]">
          {(
            [
              ['billetera', BILLETERAS_ACTIVAS.length === 1 ? BILLETERAS_ACTIVAS[0].nombre : 'Billetera'],
              ['banco', 'Cuenta bancaria'],
            ] as [Medio, string][]
          ).map(([id, nombre]) => (
            <button
              key={id}
              type="button"
              aria-pressed={medio === id}
              onClick={() => setMedio(id)}
              className={`min-h-11 px-2 text-[14px] font-semibold transition ${
                medio === id ? 'bg-[rgb(var(--fg))] text-[rgb(var(--bg))]' : 'hover:bg-[rgb(var(--fg)/.06)]'
              }`}
            >
              {nombre}
            </button>
          ))}
        </div>
      )}

      {medio === 'billetera' && w && (
        <div className="mt-4">
          {BILLETERAS_ACTIVAS.length > 1 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {BILLETERAS_ACTIVAS.map((x) => (
                <Casilla
                  key={x.id}
                  id={x.id}
                  nombre={x.nombre}
                  activo={x.id === billetera}
                  onClick={() => {
                    setBilletera(x.id);
                    setEstado('espera');
                  }}
                />
              ))}
            </div>
          )}
          <div className="flex items-center gap-2.5">
            <LogoPago id={w.id} nombre={w.nombre} alto="h-7" />
            <p className="text-[13px] text-[rgb(var(--fg-muted))]">Número de {w.nombre}</p>
          </div>
          <p className="mt-2 select-all font-display text-[clamp(2.3rem,11vw,3rem)] leading-none tracking-[-.03em] tabular-nums">
            {w.numero}
          </p>
          {w.titular && (
            <p className="mt-2 text-[13px] text-[rgb(var(--fg-muted))]">
              Al enviar verás el nombre: <strong className="font-semibold text-[rgb(var(--fg))]">{w.titular}</strong>
            </p>
          )}

          {estado === 'copiado' ? (
            <BotonSecundario className="mt-4" onClick={copiar}>
              Número copiado
            </BotonSecundario>
          ) : (
            <BotonPrincipal tamano="md" className="mt-4" onClick={copiar}>
              Copiar número
            </BotonPrincipal>
          )}

          <p
            aria-live="polite"
            className={`mt-2.5 text-[13.5px] leading-snug ${
              estado === 'fallo' ? 'text-[#B42318] dark:text-[#FDA29B]' : 'text-[rgb(var(--fg-muted))]'
            }`}
          >
            {estado === 'espera' && `Luego abre ${w.nombre} y envía S/ ${monto}.`}
            {estado === 'copiado' && (
              <>
                Abre {w.nombre}, pega el número y envía{' '}
                <strong className="font-semibold text-[rgb(var(--fg))]">S/ {monto}</strong>.
              </>
            )}
            {estado === 'fallo' && 'No se pudo copiar. Mantén presionado el número para seleccionarlo.'}
          </p>

          {w.qr && (
            <details className={`mt-3 border-t ${HAIRLINE} pt-1`}>
              <summary className="flex min-h-11 cursor-pointer items-center text-[13px] font-semibold">
                Prefiero escanear el QR
              </summary>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={rutaPublica(w.qr)}
                alt={`Código QR de ${w.nombre}`}
                width={1024}
                height={1024}
                className="mb-3 h-auto w-[200px] bg-white p-3"
              />
            </details>
          )}
        </div>
      )}

      {medio === 'banco' && b && (
        <div className="mt-4">
          {BANCOS_ACTIVOS.length > 1 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {BANCOS_ACTIVOS.map((x) => (
                <Casilla key={x.id} id={x.id} nombre={x.nombre} activo={x.id === banco} onClick={() => setBanco(x.id)} />
              ))}
            </div>
          )}
          <div className="space-y-3">
            <CampoCopiable etiqueta={`Cuenta ${b.nombre} · ${b.moneda}`} valor={b.cuenta} />
            <CampoCopiable etiqueta="Código interbancario (CCI), si vienes de otro banco" valor={b.cci} />
          </div>
          {TITULAR_CUENTAS && (
            <p className="mt-2.5 text-[13px] text-[rgb(var(--fg-muted))]">
              A nombre de <strong className="font-semibold text-[rgb(var(--fg))]">{TITULAR_CUENTAS}</strong>
            </p>
          )}
          <p className="mt-2.5 text-[13.5px] leading-snug text-[rgb(var(--fg-muted))]">
            Transfiere <strong className="font-semibold text-[rgb(var(--fg))]">S/ {monto}</strong> desde la app de tu banco.
          </p>
        </div>
      )}

      {listoPrincipal ? (
        <BotonPrincipal tamano="md" className="mt-4" onClick={() => onListo(nombreMedio)}>
          Ya hice mi aporte
        </BotonPrincipal>
      ) : (
        <BotonSecundario className="mt-4" onClick={() => onListo(nombreMedio)}>
          Ya hice mi aporte
        </BotonSecundario>
      )}

      <div className={`mt-4 flex flex-wrap items-center gap-x-4 border-t ${HAIRLINE} pt-2 text-[13px]`}>
        <a
          href={BRAND.tiktok}
          target="_blank"
          rel="noopener"
          className="inline-flex min-h-11 items-center text-[rgb(var(--accent))] underline underline-offset-4"
        >
          Mira las entregas
        </a>
        <a
          href={BRAND.whatsappLink}
          target="_blank"
          rel="noopener"
          className="inline-flex min-h-11 items-center text-[rgb(var(--accent))] underline underline-offset-4"
        >
          ¿Dudas? WhatsApp
        </a>
        <span className="ml-auto text-[12px] tabular-nums text-[rgb(var(--fg-muted))]">RUC {BRAND.ruc}</span>
      </div>
    </div>
  );
}

/** El final del flujo: la historia de La Plebe es «lo vas a ver», y aquí se cumple. */
export function PasoGracias({
  monto,
  medio,
  onMensual,
  className = '',
}: {
  monto: number;
  medio: string;
  onMensual?: () => void;
  className?: string;
}) {
  const mensaje = `Hola La Plebe, acabo de hacer mi aporte de S/ ${monto} por ${medio}. Les envío la captura.`;
  return (
    <div className={className}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={rutaPublica('/img/gracias.webp')}
        alt=""
        width={480}
        height={618}
        className="grabado mx-auto h-auto w-[132px]"
      />
      <p className="mt-3 text-center text-[15px] leading-snug text-pretty">
        Mándanos la captura para confirmar que llegó bien.
      </p>
      <BotonPrincipal
        tamano="md"
        className="mt-4"
        href={`${BRAND.whatsappLink}?text=${encodeURIComponent(mensaje)}`}
        icono={<IconWhatsApp className="h-5 w-5" />}
      >
        Enviar captura
      </BotonPrincipal>
      {onMensual && (
        <button
          type="button"
          onClick={onMensual}
          className="mt-1 flex min-h-11 w-full items-center justify-center text-[13px] font-semibold text-[rgb(var(--fg-muted))] underline underline-offset-4 transition hover:text-[rgb(var(--fg))]"
        >
          Quiero ayudar cada mes
        </button>
      )}
      <div className={`mt-3 flex items-center justify-center gap-1 border-t ${HAIRLINE} pt-2 text-[13px] text-[rgb(var(--fg-muted))]`}>
        Síguenos
        <RedesSociales />
      </div>
    </div>
  );
}
