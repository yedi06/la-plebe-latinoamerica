# La Plebe Latinoamérica — Landing de donaciones

Tres alternativas de UX/UI para la landing de donaciones de **La Plebe Latinoamérica**, todas
sin header/navbar tradicional y mobile-first.

## Arrancar

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # exporta HTML estático a /out
```

| Ruta  | Propuesta       | Navegación                                      | Modo base      |
| ----- | --------------- | ----------------------------------------------- | -------------- |
| `/`   | Índice de las 3 | —                                               | Oscuro         |
| `/v1` | Paginada        | La rueda, el swipe o las flechas saltan de pantalla | Claro (crema)  |
| `/v2` | Scroll natural  | Scroll normal hacia abajo                       | Oscuro (negro) |
| `/v3` | Cortina         | Índice numerado + barrido de marca entre secciones | Oscuro         |

Las tres comparten contenido y sistema visual: lo único que cambia es cómo se recorre la página.

Cada propuesta abre en el modo para el que fue diseñada, pero el toggle flotante (arriba a la
derecha) permite ver las tres en claro y en oscuro. Ambos modos cumplen contraste AA.

## Stack

Next.js 14 (App Router, `output: 'export'` → SSG puro) · React 18 · TypeScript · Tailwind CSS ·
Framer Motion. Sin backend: las 4 páginas son HTML estático servible desde cualquier CDN.

**Peso:** 143–159 kB de First Load JS por ruta. Las fuentes se auto-alojan en build
(`next/font`), así que en producción no hay ni una sola petición a Google.

## Sistema de marca

Extraído de `kit media plebe.pdf` (que está en la carpeta padre) y contrastado con la paleta
entregada por el cliente.

| Token     | Hex       | Origen en el kit                                    |
| --------- | --------- | --------------------------------------------------- |
| `ink`     | `#0A0A0A` | Negro de las poleras del equipo y de los titulares   |
| `navy`    | `#10233C` | Píldoras de contacto de la última lámina             |
| `turq`    | `#3FA79C` | Color de acento de títulos y badges                  |
| `lime`    | `#8BC53F` | Brochazo bajo el claim y anillo del avatar           |
| `cream`   | `#F2EFE9` | Fondo de papel texturado de todas las láminas        |

Variantes accesibles: `turq.deep #15665E` y `lime.deep #4E7A16` para texto sobre crema (el
turquesa y el lima originales no pasan AA como texto sobre fondo claro; se usan solo como
relleno, siempre con texto `ink` encima).

### Tipografía

- **Anton** — display condensada y pesada: titulares, cifras y CTAs.
- **Plus Jakarta Sans** — sans limpia: cuerpo, UI y montos.
- **Caveat** — marcador: el claim *"Donde otros no llegan, nosotros sí."*, con el brochazo lima
  replicado en CSS (`.brush-underline`).

### Recursos gráficos replicados del kit

`.paper-grain` (textura de papel), `.dashed-rule` (divisor punteado turquesa),
`.brush-underline` (brochazo lima), `AvatarMarca` (anillo de brochazo circular),
`.media-fill` (composición mesh turquesa + lima sobre navy).

## Espacios de foto, video y short

Ninguna imagen existe todavía. Cada hueco usa `<MediaPlaceholder>`, que:

- ocupa **exactamente** la proporción y el tamaño final del medio real;
- pinta un fondo de marca (mesh + patrón diagonal + malla técnica + barrido de luz) con
  esquinas de encuadre, no una caja vacía;
- centra una etiqueta que dice qué contenido va ahí;
- imprime la proporción y el tamaño recomendado en píxeles.

Proporciones ya usadas: `16/9`, `9/16`, `4/3`, `4/5`, `1/1`, `3/2`, `21/9`. Ese mapa (en
`components/brand/MediaPlaceholder.tsx`) es el insumo directo del documento de especificaciones
que se le pedirá después al cliente.

Los códigos QR son mockups deterministas (`QrMock`), con los tres ojos de posición reales para
que midan y se vean como un QR de verdad. **No son escaneables.**

## Qué falta reemplazar antes de producción

Todo está marcado con `PENDIENTE` en `lib/data.ts`:

- números de Yape y Plin;
- cuenta y CCI de BCP, BBVA, Interbank y Scotiabank;
- WhatsApp de contacto corporativo;
- QR reales (Yape, Plin e interoperable) a 1024 × 1024 px;
- elección de pasarela (Izipay / Niubiz / Mercado Pago) y su logo oficial;
- logos oficiales de Yape, Plin y PayPal — hoy son placeholders tipográficos con el color de
  cada marca;
- montos de meta y recaudado de cada frente;
- las líneas de impacto (`S/ 25 = 10 raciones calientes`, etc.) deben validarse con el cliente:
  son la pieza que más mueve la conversión y tienen que ser verdad.

## Estructura

```
app/
  layout.tsx          fuentes, metadata, script anti-flash de tema
  page.tsx            índice de las 3 propuestas
  v1|v2|v3/page.tsx   una propuesta por ruta
components/
  motion/             Reveal, StaggerGroup, TiltCard, CountUp, MeshBackground,
                      Marquee, ScrollProgress  (una sola "voz" de movimiento)
  brand/              AvatarMarca, Claim, iconos, ThemeToggle, MediaPlaceholder, QrMock
  donate/             DonacionUI (montos, frentes, bancos, billeteras) + DonationSheet
  secciones/          GrillaStats, BarraAliados, BloqueTransparencia,
                      BloqueEmpresas, PieDePagina
lib/data.ts           contenido, cuentas y datos del kit
```

## Accesibilidad

`prefers-reduced-motion` desactiva blobs, tilt, parallax y contadores en todo el sistema (los
componentes de motion devuelven la versión estática). Foco visible global, `role="radiogroup"`
en los selectores, `role="dialog"` + cierre con Escape + bloqueo de scroll en el bottom-sheet,
y cada placeholder expone su etiqueta como `aria-label`.
