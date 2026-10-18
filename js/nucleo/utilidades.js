/* ==========================================================
   Utilidades compartidas: eventos, avisos, copiar, descargar
   ========================================================== */
(function () {
  'use strict';
  var BP = window.BP = window.BP || {};

  /* Eventos internos: BP.on('cambio', fn) · BP.emitir('cambio') */
  var oyentes = {};
  BP.on = function (nombre, fn) { (oyentes[nombre] = oyentes[nombre] || []).push(fn); };
  BP.emitir = function (nombre, dato) {
    (oyentes[nombre] || []).forEach(function (fn) {
      try { fn(dato); } catch (e) { console.error('[' + nombre + ']', e); }
    });
  };

  BP.$ = function (id) { return document.getElementById(id); };

  BP.debounce = function (fn, ms) {
    var t;
    return function () {
      var a = arguments, self = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(self, a); }, ms);
    };
  };

  BP.aviso = function (texto) {
    var el = BP.$('aviso');
    el.textContent = texto;
    el.hidden = false;
    clearTimeout(BP.aviso.t);
    BP.aviso.t = setTimeout(function () { el.hidden = true; }, 2200);
  };

  BP.copiar = function (texto, mensaje) {
    function ok() { BP.aviso(mensaje || 'Copiado al portapapeles'); }
    function fallo() { BP.aviso('No se pudo copiar'); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texto).then(ok, function () { copiarAlterno(texto) ? ok() : fallo(); });
    } else {
      copiarAlterno(texto) ? ok() : fallo();
    }
  };
  function copiarAlterno(texto) {
    var a = document.createElement('textarea');
    a.value = texto; a.style.position = 'fixed'; a.style.opacity = '0';
    document.body.appendChild(a); a.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) {}
    a.remove();
    return ok;
  }

  BP.descargar = function (nombre, texto, tipo) {
    var blob = new Blob([texto], { type: (tipo || 'text/html') + ';charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = nombre;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1500);
  };

  /* Nombre legible de un elemento para mostrar en paneles */
  var NOMBRES = {
    h1: 'Título 1', h2: 'Título 2', h3: 'Título 3', h4: 'Título 4', p: 'Párrafo', a: 'Enlace', img: 'Imagen',
    span: 'Texto', strong: 'Texto en negrita', em: 'Texto en cursiva', div: 'Contenedor', section: 'Sección',
    header: 'Cabecera', footer: 'Pie', nav: 'Menú', ul: 'Lista', ol: 'Lista numerada', li: 'Elemento de lista',
    button: 'Botón', input: 'Campo', textarea: 'Área de texto', form: 'Formulario', label: 'Etiqueta',
    details: 'Desplegable', summary: 'Pregunta', hr: 'Línea', article: 'Tarjeta', blockquote: 'Cita',
    figure: 'Figura', figcaption: 'Pie de figura'
  };
  BP.nombreElemento = function (el) {
    if (el.hasAttribute('data-bloque')) {
      var d = BP.bloque(el.getAttribute('data-bloque'));
      return d ? d.nombre : 'Bloque';
    }
    var t = el.tagName.toLowerCase();
    if (el.classList.contains('boton')) return 'Botón';
    return NOMBRES[t] || t;
  };

  /* Elementos que no tienen contenido de texto editable */
  BP.SIN_TEXTO = { img: 1, hr: 1, input: 1, textarea: 1, select: 1, svg: 1, video: 1, iframe: 1, br: 1 };
  BP.EN_LINEA = { a: 1, span: 1, strong: 1, em: 1, b: 1, i: 1, small: 1, code: 1, br: 1, mark: 1, sub: 1, sup: 1, u: 1, s: 1 };
})();
