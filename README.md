# La Plebe Latinoamérica — Web de donaciones

Web de donaciones de [@la.plebe_latinoamerica](https://www.tiktok.com/@la.plebe_latinoamerica).
Dominio previsto: **laplebelatam.org**.

La navegación es la «Cortina»: índice de secciones con un barrido de marca al cambiar.

## Arrancar

```bash
cd diseno-laplebe
npm install
npm run dev     # http://localhost:3000
npm run build   # exporta HTML estático a /out y verifica que no haya datos de ejemplo
```

Next.js 14 (`output: 'export'`) · React 18 · TypeScript · Tailwind CSS. Sin backend: HTML estático.

## Documentos

| Archivo | Qué contiene |
| --- | --- |
| [`docs/design-system.md`](docs/design-system.md) | Color, tipografía, componentes, movimiento y fotografía |
| [`LOGOS-Y-MEDIOS.md`](LOGOS-Y-MEDIOS.md) | Especificación de logotipos, QR, fotos y video |
| [`sistema-mensual/LEEME.md`](sistema-mensual/LEEME.md) | Instalar el recordatorio mensual por correo |
| [`ANALISIS-UX-UI.md`](ANALISIS-UX-UI.md) | Análisis inicial de las tres propuestas; histórico |

## Estado de la información

### Confirmado por el kit del cliente

Misión, los tres frentes, +20K seguidores, las tres modalidades para empresas, el reporte con acta
para marcas y el correo de contacto publicado en el kit.

### Entregado por el responsable del proyecto, por verificar

- **RUC 20616665619:** dígito verificador correcto; falta confirmar titular y estado en SUNAT.
- **Yape y WhatsApp 939 647 279:** falta confirmar el número y el nombre que aparece al yapear.

### Pendiente del cliente

Todo está marcado `PENDIENTE` en [`diseno-laplebe/lib/data.ts`](diseno-laplebe/lib/data.ts). Lo que
falta **no se muestra**; al cargar el dato, aparece solo.

- Nombre exacto del titular en Yape
- Números de Plin y BIM, y QR reales
- Cuentas y CCI de los bancos
- Historia real de La Plebe, con fechas
- Equivalencias de impacto (`S/ X = …`), si se quieren mostrar
- Pasarela para tarjetas y enlace de PayPal
- URL del Apps Script del recordatorio mensual

## Publicación

Cada push a `main` publica la web en **laplebelatam.org** mediante GitHub Pages
(`.github/workflows/deploy.yml`). El dominio está en GoDaddy, con estos registros DNS:

| Tipo | Nombre | Valor |
| --- | --- | --- |
| A | @ | 185.199.108.153 · 185.199.109.153 · 185.199.110.153 · 185.199.111.153 |
| CNAME | www | yedi06.github.io |

Pendiente de confirmar con el cliente: número y titular de Yape, RUC, cuenta de Instagram y el permiso
de las personas que aparecen en las fotos.

## Sobre los logotipos

`diseno-laplebe/public/logos/` contiene logotipos de medios de pago, procesados a partir de los archivos
que entregó el cliente. Son **marcas registradas de sus titulares**, y se muestran solo para indicar los
medios aceptados.
