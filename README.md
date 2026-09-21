# La Plebe Latinoamérica — Landing de donaciones

Propuesta de diseño UX/UI para la landing de donaciones de
[@la.plebe_latinoamerica](https://www.tiktok.com/@la.plebe_latinoamerica).

Tres alternativas construidas sobre el mismo sistema visual. Lo que cambia entre ellas no es el
estilo, es **la forma de moverse por la página**.

| Ruta | Propuesta | Navegación |
| --- | --- | --- |
| `/` | Índice | — |
| `/v1` | Paginada | La rueda del mouse, el swipe o las flechas saltan de pantalla |
| `/v2` | Scroll natural | Recorrido hacia abajo, sin trucos |
| **`/v3`** | **Cortina — elegida** | Índice numerado con iconos + barrido de marca entre secciones |

## Arrancar

```bash
cd diseno-laplebe
npm install
npm run dev     # http://localhost:3000
npm run build   # exporta HTML estático a /out
```

Next.js 14 (App Router, `output: 'export'` → SSG puro) · React 18 · TypeScript · Tailwind CSS ·
Framer Motion. Sin backend: es HTML estático servible desde cualquier CDN.

## Documentos

| Archivo | Qué contiene |
| --- | --- |
| [`ANALISIS-UX-UI.md`](ANALISIS-UX-UI.md) | Comparación de las tres propuestas, recomendación y plan de medición |
| [`PASARELAS-PERU.md`](PASARELAS-PERU.md) | Culqi, Izipay, Niubiz y Mercado Pago: comisiones, requisitos y qué datos hacen falta |
| [`LOGOS-Y-MEDIOS.md`](LOGOS-Y-MEDIOS.md) | De dónde sale cada logotipo y las medidas de todas las fotos y videos pendientes |
| [`diseno-laplebe/README.md`](diseno-laplebe/README.md) | Sistema de marca, tipografía y estructura del código |

---

## ⚠️ Antes de publicar

El diseño está terminado. **El contenido no.** Todo lo pendiente está marcado `PENDIENTE` en
[`diseno-laplebe/lib/data.ts`](diseno-laplebe/lib/data.ts).

**Datos de cobro** — sin esto la web no puede recibir una sola donación:

- Números reales de Yape y Plin
- Cuentas y CCI de BCP, BBVA, Interbank, Scotiabank y BanBif
- Los tres códigos QR (Yape, Plin e interoperable), 1024 × 1024 px
- WhatsApp de contacto

**Contenido que hoy es texto inventado como marcador y no debe salir así:**

- La **historia de La Plebe** en la sección «Nosotros» (los hitos 2023 / 2024 / 2025)
- Las **equivalencias de impacto**: «S/ 25 = 10 raciones calientes», «S/ 60 = un mes de
  medicinas», «S/ 40 = un kit escolar»

Esas cifras son el motor de conversión de la página. Una web cuyo argumento central es *«todo lo
que hacemos está documentado»* no puede publicarse con números que nadie verificó.

**Fotos y video**: cada hueco de imagen muestra su proporción y medida exactas. El detalle está en
`LOGOS-Y-MEDIOS.md`. El de mayor riesgo es el video del hero de la propuesta 02.

## Sobre los logotipos

`diseno-laplebe/public/logos/` contiene los logotipos de los medios de pago, procesados a partir
de los archivos que entregó el cliente. Son **marcas registradas de sus respectivos titulares** y
se muestran únicamente para indicar los medios de pago aceptados. No se han recoloreado ni
modificado más allá del recorte y el reescalado.

Los códigos QR que se ven en pantalla son **maquetas generadas, no son escaneables**.
