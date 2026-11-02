# La Plebe Latinoamérica — Web de donaciones

Sitio estático en Next.js 14 (`output: 'export'`), mobile-first. El estado del proyecto está en el
[README principal](../README.md) y las decisiones visuales en
[`docs/design-system.md`](../docs/design-system.md).

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # exporta a /out y corre scripts/verificar-publicacion.mjs
```

Variables opcionales de build:

| Variable | Para qué |
| --- | --- |
| `NEXT_PUBLIC_BASE_PATH` | Subruta del sitio (GitHub Pages) |
| `NEXT_PUBLIC_SITE_URL` | Dominio de metadatos; por defecto `https://laplebelatam.org` |

## Secciones

Cada una tiene su propia dirección, para usarla por ejemplo en la bio de TikTok:
`laplebelatam.org/nosotros`, `/donar` y `/empresas`. Los enlaces antiguos con `#donar` siguen funcionando.

## Agregar un medio de pago

Basta con cargar el dato real en `lib/data.ts`: `numero` en `BILLETERAS`, `cuenta` y `cci` en `BANCOS`,
y `qr` con la ruta de la imagen en `public/`. El medio aparece solo. Un medio sin datos nunca se muestra.

## Estructura

```
app/
  layout.tsx          fuentes, metadatos, script anti-flash de tema
  page.tsx            Inicio; nosotros/, donar/ y empresas/ son las otras direcciones
components/
  Sitio.tsx           la web completa: secciones, navegación y cortina
  brand/              Claim, iconos, Polaroid, LogoPago, ThemeToggle
  donate/             Capa (ventana), DonationSheet (flujo), Checkout, RegistroMensual
  media/              embed de TikTok
  secciones/          Empresas y pie
lib/data.ts           todo el contenido y los datos de pago
scripts/              verificación antes de publicar
```

## Accesibilidad

`prefers-reduced-motion` respetado en todo el sitio. Foco visible y retenido en las ventanas, que
cierran con Escape. El estado de copiar se anuncia con `aria-live`, y al cambiar de sección el foco
pasa al contenido nuevo.
