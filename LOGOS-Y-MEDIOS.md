# Requerimiento de imágenes y logotipos

Todo lo que falta para que la web quede lista, con medidas exactas.

El código ya está preparado: el componente `LogoPago` busca el archivo en `public/logos/` y, si
todavía no existe, muestra un recuadro con el nombre de la marca. En cuanto copias el archivo con
el nombre correcto, aparece solo. **No hay que tocar código.**

---

## 1. Por qué no vienen incluidos

Los logotipos de Yape, Plin, Visa, Mastercard y del resto son **marcas registradas**. No se pueden
redibujar, aproximar ni bajar de un banco de imágenes: cada marca entrega su archivo oficial con
reglas de uso. Si se usa una versión no oficial, la marca puede pedir que se retire.

---

## 2. Billeteras peruanas

| Archivo | Marca | De dónde se baja |
|---|---|---|
| `yape.svg` | Yape | **Se pide al BCP.** El kit de marca se entrega al comercio o institución afiliada, junto con el manual de uso. Contacto: el ejecutivo de la cuenta o el soporte de Yape para negocios. |
| `plin.svg` | Plin | **Se pide al banco con el que se afilie**: Interbank, BBVA o Scotiabank. Plin es un servicio conjunto de esos bancos; cada uno entrega el mismo kit. |

> Solo se pueden mostrar si la organización está efectivamente afiliada y la cuenta es suya.

---

## 3. Tarjetas que se usan en Perú

| Archivo | Marca | De dónde se baja |
|---|---|---|
| `visa.svg` | Visa | Brand center de Visa para comercios. Buscar "Visa brand center" o pedirlo a la pasarela: normalmente lo entrega con el kit de afiliación. |
| `mastercard.svg` | Mastercard | Centro de marca de Mastercard, sección de logotipos para aceptación. |
| `amex.svg` | American Express | Recursos de marca de American Express para establecimientos. |
| `diners.svg` | Diners Club | Se solicita a Diners Club Perú. |

**Atajo recomendado:** la pasarela que se contrate (Culqi, Izipay, Niubiz o Mercado Pago) entrega
un paquete con todos los logotipos de aceptación ya aprobados. Es la vía más rápida y la que menos
riesgo tiene de usar una versión incorrecta.

---

## 4. Medios internacionales

| Archivo | Marca | De dónde se baja |
|---|---|---|
| `paypal.svg` | PayPal | Centro de logotipos para comerciantes de PayPal. Requiere cuenta business. |
| `unionpay.svg` | UnionPay | Solo si la pasarela elegida la acepta. |

Opcionales, según lo que termine aceptando la pasarela: `applepay.svg`, `googlepay.svg`.

---

## 5. Logotipo de la pasarela

| Archivo | Cuándo |
|---|---|
| `culqi.svg` · `izipay.svg` · `niubiz.svg` · `mercadopago.svg` | Solo el de la que se contrate. Lo entrega la pasarela al afiliarse. |

Ver `PASARELAS-PERU.md`: la recomendación es **Culqi**.

---

## 6. Especificación técnica de los logotipos

| | |
|---|---|
| **Formato preferido** | SVG |
| **Alternativa** | PNG con fondo transparente |
| **Alto mínimo en PNG** | 96 px (se muestran a 24–28 px; 3× para pantallas retina) |
| **Fondo** | Transparente, nunca blanco recortado |
| **Versión** | A color sobre fondo oscuro. Si la marca ofrece versión monocroma, mandar también. |
| **Nombre** | Exactamente como la tabla, en minúsculas y sin acentos |
| **Dónde va** | `diseno-laplebe/public/logos/` |

Si los archivos vienen en PNG en vez de SVG, hay que cambiar una línea en
`components/brand/LogoPago.tsx` (la que dice `` src={`/logos/${id}.svg`} ``).

### Reglas de uso que casi todas las marcas comparten

- No deformar: se escala proporcionalmente.
- No recolorear ni aplicar efectos.
- Respetar el área de protección del manual.
- No sugerir patrocinio: "Aceptamos Visa" es correcto; dar a entender que Visa apoya a La Plebe, no.

---

## 7. Códigos QR

Los QR que se ven en el diseño son **generados como maqueta**: tienen los tres ojos de posición
reales para que midan y se vean como un QR verdadero, pero **no son escaneables**.

| Archivo | Qué es | De dónde sale |
|---|---|---|
| `qr-yape.png` | QR de cobro de la cuenta Yape | Se exporta desde la app de Yape |
| `qr-plin.png` | QR de cobro de Plin | Se exporta desde la app del banco |
| `qr-interoperable.png` | QR que funciona desde Yape, Plin y banca móvil | Lo entrega el banco |

**Especificación:** 1024 × 1024 px · PNG o SVG · fondo blanco · margen libre de 4 módulos
alrededor · sin logo encima si eso reduce la lectura.

---

## 8. Fotos y video que faltan

| Dónde | Proporción | Medida | Qué debe mostrar |
|---|---|---|---|
| Portada | 4:5 | 1080 × 1350 | **Ya está**: la foto de perfil del TikTok. |
| Nosotros — equipo | 4:5 | 1080 × 1350 | El equipo completo en una brigada real, no posado en estudio. |
| Empresas | 21:9 | 2520 × 1080 | Una entrega con el empaque de la marca aliada visible. |
| Frentes (propuestas 01 y 02) | 4:3 | 1600 × 1200 | Una foto por frente: olla común, caso médico, kits escolares. |
| Hero de la propuesta 02 | 9:16 **y** 16:9 | 1080×1920 y 1920×1080 | Video de la brigada llegando. **Dos encuadres del mismo material**, uno para móvil y otro para escritorio. |

**Formato:** JPG de calidad alta. Sin marcas de agua ni texto quemado — el texto lo pone la web,
así se puede cambiar o traducir sin volver a exportar.

---

## 9. Shorts de TikTok — listo

Los cuatro videos ya están cargados. Se usa el **embed oficial**, no el archivo descargado: las
vistas siguen contando en la cuenta, no hay que pagar ancho de banda y si se edita o borra un
video en TikTok, la web se actualiza sola.

| Video | Descripción en TikTok |
|---|---|
| `7619125416548207892` | "Ella dormía sobre tablas. HOY NO. 🤍 ¡Esto es gracias a ustedes! 💪 Si conoces un caso, escríbenos." |
| `7617278794218425621` | Abuelita en condiciones difíciles: víveres, camas y enseres para su casa. |
| `7592757314331872520` | "No podemos borrar el dolor, pero sí acompañar. 🤍" |
| `7660350415162101012` | Caso del señor Nimer: lucha por su salud y sus hijos sacrifican sus estudios para cuidarlo. Primer apoyo cumplido. |

Para cambiarlos o agregar más, se editan en `diseno-laplebe/lib/data.ts`, en la lista `TIKTOKS`.

---

## 10. Resumen de lo que hay que conseguir

**Urgente** (sin esto la web no puede cobrar):
1. RUC activo y cuenta bancaria a nombre de la organización.
2. Números reales de Yape y Plin.
3. Cuentas y CCI de BCP, BBVA, Interbank y Scotiabank.
4. Los tres códigos QR.

**Importante** (la web funciona, pero se ve incompleta):
5. Logotipos de Yape y Plin.
6. Paquete de logotipos de tarjetas — pedirlo a la pasarela.
7. Foto del equipo y foto para la sección de empresas.

**Después:**
8. Logo de la pasarela, una vez contratada.
9. Video del hero, si se elige la propuesta 02.
10. La historia real de La Plebe para la sección "Nosotros" — hoy tiene texto de ejemplo.
