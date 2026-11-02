import type { Metadata } from 'next';
import { Sitio } from '@/components/Sitio';

export const metadata: Metadata = {
  title: 'Empresas',
  description: 'Canje en especie, apoyo logístico o campañas con tu marca.',
  alternates: { canonical: '/empresas' },
};

export default function Empresas() {
  return <Sitio inicial={3} />;
}
