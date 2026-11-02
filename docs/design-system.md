# Sistema de diseño — La Plebe Latinoamérica

Describe lo que la web usa hoy en `diseno-laplebe/`. Nace del kit de marca del cliente
(`kit media plebe.pdf`), no de una plantilla: papel crema, negro de las poleras de la brigada,
turquesa y brochazo lima.

## Idea que lo ordena

La marca promete «Si no está en video, no pasó». Por eso la evidencia real manda: fotos de campo
con marco de polaroid, frases escritas a mano y videos de TikTok. Y por eso el momento de donar es
casi vacío: un monto, un número y un botón.

## Color

Cada color tiene un trabajo. El negro y el crema dan el fondo y la lectura; turquesa y lima se
guardan para la acción y la marca, así que el botón de donar es lo único lleno de color en pantalla.

| Token | Valor | Uso |
| --- | --- | --- |
| `ink` | `#0A0A0A` | Texto, cabeceras de las ventanas |
| `cream` | `#F2EFE9` | Fondo del modo claro, el del kit |
| `turq` | `#3FA79C` | Relleno: botón principal, cortina, monto elegido |
| `lime` | `#8BC53F` | Relleno: brochazo del claim, degradado del botón, progreso |
| `--accent` claro | `#15665E` | Enlaces y acentos como texto sobre crema |
| `--fg-muted` claro | `#4A4A4A` | Texto secundario |
| Error claro | `#B42318` | Mensajes de error |

Turquesa y lima **nunca** van como texto sobre crema (no alcanzan AA); siempre son relleno con `ink`
encima.

**Modo oscuro:** fondo `#11110F`, el negro de las poleras, con la textura del papel oscurecida. Los grabados
se invierten (línea clara sobre negro, conservando turquesa y lima) y las fotos se atenúan un poco. El botón
de tema está en móvil y en escritorio.

### Contraste medido (WCAG AA pide 4.5:1)

| Combinación | Ratio |
| --- | --- |
| Texto sobre crema | 17.25 |
| Secundario sobre crema | 7.72 |
| Acento sobre crema | 5.91 |
| Error sobre crema | 5.73 |
| `ink` sobre turquesa | 6.81 |
| `ink` sobre lima | 9.57 |
| Secundario oscuro sobre negro | 8.39 |
| Acento oscuro sobre negro | 12.66 |

## Tipografía

Autoalojada con `next/font`: cero peticiones a Google en producción.

| Fuente | Rol | Por qué |
| --- | --- | --- |
| Montserrat 800 | Titulares, cifras, botones | Es la del kit («SOMOS LA PLEBE») |
| Plus Jakarta Sans | Cuerpo, formularios | Legible en pantallas pequeñas, cubre el español |
| Caveat | Claims y leyendas de foto | La voz manuscrita de la marca; nunca para datos |

Tamaños mínimos: 12 px en etiquetas, 13 px en texto de apoyo, 16 px en campos de formulario para que
iOS no haga zoom al enfocarlos. Los titulares usan `clamp()` y por eso son fluidos.

## Composición

- Una columna en móvil; desde `lg` (1024 px), índice lateral de 230 px y contenido de hasta 1000 px.
- En móvil se muestra menos texto: la imagen explica y el detalle queda a un toque. Las listas largas son
  carruseles (`.carrusel`) donde la siguiente tarjeta asoma por el borde.
- Inicio en móvil: elegir monto y tocar «Donar» lleva directo al número.
- Las secciones se separan con líneas de 1 px, no con tarjetas.
- Más espacio encima de un título que debajo.
- Zonas táctiles de 44 px como mínimo en el flujo de donar.

## Componentes

| Pieza | Archivo | Regla |
| --- | --- | --- |
| Botón principal | `components/ui/Boton.tsx` | Único botón lleno; admite `disabled` |
| Botón secundario | `components/ui/Boton.tsx` | Contorno de 1 px |
| Ventana y su cabecera | `components/donate/Capa.tsx` | Transición CSS, nunca AnimatePresence; foco retenido, Esc y fondo cierran |
| Flujo de donar | `components/donate/DonationSheet.tsx` | Monto → envío → gracias; la misma pieza en la ventana y en «Donar» |
| Envío | `components/donate/Checkout.tsx` | Solo medios con datos reales; el número manda |
| Monto y copiar | `components/donate/DonacionUI.tsx` | Copiar siempre avisa si falla |
| Registro mensual | `components/donate/RegistroMensual.tsx` | No promete correos hasta que exista el Apps Script |
| Polaroid | `components/brand/Polaroid.tsx` | Solo fotos reales, con leyenda manuscrita |
| Video | `components/media/TikTokEmbed.tsx` | Embed oficial, cargado al acercarse a pantalla |
| Pie | `components/secciones/Comunes.tsx` | Contacto y RUC |

**Estados del flujo:** deshabilitado (monto menor al mínimo), copiado, fallo al copiar, enviando,
error de red y confirmación. **Estado vacío:** un medio de pago o la historia sin datos no se muestran.

## Movimiento

Un solo momento de autor: la **cortina** turquesa y lima al cambiar de sección. Lo demás es
funcional: la ventana sube, el monto elegido da un pequeño salto. No hay secuestro del scroll. Con
`prefers-reduced-motion` todo se vuelve instantáneo.

## Fotografía

- Solo fotos reales de La Plebe. Una imagen generada con IA nunca se presenta como evidencia.
- La portada es la foto de entrega: una persona, un gesto y la marca en el chaleco.
- Foco fijado en los rostros (`object-position`), para que los recortes móviles no los corten.
- Las personas retratadas deben haber autorizado el uso de su imagen.
- **Ilustraciones generadas con IA** (Gemini, Nano Banana 2): `frente-alimentacion`, `frente-medico`,
  `frente-educacion`, `camino`, `manos`, `bolsa`, `carga`, `promesa-video`, `promesa-acta`, `promesa-respeto`,
  `modalidad-logistica`, `modalidad-campana` y `gracias`. Son grabados de objetos
  y paisaje, sin rostros. Los originales están en `.impeccable/borradores/`.
- Cada imagen tiene un solo lugar: la foto de entrega va en la portada y no se repite en otra sección.
- Recursos del kit media, optimizados en `public/img/`: `papel` (fondo), `claim-tinta` y `claim-blanco`
  (lettering del claim; la versión en tinta es una recoloración de la original), `fundadores`, `marco-brigada`
  (marco y foto de la brigada del kit, unidos) y `fundador`.

## Regla de verdad

`scripts/verificar-publicacion.mjs` corre después de cada `npm run build` y lo hace fallar si reaparece
un dato de ejemplo o un texto sin respaldo, o si falta el número real de Yape.
