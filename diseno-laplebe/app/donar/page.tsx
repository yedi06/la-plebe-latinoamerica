import type { Metadata } from 'next';
import { Sitio } from '@/components/Sitio';

export const metadata: Metadata = {
  title: 'Donar',
  description: 'Dona por Yape en un toque, desde S/ 1.',
  alternates: { canonical: '/donar' },
};

export default function Donar() {
  return <Sitio inicial={2} />;
}
