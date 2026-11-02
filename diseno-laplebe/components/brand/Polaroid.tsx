import { rutaPublica } from '@/lib/ruta';

/**
 * Las secciones de la página se montan recién al elegirlas, así que las fotos de
 * «Nosotros» se piden por adelantado para que aparezcan al instante. Las de la
 * portada se precargan solas porque están en la primera pantalla.
 */
export function PrecargaPolaroids() {
  const srcset = (nombre: string, anchos: number[]) =>
    anchos.map((a) => `${rutaPublica(`/img/${nombre}-${a}.webp`)} ${a}w`).join(', ');
  return (
    <>
      <link rel="preload" as="image" imageSrcSet={srcset('fundadores', [640, 1200])} imageSizes="(min-width: 1024px) 1000px, 100vw" />
      <link rel="preload" as="image" imageSrcSet={srcset('marco-brigada', [640, 1100])} imageSizes="(min-width: 1024px) 440px, 100vw" />
    </>
  );
}

/**
 * Foto real con marco blanco de polaroid y leyenda escrita a mano, como las
 * láminas del kit media. Los archivos están en public/img/{nombre}-{ancho}.webp.
 */
export function Polaroid({
  nombre,
  anchos,
  ancho,
  alto,
  alt,
  leyenda,
  sizes,
  giro = 'rotate-[1.2deg]',
  className = '',
}: {
  nombre: string;
  anchos: number[];
  /** Medidas del archivo más grande: reservan el espacio y evitan saltos. */
  ancho: number;
  alto: number;
  alt: string;
  leyenda: string;
  sizes: string;
  giro?: string;
  className?: string;
}) {
  const src = (a: number) => rutaPublica(`/img/${nombre}-${a}.webp`);
  return (
    <figure
      className={`foto-tema bg-white p-3 pb-4 shadow-[0_1px_2px_rgba(10,10,10,.08),0_24px_48px_-24px_rgba(10,10,10,.45)] ${giro} ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src(anchos[anchos.length - 1])}
        srcSet={anchos.map((a) => `${src(a)} ${a}w`).join(', ')}
        sizes={sizes}
        width={ancho}
        height={alto}
        alt={alt}
        // Sin lazy: la sección se monta al elegirla y la foto ya viene precargada
        // (ver PrecargaPolaroids); con lazy el marco se veía vacío un segundo.
        decoding="async"
        className="h-auto w-full bg-[#d9d5cc]"
      />
      <figcaption className="pt-4 font-marker text-[22px] leading-none text-ink/80 sm:text-[24px]">
        {leyenda}
      </figcaption>
    </figure>
  );
}
