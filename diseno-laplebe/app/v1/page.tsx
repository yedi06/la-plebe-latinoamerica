'use client';

import { useState } from 'react';
import { BRAND, FRENTES, TARJETAS, type Frente, type TarjetaAccion } from '@/lib/data';
import {
  AvatarMarca,
  Claim,
  IconTikTok,
  IconoFrente,
  ThemeToggle,
} from '@/components/brand/Marca';
import { MediaPlaceholder } from '@/components/brand/MediaPlaceholder';
import { useTemaVariante } from '@/components/brand/useTemaVariante';
import { DonationSheet } from '@/components/donate/DonationSheet';
import { MediosDeDonacion } from '@/components/donate/DonacionUI';
import { TarjetaAccionUI } from '@/components/nav/TarjetaAccion';
import { Paginador, type Pantalla } from '@/components/nav/Paginador';
import { BloqueEmpresas, PieDePagina } from '@/components/secciones/Comunes';
import { MeshBackground } from '@/components/motion';

const HAIRLINE = 'border-[rgb(var(--line)/var(--line-a))]';

/**
 * PROPUESTA 01 — «Paginada»
 * La rueda del mouse o el swipe saltan de pantalla. Sin scroll de página.
 */
export default function V1() {
  useTemaVariante('light');
  const [sheet, setSheet] = useState(false);
  const [frenteSel, setFrenteSel] = useState<Frente['id']>('alimentacion');
  const [montoSel, setMontoSel] = useState(50);

  const abrir = (f?: Frente['id'], m?: number) => {
    if (f) setFrenteSel(f);
    if (m) setMontoSel(m);
    setSheet(true);
  };
  const desdeTarjeta = (t: TarjetaAccion) => abrir(t.frente, t.monto);

  const pantallas: Pantalla[] = [
    {
      id: 'perfil',
      titulo: 'Perfil',
      contenido: (
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <AvatarMarca size="xl" />
            <h1 className="mt-6 font-display text-[clamp(2.2rem,9vw,4.6rem)] uppercase leading-[0.84] tracking-[-.02em]">
              La Plebe
              <br />
              Latinoamérica
            </h1>
            <a
              href={BRAND.tiktok}
              className="mt-3 inline-flex items-center gap-1.5 text-[13px] text-[rgb(var(--fg-muted))] transition hover:text-[rgb(var(--fg))]"
            >
              <IconTikTok className="h-4 w-4" />
              {BRAND.handle}
            </a>
            <Claim className="mt-6 text-[clamp(1.4rem,5.5vw,2.2rem)]" />
            <p className="mt-4 max-w-[46ch] text-[14px] leading-relaxed text-[rgb(var(--fg-muted))] text-pretty">
              {BRAND.misionCorta} Cada entrega se publica con evidencia audiovisual.
            </p>
          </div>

          <div>
            <TarjetaAccionUI
              tarjeta={TARJETAS[0]}
              onDonar={desdeTarjeta}
              className="shadow-glow"
            />
            <div className={`mt-5 border-b ${HAIRLINE}`}>
              {TARJETAS.slice(1).map((t) => (
                <TarjetaAccionUI key={t.id} tarjeta={t} onDonar={desdeTarjeta} />
              ))}
            </div>
          </div>
        </div>
      ),
    },

    {
      id: 'frentes',
      titulo: 'Frentes de ayuda',
      contenido: (
        <div>
          <h2 className="font-display text-[clamp(1.7rem,6.5vw,3rem)] uppercase leading-[0.9] tracking-[-.015em]">
            Elige dónde quieres que llegue
          </h2>
          <div className="mt-7 grid gap-8 sm:grid-cols-3">
            {FRENTES.map((f) => (
              <article key={f.id} className={`border-t ${HAIRLINE} pt-4`}>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-[17px] uppercase leading-tight tracking-tight text-balance">
                    {f.nombre}
                  </h3>
                  <span className="shrink-0 text-[rgb(var(--accent))]">
                    <IconoFrente tipo={f.icono} className="h-6 w-6" />
                  </span>
                </div>
                <MediaPlaceholder
                  label={f.medioLabel}
                  ratio="4/3"
                  tone="dark"
                  compact
                  className="mt-3.5"
                />
                <p className="mt-3.5 text-[12.5px] leading-relaxed text-[rgb(var(--fg-muted))]">
                  {f.descripcion}
                </p>
                <p className="mt-3 font-display text-[15px] uppercase leading-tight tracking-tight">
                  {f.impacto}
                </p>
                <button
                  type="button"
                  onClick={() => abrir(f.id, f.montoAncla)}
                  className="mt-4 w-full bg-[rgb(var(--fg))] py-3.5 font-display text-[14px] uppercase tracking-tight text-[rgb(var(--bg))] transition hover:opacity-90"
                >
                  Donar a este frente
                </button>
              </article>
            ))}
          </div>
        </div>
      ),
    },

    {
      id: 'donar',
      titulo: 'Cómo donar',
      contenido: (
        <div>
          <h2 className="font-display text-[clamp(1.7rem,6.5vw,3rem)] uppercase leading-[0.9] tracking-[-.015em]">
            Todas las cuentas, a la vista
          </h2>
          <div className="mt-7">
            <MediosDeDonacion />
          </div>
        </div>
      ),
    },

    {
      id: 'empresas',
      titulo: 'Empresas',
      contenido: (
        <div>
          <BloqueEmpresas className="border-t-0 pt-0" />
          <MediaPlaceholder
            label="Espacio para foto — entrega con marca aliada visible en el empaque"
            ratio="21/9"
            tone="light"
            className="mt-8"
          />
          <PieDePagina className="mt-8" />
        </div>
      ),
    },
  ];

  return (
    <main className="paper-grain relative overflow-hidden">
      <MeshBackground variant="light" grid={false} />

      <div className="fixed right-4 top-4 z-40 flex items-center gap-2 sm:right-8 sm:top-5">
        <ThemeToggle />
      </div>

      <div className="relative">
        <Paginador pantallas={pantallas} />
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
