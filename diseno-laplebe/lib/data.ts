/**
 * Fuente única de contenido de la landing.
 *
 * ⚠️ TODO CLIENTE: los campos marcados con `PENDIENTE` son datos reales que debe
 * entregar La Plebe (números de Yape/Plin, cuentas y CCI, links de pasarela y PayPal).
 * Están escritos con el formato correcto para que el diseño se vea tal cual saldrá
 * en producción; solo hay que reemplazar el valor.
 */

export const BRAND = {
  nombre: 'La Plebe Latinoamérica',
  handle: '@la.plebe_latinoamerica',
  tiktok: 'https://www.tiktok.com/@la.plebe_latinoamerica',
  claim: 'Donde otros no llegan, nosotros sí.',
  mision:
    'Plataforma de ayuda social y movilización comunitaria que documenta historias reales y entrega asistencia directa en comedores populares, asentamientos y zonas extremas del Perú.',
  misionCorta: 'Ayuda directa y documentada en las zonas más alejadas del Perú.',
  email: 'contacto.laplebe@gmail.com',
  whatsapp: '+51 9XX XXX XXX', // PENDIENTE
  whatsappLink: 'https://wa.me/519XXXXXXXX', // PENDIENTE
  cobertura: 'Lima & Provincias / LATAM',
} as const;

/* -------------------------------------------------------------------------- */
/*  Frentes de ayuda — textos literales del kit media (lámina 3)               */
/* -------------------------------------------------------------------------- */

export type Frente = {
  id: 'alimentacion' | 'medico' | 'educacion';
  nombre: string;
  nombreCorto: string;
  descripcion: string;
  /** Línea de impacto: qué compra una donación concreta. PENDIENTE de validar con el cliente. */
  impacto: string;
  montoAncla: number;
  /** Avance de la campaña vigente. PENDIENTE: conectar a datos reales. */
  meta: number;
  recaudado: number;
  icono: 'olla' | 'corazon' | 'birrete';
  /** Texto de la etiqueta del espacio reservado para foto/video. */
  medioLabel: string;
};

export const FRENTES: Frente[] = [
  {
    id: 'alimentacion',
    nombre: 'Alimentación & Ollas Comunes',
    nombreCorto: 'Alimentación',
    descripcion:
      'Abastecimiento de víveres no perecibles, raciones y cocinas solidarias.',
    impacto: 'S/ 25 = 10 raciones calientes servidas en una olla común',
    montoAncla: 25,
    meta: 18000,
    recaudado: 11240,
    icono: 'olla',
    medioLabel: 'Espacio para foto — frente Alimentación & Ollas Comunes',
  },
  {
    id: 'medico',
    nombre: 'Casos Médicos & Emergencias',
    nombreCorto: 'Casos médicos',
    descripcion:
      'Medicinas, pañales, sillas de ruedas y apoyo a adultos mayores o niños.',
    impacto: 'S/ 60 = un mes de medicinas para un adulto mayor',
    montoAncla: 60,
    meta: 24000,
    recaudado: 9860,
    icono: 'corazon',
    medioLabel: 'Espacio para foto — frente Casos Médicos & Emergencias',
  },
  {
    id: 'educacion',
    nombre: 'Educación & Bienestar Infantil',
    nombreCorto: 'Educación',
    descripcion:
      'Kits escolares, abrigo, calzado e implementación de espacios comunitarios.',
    impacto: 'S/ 40 = un kit escolar completo + abrigo para un niño',
    montoAncla: 40,
    meta: 15000,
    recaudado: 12310,
    icono: 'birrete',
    medioLabel: 'Espacio para foto — frente Educación & Bienestar Infantil',
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
 * Qué compra un monto, sin pedirle al donante que elija categoría.
 * PENDIENTE: las equivalencias las tiene que validar el cliente.
 */
export function impactoGeneral(monto: number): string {
  if (monto < 25) return `${Math.max(1, Math.floor(monto / 2.5))} raciones calientes`;
  if (monto < 40) return `${Math.floor(monto / 2.5)} raciones calientes`;
  if (monto < 60) return `un kit escolar completo`;
  if (monto < 150) return `un mes de medicinas para un adulto mayor`;
  return `el abastecimiento de una olla común por una semana`;
}

export const MONTOS_UNICO = [20, 50, 100, 250] as const;
export const MONTOS_MENSUAL = [10, 25, 50, 100] as const;

export function impactoDeMonto(monto: number, frenteId: Frente['id']): string {
  const f = FRENTES.find((x) => x.id === frenteId)!;
  const veces = Math.max(1, Math.floor(monto / f.montoAncla));
  switch (frenteId) {
    case 'alimentacion':
      return `≈ ${veces * 10} raciones calientes`;
    case 'medico':
      return `≈ ${veces} ${veces === 1 ? 'mes' : 'meses'} de medicinas`;
    case 'educacion':
      return `≈ ${veces} ${veces === 1 ? 'kit escolar' : 'kits escolares'} completos`;
  }
}

/* -------------------------------------------------------------------------- */
/*  Medios de donación                                                         */
/* -------------------------------------------------------------------------- */

export type Billetera = {
  id: 'yape' | 'plin' | 'qr';
  nombre: string;
  numero: string;
  titular: string;
  color: string;
  nota: string;
};

export const BILLETERAS: Billetera[] = [
  {
    id: 'yape',
    nombre: 'Yape',
    numero: '9XX XXX XXX', // PENDIENTE
    titular: 'La Plebe Latinoamérica',
    color: '#742384',
    nota: 'Escanea el QR o yapea al número',
  },
  {
    id: 'plin',
    nombre: 'Plin',
    numero: '9XX XXX XXX', // PENDIENTE
    titular: 'La Plebe Latinoamérica',
    color: '#00A9E0',
    nota: 'Escanea el QR o plinea al número',
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
    cuenta: '191-XXXXXXX-0-XX', // PENDIENTE
    cci: '002-191-XXXXXXXXXXXX-XX', // PENDIENTE
  },
  {
    id: 'bbva',
    nombre: 'BBVA',
    color: '#0B5EA8',
    moneda: 'Soles',
    cuenta: '0011-XXXX-XXXXXXXXXX-XX', // PENDIENTE
    cci: '011-XXX-XXXXXXXXXXXXX-XX', // PENDIENTE
  },
  {
    id: 'interbank',
    nombre: 'Interbank',
    color: '#00A64F',
    moneda: 'Soles',
    cuenta: '200-XXXXXXXXXX', // PENDIENTE
    cci: '003-200-XXXXXXXXXXXX-XX', // PENDIENTE
  },
  {
    id: 'banbif',
    nombre: 'BanBif',
    color: '#00693C',
    moneda: 'Soles',
    cuenta: '000-XXXXXXX-XXX', // PENDIENTE
    cci: '038-000-XXXXXXXXXXXX-XX', // PENDIENTE
  },
  {
    id: 'scotiabank',
    nombre: 'Scotiabank',
    color: '#DA291C',
    moneda: 'Soles',
    cuenta: '000-XXXXXXX', // PENDIENTE
    cci: '009-000-XXXXXXXXXXXX-XX', // PENDIENTE
  },
];

export type Pasarela = {
  id: string;
  nombre: string;
  descripcion: string;
};

/** El cliente elige una. Las 3 quedan como placeholder de logo en el diseño. */
export const PASARELAS: Pasarela[] = [
  { id: 'izipay', nombre: 'Izipay', descripcion: 'Visa · Mastercard · Amex · Diners' },
  { id: 'niubiz', nombre: 'Niubiz', descripcion: 'Visa · Mastercard · Yape integrado' },
  { id: 'mercadopago', nombre: 'Mercado Pago', descripcion: 'Tarjetas · Cuotas · Wallet' },
];

/* -------------------------------------------------------------------------- */
/*  Modalidades corporativas — lámina 4 del kit                                */
/* -------------------------------------------------------------------------- */

export type Modalidad = {
  titulo: string;
  aporte: string;
  retorno: string;
};

export const MODALIDADES: Modalidad[] = [
  {
    titulo: 'Canje Solidario en Especie',
    aporte:
      'Alimentos, insumos de primera necesidad, abrigo, medicamentos o materiales.',
    retorno:
      'Mención orgánica en el video, empaque visible en la entrega y etiqueta oficial en descripción y comentario fijado.',
  },
  {
    titulo: 'Partner Logístico Operativo',
    aporte: 'Cobertura de movilidad, combustible, transporte de carga o viáticos de la brigada.',
    retorno:
      'Branding en indumentaria del equipo ("Llegamos gracias a [Marca]"), mención de apertura y créditos institucionales.',
  },
  {
    titulo: 'Campaña Integral RSE Co-Branded',
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
  icono: 'olla' | 'corazon' | 'birrete' | 'rayo' | 'repetir' | 'maletin' | 'play';
  /** Si se define, la tarjeta muestra una miniatura con este texto de espacio reservado. */
  medioLabel?: string;
};

export const TARJETAS: TarjetaAccion[] = [
  {
    id: 'rapida',
    titulo: 'Donar ahora',
    bajada: 'Yape, Plin, transferencia, tarjeta o PayPal.',
    destacada: true,
    accion: 'donar',
    icono: 'rayo',
  },
  {
    id: 'mensual',
    titulo: 'Donar cada mes',
    bajada: 'Desde S/ 10. Es lo que nos permite planificar las brigadas.',
    accion: 'donar',
    monto: 25,
    icono: 'repetir',
  },
  {
    id: 'alimentacion',
    titulo: 'Alimentación & Ollas Comunes',
    bajada: 'S/ 25 = 10 raciones calientes.',
    accion: 'donar',
    frente: 'alimentacion',
    monto: 25,
    icono: 'olla',
  },
  {
    id: 'medico',
    titulo: 'Casos Médicos & Emergencias',
    bajada: 'S/ 60 = un mes de medicinas.',
    accion: 'donar',
    frente: 'medico',
    monto: 60,
    icono: 'corazon',
  },
  {
    id: 'educacion',
    titulo: 'Educación & Bienestar Infantil',
    bajada: 'S/ 40 = un kit escolar completo.',
    accion: 'donar',
    frente: 'educacion',
    monto: 40,
    icono: 'birrete',
  },
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
export const TIKTOKS: { url: string; etiqueta: string }[] = [
  {
    // "Ella dormía sobre tablas. HOY NO."
    url: 'https://www.tiktok.com/@la.plebe_latinoamerica/video/7619125416548207892',
    etiqueta: 'Dormía sobre tablas — entrega de cama',
  },
  {
    // Abuelita: víveres, camas y enseres para su casa.
    url: 'https://www.tiktok.com/@la.plebe_latinoamerica/video/7617278794218425621',
    etiqueta: 'Víveres y camas para una abuelita',
  },
  {
    // "No podemos borrar el dolor, pero sí acompañar."
    url: 'https://www.tiktok.com/@la.plebe_latinoamerica/video/7592757314331872520',
    etiqueta: 'Acompañamiento en el duelo',
  },
  {
    // Caso del señor Nimer: salud y estudios de sus hijos.
    url: 'https://www.tiktok.com/@la.plebe_latinoamerica/video/7660350415162101012',
    etiqueta: 'Caso del señor Nimer — apoyo en curso',
  },
];

/* -------------------------------------------------------------------------- */
/*  Quiénes somos                                                              */
/* -------------------------------------------------------------------------- */

/** Hitos de la historia. PENDIENTE: fechas y cifras reales del cliente. */
export const HISTORIA = [
  {
    año: '2023',
    titulo: 'Empezó con un celular',
    texto:
      'Dos amigos grabando lo que veían en su propio barrio. Sin presupuesto, sin equipo y sin plan: solo mostrar lo que nadie mostraba.',
  },
  {
    año: '2024',
    titulo: 'La comunidad se sumó',
    texto:
      'Los comentarios se volvieron donaciones y las donaciones, entregas. Nació la regla que seguimos hasta hoy: todo lo que entra se muestra en video.',
  },
  {
    año: '2025',
    titulo: 'Salimos de Lima',
    texto:
      'Primeras brigadas a provincias. Comedores populares, asentamientos y comunidades a horas de la carretera más cercana.',
  },
  {
    año: 'Hoy',
    titulo: 'Tres frentes activos',
    texto:
      'Alimentación, casos médicos y educación. Cada campaña cierra con acta de entrega y evidencia audiovisual publicada.',
  },
];

/** Las tres promesas que sostienen la confianza. */
export const PROMESAS = [
  {
    titulo: 'Todo se graba',
    texto: 'Cada entrega se publica en el canal. Si no está en video, no pasó.',
  },
  {
    titulo: 'Acta de entrega',
    texto: 'Cantidad exacta de lo distribuido, con balance fotográfico.',
  },
  {
    titulo: 'Sin morbo',
    texto: 'Storytelling que dignifica a las personas, nunca que las expone.',
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
  'applepay', 'googlepay', 'transferencia', 'pagoefectivo',
];

export const LOGOS_BILLETERAS = [
  { id: 'yape', nombre: 'Yape' },
  { id: 'plin', nombre: 'Plin' },
  { id: 'bim', nombre: 'BIM' },
];

export const LOGOS_TARJETAS = [
  { id: 'visa', nombre: 'Visa' },
  { id: 'mastercard', nombre: 'Mastercard' },
  { id: 'amex', nombre: 'American Express' },
  { id: 'diners', nombre: 'Diners Club' },
];

export const LOGOS_INTERNACIONAL = [
  { id: 'applepay', nombre: 'Apple Pay' },
  { id: 'googlepay', nombre: 'Google Pay' },
];

/* -------------------------------------------------------------------------- */
/*  Las 3 propuestas (para el índice)                                          */
/* -------------------------------------------------------------------------- */

export const PROPUESTAS = [
  {
    slug: 'v1',
    numero: '01',
    nombre: 'Paginada',
    lema: 'La rueda salta de pantalla',
    navegacion: 'Rueda / swipe / teclado',
    resumen:
      'Cuatro pantallas completas. La rueda del mouse, el swipe o las flechas del teclado saltan de una a otra. No existe el scroll de página.',
    modo: 'Claro — papel crema',
  },
  {
    slug: 'v2',
    numero: '02',
    nombre: 'Scroll natural',
    lema: 'Un solo recorrido, sin trucos',
    navegacion: 'Scroll normal',
    resumen:
      'La única que se recorre hacia abajo como una página cualquiera. Corta: portada, acciones, frentes, cuentas y empresas.',
    modo: 'Oscuro — negro de marca',
  },
  {
    slug: 'v3',
    numero: '03',
    nombre: 'Cortina',
    lema: 'Índice numerado y barrido de marca',
    navegacion: 'Índice + transición de cortina',
    resumen:
      'Índice numerado a un lado. Al elegir una sección, una cortina de marca barre la pantalla, cambia el contenido debajo y se retira por el otro lado.',
    modo: 'Oscuro — editorial',
  },
] as const;
