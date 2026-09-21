'use client';

/**
 * Mockup de código QR.
 *
 * Genera un patrón determinista (mismo `seed` → mismo dibujo) con los tres ojos
 * de posición reales, para que el bloque se vea y mida como un QR de verdad.
 * NO es escaneable: el cliente debe reemplazarlo por el QR real de Yape / Plin /
 * interoperable exportado en PNG o SVG a 1024 × 1024 px, margen mínimo 4 módulos.
 */

const MODULES = 25;

function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 1000) / 1000;
  };
}

function isFinder(r: number, c: number) {
  const zones = [
    [0, 0],
    [0, MODULES - 7],
    [MODULES - 7, 0],
  ];
  return zones.some(([zr, zc]) => r >= zr && r < zr + 7 && c >= zc && c < zc + 7);
}

function hashSeed(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function QrMock({
  seed = 'laplebe',
  className = '',
  fg = 'currentColor',
  label,
}: {
  seed?: string;
  className?: string;
  fg?: string;
  label?: string;
}) {
  const rand = rng(hashSeed(seed));
  const cells: { r: number; c: number }[] = [];

  for (let r = 0; r < MODULES; r++) {
    for (let c = 0; c < MODULES; c++) {
      if (isFinder(r, c)) continue;
      // Banda de sincronización, como en un QR real
      if ((r === 6 || c === 6) && (r + c) % 2 === 0) {
        cells.push({ r, c });
        continue;
      }
      if (rand() > 0.53) cells.push({ r, c });
    }
  }

  const Finder = ({ x, y }: { x: number; y: number }) => (
    <g transform={`translate(${x} ${y})`}>
      <rect width="7" height="7" rx="1.9" fill="none" stroke={fg} strokeWidth="1" />
      <rect x="2" y="2" width="3" height="3" rx="0.8" fill={fg} />
    </g>
  );

  return (
    <svg
      viewBox={`-1 -1 ${MODULES + 2} ${MODULES + 2}`}
      className={className}
      role="img"
      aria-label={label ?? 'Código QR de ejemplo, pendiente de reemplazo por el QR real'}
      shapeRendering="crispEdges"
    >
      {cells.map(({ r, c }) => (
        <rect key={`${r}-${c}`} x={c} y={r} width="1" height="1" rx="0.22" fill={fg} />
      ))}
      <Finder x={0} y={0} />
      <Finder x={MODULES - 7} y={0} />
      <Finder x={0} y={MODULES - 7} />
    </svg>
  );
}
