'use client';

import { useEffect, useState } from 'react';
import { BANCOS_ACTIVOS, BILLETERAS_ACTIVAS, MONTO_MINIMO, MONTO_SUGERIDO } from '@/lib/data';
import { BotonPrincipal } from '@/components/ui/Boton';
import { Capa, CabeceraCapa } from './Capa';
import { Checkout, PasoGracias } from './Checkout';
import { SelectorMonto } from './DonacionUI';

export type Paso = 1 | 2 | 3;

/**
 * Los tres momentos de donar: cuánto, cómo y gracias. Es la misma pieza en la
 * ventana y en la sección «Donar», para que no existan dos caminos que puedan
 * contar cosas distintas.
 */
export function FlujoDonacion({
  montoInicial = MONTO_SUGERIDO,
  pasoInicial = 1,
  onPaso,
  onMensual,
  className = '',
}: {
  montoInicial?: number;
  /** 2 abre directo en el número, cuando el monto ya se eligió en la página. */
  pasoInicial?: 1 | 2;
  onPaso?: (p: Paso) => void;
  onMensual?: () => void;
  className?: string;
}) {
  const [paso, setPasoLocal] = useState<Paso>(pasoInicial);
  const [monto, setMonto] = useState(montoInicial);
  const [medio, setMedio] = useState('Yape');

  const setPaso = (p: Paso) => {
    setPasoLocal(p);
    onPaso?.(p);
  };

  if (paso === 3) return <PasoGracias monto={monto} medio={medio} onMensual={onMensual} className={className} />;

  if (paso === 2)
    return (
      <Checkout
        monto={monto}
        onCambiarMonto={() => setPaso(1)}
        onListo={(m) => {
          setMedio(m);
          setPaso(3);
        }}
        className={className}
      />
    );

  const valido = monto >= MONTO_MINIMO;
  return (
    <div className={className}>
      <SelectorMonto monto={monto} onChange={setMonto} onConfirmar={() => valido && setPaso(2)} />
      <BotonPrincipal
        tamano="md"
        className="mt-4"
        disabled={!valido}
        onClick={() => setPaso(2)}
        bajada={valido ? undefined : `El mínimo es S/ ${MONTO_MINIMO}`}
      >
        Continuar · S/ {monto}
      </BotonPrincipal>
      <p className="mt-3 text-[13px] leading-snug text-[rgb(var(--fg-muted))]">
        Pagas en tu app. Tu aporte va donde más se necesite.
      </p>
      {onMensual && (
        <button
          type="button"
          onClick={onMensual}
          className="mt-1 flex min-h-11 items-center text-[13px] font-semibold text-[rgb(var(--fg-muted))] underline underline-offset-4 transition hover:text-[rgb(var(--fg))]"
        >
          Prefiero ayudar cada mes
        </button>
      )}
    </div>
  );
}

const soloUnaBilletera = BILLETERAS_ACTIVAS.length === 1 && BANCOS_ACTIVOS.length === 0;

const TITULOS: Record<Paso, string> = {
  1: 'Cuánto quieres donar',
  2: soloUnaBilletera ? `Envíalo por ${BILLETERAS_ACTIVAS[0].nombre}` : 'Cómo lo envías',
  3: '¡Gracias por sumarte!',
};

/** El flujo de donación en una ventana sobre la página. */
export function DonationSheet({
  abierto,
  onClose,
  montoInicial = MONTO_SUGERIDO,
  pasoInicial = 1,
  onMensual,
}: {
  abierto: boolean;
  onClose: () => void;
  montoInicial?: number;
  pasoInicial?: 1 | 2;
  onMensual?: () => void;
}) {
  const [paso, setPaso] = useState<Paso>(1);

  useEffect(() => {
    if (abierto) setPaso(pasoInicial);
  }, [abierto, pasoInicial]);

  return (
    <Capa
      abierta={abierto}
      onClose={onClose}
      etiqueta="Tu donación"
      arte={{ src: '/img/bolsa-640.webp', ancho: 640, alto: 796, leyenda: 'Así llega tu ayuda.' }}
    >
      <CabeceraCapa linea="Cada entrega queda en video" titulo={TITULOS[paso]} onClose={onClose}>
        {paso < 3 && (
          <div className="mt-3 flex items-center gap-2.5">
            <div className="flex flex-1 gap-1.5">
              {[1, 2].map((n) => (
                <span key={n} className="h-[3px] flex-1 overflow-hidden bg-[rgb(var(--fg)/.14)]">
                  <span
                    className={`block h-full bg-[rgb(var(--accent-fill))] transition-all duration-500 ${
                      paso >= n ? 'w-full' : 'w-0'
                    }`}
                  />
                </span>
              ))}
            </div>
            <span className="shrink-0 text-[12px] tabular-nums text-[rgb(var(--fg-muted))]">Paso {paso} de 2</span>
          </div>
        )}
      </CabeceraCapa>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5">
        <FlujoDonacion montoInicial={montoInicial} pasoInicial={pasoInicial} onPaso={setPaso} onMensual={onMensual} />
      </div>
    </Capa>
  );
}
