import type { Metadata, Viewport } from 'next';
import { Caveat, Montserrat, Plus_Jakarta_Sans } from 'next/font/google';
import { BRAND } from '@/lib/data';
import './globals.css';

/**
 * Sistema tipográfico — el mismo del kit media de La Plebe:
 *  · Montserrat ExtraBold → display (es literalmente la del kit: "SOMOS LA PLEBE",
 *    "NUESTRA COMUNIDAD"). Ancha y rotunda, no condensada: así se comunican.
 *  · Plus Jakarta Sans    → sans limpia para cuerpo, UI y montos.
 *  · Caveat               → marcador del claim "Donde otros no llegan, nosotros sí."
 * Se autoalojan en build (next/font) → 0 requests a Google en producción.
 */
const display = Montserrat({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  variable: '--font-display',
  display: 'swap',
});

const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

const marker = Caveat({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-marker',
  display: 'swap',
});

/** El dominio definitivo; se puede cambiar por entorno para probar en otro sitio. */
const sitio = process.env.NEXT_PUBLIC_SITE_URL ?? BRAND.dominio;

export const metadata: Metadata = {
  metadataBase: new URL(sitio),
  alternates: { canonical: '/' },
  title: {
    default: 'La Plebe Latinoamérica — Dona y llega donde otros no llegan',
    template: '%s · La Plebe Latinoamérica',
  },
  description:
    'Ayuda directa y documentada en comedores populares, asentamientos y zonas extremas del Perú. Dona por Yape y mira cada entrega en video.',
  openGraph: {
    title: 'La Plebe Latinoamérica — Donde otros no llegan, nosotros sí',
    description: 'Dona por Yape y mira cada entrega en video.',
    locale: 'es_PE',
    type: 'website',
    url: '/',
    images: [
      {
        url: '/og.jpg',
        width: 1200,
        height: 630,
        alt: 'Integrante de La Plebe con una señora mayor durante una entrega de víveres',
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F2EFE9' },
    { media: '(prefers-color-scheme: dark)', color: '#11110F' },
  ],
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

/**
 * Aplica el tema antes del primer paint para evitar el flash de color.
 * Por defecto siempre arranca en claro; el modo oscuro solo se activa si la
 * persona lo eligió antes con el toggle (no sigue la preferencia del sistema).
 */
/** Le dice a los buscadores qué perfiles son de la organización. */
const organizacion = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: BRAND.nombre,
  url: sitio,
  email: BRAND.email,
  sameAs: [BRAND.tiktok, BRAND.instagram, BRAND.facebook],
});

const noFlash = `(function(){try{var s=localStorage.getItem('lp-theme');document.documentElement.classList.toggle('dark',s==='dark')}catch(e){}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-PE" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlash }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: organizacion }} />
      </head>
      <body className={`${display.variable} ${sans.variable} ${marker.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
