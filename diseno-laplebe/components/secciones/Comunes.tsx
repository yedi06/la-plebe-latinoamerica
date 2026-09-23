'use client';

import { BRAND, STATS } from '@/lib/data';
import { Claim, IconMail, IconTikTok, IconWhatsApp } from '@/components/brand/Marca';
import { CountUp } from '@/components/motion';

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
   Empresas — una frase y dos vías de contacto. Nada más.
   ========================================================================== */
export function BloqueEmpresas({ className = '' }: { className?: string }) {
  return (
    <section id="empresas" className={`scroll-mt-16 border-t ${HAIRLINE} pt-6 ${className}`}>
      <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <Claim
            texto="Ayudar también es buen negocio."
            highlight="buen negocio."
            className="text-[clamp(1.1rem,4.2vw,1.6rem)] text-[rgb(var(--fg))]"
          />
          <h2 className="mt-2 font-display text-[clamp(1.2rem,4.4vw,1.8rem)] uppercase leading-[0.98] tracking-[-.03em] text-balance">
            ¿Tu empresa quiere sumarse?
          </h2>
          <p className="mt-2.5 max-w-[52ch] text-[13.5px] leading-relaxed text-[rgb(var(--fg-muted))]">
            Donación corporativa, canje en especie o campaña con tu marca. Emitimos comprobante y
            entregamos reporte fotográfico con acta de entrega.
          </p>

          {/* El correo visible, no solo detrás del botón: una empresa suele
              copiarlo para escribir desde su propio gestor de correo. */}
          <a
            href={`mailto:${BRAND.email}?subject=Alianza%20corporativa`}
            className="mt-4 inline-flex items-center gap-2 text-[15px] font-semibold text-[rgb(var(--accent))] underline decoration-[rgb(var(--accent))]/35 underline-offset-4 transition hover:decoration-[rgb(var(--accent))]"
          >
            <IconMail className="h-4 w-4 shrink-0" />
            {BRAND.email}
          </a>
          <p className="mt-1.5 text-[12px] text-[rgb(var(--fg-muted))]">
            Respondemos en menos de 24 h · {BRAND.whatsapp}
          </p>
        </div>
        <div className="flex gap-2.5">
          <a
            href={BRAND.whatsappLink}
            className="inline-flex items-center gap-2 bg-[rgb(var(--fg))] px-5 py-3.5 font-display text-[15px] uppercase tracking-tight text-[rgb(var(--bg))] transition hover:opacity-90"
          >
            <IconWhatsApp className="h-4 w-4" />
            WhatsApp
          </a>
          <a
            href={`mailto:${BRAND.email}?subject=Alianza%20corporativa`}
            className={`inline-flex items-center gap-2 border ${HAIRLINE} px-5 py-3.5 font-display text-[15px] uppercase tracking-tight transition hover:border-[rgb(var(--fg)/.4)]`}
          >
            <IconMail className="h-4 w-4" />
            Correo
          </a>
        </div>
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
      className={`flex flex-wrap items-center gap-x-5 gap-y-1.5 border-t ${HAIRLINE} pt-4 text-[11.5px] text-[rgb(var(--fg-muted))] ${className}`}
    >
      <a
        href={BRAND.tiktok}
        className="inline-flex items-center gap-1.5 transition hover:text-[rgb(var(--fg))]"
      >
        <IconTikTok className="h-3.5 w-3.5" />
        {BRAND.handle}
      </a>
      <a href={`mailto:${BRAND.email}`} className="transition hover:text-[rgb(var(--fg))]">
        {BRAND.email}
      </a>
      <span>{BRAND.cobertura}</span>
      <span className="ml-auto tabular-nums">© {new Date().getFullYear()} La Plebe</span>
    </footer>
  );
}
