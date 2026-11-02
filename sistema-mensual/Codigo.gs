/**
 * La Plebe Latinoamérica — Donación mensual (registro + recordatorio).
 *
 * Qué hace:
 *  1. Recibe el registro desde la web (doPost) y lo guarda en la hoja «Donantes».
 *  2. Le manda al donante un correo de bienvenida y avisa a La Plebe.
 *  3. Todos los días a las 8:00 (Lima) manda el recordatorio a quienes les toca hoy.
 *  4. Cada correo trae un enlace para darse de baja (doGet?baja=…).
 *
 * Instalación paso a paso: ver LEEME.md en esta misma carpeta.
 */

const CONFIG = {
  HOJA: 'Donantes',
  CORREO_LA_PLEBE: 'contacto.laplebe@gmail.com',
  YAPE: '939 647 279',
  WHATSAPP: '51939647279',
  WEB: 'https://laplebelatam.org/',
  REMITENTE: 'La Plebe Latinoamérica',
};

const COLUMNAS = [
  'Fecha de registro',
  'Nombre',
  'Correo',
  'WhatsApp',
  'Monto (S/)',
  'Día del mes',
  'Estado',
  'Último recordatorio',
  'Token',
  'Origen',
];
const COL = { nombre: 2, correo: 3, monto: 5, dia: 6, estado: 7, ultimo: 8, token: 9 };

/* ------------------------------------------------------------------------- */
/*  Web                                                                       */
/* ------------------------------------------------------------------------- */

function doPost(e) {
  const p = (e && e.parameter) || {};
  const correo = String(p.correo || '').trim().toLowerCase();
  if (!p.nombre || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) return texto('datos incompletos');

  const registro = {
    nombre: limpiar(p.nombre),
    correo: correo,
    whatsapp: limpiar(p.whatsapp),
    monto: Math.max(1, Math.round(Number(p.monto) || 0)),
    dia: Math.min(28, Math.max(1, Math.round(Number(p.dia) || 15))),
    token: Utilities.getUuid(),
  };

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    obtenerHoja().appendRow([
      new Date(),
      registro.nombre,
      registro.correo,
      registro.whatsapp,
      registro.monto,
      registro.dia,
      'Activo',
      '',
      registro.token,
      limpiar(p.origen),
    ]);
  } finally {
    lock.releaseLock();
  }

  enviarCorreo(registro.correo, '¡Ya eres parte de La Plebe cada mes!', plantillaBienvenida(registro));
  MailApp.sendEmail({
    to: CONFIG.CORREO_LA_PLEBE,
    subject: `Nuevo donante mensual: ${registro.nombre} · S/ ${registro.monto}`,
    body:
      `${registro.nombre} se registró para donar S/ ${registro.monto} cada mes.\n` +
      `Correo: ${registro.correo}\nWhatsApp: ${registro.whatsapp || '—'}\n` +
      `Recordatorio: día ${registro.dia} de cada mes.\n\nHoja: ${SpreadsheetApp.getActive().getUrl()}`,
  });

  return texto('ok');
}

/** Enlace de baja que viene en cada correo. */
function doGet(e) {
  const token = e && e.parameter && e.parameter.baja;
  if (!token) return texto('La Plebe Latinoamérica');

  const hoja = obtenerHoja();
  const filas = hoja.getDataRange().getValues();
  for (let i = 1; i < filas.length; i++) {
    if (filas[i][COL.token - 1] === token) {
      hoja.getRange(i + 1, COL.estado).setValue('Baja');
      return pagina(
        'Listo, ya no te enviaremos recordatorios',
        `Gracias por todo lo que aportaste, ${filas[i][COL.nombre - 1]}. Si algún día quieres volver, te esperamos en <a href="${CONFIG.WEB}">nuestra web</a>.`,
      );
    }
  }
  return pagina('No encontramos tu registro', 'Puede que ya te hayas dado de baja. Si tienes dudas, escríbenos por WhatsApp.');
}

/* ------------------------------------------------------------------------- */
/*  Recordatorio diario                                                       */
/* ------------------------------------------------------------------------- */

/** Lo ejecuta el activador todos los días. Manda el recordatorio a quien le toca hoy. */
function enviarRecordatorios() {
  const hoy = new Date();
  const dia = hoy.getDate();
  const clave = Utilities.formatDate(hoy, 'America/Lima', 'yyyy-MM-dd');

  const hoja = obtenerHoja();
  const filas = hoja.getDataRange().getValues();
  let enviados = 0;

  for (let i = 1; i < filas.length; i++) {
    const f = filas[i];
    if (f[COL.estado - 1] !== 'Activo') continue;
    if (Number(f[COL.dia - 1]) !== dia) continue;
    if (String(f[COL.ultimo - 1]).slice(0, 10) === clave) continue; // ya se envió hoy

    const r = {
      nombre: f[COL.nombre - 1],
      correo: f[COL.correo - 1],
      monto: f[COL.monto - 1],
      dia: f[COL.dia - 1],
      token: f[COL.token - 1],
    };
    try {
      enviarCorreo(r.correo, `Hoy toca tu aporte de S/ ${r.monto} 💚`, plantillaRecordatorio(r));
      hoja.getRange(i + 1, COL.ultimo).setValue(clave);
      enviados++;
    } catch (err) {
      console.error(`No se pudo enviar a ${r.correo}: ${err}`);
    }
  }
  console.log(`Recordatorios enviados hoy: ${enviados}`);
}

/** Ejecutar UNA vez después de pegar el código: crea la hoja y el activador diario. */
function instalar() {
  obtenerHoja();
  ScriptApp.getProjectTriggers()
    .filter((t) => t.getHandlerFunction() === 'enviarRecordatorios')
    .forEach((t) => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('enviarRecordatorios').timeBased().everyDays(1).atHour(8).create();
  console.log('Listo: hoja creada y recordatorio diario programado a las 8:00.');
}

/* ------------------------------------------------------------------------- */
/*  Correos                                                                   */
/* ------------------------------------------------------------------------- */

function plantillaBienvenida(r) {
  return marco(
    `¡Gracias, ${primerNombre(r.nombre)}!`,
    `<p>Desde ahora eres parte de quienes sostienen La Plebe cada mes. Tu aporte de <b>S/ ${r.monto}</b> nos permite planificar las brigadas con anticipación.</p>
     <p>El <b>día ${r.dia} de cada mes</b> te escribiremos para recordártelo.</p>
     <p>Si todavía no hiciste tu primer aporte, puedes hacerlo ahora:</p>`,
    r,
  );
}

function plantillaRecordatorio(r) {
  return marco(
    `Hola, ${primerNombre(r.nombre)}`,
    `<p>Hoy es día ${r.dia}: toca tu aporte mensual de <b>S/ ${r.monto}</b> para La Plebe.</p>
     <p>Cada entrega se graba y se publica en nuestro TikTok. Gracias por hacerlo posible.</p>`,
    r,
  );
}

function marco(titulo, cuerpo, r) {
  const wa = `https://wa.me/${CONFIG.WHATSAPP}?text=${encodeURIComponent(
    `Hola La Plebe, acabo de hacer mi aporte mensual de S/ ${r.monto} por Yape. Les envío la captura.`,
  )}`;
  const baja = `${ScriptApp.getService().getUrl()}?baja=${encodeURIComponent(r.token)}`;
  return `
  <div style="background:#F2EFE9;padding:24px 12px;font-family:Arial,Helvetica,sans-serif;color:#0A0A0A">
    <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden">
      <div style="background:#0A0A0A;padding:22px 24px">
        <p style="margin:0;color:#F2EFE9;font-weight:800;letter-spacing:.02em;font-size:13px;text-transform:uppercase">La Plebe Latinoamérica</p>
        <h1 style="margin:14px 0 0;color:#F2EFE9;font-size:24px;line-height:1.1;text-transform:uppercase">${titulo}</h1>
      </div>
      <div style="padding:22px 24px;font-size:15px;line-height:1.55">
        ${cuerpo}
        <div style="margin:18px 0;padding:16px;border:1px solid #e5e0d6;border-radius:12px">
          <p style="margin:0;font-size:12px;color:#4A4A4A">Yapea S/ ${r.monto} al</p>
          <p style="margin:4px 0 0;font-size:26px;font-weight:800;letter-spacing:.01em">${CONFIG.YAPE}</p>
        </div>
        <a href="${wa}" style="display:block;text-align:center;background:#3FA79C;color:#0A0A0A;text-decoration:none;font-weight:800;text-transform:uppercase;padding:14px;border-radius:10px">Enviar captura por WhatsApp</a>
      </div>
      <div style="padding:16px 24px;border-top:1px solid #eee;font-size:11.5px;color:#6b6b6b;line-height:1.5">
        Recibes este correo porque te registraste como donante mensual en <a href="${CONFIG.WEB}" style="color:#15665E">nuestra web</a>.
        <a href="${baja}" style="color:#6b6b6b">Darme de baja</a>.
      </div>
    </div>
  </div>`;
}

function enviarCorreo(para, asunto, html) {
  MailApp.sendEmail({ to: para, subject: asunto, htmlBody: html, name: CONFIG.REMITENTE, replyTo: CONFIG.CORREO_LA_PLEBE });
}

/* ------------------------------------------------------------------------- */
/*  Utilidades                                                                */
/* ------------------------------------------------------------------------- */

function obtenerHoja() {
  const libro = SpreadsheetApp.getActive();
  let hoja = libro.getSheetByName(CONFIG.HOJA);
  if (!hoja) {
    hoja = libro.insertSheet(CONFIG.HOJA);
    hoja.appendRow(COLUMNAS);
    hoja.setFrozenRows(1);
    hoja.getRange(1, 1, 1, COLUMNAS.length).setFontWeight('bold');
  }
  return hoja;
}

/** Evita que un texto del formulario se interprete como fórmula en la hoja. */
function limpiar(v) {
  return String(v || '').trim().replace(/^[=+\-@]+/, '').slice(0, 200);
}

function primerNombre(nombre) {
  return String(nombre || '').trim().split(/\s+/)[0] || '';
}

function texto(t) {
  return ContentService.createTextOutput(t);
}

function pagina(titulo, mensaje) {
  return HtmlService.createHtmlOutput(
    `<div style="font-family:Arial,sans-serif;max-width:480px;margin:60px auto;padding:0 16px;color:#0A0A0A">
       <h2 style="text-transform:uppercase">${titulo}</h2><p style="line-height:1.55">${mensaje}</p></div>`,
  ).setTitle('La Plebe Latinoamérica');
}
