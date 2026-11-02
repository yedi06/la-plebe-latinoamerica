/**
 * Fuente única de contenido de la landing.
 *
 * Regla de esta web: aquí solo entran datos reales. Un número o una cuenta vacíos
 * no se muestran; al cargarlos, el medio aparece solo en la pantalla de donar. Lo
 * que falta está marcado `PENDIENTE`, y `scripts/verificar-publicacion.mjs` frena
 * el build si vuelve a colarse un dato de ejemplo.
 */

export const BRAND = {
  nombre: 'La Plebe Latinoamérica',
  handle: '@la.plebe_latinoamerica',
  tiktok: 'https://www.tiktok.com/@la.plebe_latinoamerica',
  instagram: 'https://www.instagram.com/laplebeschool/',
  facebook: 'https://www.facebook.com/LaPlebeLatino',
  claim: 'Donde otros no llegan, nosotros sí.',
  mision:
    'Plataforma de ayuda social y movilización comunitaria que documenta historias reales y entrega asistencia directa en comedores populares, asentamientos y zonas extremas del Perú.',
  misionCorta: 'Ayuda directa y documentada en las zonas más alejadas del Perú.',
  email: 'contacto.laplebe@gmail.com',
  whatsapp: '+51 939 647 279',
  whatsappLink: 'https://wa.me/51939647279',
  cobertura: 'Lima & Provincias / LATAM',
  ruc: '20616665619',
  dominio: 'https://laplebelatam.org',
} as const;

/**
 * Enlace que abre Gmail en el navegador con el correo y el asunto ya escritos.
 * Se usa en vez de `mailto:`, que no hace nada si la computadora no tiene un
 * programa de correo configurado (lo normal en Windows).
 */
export function enlaceCorreo(asunto?: string) {
  const q = new URLSearchParams({ view: 'cm', fs: '1', to: BRAND.email });
  if (asunto) q.set('su', asunto);
  return `https://mail.google.com/mail/?${q.toString()}`;
}

/* -------------------------------------------------------------------------- */
/*  Frentes de ayuda — textos literales del kit media (lámina 3)               */
/* -------------------------------------------------------------------------- */

export type Frente = {
  id: 'alimentacion' | 'medico' | 'educacion';
  nombre: string;
  nombreCorto: string;
  descripcion: string;
  icono: 'olla' | 'corazon' | 'birrete';
};

export const FRENTES: Frente[] = [
  {
    id: 'alimentacion',
    nombre: 'Alimentación & Ollas Comunes',
    nombreCorto: 'Alimentación',
    descripcion:
      'Abastecimiento de víveres no perecibles, raciones y cocinas solidarias.',
    icono: 'olla',
  },
  {
    id: 'medico',
    nombre: 'Casos Médicos & Emergencias',
    nombreCorto: 'Casos médicos',
    descripcion:
      'Medicinas, pañales, sillas de ruedas y apoyo a adultos mayores o niños.',
    icono: 'corazon',
  },
  {
    id: 'educacion',
    nombre: 'Educación & Bienestar Infantil',
    nombreCorto: 'Educación',
    descripcion:
      'Kits escolares, abrigo, calzado e implementación de espacios comunitarios.',
    icono: 'birrete',
  },
];

/* -------------------------------------------------------------------------- */
/*  Métricas de comunidad — lámina 3 del kit                                   */
/* -------------------------------------------------------------------------- */

export type Stat = {
  valor: number;
  sufijo?: string;
  prefijo?: string;
  decimales?: number;
  /** Para rangos como "18 - 40" que no son un conteo. */
  textoFijo?: string;
  titulo: string;
  detalle: string;
};

export const STATS: Stat[] = [
  {
    valor: 20,
    prefijo: '+',
    sufijo: 'K',
    titulo: 'Seguidores',
    detalle: 'Audiencia 100% orgánica y activa',
  },
  {
    valor: 9.4,
    sufijo: '%',
    decimales: 1,
    titulo: 'Engagement promedio',
    detalle: 'Comentarios, shares y apoyo continuo',
  },
  {
    valor: 100,
    sufijo: '%',
    titulo: 'Trazabilidad',
    detalle: 'Evidencia audiovisual de cada entrega',
  },
  {
    valor: 0,
    textoFijo: '18–40',
    titulo: 'Edad core',
    detalle: 'Sensible a RSE e impacto social',
  },
];

/* -------------------------------------------------------------------------- */
/*  Montos sugeridos                                                           */
/* -------------------------------------------------------------------------- */

/**
 * La mayoría de aportes son pequeños y unos pocos son grandes: la escalera cubre
 * los dos extremos, y arranca marcada en un monto bajo pero no en el mínimo.
 */
export const MONTOS_UNICO = [1, 5, 10, 20, 50, 100] as const;
/** La versión corta de la portada, donde «Otro» abre el resto. */
export const MONTOS_PORTADA = [1, 5, 10, 50] as const;
export const MONTO_SUGERIDO = 10;
export const MONTOS_MENSUAL = [10, 25, 50, 100] as const;
export const MONTO_MINIMO = 1;

/* -------------------------------------------------------------------------- */
/*  Donación mensual — registro + recordatorio                                 */
/* -------------------------------------------------------------------------- */

/**
 * El donante mensual se registra en la web y cada mes recibe un correo con el
 * recordatorio y el número de Yape. Los registros llegan a una hoja de Google
 * de La Plebe a través de un Apps Script (ver `sistema-mensual/LEEME.md`).
 *
 * PENDIENTE: pegar aquí la URL de la aplicación web del Apps Script
 * (termina en /exec). Mientras esté vacía, el registro se envía por WhatsApp
 * con los mismos datos, así que el formulario funciona igual desde hoy.
 */
export const MENSUAL = {
  endpoint: '',
  /** Días del mes que puede elegir el donante. Hasta 28 para que exista en todos los meses. */
  dias: Array.from({ length: 28 }, (_, i) => i + 1),
  diaSugerido: 15,
} as const;

/* -------------------------------------------------------------------------- */
/*  Medios de donación                                                         */
/* -------------------------------------------------------------------------- */

export type Billetera = {
  id: 'yape' | 'plin' | 'bim';
  nombre: string;
  numero: string;
  /** Nombre exacto que ve quien envía. Vacío hasta que el cliente lo confirme. */
  titular: string;
  color: string;
  nota: string;
  /** Ruta en `public/` del QR real. Sin archivo real no se muestra ningún QR. */
  qr?: string;
};

export const BILLETERAS: Billetera[] = [
  {
    id: 'yape',
    nombre: 'Yape',
    numero: '939 647 279',
    titular: '', // PENDIENTE: nombre exacto que aparece al yapear
    color: '#742384',
    nota: 'Escanea el QR o yapea al número',
  },
  {
    id: 'plin',
    nombre: 'Plin',
    numero: '', // PENDIENTE
    titular: '',
    color: '#00A9E0',
    nota: 'Escanea el QR o plinea al número',
  },
  {
    id: 'bim',
    nombre: 'BIM',
    numero: '', // PENDIENTE
    titular: '',
    color: '#E4032E',
    nota: 'Escanea el QR o envía al número',
  },
];

export type Banco = {
  id: string;
  nombre: string;
  color: string;
  moneda: 'Soles' | 'Dólares';
  cuenta: string;
  cci: string;
};

export const BANCOS: Banco[] = [
  {
    id: 'bcp',
    nombre: 'BCP',
    color: '#F58220',
    moneda: 'Soles',
    cuenta: '', // PENDIENTE
    cci: '', // PENDIENTE
  },
  {
    id: 'bbva',
    nombre: 'BBVA',
    color: '#0B5EA8',
    moneda: 'Soles',
    cuenta: '', // PENDIENTE
    cci: '', // PENDIENTE
  },
  {
    id: 'interbank',
    nombre: 'Interbank',
    color: '#00A64F',
    moneda: 'Soles',
    cuenta: '', // PENDIENTE
    cci: '', // PENDIENTE
  },
  {
    id: 'banbif',
    nombre: 'BanBif',
    color: '#00693C',
    moneda: 'Soles',
    cuenta: '', // PENDIENTE
    cci: '', // PENDIENTE
  },
  {
    id: 'scotiabank',
    nombre: 'Scotiabank',
    color: '#DA291C',
    moneda: 'Soles',
    cuenta: '', // PENDIENTE
    cci: '', // PENDIENTE
  },
];

/** Lo único que ve el donante: medios con datos reales cargados. */
export const BILLETERAS_ACTIVAS = BILLETERAS.filter((b) => b.numero);
export const BANCOS_ACTIVOS = BANCOS.filter((b) => b.cuenta && b.cci);
/** PENDIENTE: nombre exacto del titular de las cuentas bancarias. */
export const TITULAR_CUENTAS = '';

/* -------------------------------------------------------------------------- */
/*  Modalidades corporativas — lámina 4 del kit                                */
/* -------------------------------------------------------------------------- */

export type Modalidad = {
  titulo: string;
  aporte: string;
  retorno: string;
  imagen: string;
};

export const MODALIDADES: Modalidad[] = [
  {
    titulo: 'Canje Solidario en Especie',
    imagen: 'carga-940',
    aporte:
      'Alimentos, insumos de primera necesidad, abrigo, medicamentos o materiales.',
    retorno:
      'Mención orgánica en el video, empaque visible en la entrega y etiqueta oficial en descripción y comentario fijado.',
  },
  {
    titulo: 'Partner Logístico Operativo',
    imagen: 'modalidad-logistica',
    aporte: 'Cobertura de movilidad, combustible, transporte de carga o viáticos de la brigada.',
    retorno:
      'Branding en indumentaria del equipo ("Llegamos gracias a [Marca]"), mención de apertura y créditos institucionales.',
  },
  {
    titulo: 'Campaña Integral RSE Co-Branded',
    imagen: 'modalidad-campana',
    aporte: 'Financiamiento o dotación completa para un caso de alto impacto comunal.',
    retorno:
      'Video dedicado con storytelling de marca, material en 4K/FHD para tus canales y co-publicación en redes.',
  },
];

export const COMPROMISOS = [
  {
    n: '01',
    titulo: 'Reporte post-entrega',
    texto:
      'Balance fotográfico y acta de entrega detallada con la cantidad exacta de productos o recursos distribuidos.',
  },
  {
    n: '02',
    titulo: 'Dignidad audiovisual',
    texto:
      'Storytelling humano y respetuoso que dignifica a los beneficiarios, evitando el morbo.',
  },
  {
    n: '03',
    titulo: 'Trazabilidad 100%',
    texto:
      'Cada campaña cierra con evidencia audiovisual publicada en el canal, visible para toda la comunidad.',
  },
];

/* -------------------------------------------------------------------------- */
/*  TARJETAS DE ACCIÓN                                                         */
/* -------------------------------------------------------------------------- */

/**
 * 👉 CÓMO AGREGAR UNA TARJETA NUEVA
 *
 * Igual que en la página de referencia (stan.store): las tarjetas son una lista.
 * Para sumar una, copia cualquier objeto de `TARJETAS`, cámbiale los campos y
 * listo — aparece sola en las tres propuestas. No hay que tocar ningún componente.
 *
 *   accion: 'donar'     → abre el selector de donación (usa `frente` y `monto`)
 *   accion: 'enlace'    → abre `href` (TikTok, formulario, nota de prensa…)
 *   accion: 'whatsapp'  → abre el WhatsApp de coordinación
 *   accion: 'seccion'   → lleva a otra pantalla/pestaña de la misma página
 *
 * Para quitar una tarjeta, bórrala o coméntala. Para reordenarlas, muévelas.
 */
export type TarjetaAccion = {
  id: string;
  titulo: string;
  bajada: string;
  /** Chip corto arriba a la izquierda. Opcional. */
  etiqueta?: string;
  /** La tarjeta destacada ocupa el doble de ancho y lleva el degradado de marca. */
  destacada?: boolean;
  accion: 'donar' | 'enlace' | 'whatsapp' | 'seccion';
  href?: string;
  frente?: Frente['id'];
  monto?: number;
  /** Con qué frecuencia abre el selector de donación. */
  frecuencia?: 'unica' | 'mensual';
  icono: 'olla' | 'corazon' | 'birrete' | 'rayo' | 'repetir' | 'maletin' | 'play';
  /** Si se define, la tarjeta muestra una miniatura con este texto de espacio reservado. */
  medioLabel?: string;
};

export const TARJETAS: TarjetaAccion[] = [
  {
    id: 'mensual',
    titulo: 'Prefiero ayudar cada mes',
    bajada: 'Desde S/ 10. Es lo que nos permite planificar las brigadas.',
    accion: 'donar',
    frecuencia: 'mensual',
    monto: 25,
    icono: 'repetir',
  },
  // Las tarjetas por frente con equivalencias («S/ 25 = 10 raciones»…) se
  // quitaron: eran texto de ejemplo que el cliente nunca validó. «Donar ahora» es
  // el botón principal de la portada; repetirlo aquí solo creaba una duda falsa.
];

/* -------------------------------------------------------------------------- */
/*  Shorts de TikTok                                                           */
/* -------------------------------------------------------------------------- */

/**
 * ⚠️ PENDIENTE CLIENTE: pegar aquí las URLs de los videos a destacar.
 * Formato: https://www.tiktok.com/@la.plebe_latinoamerica/video/7XXXXXXXXXXXXXXXXXX
 *
 * Se usa el embed oficial de TikTok, no el archivo descargado: las vistas
 * siguen contando en la cuenta, no hay que alojar el video y si se edita o
 * borra en TikTok la web se actualiza sola.
 */
export const TIKTOKS: { url: string; etiqueta: string; descripcion: string }[] = [
  {
    url: 'https://www.tiktok.com/@la.plebe_latinoamerica/video/7619125416548207892',
    etiqueta: 'Dormía sobre tablas',
    descripcion:
      'Ella dormía sobre tablas. Hoy no. 🤍 ¡Esto es gracias a ustedes! 💪 Si conoces un caso, escríbenos.',
  },
  {
    url: 'https://www.tiktok.com/@la.plebe_latinoamerica/video/7617278794218425621',
    etiqueta: 'Una abuelita sola',
    descripcion:
      'Fuimos a ayudar a una abuelita que vive en condiciones muy difíciles. Le llevamos víveres, camas y algunas cosas para su casa. Su agradecimiento fue tan grande que terminó llorando… 🥹❤️',
  },
  {
    url: 'https://www.tiktok.com/@la.plebe_latinoamerica/video/7592757314331872520',
    etiqueta: 'Acompañar el dolor',
    descripcion: 'No podemos borrar el dolor, pero sí acompañar. 🤍',
  },
  {
    url: 'https://www.tiktok.com/@la.plebe_latinoamerica/video/7686645695977213192',
    etiqueta: 'Los que hicieron tanto',
    descripcion:
      '💔 Nunca nos olvidemos de quienes hicieron tanto por nosotros. Hoy estamos aquí para darles al menos un pequeño momento de alegría ✨🙏🏻',
  },
  {
    url: 'https://www.tiktok.com/@la.plebe_latinoamerica/video/7683662382517783829',
    etiqueta: 'Sobrevivir con muy poco',
    descripcion:
      'Hay familias que sobreviven con muy poco 💔 Estamos aquí para darles al menos un pequeño momento de alegría ✨🙏🏻',
  },
  {
    url: 'https://www.tiktok.com/@la.plebe_latinoamerica/video/7682507049439218964',
    etiqueta: 'Somos La Plebe',
    descripcion:
      'Estamos aquí para ayudar, para dar un poco de esperanza a todo el que lo necesita. Somos La Plebe ♥️🙏🏻',
  },
  {
    url: 'https://www.tiktok.com/@la.plebe_latinoamerica/video/7678869755775782164',
    etiqueta: 'Una madre que no pierde la fe',
    descripcion:
      'Toda una familia a sus espaldas, pero esta madre no pierde la fe 🙏🏻 Llegamos hasta aquí para darle un poco de ayuda y respiro en momentos difíciles.',
  },
  {
    url: 'https://www.tiktok.com/@la.plebe_latinoamerica/video/7676717176534928661',
    etiqueta: 'Ella lucha sola',
    descripcion:
      'Ella lucha sola por su hijito 💔 Vinimos a ayudarla y darle un poquito de tranquilidad para sus días 🙌🏻',
  },
  {
    url: 'https://www.tiktok.com/@la.plebe_latinoamerica/video/7676630261135625479',
    etiqueta: 'Llegar cada vez más lejos',
    descripcion:
      'Ayúdennos a llegar cada vez más lejos para poder seguir ayudando a todas las familias que lo necesitan 🙌🏻',
  },
  {
    url: 'https://www.tiktok.com/@la.plebe_latinoamerica/video/7675048478367681799',
    etiqueta: 'Bendecir más hogares',
    descripcion:
      'Seguimos apoyando a todos los que lo necesitan 🙏🏻✨ Ayúdennos a ayudar a más familias y seguir bendiciendo más hogares 🕊️',
  },
  {
    url: 'https://www.tiktok.com/@la.plebe_latinoamerica/video/7672080734743563541',
    etiqueta: 'Un camino duro',
    descripcion:
      'Un duro camino, pero nunca es demasiado largo cuando queremos ayudar. Y ella lo necesitaba 💔',
  },
  {
    url: 'https://www.tiktok.com/@la.plebe_latinoamerica/video/7669947620084731153',
    etiqueta: 'Los milagros existen',
    descripcion:
      'Ella lucha constantemente por ella y por su hijo. Llegamos a ayudarla, a darle un respiro y a hacerla creer que los milagros existen… 🙏🏻✨',
  },
];

/* -------------------------------------------------------------------------- */
/*  Quiénes somos                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Hitos de la historia. PENDIENTE: fechas y datos reales del cliente. Mientras esté
 * vacío la línea de tiempo no se muestra: una web cuyo argumento es «todo pasó de
 * verdad» no puede contar una historia de ejemplo.
 */
export const HISTORIA: { año: string; titulo: string; texto: string }[] = [];

/** Las tres promesas que sostienen la confianza. */
export const PROMESAS = [
  {
    titulo: 'Todo se graba',
    corto: 'Todo se graba',
    imagen: 'promesa-video',
    texto: 'Cada entrega se publica en el canal. Si no está en video, no pasó.',
  },
  {
    titulo: 'Cuentas claras con las marcas',
    corto: 'Cuentas claras',
    imagen: 'promesa-acta',
    texto: 'Cada marca aliada recibe balance fotográfico y acta con la cantidad exacta entregada.',
  },
  {
    titulo: 'Sin morbo',
    corto: 'Sin morbo',
    imagen: 'promesa-respeto',
    texto: 'Contamos cada historia con respeto, nunca para exponer a nadie.',
  },
];

/* -------------------------------------------------------------------------- */
/*  Logotipos de medios de pago                                                */
/* -------------------------------------------------------------------------- */

/**
 * Archivos que ya están en `public/logos/`, normalizados a 240 × 96 px.
 * Lo que no esté en esta lista se dibuja como recuadro tipográfico.
 */
export const LOGOS_DISPONIBLES = [
  'yape', 'plin', 'bim',
  'bcp', 'bbva', 'interbank', 'scotiabank', 'banbif',
  'visa', 'mastercard', 'amex', 'diners',
  'transferencia', 'pagoefectivo',
  'billeteras', 'paypal', 'tarjeta',
];

export const LOGOS_BILLETERAS = [
  { id: 'yape', nombre: 'Yape' },
  { id: 'plin', nombre: 'Plin' },
  { id: 'bim', nombre: 'BIM' },
];

