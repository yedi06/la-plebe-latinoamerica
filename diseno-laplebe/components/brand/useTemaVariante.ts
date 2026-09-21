'use client';

import { useEffect } from 'react';

/**
 * Cada propuesta nace en el modo para el que fue diseñada (la 01 en papel crema,
 * la 02 y 03 en negro de marca), pero si la persona ya eligió un tema con el
 * toggle, su elección manda. Las 3 pasan contraste AA en ambos modos.
 */
export function useTemaVariante(preferido: 'light' | 'dark') {
  useEffect(() => {
    let elegido: string | null = null;
    try {
      elegido = window.localStorage.getItem('lp-theme');
    } catch {
      /* modo privado */
    }
    if (elegido) return;
    document.documentElement.classList.toggle('dark', preferido === 'dark');
  }, [preferido]);
}
