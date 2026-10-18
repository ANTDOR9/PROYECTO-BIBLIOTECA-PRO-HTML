/* ==========================================================
   Historial: deshacer y rehacer
   ========================================================== */
(function () {
  'use strict';
  var BP = window.BP = window.BP || {};

  var pila = [], pos = -1, MAX = 100, enLote = false;

  function foto() {
    return JSON.stringify({ html: BP.lienzo.htmlPersistente(), tema: BP.tema });
  }
  function avisar() { BP.emitir('historial', { deshacer: pos > 0, rehacer: pos < pila.length - 1 }); }

  BP.historial = {
    /* Empieza de cero con el estado actual como punto de partida */
    reiniciar: function () { pila = [foto()]; pos = 0; avisar(); },

    /* Guarda el estado actual (si cambió respecto al último) */
    registrar: function () {
      if (enLote) return;
      var f = foto();
      if (pila[pos] === f) return;
      pila = pila.slice(0, pos + 1);
      pila.push(f);
      if (pila.length > MAX) pila.shift();
      pos = pila.length - 1;
      avisar();
    },

    /* Mientras dura un lote, los cambios no crean pasos propios: el llamador registra uno solo al final */
    lote: function (activo) { enLote = !!activo; },

    deshacer: function () {
      if (pos <= 0) return;
      pos--; BP.lienzo.restaurar(JSON.parse(pila[pos])); avisar();
    },
    rehacer: function () {
      if (pos >= pila.length - 1) return;
      pos++; BP.lienzo.restaurar(JSON.parse(pila[pos])); avisar();
    }
  };
})();
