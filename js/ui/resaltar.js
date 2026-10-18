/* ==========================================================
   Resaltado de sintaxis sencillo para HTML y CSS
   ========================================================== */
(function () {
  'use strict';
  var BP = window.BP = window.BP || {};

  function esc(t) { return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  function resaltarHTML(codigo) {
    var re = /(&lt;!--[\s\S]*?--&gt;)|(&lt;\/?)([a-zA-Z][\w-]*)((?:\s+[\w:-]+(?:=(?:"[^"]*"|'[^']*'))?)*)\s*(\/?&gt;)/g;
    return esc(codigo).replace(re, function (m, com, abre, tag, attrs, cierra) {
      if (com) return '<span class="rc">' + com + '</span>';
      var a = attrs.replace(/([\w:-]+)(=)("[^"]*"|'[^']*')?/g, function (x, n, ig, v) {
        return '<span class="ra">' + n + '</span>' + (ig || '') + (v ? '<span class="rv">' + v + '</span>' : '');
      });
      return '<span class="rp">' + abre + '</span><span class="rt">' + tag + '</span>' + a + '<span class="rp">' + cierra + '</span>';
    });
  }

  function resaltarCSS(codigo) {
    var t = esc(codigo);
    t = t.replace(/\/\*[\s\S]*?\*\//g, function (m) { return '\u0001' + m + '\u0002'; });
    t = t.replace(/([^{}\u0001\u0002]+)\{([^{}]*)\}/g, function (m, sel, cuerpo) {
      var c = cuerpo.replace(/([\w-]+)(\s*:\s*)([^;]+)(;?)/g, function (x, p, d, v, pc) {
        return '<span class="ra">' + p + '</span>' + d + '<span class="rv">' + v + '</span>' + pc;
      });
      return '<span class="rt">' + sel + '</span>{' + c + '}';
    });
    return t.replace(/\u0001/g, '<span class="rc">').replace(/\u0002/g, '</span>');
  }

  BP.resaltar = function (codigo, lenguaje) {
    return lenguaje === 'css' ? resaltarCSS(codigo) : resaltarHTML(codigo);
  };
})();
