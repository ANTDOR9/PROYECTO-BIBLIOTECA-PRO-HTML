/* ==========================================================
   Acciones de la IA: el "idioma" común entre cualquier modelo
   (Constructor, Intérprete…) y el editor.

   Un plan es un JSON:  { "acciones": [ { "accion": "...", ... } ] }

   - El modelo NUNCA toca el HTML directamente: solo pide acciones.
   - Cada acción se valida antes de ejecutarse.
   - Todo el plan se aplica como UN solo paso del historial
     (un Ctrl+Z lo deshace completo).
   ========================================================== */
(function () {
  'use strict';
  var BP = window.BP = window.BP || {};
  var IA = BP.ia = BP.ia || {};

  var MAX_ACCIONES = 30;

  var PERMITIDAS = ['color', 'background-color', 'font-size', 'font-weight', 'font-style', 'text-align', 'text-transform',
    'letter-spacing', 'line-height', 'padding', 'padding-top', 'padding-bottom', 'padding-left', 'padding-right',
    'margin', 'margin-top', 'margin-bottom', 'border-radius', 'border', 'width', 'max-width', 'min-height', 'height',
    'opacity', 'gap', 'object-fit'];
  var ALIAS = { fondo: 'background-color', 'color-fondo': 'background-color', background: 'background-color',
    'color-texto': 'color', 'tamano-fuente': 'font-size', 'tamaño-fuente': 'font-size', 'tamano-letra': 'font-size',
    'tamaño-letra': 'font-size', alineacion: 'text-align', 'alineación': 'text-align', relleno: 'padding', margen: 'margin',
    'radio-borde': 'border-radius', ancho: 'width', alto: 'height', opacidad: 'opacity' };

  function norm(t) { return String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim(); }
  function corto(t, n) { t = String(t || '').replace(/\s+/g, ' ').trim(); return t.length > (n || 40) ? t.slice(0, (n || 40) - 1) + '…' : t; }
  function camel(k) { return k.replace(/-([a-z])/g, function (m, c) { return c.toUpperCase(); }); }
  function valorSeguro(v) { return (typeof v === 'string' || typeof v === 'number') && String(v).length <= 80 && !/[;{}<>]|url\(|expression|javascript:|@import/i.test(String(v)); }
  function hexOk(v) { return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(String(v)); }
  function hex6(v) { v = String(v).toLowerCase(); return v.length === 4 ? '#' + v[1] + v[1] + v[2] + v[2] + v[3] + v[3] : v; }
  function urlImagenOk(u) { return typeof u === 'string' && u.length < 2000000 && (/^https?:\/\//i.test(u) || /^data:image\/(png|jpe?g|gif|webp|svg\+xml);/i.test(u)); }
  function urlEnlaceOk(u) { return typeof u === 'string' && u.length < 500 && !/^\s*(javascript|data|vbscript):/i.test(u) && /^(https?:\/\/|#|mailto:|tel:|\/|\.\/|\.\.\/|[\w-]+(\.[\w-]+)*(\/|$))/i.test(u.trim()); }

  /* ---------- Contexto que se le entrega al modelo ---------- */
  function resumenBloque(b, i) {
    var def = BP.bloque(b.dataset.bloque), textos = [];
    [].forEach.call(b.querySelectorAll('h1,h2,h3,h4,p,a,button,li,span,figcaption,label,strong'), function (el) {
      if (!el.children.length && textos.length < 12) { var t = corto(el.textContent, 60); if (t) textos.push(t); }
    });
    return { n: i + 1, id: b.dataset.bloque, nombre: def ? def.nombre : b.dataset.bloque, textos: textos, imagenes: b.querySelectorAll('img').length };
  }
  function bloqueN(el) { var b = BP.lienzo.bloqueDe(el); return b ? BP.lienzo.bloques().indexOf(b) + 1 : 0; }

  IA.contexto = function () {
    var s = BP.lienzo.seleccionado(), sel = null;
    if (s) sel = { bloque: bloqueN(s), etiqueta: s.tagName.toLowerCase(), texto: corto(s.textContent, 80) };
    var disponibles = BP.bloques.concat(BP.bloquesPro || []).map(function (b) {
      return { id: b.id, nombre: b.nombre, categoria: b.categoria, descripcion: b.descripcion };
    });
    return {
      pagina: BP.lienzo.bloques().map(resumenBloque),
      seleccionado: sel,
      tema: Object.assign({}, BP.tema),
      fuentes: Object.keys(BP.fuentes),
      bloquesDisponibles: disponibles
    };
  };

  /* ---------- Localizar elementos ---------- */
  function resolver(o) {
    var bl = BP.lienzo.bloques();
    if (o === 'seleccionado' || o == null) {
      var s = BP.lienzo.seleccionado();
      if (!s) throw new Error('no hay ningún elemento seleccionado');
      return s;
    }
    if (typeof o === 'number') o = { bloque: o };
    if (typeof o !== 'object') throw new Error('objetivo no válido');
    var b = bl[(o.bloque | 0) - 1];
    if (!b) throw new Error('no existe el bloque ' + o.bloque);
    var idx = o.indice | 0, el = b;
    if (o.selector) {
      var lista;
      try { lista = b.querySelectorAll(String(o.selector)); } catch (e) { throw new Error('selector no válido «' + o.selector + '»'); }
      el = lista[idx];
      if (!el) throw new Error('no encontré «' + o.selector + '» en el bloque ' + o.bloque);
    } else if (o.texto) {
      var q = norm(o.texto);
      var coin = [].slice.call(b.querySelectorAll('*')).filter(function (e) { return !BP.SIN_TEXTO[e.tagName.toLowerCase()] && norm(e.textContent).indexOf(q) !== -1; });
      var hondos = coin.filter(function (e) { return ![].some.call(e.children, function (c) { return coin.indexOf(c) !== -1; }); });
      el = hondos[idx];
      if (!el) throw new Error('no encontré el texto «' + corto(o.texto, 30) + '» en el bloque ' + o.bloque);
    }
    return el;
  }
  function describir(el) {
    var n = bloqueN(el), b = BP.lienzo.bloqueDe(el);
    if (el === b) return 'el bloque ' + n + ' («' + (BP.bloque(el.dataset.bloque) || {}).nombre + '»)';
    var t = corto(el.textContent, 28);
    return (el.tagName === 'IMG' ? 'la imagen' : 'el elemento') + (t ? ' «' + t + '»' : '') + ' del bloque ' + n;
  }
  function del(t) { return t.replace(/^el /, 'del '); }
  function posTexto(p) { return p == null || p === 'final' ? 'al final' : p === 'inicio' ? 'al inicio' : 'en la posición ' + p; }
  function validarPos(p) {
    if (p == null || p === 'final' || p === 'inicio') return;
    if (!(Number.isInteger(p) && p >= 1)) throw new Error('posición no válida (usa "inicio", "final" o un número desde 1)');
  }
  function destino(p, largo, maxIdx) {
    if (p == null || p === 'final') return maxIdx;
    if (p === 'inicio') return 0;
    return Math.min(Math.max(p - 1, 0), maxIdx);
  }

  /* ---------- Definición de cada acción ---------- */
  var ACC = {
    agregar_bloque: {
      doc: '{"accion":"agregar_bloque","id":"<id del catálogo>","posicion":"inicio"|"final"|<número desde 1>}',
      preparar: function (a) {
        var d = BP.bloque(a.id);
        if (!d) throw new Error('el bloque «' + a.id + '» no existe en la biblioteca');
        validarPos(a.posicion);
        return { d: d };
      },
      resumen: function (a, c) { return 'Agregar «' + c.d.nombre + '» ' + posTexto(a.posicion); },
      ejecutar: function (a, c) {
        var n = BP.lienzo.bloques().length;
        BP.lienzo.agregarBloque(a.id, a.posicion == null || a.posicion === 'final' ? n : destino(a.posicion, n, n));
      }
    },
    mover_bloque: {
      doc: '{"accion":"mover_bloque","bloque":<n actual>,"a":"inicio"|"final"|<posición final desde 1>}',
      preparar: function (a) { validarPos(a.a); if (a.a == null) throw new Error('falta "a" (la nueva posición)'); return { el: resolver({ bloque: a.bloque }) }; },
      resumen: function (a, c) { return 'Mover ' + describir(c.el) + ' ' + posTexto(a.a); },
      ejecutar: function (a, c) {
        var hijos = BP.lienzo.bloques(), desde = hijos.indexOf(c.el);
        var p = destino(a.a, hijos.length, hijos.length - 1);
        if (p === desde) return;
        BP.lienzo.moverBloqueIndice(desde, p > desde ? p + 1 : p);
      }
    },
    duplicar_bloque: {
      doc: '{"accion":"duplicar_bloque","bloque":<n>}',
      preparar: function (a) { return { el: resolver({ bloque: a.bloque }) }; },
      resumen: function (a, c) { return 'Duplicar ' + describir(c.el); },
      ejecutar: function (a, c) { BP.lienzo.duplicar(c.el); }
    },
    eliminar_bloque: {
      doc: '{"accion":"eliminar_bloque","bloque":<n>}',
      preparar: function (a) { return { el: resolver({ bloque: a.bloque }) }; },
      resumen: function (a, c) { return 'Eliminar ' + describir(c.el); },
      ejecutar: function (a, c) { BP.lienzo.eliminar(c.el); }
    },
    cambiar_texto: {
      doc: '{"accion":"cambiar_texto","objetivo":<objetivo>,"texto":"..."}',
      preparar: function (a) {
        var el = resolver(a.objetivo);
        if (typeof a.texto !== 'string' || a.texto.length > 2000) throw new Error('"texto" debe ser un texto de hasta 2000 caracteres');
        if (BP.SIN_TEXTO[el.tagName.toLowerCase()]) throw new Error('ese elemento no contiene texto');
        if (el.children.length) throw new Error('ese elemento contiene otros elementos; apunta al texto exacto');
        return { el: el };
      },
      resumen: function (a, c) { return 'Cambiar el texto ' + del(describir(c.el)) + ' por «' + corto(a.texto, 40) + '»'; },
      ejecutar: function (a, c) { c.el.textContent = a.texto; }
    },
    cambiar_estilo: {
      doc: '{"accion":"cambiar_estilo","objetivo":<objetivo>,"estilos":{"color":"#fff","font-size":"2rem",...}}',
      preparar: function (a) {
        var el = resolver(a.objetivo), est = {};
        if (!a.estilos || typeof a.estilos !== 'object') throw new Error('falta "estilos"');
        Object.keys(a.estilos).forEach(function (k) {
          var kk = String(k).toLowerCase().replace(/[_\s]/g, '-'); kk = ALIAS[kk] || kk;
          if (PERMITIDAS.indexOf(kk) === -1) throw new Error('propiedad no permitida «' + k + '»');
          var v = a.estilos[k];
          if (v !== '' && v != null && !valorSeguro(v)) throw new Error('valor no válido para «' + k + '»');
          est[kk] = v === '' ? null : String(v);
        });
        if (!Object.keys(est).length) throw new Error('"estilos" está vacío');
        return { el: el, est: est };
      },
      resumen: function (a, c) {
        return 'Cambiar el estilo ' + del(describir(c.el)) + ': ' + Object.keys(c.est).map(function (k) { return k + ' → ' + (c.est[k] == null ? 'quitar' : c.est[k]); }).join(', ');
      },
      ejecutar: function (a, c) { Object.keys(c.est).forEach(function (k) { BP.lienzo.estilo(c.el, camel(k), c.est[k]); }); }
    },
    poner_imagen: {
      doc: '{"accion":"poner_imagen","objetivo":<objetivo de una imagen>,"url":"https://...","alt":"descripción"}',
      preparar: function (a) {
        var el = resolver(a.objetivo);
        if (el.tagName !== 'IMG') throw new Error('ese elemento no es una imagen (apunta a una imagen existente con "selector":"img")');
        if (!urlImagenOk(a.url)) throw new Error('la dirección de la imagen no es válida (solo http/https o imagen incrustada)');
        if (a.alt != null && (typeof a.alt !== 'string' || a.alt.length > 200)) throw new Error('"alt" no válido');
        return { el: el };
      },
      resumen: function (a, c) { return 'Poner una imagen nueva en ' + describir(c.el); },
      ejecutar: function (a, c) { c.el.setAttribute('src', a.url); if (a.alt != null) c.el.setAttribute('alt', a.alt); }
    },
    cambiar_enlace: {
      doc: '{"accion":"cambiar_enlace","objetivo":<objetivo>,"href":"https://..."}',
      preparar: function (a) {
        var el = resolver(a.objetivo), enl = el.closest('a');
        if (!enl) throw new Error('ese elemento no es un enlace ni está dentro de uno');
        if (!urlEnlaceOk(a.href)) throw new Error('la dirección del enlace no es válida');
        return { el: enl };
      },
      resumen: function (a, c) { return 'Cambiar el enlace ' + del(describir(c.el)) + ' a ' + corto(a.href, 40); },
      ejecutar: function (a, c) { c.el.setAttribute('href', a.href); }
    },
    cambiar_tema: {
      doc: '{"accion":"cambiar_tema","primario":"#hex","secundario":"#hex","fondo":"#hex","texto":"#hex","fuente":"<clave>","radio":0-32,"titulo":"..."}',
      preparar: function (a) {
        var t = {};
        ['primario', 'secundario', 'fondo', 'texto'].forEach(function (k) {
          if (a[k] == null) return;
          if (!hexOk(a[k])) throw new Error('el color «' + k + '» debe ser hexadecimal (#rrggbb)');
          t[k] = hex6(a[k]);
        });
        if (a.fuente != null) { if (!BP.fuentes[a.fuente]) throw new Error('fuente desconocida «' + a.fuente + '» (usa: ' + Object.keys(BP.fuentes).join(', ') + ')'); t.fuente = a.fuente; }
        if (a.radio != null) { if (!(typeof a.radio === 'number' && a.radio >= 0 && a.radio <= 32)) throw new Error('"radio" debe estar entre 0 y 32'); t.radio = Math.round(a.radio); }
        if (a.titulo != null) { if (typeof a.titulo !== 'string' || a.titulo.length > 120) throw new Error('"titulo" no válido'); t.titulo = a.titulo; }
        if (!Object.keys(t).length) throw new Error('no indicas ningún cambio de tema');
        return { t: t };
      },
      resumen: function (a, c) { return 'Cambiar el tema: ' + Object.keys(c.t).map(function (k) { return k + ' → ' + c.t[k]; }).join(', '); },
      ejecutar: function (a, c) { Object.assign(BP.tema, c.t); BP.lienzo.aplicarTema(); }
    }
  };

  /* Texto de guía para incluir en el prompt de cualquier modelo */
  IA.guia = function () {
    return 'Responde SOLO con un JSON {"acciones":[...]}. Acciones disponibles:\n' +
      Object.keys(ACC).map(function (k) { return '- ' + ACC[k].doc; }).join('\n') +
      '\nUn <objetivo> es "seleccionado" o {"bloque":<n>,"selector":"h2","indice":0} o {"bloque":<n>,"texto":"texto que contiene"}. ' +
      'Los números de bloque se refieren al orden ACTUAL de la página al recibir tu respuesta; "posicion"/"a" se evalúan en el momento de ejecutar cada paso.';
  };

  /* ---------- Validar un plan ---------- */
  function extraer(plan) {
    if (typeof plan === 'string') {
      var t = plan.trim(), m = t.match(/```(?:json)?\s*([\s\S]*?)```/i);
      if (m) t = m[1].trim();
      try { plan = JSON.parse(t); } catch (e) { throw new Error('el JSON no es válido: ' + e.message); }
    }
    if (Array.isArray(plan)) plan = { acciones: plan };
    if (!plan || !Array.isArray(plan.acciones)) throw new Error('el plan debe tener una lista "acciones"');
    if (plan.acciones.length > MAX_ACCIONES) throw new Error('demasiadas acciones (máximo ' + MAX_ACCIONES + ')');
    return plan.acciones;
  }

  /* Devuelve { items:[{ resumen, error, ctx, a, def }], validas } */
  IA.validar = function (plan) {
    var lista = extraer(plan), items = [];
    lista.forEach(function (a, i) {
      var it = { a: a, resumen: '', error: null };
      try {
        if (!a || typeof a !== 'object') throw new Error('acción no válida');
        var def = ACC[a.accion];
        if (!def) throw new Error('acción desconocida «' + a.accion + '»');
        it.def = def; it.ctx = def.preparar(a); it.resumen = def.resumen(a, it.ctx);
      } catch (e) {
        it.error = e.message; it.resumen = 'Acción ' + (i + 1) + (a && a.accion ? ' (' + a.accion + ')' : '');
      }
      items.push(it);
    });
    return { items: items, validas: items.filter(function (i) { return !i.error; }).length };
  };

  /* Ejecuta las acciones válidas como UN solo paso del historial */
  IA.aplicar = function (res) {
    var hechas = 0, fallos = [];
    BP.historial.lote(true);
    try {
      res.items.forEach(function (it) {
        if (it.error) return;
        try { it.def.ejecutar(it.a, it.ctx); hechas++; } catch (e) { fallos.push(it.resumen + ': ' + e.message); }
      });
      BP.lienzo.vivo();
    } finally {
      BP.historial.lote(false);
    }
    BP.lienzo.confirmar();
    return { hechas: hechas, fallos: fallos };
  };

  IA.proveedores = IA.proveedores || {};   /* constructor / interprete se registran en pasos siguientes */
})();
