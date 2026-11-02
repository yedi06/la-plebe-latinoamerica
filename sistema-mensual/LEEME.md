# Donación mensual: registro y recordatorio

Quien elige **«Cada mes»** en la web deja su nombre, correo, WhatsApp (opcional), monto y día del
mes. Los datos llegan a una hoja de Google de La Plebe, y el día elegido le llega un correo con el
recordatorio y el número de Yape. No hay débito automático: el donante yapea a mano.

```
Web (formulario) ──► Apps Script ──► Hoja «Donantes»
                          │
                          ├─► Correo de bienvenida al donante + aviso a La Plebe
                          └─► Todos los días 8:00 → recordatorio a quien le toca
```

Mientras no esté instalado, el formulario de la web **igual funciona**: envía el registro por
WhatsApp al 939 647 279.

## Instalación (una sola vez, unos 10 minutos)

Hacerlo con la cuenta **contacto.laplebe@gmail.com**: los correos salen desde ahí.

1. Crear una hoja nueva en [sheets.new](https://sheets.new) y ponerle de nombre
   «La Plebe — Donantes mensuales».
2. En la hoja: **Extensiones → Apps Script**.
3. Borrar lo que haya en `Código.gs` y pegar el contenido de [`Codigo.gs`](Codigo.gs).
4. En el panel izquierdo, **Configuración del proyecto** (engranaje) → marcar
   «Mostrar el archivo de manifiesto appsscript.json». Abrirlo y reemplazarlo por
   [`appsscript.json`](appsscript.json).
5. Arriba, elegir la función **`instalar`** y pulsar **Ejecutar**. Google pedirá permisos
   (hoja, correo y activadores): aceptar. Esto crea la pestaña «Donantes» y programa el
   recordatorio diario.
6. **Implementar → Nueva implementación** → tipo **Aplicación web**:
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier persona**
   - Implementar y **copiar la URL** (termina en `/exec`).
7. Pegar esa URL en `diseno-laplebe/lib/data.ts`, en `MENSUAL.endpoint`, y publicar la web.

Para probar: registrarse desde la web con un correo propio. Debe aparecer la fila en la hoja y
llegar el correo de bienvenida.

## Uso diario

- **Ver donantes:** la pestaña «Donantes» de la hoja. La columna «Estado» dice *Activo* o *Baja*.
- **Pausar a alguien:** cambiar su «Estado» a cualquier cosa distinta de *Activo*.
- **Cambiar monto o día:** editar la celda directamente.
- **Baja:** cada correo trae el enlace «Darme de baja», que marca la fila como *Baja*.

## Límites

- Una cuenta Gmail gratuita puede enviar unos **100 correos al día** con Apps Script. Si los
  donantes mensuales que caen el mismo día superan esa cifra, conviene pasar a Google Workspace o
  a un servicio de correo.
- Si se cambia el código, hay que **Implementar → Gestionar implementaciones → Editar → Nueva
  versión** para que la URL use la versión nueva (la URL no cambia).
