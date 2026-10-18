/* ==========================================================
   Exportación: genera el HTML y CSS limpios de la página
   ========================================================== */
(function () {
  'use strict';
  var BP = window.BP = window.BP || {};

  var VACIOS = { area: 1, base: 1, br: 1, col: 1, embed: 1, hr: 1, img: 1, input: 1, link: 1, meta: 1, source: 1, track: 1, wbr: 1 };
  var BOOLEANOS = { required: 1, open: 1, checked: 1, disabled: 1, selected: 1, hidden: 1, readonly: 1, multiple: 1, novalidate: 1, autofocus: 1 };

  function esc(t) { return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function escAttr(v) { return v.replace(/&/g, '&amp;').replace(/"/g, '&quot;'); }

  function atributos(el) {
    var s = '';
    for (var i = 0; i < el.attributes.length; i++) {
      var a = el.attributes[i];
      s += ' ' + a.name + ((a.value === '' && BOOLEANOS[a.name]) ? '' : '="' + escAttr(a.value) + '"');
    }
    return s;
  }

  function enLinea(n) {
    if (n.nodeType === 3) return esc(n.textContent);
    if (n.nodeType !== 1) return '';
    var tag = n.tagName.toLowerCase(), ab = '<' + tag + atributos(n) + '>';
    if (VACIOS[tag]) return ab;
    return ab + [].map.call(n.childNodes, enLinea).join('') + '</' + tag + '>';
  }

  /* Convierte un nodo en texto HTML con sangría ordenada */
  function formatear(n, nivel) {
    var pad = new Array(nivel + 1).join('  ');
    if (n.nodeType === 3) {
      var t = n.textContent.replace(/\s+/g, ' ').trim();
      return t ? pad + esc(t) + '\n' : '';
    }
    if (n.nodeType === 8) return pad + '<!--' + n.textContent + '-->\n';
    if (n.nodeType !== 1) return '';
    var tag = n.tagName.toLowerCase(), ab = '<' + tag + atributos(n) + '>';
    if (VACIOS[tag]) return pad + ab + '\n';
    var hijos = [].slice.call(n.childNodes);
    var hayBloque = hijos.some(function (h) { return h.nodeType === 1 && !(BP.EN_LINEA[h.tagName.toLowerCase()] && h.tagName.toLowerCase() !== 'a'); });
    if (!hayBloque) {
      var interior = hijos.map(enLinea).join('').replace(/\s+/g, ' ').trim();
      return pad + ab + interior + '</' + tag + '>\n';
    }
    var out = pad + ab + '\n';
    hijos.forEach(function (h) { out += formatear(h, nivel + 1); });
    return out + pad + '</' + tag + '>\n';
  }

  /* Quita todo lo que pertenece al editor (selección, edición, marcas internas) */
  function limpiarClon(raiz, conservarBloque) {
    var todos = [raiz].concat([].slice.call(raiz.querySelectorAll('*')));
    todos.forEach(function (n) {
      n.classList.remove('bp-sel', 'bp-hover');
      if (n.hasAttribute('class') && !n.getAttribute('class').trim()) n.removeAttribute('class');
      n.removeAttribute('contenteditable');
      if (n.hasAttribute('style') && !n.getAttribute('style').trim()) n.removeAttribute('style');
      if (!conservarBloque) n.removeAttribute('data-bloque');
    });
    return raiz;
  }

  function clonPagina(conservarBloque) {
    var p = BP.lienzo.pagina();
    return limpiarClon(p.cloneNode(true), conservarBloque);
  }

  function bloquesUsados() {
    var vistos = {}, lista = [];
    [].forEach.call(BP.lienzo.pagina().querySelectorAll('[data-bloque]'), function (n) {
      var id = n.getAttribute('data-bloque');
      if (!vistos[id] && BP.bloque(id)) { vistos[id] = 1; lista.push(id); }
    });
    return lista;
  }

  function sangrar(texto, n) {
    var pad = new Array(n + 1).join(' ');
    return texto.split('\n').map(function (l) { return l ? pad + l : l; }).join('\n');
  }

  var X = BP.exportar = {
    formatear: formatear,
    limpiarClon: limpiarClon,
    clonPagina: clonPagina,
    bloquesUsados: bloquesUsados,

    /* HTML de lo que hay dentro de <body> */
    html: function (nivel) {
      var clon = clonPagina(false), out = '';
      [].forEach.call(clon.childNodes, function (h) { out += formatear(h, nivel || 0); });
      return out.replace(/\s+$/, '') + '\n';
    },

    /* CSS: tema + base + solo los bloques que se usan */
    css: function () {
      var partes = ['/* Tema */\n' + BP.temaCSS(), '/* Base */\n' + BP.baseCSS];
      bloquesUsados().forEach(function (id) {
        var b = BP.bloque(id);
        partes.push('/* ' + b.nombre + ' */\n' + b.css);
      });
      return partes.join('\n\n') + '\n';
    },

    /* Documento completo listo para guardar como .html */
    documento: function () {
      var titulo = (BP.tema.titulo || 'Mi página');
      return '<!DOCTYPE html>\n<html lang="es">\n<head>\n' +
        '  <meta charset="UTF-8">\n' +
        '  <meta name="viewport" content="width=device-width, initial-scale=1">\n' +
        '  <title>' + esc(titulo) + '</title>\n' +
        '  <style>\n' + sangrar(X.css().replace(/\s+$/, ''), 4) + '\n  </style>\n' +
        '</head>\n<body>\n' + X.html(1) + '</body>\n</html>\n';
    },

    /* HTML / CSS de un solo bloque de la biblioteca (para "Ver código") */
    bloqueHTML: function (def) {
      var t = document.createElement('template');
      t.innerHTML = def.html.trim();
      var out = '';
      [].forEach.call(t.content.childNodes, function (h) { out += formatear(h, 0); });
      return out;
    },
    bloqueCSS: function (def) { return def.css + '\n'; }
  };
})();
