import type { Metadata } from 'next';
import { Sitio } from '@/components/Sitio';

export const metadata: Metadata = {
  title: 'Nosotros',
  description: 'Quiénes somos y las historias de cada entrega, en video.',
  alternates: { canonical: '/nosotros' },
};

export default function Nosotros() {
  return <Sitio inicial={1} />;
}
