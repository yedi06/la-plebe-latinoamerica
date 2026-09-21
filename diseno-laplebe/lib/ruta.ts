/**
 * Prefija las rutas de `public/` con el subdirectorio donde vive la web.
 *
 * En GitHub Pages el sitio no cuelga de la raíz sino de
 * /la-plebe-latinoamerica, y Next.js solo reescribe automáticamente las rutas
 * de `next/link` y `next/image`. Las etiquetas `<img src="/...">` normales se
 * quedarían apuntando a la raíz del dominio y darían 404.
 *
 * En local `NEXT_PUBLIC_BASE_PATH` está vacío, así que no cambia nada.
 */
export function rutaPublica(ruta: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  return `${base}${ruta}`;
}
