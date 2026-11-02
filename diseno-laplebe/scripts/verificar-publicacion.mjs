/**
 * Corre al terminar `npm run build` y frena la publicación si en la web exportada
 * aparece un dato de ejemplo, un texto sin respaldo o falta el medio de pago real.
 * En una web de donaciones, un número falso es peor que un build fallido.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const SALIDA = new URL('../out', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');

const PROHIBIDO = [
  /9XX XXX/,
  /X{4,}-/,
  /raciones calientes/,
  /Empezó con un celular/,
  /Salimos de Lima/,
  /Recibes constancia/,
  /Pago cifrado/,
  /3D Secure/,
  /Emitimos comprobante/,
];
const OBLIGATORIO = [/939 647 279/];

function archivos(dir) {
  return readdirSync(dir).flatMap((n) => {
    const ruta = join(dir, n);
    if (statSync(ruta).isDirectory()) return archivos(ruta);
    return /\.(html|js|txt)$/.test(n) ? [ruta] : [];
  });
}

const textos = archivos(SALIDA).map((ruta) => [ruta, readFileSync(ruta, 'utf8')]);
const errores = [];

for (const patron of PROHIBIDO) {
  const hallado = textos.find(([, t]) => patron.test(t));
  if (hallado) errores.push(`Prohibido ${patron} en ${hallado[0]}`);
}
for (const patron of OBLIGATORIO) {
  if (!textos.some(([, t]) => patron.test(t))) errores.push(`Falta ${patron} en la web exportada`);
}

if (errores.length) {
  console.error(`\nNo se puede publicar:\n- ${errores.join('\n- ')}\n`);
  process.exit(1);
}
console.log(`Verificación de publicación correcta (${textos.length} archivos).`);
