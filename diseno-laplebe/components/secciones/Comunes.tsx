'use client';

import { useState } from 'react';
import { BRAND, MODALIDADES, STATS, enlaceCorreo } from '@/lib/data';
import { Claim, IconMail, IconWhatsApp, RedesSociales } from '@/components/brand/Marca';
import { CountUp } from '@/components/motion';
import { rutaPublica } from '@/lib/ruta';

const HAIRLINE = 'border-[rgb(var(--line)/var(--line-a))]';

/* ==========================================================================
   Cifras — sin tarjetas ni contenedores: sólo números y una línea fina
   ========================================================================== */
export function StatsLinea({ className = '' }: { className?: string }) {
  return (
    <dl className={`grid grid-cols-4 border-t ${HAIRLINE} ${className}`}>
      {STATS.map((s, i) => (
        <div key={s.titulo} className={`py-3.5 ${i > 0 ? `border-l ${HAIRLINE} pl-3` : ''}`}>
          <dd className="font-display text-[clamp(1.1rem,5vw,1.8rem)] leading-none">
            {s.textoFijo ?? (
              <CountUp
                to={s.valor}
                decimals={s.decimales ?? 0}
                prefix={s.prefijo ?? ''}
                suffix={s.sufijo ?? ''}
              />
            )}
          </dd>
          <dt className="mt-1.5 text-[10.5px] leading-tight text-[rgb(var(--fg-muted))]">
            {s.titulo}
          </dt>
        </div>
      ))}
    </dl>
  );
}

/* ==========================================================================
   Empresas — las tres formas de sumarse del kit y dos vías de contacto.
   ========================================================================== */
export function BloqueEmpresas({ className = '' }: { className?: string }) {
  return (
    <section id="empresas" className={`scroll-mt-16 border-t ${HAIRLINE} pt-6 ${className}`}>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,.8fr)] lg:items-center">
        <div>
          <Claim
            texto="Trabajemos juntos."
            highlight="juntos."
            className="text-[clamp(1.1rem,4.2vw,1.6rem)] text-[rgb(var(--fg))]"
          />
          <h2 className="mt-2 font-display text-[clamp(1.2rem,4.4vw,1.8rem)] uppercase leading-[0.98] tracking-[-.03em] text-balance">
            ¿Tu empresa quiere sumarse?
          </h2>
          <p className="mt-2.5 hidden max-w-[56ch] text-[14px] leading-relaxed text-[rgb(var(--fg-muted))] lg:block">
            Después de cada entrega recibes un balance fotográfico y un acta con la cantidad exacta
            de lo distribuido.
          </p>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={rutaPublica('/img/carga-940.webp')}
          alt="Grabado de cajas, sacos y mantas amarrados con soga, listos para entregar"
          width={940}
          height={660}
          loading="lazy"
          className="grabado hidden h-auto w-full lg:block"
        />
      </div>

      {/* Móvil: tarjetas con imagen que se deslizan; el detalle se abre si interesa.
          Escritorio: la tabla completa. */}
      <div className={`carrusel mt-4 lg:mt-6 lg:!block lg:border-t ${HAIRLINE}`}>
        {MODALIDADES.map((m) => (
          <div
            key={m.titulo}
            className={`w-[76vw] max-w-[320px] border ${HAIRLINE} p-4 lg:grid lg:w-auto lg:max-w-none lg:grid-cols-[minmax(0,.8fr)_minmax(0,1fr)] lg:gap-x-8 lg:gap-y-1.5 lg:border-0 lg:border-b lg:px-0`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={rutaPublica(`/img/${m.imagen}.webp`)}
              alt=""
              width={640}
              height={450}
              loading="lazy"
              className="grabado mb-3 aspect-[4/3] h-auto w-full object-contain lg:hidden"
            />
            <div>
              <h3 className="font-display text-[15px] uppercase leading-tight tracking-tight text-balance">
                {m.titulo}
              </h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[rgb(var(--fg-muted))]">
                <span className="hidden font-semibold text-[rgb(var(--fg))] lg:inline">Tu aporte: </span>
                {m.aporte}
              </p>
            </div>
            <details className="mt-1 lg:hidden">
              <summary className="flex min-h-11 cursor-pointer items-center text-[13px] font-semibold text-[rgb(var(--accent))]">
                Qué recibe tu marca
              </summary>
              <p className="pb-1 text-[13px] leading-relaxed text-[rgb(var(--fg-muted))]">{m.retorno}</p>
            </details>
            <p className="hidden text-[13px] leading-relaxed text-[rgb(var(--fg-muted))] lg:block">
              <span className="font-semibold text-[rgb(var(--fg))]">Tu marca: </span>
              {m.retorno}
            </p>
          </div>
        ))}
      </div>

      {/* El turquesa de la última lámina del kit, con el fundador recortado: quien
          escribe sabe con quién va a hablar. */}
      <div className="mt-8 flex flex-col overflow-hidden bg-turq text-ink sm:flex-row sm:items-end sm:justify-between">
        <div className="p-6 sm:self-center sm:p-8">
          <h3 className="font-display text-[clamp(1.5rem,5vw,2.2rem)] uppercase leading-none tracking-[-.03em]">
            Hablemos
          </h3>
          <p className="mt-2 hidden max-w-[42ch] text-[14.5px] leading-relaxed sm:block">
            Escríbenos por donde te quede mejor y vemos juntos cómo sumar a tu marca.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <a
              href={BRAND.whatsappLink}
              target="_blank"
              rel="noopener"
              className="inline-flex min-h-12 items-center gap-2 bg-ink px-5 py-3.5 font-display text-[15px] uppercase tracking-tight text-cream transition hover:opacity-90"
            >
              <IconWhatsApp className="h-4 w-4" />
              WhatsApp
            </a>
            <a
              href={enlaceCorreo('Alianza corporativa')}
              target="_blank"
              rel="noopener"
              className="inline-flex min-h-12 items-center gap-2 border border-ink px-5 py-3.5 font-display text-[15px] uppercase tracking-tight transition hover:bg-ink/10"
            >
              <IconMail className="h-4 w-4" />
              Correo
            </a>
          </div>

          {/* El correo visible, no solo detrás del botón: una empresa suele
              copiarlo para escribir desde su propio gestor de correo. */}
          <div className="mt-3 flex flex-wrap items-center gap-x-4 text-[13px]">
            <span className="select-all">{BRAND.email}</span>
            <CopiarCorreo />
            <span className="hidden tabular-nums sm:inline">{BRAND.whatsapp}</span>
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={rutaPublica('/img/fundador-800.webp')}
          srcSet={[480, 800].map((a) => `${rutaPublica(`/img/fundador-${a}.webp`)} ${a}w`).join(', ')}
          sizes="(min-width: 640px) 250px, 200px"
          alt="Fundador de La Plebe sonriendo mientras usa su celular, rodeado de íconos de TikTok y correo"
          width={800}
          height={1059}
          loading="lazy"
          className="-mt-3 h-auto w-[170px] shrink-0 self-end sm:mt-5 sm:w-[250px]"
        />
      </div>
    </section>
  );
}

/* ==========================================================================
   Pie — una sola línea
   ========================================================================== */
export function PieDePagina({ className = '' }: { className?: string }) {
  return (
    <footer
      className={`flex flex-wrap items-center gap-x-5 gap-y-1.5 border-t ${HAIRLINE} pt-4 text-[12px] text-[rgb(var(--fg-muted))] ${className}`}
    >
      <RedesSociales className="-ml-3 lg:hidden" />
      <span>{BRAND.cobertura}</span>
      <span className="tabular-nums">RUC {BRAND.ruc}</span>
      <span className="ml-auto tabular-nums">© {new Date().getFullYear()} La Plebe</span>
    </footer>
  );
}

/** Copia el correo: para quien no usa Gmail y escribe desde otro programa. */
function CopiarCorreo() {
  const [copiado, setCopiado] = useState(false);
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(BRAND.email);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1800);
    } catch {
      /* sin permiso de portapapeles: el correo igual está visible */
    }
  };
  return (
    <button
      type="button"
      onClick={copiar}
      className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4 transition hover:opacity-70"
    >
      {copiado ? '¡Copiado!' : 'Copiar correo'}
    </button>
  );
}
