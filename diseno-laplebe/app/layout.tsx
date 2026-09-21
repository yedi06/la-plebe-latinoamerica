import type { Metadata, Viewport } from 'next';
import { Caveat, Montserrat, Plus_Jakarta_Sans } from 'next/font/google';
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

export const metadata: Metadata = {
  title: {
    default: 'La Plebe Latinoamérica — Dona y llega donde otros no llegan',
    template: '%s · La Plebe Latinoamérica',
  },
  description:
    'Ayuda directa y documentada en comedores populares, asentamientos y zonas extremas del Perú. Dona por Yape, Plin, transferencia, tarjeta o PayPal en menos de 30 segundos.',
  openGraph: {
    title: 'La Plebe Latinoamérica — Donde otros no llegan, nosotros sí',
    description: 'Dona en menos de 30 segundos. 100% de trazabilidad con evidencia audiovisual.',
    locale: 'es_PE',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F2EFE9' },
    { media: '(prefers-color-scheme: dark)', color: '#070809' },
  ],
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

/** Aplica el tema antes del primer paint para evitar el flash de color. */
const noFlash = `(function(){try{var s=localStorage.getItem('lp-theme');var d=s?s==='dark':matchMedia('(prefers-color-scheme:dark)').matches;document.documentElement.classList.toggle('dark',d)}catch(e){}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-PE" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlash }} />
      </head>
      <body className={`${display.variable} ${sans.variable} ${marker.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
