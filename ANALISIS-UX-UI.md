# Análisis UX/UI — Landing de donaciones · La Plebe Latinoamérica

Las tres propuestas comparten contenido y sistema visual. Lo único que cambia es **cómo se
mueve el usuario por la página**. Este documento evalúa cuál conviene para el objetivo real:
maximizar donaciones rápidas.

---

## 1. Contexto que condiciona la decisión

**El tráfico llega de TikTok, dentro del navegador de TikTok.** Llega caliente de emoción y frío
de confianza, con una ventana de atención de 5 a 8 segundos. Cualquier estructura que exija leer
antes de poder actuar pierde.

**En Perú la donación no se cierra en la web, se cierra en Yape.** El flujo real es *copiar el
número → salir a la app → pagar*. Por eso el botón "Copiar" pesa más que cualquier pasarela.

**El QR es casi inútil en móvil.** El usuario ya tiene el teléfono en la mano; no puede escanear
su propia pantalla. El QR sirve en escritorio y cuando alguien comparte una captura por WhatsApp.
Jerarquía correcta en móvil: **número copiable primero, QR después.**

**Una ONG sin marca institucional compra confianza con evidencia.** El activo de La Plebe es el
100% de trazabilidad audiovisual y los +20K que ya lo vieron.

---

## 2. Las tres propuestas

| | 01 Paginada | 02 Scroll natural | 03 Cortina |
|---|---|---|---|
| **Navegación** | La rueda, el swipe o las flechas saltan de pantalla completa | Scroll normal hacia abajo | Índice numerado + barrido de marca entre secciones |
| **Scroll de página** | No existe | Sí, corto | No existe |
| **Modo base** | Claro, papel crema | Oscuro | Oscuro |
| **Pantallas** | 4 | 4 bloques en un recorrido | 4 |

---

## 3. Comparación

Escala 1–5. El peso indica cuánto influye el criterio en el objetivo.

| Criterio | Peso | 01 Paginada | 02 Scroll natural | 03 Cortina |
|---|---|---|---|---|
| Tiempo hasta la primera acción de donar | ×3 | **5** · la lista de acciones está en la primera pantalla | 4 · botón grande, pero el hero ocupa la pantalla | **5** · igual que la 01 |
| Familiaridad del gesto para tráfico de TikTok | ×3 | 3 · la rueda que salta sorprende en escritorio | **5** · scrollear es lo que todos ya saben hacer | 3 · hay que descubrir el índice |
| Confianza en los primeros 5 s | ×2 | **5** · perfil, foto real, claim y cifras juntos | 4 · el hero emociona, la prueba llega al scroll | **5** · igual que la 01 |
| Ergonomía móvil | ×2 | 4 · el swipe es natural | **5** · nada que aprender | 4 · índice inferior siempre visible |
| Riesgo de que el usuario se pierda | ×2 | 3 · sin scroll, hay que entender el gesto | **5** · ninguno | 4 · el índice numerado orienta |
| Sensación premium / diferenciación | ×1 | 4 | 2 · es lo convencional | **5** · el barrido es lo más distintivo |
| Peso (First Load JS) | ×1 | **5** · 142 kB | 4 · 145 kB | **5** · 141 kB |
| Resistencia a que el video no llegue | ×1 | **5** · no depende de él | 2 · el hero es un video a pantalla completa | **5** · no depende de él |
| **Total ponderado (sobre 75)** | | **57** | **59** | **60** |

---

## 4. Recomendación

### Para publicar ya: **02 «Scroll natural»**

No porque sea la más bonita —no lo es— sino porque **no le pide nada nuevo al usuario**. Para
tráfico frío que llega de un video, cualquier gesto que haya que descubrir es una fuga. Scrollear
es el único gesto que nadie tiene que aprender.

Su debilidad es real y hay que decirla: **apuesta la primera pantalla a un video que todavía no
existe.** Si ese video es débil, la propuesta se cae. Por eso es el entregable de mayor riesgo del
proyecto y el primero que hay que pedir.

### La que más me gusta como diseño: **03 «Cortina»**

Es la que mejor resuelve el encargo de "moderno sin scroll largo" y la única que se siente
diseñada y no ensamblada. El barrido de marca entre secciones es un recurso editorial, no un
efecto decorativo: usa el turquesa y el lima como material, no como adorno.

El riesgo es de comprensión, no de gusto: un índice numerado exige que el usuario entienda que
eso es la navegación. En escritorio funciona solo; en móvil el índice inferior lo resuelve.

### La 01 «Paginada»

El gesto de la rueda saltando de pantalla es el efecto que pediste conservar y está bien resuelto,
pero tiene un costo: **rompe la expectativa del scroll**. Quien mueva la rueda esperando avanzar
un poco avanza una pantalla entera. En una landing de conversión eso es fricción, no encanto.
Es excelente para una presentación al cliente o a un auspiciador, donde el recorrido es guiado.

### Lo que haría en la práctica

Publicar la **02** y medir. Si los datos muestran que la gente llega hasta abajo sin donar, probar
la **03** como test A/B: su lista de acciones está en la primera pantalla y no obliga a recorrer
nada.

---

## 5. Sobre el lenguaje visual

La versión anterior de este diseño tenía los tics que delatan una interfaz generada: etiquetas de
color por todos lados, títulos precedidos de un kicker con línea punteada, listas con viñetas,
chips de estado sobre cada imagen, iconos metidos en cuadraditos de color. Se eliminaron del
sistema entero, no de una pantalla.

Lo que quedó en su lugar:

- **La tipografía hace la jerarquía.** Anton condensada para titulares y cifras, Plus Jakarta Sans
  para el cuerpo, Caveat solo para el claim de marca. Nada de etiquetas que expliquen lo que el
  tamaño del texto ya dice.
- **Líneas de un píxel en vez de contenedores.** Las secciones se separan con una regla fina, no
  con tarjetas redondeadas apiladas.
- **Numerales como estructura.** 01, 02, 03 dan orden sin recurrir a insignias.
- **Color contenido.** Turquesa y lima aparecen en el botón principal, en el trazo del claim y en
  el barrido de la 03. En el resto manda el negro y el crema del kit.
- **Los medios de pago son texto.** Yape, Plin y PayPal están en tipografía, no en píldoras de su
  color corporativo: esos son logotipos oficiales y van cuando el cliente los entregue.

---

## 6. Contraste

El turquesa `#3FA79C` y el lima `#8BC53F` **no pasan AA como texto sobre crema** (2.4:1 y 1.9:1).
Se crearon las variantes `#15665E` y `#4E7A16` para texto en modo claro, y los colores originales
quedaron como relleno con texto negro encima, que sí pasa (6.8:1 y 9.2:1). Misma marca, legible.

---

## 7. Performance

- **SSG puro** (`output: 'export'`): HTML estático servible desde CDN.
- **141–145 kB de First Load JS.** Bajó respecto de la versión anterior al quitar componentes
  decorativos (tilt 3D en cada tarjeta, halos, contadores duplicados).
- **Fuentes auto-alojadas** con `next/font`: cero peticiones a Google, cero CLS.
- **Cuando llegue el video del hero de la 02**: `poster` optimizado como LCP y el video cargando
  después. Un autoplay pesado destruye el LCP justo en la pantalla que decide la conversión.

---

## 8. Qué medir en producción

1. `donate_open` — apertura del selector (tasa sobre visitas: **la métrica principal**).
2. `donate_step2` — llegó a elegir medio de pago.
3. `copy_number` — copió un número de Yape/Plin/CCI. **El proxy más fiable de donación real**,
   porque la transacción ocurre fuera de la web.
4. `method_selected` — qué riel gana. Determina si vale la pena pagar una pasarela.
5. `frequency_toggle` — cuántos eligen mensual.

---

## 9. Siguiente paso

1. **Pedir el video del hero.** Es el entregable de mayor riesgo.
2. Validar las líneas de impacto (`S/ 25 = 10 raciones calientes`). Son el motor de conversión y
   tienen que ser verdad.
3. Cerrar la pasarela y cargar cuentas, CCI, QR y logotipos reales — todo marcado `PENDIENTE` en
   `diseno-laplebe/lib/data.ts`.
