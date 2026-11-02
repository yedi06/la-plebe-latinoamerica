import Link from 'next/link';

/**
 * «/donar/», con barra final, no existe como archivo: se lleva a «/donar» antes de
 * mostrar el error, porque es un enlace que la gente escribe o pega así.
 */
const sinBarraFinal = `(function(){var p=location.pathname;if(p.length>1&&p.slice(-1)==='/'){location.replace(p.replace(/\\/+$/,'')+location.search+location.hash)}})()`;

/** Una dirección equivocada no debe dejar a nadie sin camino para donar. */
export default function NoEncontrada() {
  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center px-6 text-center">
      <script dangerouslySetInnerHTML={{ __html: sinBarraFinal }} />
      <h1 className="font-display text-[clamp(1.6rem,6vw,2.4rem)] uppercase leading-none tracking-[-.03em]">
        Esta página no existe
      </h1>
      <p className="mt-3 text-[15px] text-[rgb(var(--fg-muted))]">
        Puede que el enlace haya cambiado. La Plebe sigue aquí.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex min-h-12 items-center bg-[rgb(var(--fg))] px-6 font-display text-[15px] uppercase tracking-tight text-[rgb(var(--bg))] transition hover:opacity-90"
      >
        Volver al inicio
      </Link>
    </main>
  );
}
