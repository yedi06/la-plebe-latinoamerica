'use client';

import { useEffect, useRef, useState } from 'react';
import { BILLETERAS_ACTIVAS, BRAND, MENSUAL, MONTOS_MENSUAL } from '@/lib/data';
import { IconWhatsApp } from '@/components/brand/Marca';
import { BotonPrincipal } from '@/components/ui/Boton';
import { Capa, CabeceraCapa } from './Capa';
import { CampoCopiable } from './DonacionUI';

const HAIRLINE = 'border-[rgb(var(--line)/var(--line-a))]';

type Estado = 'formulario' | 'enviando' | 'listo' | 'error';

const numeroWa = BRAND.whatsappLink.split('/').pop();

/** Con la URL del Apps Script cargada hay correos; sin ella, se coordina por WhatsApp. */
const conCorreo = Boolean(MENSUAL.endpoint);

function Campo({
  id,
  etiqueta,
  ayuda,
  children,
}: {
  id: string;
  etiqueta: string;
  ayuda?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-semibold">
        {etiqueta}
      </label>
      {children}
      {ayuda && <p className="mt-1 text-[12px] text-[rgb(var(--fg-muted))]">{ayuda}</p>}
    </div>
  );
}

const INPUT = `w-full border ${HAIRLINE} bg-transparent px-3.5 py-3 text-[16px] font-medium outline-none transition placeholder:font-normal placeholder:text-[rgb(var(--fg-muted))] focus:border-[rgb(var(--accent-fill))]`;

/**
 * Registro de donante mensual.
 *
 * Los datos van a la hoja de Google de La Plebe (Apps Script en
 * `sistema-mensual/`), que cada mes manda el recordatorio por correo. Si la URL
 * del script todavía no está configurada, el registro se envía por WhatsApp y la
 * pantalla no promete correos que nadie va a mandar.
 */
export function RegistroMensual({
  abierto,
  onClose,
  montoInicial = 25,
}: {
  abierto: boolean;
  onClose: () => void;
  montoInicial?: number;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [estado, setEstado] = useState<Estado>('formulario');
  const [monto, setMonto] = useState(montoInicial);
  const [datos, setDatos] = useState({ nombre: '', correo: '', whatsapp: '', dia: MENSUAL.diaSugerido as number });

  useEffect(() => {
    if (abierto) {
      setMonto(montoInicial);
      setEstado('formulario');
    }
  }, [abierto, montoInicial]);

  const billetera = BILLETERAS_ACTIVAS[0];
  const primerNombre = datos.nombre.trim().split(/\s+/)[0] || '';

  const mensajeRegistro =
    `Hola La Plebe, quiero donar S/ ${monto} cada mes.\n` +
    `Nombre: ${datos.nombre.trim()}\n` +
    `Recuérdenme el día ${datos.dia} de cada mes.`;
  const enlaceRegistro = `https://wa.me/${numeroWa}?text=${encodeURIComponent(mensajeRegistro)}`;

  const enviar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    // Campo trampa: los bots lo llenan, las personas no lo ven.
    if ((form.elements.namedItem('web') as HTMLInputElement)?.value) return;

    if (!conCorreo) {
      window.open(enlaceRegistro, '_blank', 'noopener');
      setEstado('listo');
      return;
    }

    const registro = {
      nombre: datos.nombre.trim(),
      correo: datos.correo.trim(),
      whatsapp: datos.whatsapp.trim(),
      monto: String(monto),
      dia: String(datos.dia),
      origen: window.location.href,
    };

    setEstado('enviando');
    try {
      // Apps Script no devuelve cabeceras CORS: se envía en modo no-cors y la
      // respuesta es opaca. Si la red falla, fetch lanza y mostramos el error.
      await fetch(MENSUAL.endpoint, {
        method: 'POST',
        mode: 'no-cors',
        body: new URLSearchParams(registro),
      });
      setEstado('listo');
    } catch {
      setEstado('error');
    }
  };

  const mensajeCaptura = `Hola La Plebe, acabo de hacer mi primer aporte mensual de S/ ${monto} por ${billetera?.nombre ?? 'Yape'}. Les envío la captura.`;
  const listo = estado === 'listo';

  const titulo = !listo
    ? 'Súmate cada mes'
    : conCorreo
      ? `¡Gracias${primerNombre ? `, ${primerNombre}` : ''}!`
      : 'Falta un paso';
  const bajada = !listo
    ? 'Los aportes mensuales nos permiten planificar las brigadas con anticipación.'
    : conCorreo
      ? `Te escribiremos a ${datos.correo} el día ${datos.dia} de cada mes.`
      : 'Te abrimos WhatsApp con tus datos. Envía ese mensaje para coordinar tu aporte.';

  return (
    <Capa
      abierta={abierto}
      onClose={onClose}
      etiqueta="Donación mensual"
      arte={{ src: '/img/camino-640.webp', ancho: 640, alto: 317, leyenda: 'Hasta donde haga falta.' }}
    >
      <CabeceraCapa
        linea={conCorreo ? 'Sin débito automático · te das de baja cuando quieras' : 'Sin débito automático · lo coordinamos por WhatsApp'}
        titulo={titulo}
        bajada={bajada}
        onClose={onClose}
      />

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5">
        {listo ? (
          <div className="space-y-5">
            {!conCorreo && (
              <a
                href={enlaceRegistro}
                target="_blank"
                rel="noopener"
                className="flex min-h-12 w-full items-center justify-center gap-2 bg-[rgb(var(--fg))] px-5 py-3.5 font-display text-[15px] uppercase tracking-tight text-[rgb(var(--bg))] transition hover:opacity-90"
              >
                <IconWhatsApp className="h-4 w-4" />
                Abrir WhatsApp otra vez
              </a>
            )}
            {billetera && (
              <div>
                <p className="font-display text-[15px] uppercase leading-tight tracking-tight">
                  Haz tu primer aporte ahora
                </p>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-[rgb(var(--fg-muted))]">
                  Envía <strong className="font-semibold text-[rgb(var(--fg))]">S/ {monto}</strong> por{' '}
                  {billetera.nombre} y mándanos la captura.
                </p>
                <CampoCopiable etiqueta={`Número ${billetera.nombre}`} valor={billetera.numero} className="mt-4" />
                <a
                  href={`https://wa.me/${numeroWa}?text=${encodeURIComponent(mensajeCaptura)}`}
                  target="_blank"
                  rel="noopener"
                  className={`mt-4 flex min-h-12 w-full items-center justify-center gap-2 border ${HAIRLINE} px-5 py-3.5 font-display text-[15px] uppercase tracking-tight transition hover:border-[rgb(var(--fg)/.45)]`}
                >
                  <IconWhatsApp className="h-4 w-4" />
                  Enviar captura
                </a>
              </div>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex min-h-11 w-full items-center justify-center text-[13px] font-semibold text-[rgb(var(--fg-muted))] underline underline-offset-4"
            >
              Lo hago después
            </button>
          </div>
        ) : (
          <form ref={formRef} onSubmit={enviar} className="space-y-4">
            <div>
              <p className="mb-1.5 text-[13px] font-semibold">Tu aporte mensual</p>
              <div role="group" aria-label="Monto mensual" className="grid grid-cols-4 gap-2">
                {MONTOS_MENSUAL.map((m) => (
                  <button
                    key={m}
                    type="button"
                    aria-pressed={monto === m}
                    onClick={() => setMonto(m)}
                    className={`border py-4 font-display text-[16px] leading-none transition ${
                      monto === m
                        ? 'border-transparent bg-[rgb(var(--accent-fill))] text-ink'
                        : `${HAIRLINE} hover:border-[rgb(var(--accent-fill)/.6)]`
                    }`}
                  >
                    <span className="opacity-70">S/</span> {m}
                  </button>
                ))}
              </div>
            </div>

            <Campo id="rm-nombre" etiqueta="Nombre">
              <input
                id="rm-nombre"
                required
                autoComplete="name"
                value={datos.nombre}
                onChange={(e) => setDatos({ ...datos, nombre: e.target.value })}
                placeholder="Cómo te llamas"
                className={INPUT}
              />
            </Campo>

            {conCorreo && (
              <Campo id="rm-correo" etiqueta="Correo" ayuda="Aquí te llega el recordatorio cada mes.">
                <input
                  id="rm-correo"
                  type="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  value={datos.correo}
                  onChange={(e) => setDatos({ ...datos, correo: e.target.value })}
                  placeholder="tu@correo.com"
                  className={INPUT}
                />
              </Campo>
            )}

            <div className={`grid gap-4 ${conCorreo ? 'sm:grid-cols-[1fr_auto]' : ''}`}>
              {conCorreo && (
                <Campo id="rm-wa" etiqueta="WhatsApp (opcional)">
                  <input
                    id="rm-wa"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    value={datos.whatsapp}
                    onChange={(e) => setDatos({ ...datos, whatsapp: e.target.value })}
                    placeholder="Tu número"
                    className={INPUT}
                  />
                </Campo>
              )}
              <Campo id="rm-dia" etiqueta="Día de cada mes">
                <select
                  id="rm-dia"
                  value={datos.dia}
                  onChange={(e) => setDatos({ ...datos, dia: Number(e.target.value) })}
                  className={`${INPUT} pr-8 ${conCorreo ? 'sm:w-[140px]' : ''}`}
                >
                  {MENSUAL.dias.map((d) => (
                    <option key={d} value={d}>
                      Día {d}
                    </option>
                  ))}
                </select>
              </Campo>
            </div>

            {/* Campo trampa anti-spam, invisible para las personas */}
            <input type="text" name="web" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

            {conCorreo && (
              <label className="flex items-start gap-2.5 text-[12.5px] leading-snug text-[rgb(var(--fg-muted))]">
                <input type="checkbox" required className="mt-0.5 h-5 w-5 shrink-0 accent-[rgb(var(--accent-fill))]" />
                <span>
                  Acepto que La Plebe guarde estos datos solo para enviarme el recordatorio mensual. Puedo
                  darme de baja cuando quiera desde el mismo correo.
                </span>
              </label>
            )}

            {estado === 'error' && (
              <p role="alert" className="text-[13px] font-semibold text-[#B42318] dark:text-[#FDA29B]">
                No pudimos registrarte. Revisa tu conexión e inténtalo otra vez, o escríbenos por
                WhatsApp al {BRAND.whatsapp}.
              </p>
            )}
          </form>
        )}
      </div>

      {!listo && (
        <div className={`shrink-0 border-t ${HAIRLINE} px-5 pb-[max(1.1rem,env(safe-area-inset-bottom))] pt-4`}>
          <BotonPrincipal
            tamano="md"
            disabled={estado === 'enviando'}
            onClick={() => formRef.current?.requestSubmit()}
            bajada={
              estado === 'enviando'
                ? 'Registrando…'
                : conCorreo
                  ? `Te lo recordamos el día ${datos.dia} de cada mes`
                  : 'Se abre WhatsApp con tu mensaje listo'
            }
          >
            {conCorreo ? `Registrarme · S/ ${monto} al mes` : `Seguir · S/ ${monto} al mes`}
          </BotonPrincipal>
        </div>
      )}
    </Capa>
  );
}
