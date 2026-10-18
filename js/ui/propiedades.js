/* ==========================================================
   Propiedades: panel derecho para modificar lo seleccionado
   ----------------------------------------------------------
   - Con un elemento seleccionado: contenido, texto, fondo,
     borde, espaciado y tamaño.
   - Sin selección: tema general de la página.
   ========================================================== */
(function () {
  'use strict';
  var BP = window.BP = window.BP || {};

  var cont, contador = 0, abiertos = { 'Contenido': true, 'Texto': true, 'Fondo y borde': true, 'Espaciado': false, 'Tamaño': false };

  /* ---------- Ayudas ---------- */
  function e(tag, cls, txt) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (txt != null) n.textContent = txt;
    return n;
  }
  function boton(txt, cls, fn, titulo) {
    var b = e('button', cls, txt); b.type = 'button';
    if (titulo) b.title = titulo;
    b.addEventListener('click', fn);
    return b;
  }

  /* Convierte rgb(), rgba() o color(srgb …) a #rrggbb. Devuelve null si es transparente */
  function aHex(c) {
    if (!c) return null;
    c = c.trim();
    var h = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(c);
    if (h) return h[1].length === 3 ? '#' + h[1].split('').map(function (x) { return x + x; }).join('') : c.toLowerCase();
    var m = /^rgba?\(([^)]+)\)/.exec(c), v;
    if (m) {
      v = m[1].split(/[ ,\/]+/).map(parseFloat);
      if (v.length > 3 && v[3] === 0) return null;
    } else {
      m = /^color\(srgb ([^)]+)\)/.exec(c);
      if (!m) return null;
      v = m[1].split(/[ \/]+/).map(parseFloat).map(function (n, i) { return i < 3 ? n * 255 : n; });
      if (v.length > 3 && v[3] === 0) return null;
    }
    return '#' + v.slice(0, 3).map(function (n) { return ('0' + Math.max(0, Math.min(255, Math.round(n))).toString(16)).slice(-2); }).join('');
  }
  function hexValido(v) { return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v); }

  /* Aplica un estilo; algunos casos (bordes) necesitan ajustes extra */
  function aplicar(el, p, v) {
    var L = BP.lienzo;
    if (p === 'borderWidth') {
      if (v == null || parseFloat(v) === 0) { L.estilo(el, 'borderWidth', null); L.estilo(el, 'borderStyle', null); return; }
      L.estilo(el, 'borderWidth', v);
      if (!el.style.borderStyle) L.estilo(el, 'borderStyle', 'solid');
      return;
    }
    if (p === 'borderColor' && v != null) {
      if (!el.style.borderStyle) L.estilo(el, 'borderStyle', 'solid');
      if (!el.style.borderWidth) L.estilo(el, 'borderWidth', '1px');
    }
    L.estilo(el, p, v);
  }

  /* ---------- Definición de los campos de estilo ---------- */
  var GRUPOS = [
    { t: 'Texto', campos: [
      { p: 'color', e: 'Color del texto', tipo: 'color' },
      { p: 'fontSize', e: 'Tamaño de letra', tipo: 'px', min: 8, max: 160 },
      { p: 'fontWeight', e: 'Grosor', tipo: 'sel', ops: [['', 'Sin cambio'], ['400', 'Normal'], ['500', 'Medio'], ['600', 'Seminegrita'], ['700', 'Negrita'], ['800', 'Extranegrita']] },
      { p: 'textAlign', e: 'Alineación', tipo: 'seg', ops: [['left', 'Izq.'], ['center', 'Centro'], ['right', 'Der.'], ['justify', 'Justif.']] },
      { p: 'lineHeight', e: 'Interlineado', tipo: 'num', min: 0.8, max: 3, paso: 0.1 }
    ] },
    { t: 'Fondo y borde', campos: [
      { p: 'backgroundColor', e: 'Color de fondo', tipo: 'color' },
      { p: 'borderRadius', e: 'Esquinas redondeadas', tipo: 'px', min: 0, max: 200 },
      { p: 'borderWidth', e: 'Grosor del borde', tipo: 'px', min: 0, max: 20 },
      { p: 'borderColor', e: 'Color del borde', tipo: 'color' },
      { p: 'boxShadow', e: 'Sombra', tipo: 'sel', ops: [['', 'Sin cambio'], ['none', 'Ninguna'], ['0 2px 8px rgba(0,0,0,.12)', 'Suave'], ['0 10px 30px rgba(0,0,0,.18)', 'Media'], ['0 24px 60px rgba(0,0,0,.3)', 'Fuerte']] },
      { p: 'opacity', e: 'Opacidad', tipo: 'rango', min: 0, max: 1, paso: 0.05 }
    ] },
    { t: 'Espaciado', campos: [
      { p: 'paddingTop', e: 'Relleno arriba', tipo: 'px', min: 0, max: 400, mitad: true },
      { p: 'paddingBottom', e: 'Relleno abajo', tipo: 'px', min: 0, max: 400, mitad: true },
      { p: 'paddingLeft', e: 'Relleno izquierda', tipo: 'px', min: 0, max: 400, mitad: true },
      { p: 'paddingRight', e: 'Relleno derecha', tipo: 'px', min: 0, max: 400, mitad: true },
      { p: 'marginTop', e: 'Margen arriba', tipo: 'px', min: -200, max: 400, mitad: true },
      { p: 'marginBottom', e: 'Margen abajo', tipo: 'px', min: -200, max: 400, mitad: true },
      { p: 'gap', e: 'Separación interna', tipo: 'px', min: 0, max: 200, soloFlex: true }
    ] },
    { t: 'Tamaño', campos: [
      { p: 'width', e: 'Ancho', tipo: 'texto', pista: 'auto, 50%, 300px' },
      { p: 'maxWidth', e: 'Ancho máximo', tipo: 'texto', pista: 'ninguno, 600px' },
      { p: 'height', e: 'Alto', tipo: 'texto', pista: 'auto, 120px' },
      { p: 'minHeight', e: 'Alto mínimo', tipo: 'texto', pista: 'ninguno, 400px' }
    ] }
  ];

  /* ---------- Un campo de estilo ---------- */
  function campo(c, el, comp) {
    var id = 'prop-' + (++contador);
    var fila = e('div', 'campo' + (c.mitad ? ' mitad' : ''));
    var cab = e('div', 'campo-cab');
    var lab = e('label', null, c.e); lab.htmlFor = id;
    var reset = boton('↺', 'reset', function () { aplicar(el, c.p, null); BP.lienzo.confirmar(); }, 'Quitar este cambio');
    cab.appendChild(lab); cab.appendChild(reset);
    fila.appendChild(cab);

    function propio() { return el.style[c.p] || ''; }
    function marcar() { fila.classList.toggle('mod', !!propio()); }
    function vivo(v) { aplicar(el, c.p, v); marcar(); }
    function fin() { BP.lienzo.confirmar(); }
    marcar();

    var ctl;
    if (c.tipo === 'color') {
      ctl = e('div', 'color-fila');
      var ci = document.createElement('input'); ci.type = 'color'; ci.id = id;
      var ti = document.createElement('input'); ti.type = 'text'; ti.placeholder = 'automático'; ti.maxLength = 9;
      var hex = aHex(propio()) || aHex(comp[c.p]);
      ci.value = hex || '#ffffff';
      ti.value = propio() ? (aHex(propio()) || propio()) : '';
      ci.addEventListener('input', function () { ti.value = ci.value; vivo(ci.value); });
      ci.addEventListener('change', fin);
      ti.addEventListener('change', function () {
        var v = ti.value.trim();
        if (!v) aplicar(el, c.p, null);
        else if (hexValido(v)) aplicar(el, c.p, v);
        fin();
      });
      ctl.appendChild(ci); ctl.appendChild(ti);
    } else if (c.tipo === 'px' || c.tipo === 'num') {
      ctl = document.createElement('input'); ctl.type = 'number'; ctl.id = id;
      ctl.min = c.min; ctl.max = c.max; ctl.step = c.paso || 1;
      var unidad = c.tipo === 'px' ? 'px' : '';
      var dato = propio() ? parseFloat(propio()) : parseFloat(comp[c.p]);
      ctl.value = isNaN(dato) ? '' : Math.round(dato * 10) / 10;
      if (!propio()) ctl.classList.add('auto');
      ctl.addEventListener('input', function () { vivo(ctl.value === '' ? null : ctl.value + unidad); ctl.classList.remove('auto'); });
      ctl.addEventListener('change', fin);
    } else if (c.tipo === 'rango') {
      ctl = e('div', 'rango-fila');
      var r = document.createElement('input'); r.type = 'range'; r.id = id;
      r.min = c.min; r.max = c.max; r.step = c.paso;
      var salida = e('output');
      var dr = propio() ? parseFloat(propio()) : parseFloat(comp[c.p]);
      r.value = isNaN(dr) ? 1 : dr; salida.textContent = Math.round(r.value * 100) + '%';
      r.addEventListener('input', function () { salida.textContent = Math.round(r.value * 100) + '%'; vivo(r.value); });
      r.addEventListener('change', fin);
      ctl.appendChild(r); ctl.appendChild(salida);
    } else if (c.tipo === 'sel') {
      ctl = document.createElement('select'); ctl.id = id;
      var ops = c.ops.slice();
      if (propio() && !ops.some(function (o) { return o[0] === propio(); })) ops.push([propio(), propio()]);
      ops.forEach(function (o) { var op = e('option', null, o[1]); op.value = o[0]; ctl.appendChild(op); });
      ctl.value = propio();
      ctl.addEventListener('change', function () { vivo(ctl.value || null); fin(); });
    } else if (c.tipo === 'seg') {
      ctl = e('div', 'seg'); ctl.setAttribute('role', 'group');
      c.ops.forEach(function (o) {
        var b = boton(o[1], propio() === o[0] ? 'activo' : '', function () {
          vivo(propio() === o[0] ? null : o[0]); fin();
        });
        ctl.appendChild(b);
      });
    } else {
      ctl = document.createElement('input'); ctl.type = 'text'; ctl.id = id;
      ctl.placeholder = c.pista || ''; ctl.value = propio();
      ctl.addEventListener('input', function () { vivo(ctl.value.trim() || null); });
      ctl.addEventListener('change', fin);
    }
    fila.appendChild(ctl);
    return fila;
  }

  /* ---------- Sección de contenido (texto, enlace, imagen…) ---------- */
  function simple(etiqueta, valor, alCambiar, pista, alFinal) {
    var id = 'prop-' + (++contador);
    var f = e('div', 'campo');
    var l = e('label', null, etiqueta); l.htmlFor = id;
    var i = document.createElement('input'); i.type = 'text'; i.id = id; i.value = valor || ''; i.placeholder = pista || '';
    i.addEventListener('input', function () { alCambiar(i.value); BP.lienzo.vivo(); });
    i.addEventListener('change', alFinal || function () { BP.lienzo.confirmar(); });
    f.appendChild(l); f.appendChild(i);
    return f;
  }

  function leerImagen(archivo, cb) {
    var lector = new FileReader();
    lector.onload = function () {
      if (archivo.type === 'image/svg+xml' || archivo.type === 'image/gif') { cb(lector.result); return; }
      var im = new Image();
      im.onload = function () {
        var k = Math.min(1, 1600 / Math.max(im.width, im.height));
        var cv = document.createElement('canvas');
        cv.width = Math.round(im.width * k); cv.height = Math.round(im.height * k);
        cv.getContext('2d').drawImage(im, 0, 0, cv.width, cv.height);
        cb(cv.toDataURL(archivo.type === 'image/png' ? 'image/png' : 'image/jpeg', 0.85));
      };
      im.src = lector.result;
    };
    lector.readAsDataURL(archivo);
  }

  function contenido(el) {
    var t = el.tagName.toLowerCase(), partes = [];

    if (!BP.SIN_TEXTO[t] && el.children.length === 0) {
      var f = e('div', 'campo'), id = 'prop-' + (++contador);
      var l = e('label', null, 'Texto'); l.htmlFor = id;
      var a = document.createElement('textarea'); a.id = id; a.rows = 3; a.value = el.textContent;
      a.addEventListener('input', function () { el.textContent = a.value; BP.lienzo.vivo(); });
      a.addEventListener('change', function () { BP.lienzo.confirmar(); });
      f.appendChild(l); f.appendChild(a); partes.push(f);
    } else if (!BP.SIN_TEXTO[t] && el.tagName !== 'BODY') {
      var tip = e('p', 'tip', 'Contenedor con varios elementos. Selecciona uno de adentro o usa las migas de pan de arriba.');
      partes.push(tip);
    }

    if (t === 'a') {
      partes.push(simple('Enlace (dirección)', el.getAttribute('href'), function (v) { el.setAttribute('href', v); }, 'https://… o #seccion'));
    }
    if (el.classList.contains('boton')) {
      var estilos = [['', 'Relleno'], ['contorno', 'Contorno'], ['claro', 'Claro (para fondos de color)'], ['contorno-claro', 'Contorno claro']];
      var fb = e('div', 'campo'), ib = 'prop-' + (++contador);
      var lb = e('label', null, 'Estilo del botón'); lb.htmlFor = ib;
      var sb = document.createElement('select'); sb.id = ib;
      estilos.forEach(function (o) { var op = e('option', null, o[1]); op.value = o[0]; sb.appendChild(op); });
      sb.value = (estilos.filter(function (o) { return o[0] && el.classList.contains(o[0]); })[0] || [''])[0];
      sb.addEventListener('change', function () {
        el.classList.remove('contorno', 'claro', 'contorno-claro');
        if (sb.value) el.classList.add(sb.value);
        BP.lienzo.confirmar();
      });
      fb.appendChild(lb); fb.appendChild(sb); partes.push(fb);
    }
    if (t === 'img') {
      partes.push(simple('Dirección de la imagen', /^data:/.test(el.getAttribute('src') || '') ? '' : el.getAttribute('src'),
        function (v) { if (v) el.setAttribute('src', v); }, /^data:/.test(el.getAttribute('src') || '') ? 'Imagen incrustada' : 'https://…/foto.jpg'));
      var fu = e('div', 'campo');
      var arch = document.createElement('input'); arch.type = 'file'; arch.accept = 'image/*'; arch.className = 'oculto'; arch.id = 'prop-archivo';
      var bu = boton('Subir imagen desde mi equipo', 'btn ancho', function () { arch.click(); });
      arch.addEventListener('change', function () {
        if (!arch.files[0]) return;
        leerImagen(arch.files[0], function (url) { el.setAttribute('src', url); BP.lienzo.confirmar(); BP.aviso('Imagen cargada'); });
      });
      fu.appendChild(bu); fu.appendChild(arch); partes.push(fu);
      partes.push(simple('Texto alternativo (accesibilidad)', el.getAttribute('alt'), function (v) { el.setAttribute('alt', v); }, 'Describe la imagen'));
      partes.push(campo({ p: 'objectFit', e: 'Ajuste de la imagen', tipo: 'sel', ops: [['', 'Sin cambio'], ['cover', 'Rellenar (recorta)'], ['contain', 'Contener (completa)'], ['fill', 'Estirar']] }, el, {}));
    }
    if (t === 'input' || t === 'textarea') {
      partes.push(simple('Texto de ayuda', el.getAttribute('placeholder'), function (v) { el.setAttribute('placeholder', v); }, 'Ej.: Tu nombre'));
    }
    if (t === 'details') {
      var fd = e('label', 'check');
      var ck = document.createElement('input'); ck.type = 'checkbox'; ck.checked = el.hasAttribute('open');
      ck.addEventListener('change', function () { if (ck.checked) el.setAttribute('open', ''); else el.removeAttribute('open'); BP.lienzo.confirmar(); });
      fd.appendChild(ck); fd.appendChild(document.createTextNode(' Abierto por defecto'));
      partes.push(fd);
    }
    return partes;
  }

  /* ---------- Cabecera con migas de pan ---------- */
  function cabecera(el) {
    var caja = e('div', 'prop-cabecera');
    caja.appendChild(e('div', 'prop-nombre', BP.nombreElemento(el)));
    var ruta = [], n = el;
    while (n && n !== BP.lienzo.pagina()) { ruta.unshift(n); n = n.parentNode; }
    var migas = e('div', 'migas');
    ruta.forEach(function (x, i) {
      var etq = x.hasAttribute('data-bloque') ? 'bloque' : x.tagName.toLowerCase();
      var b = boton(etq, 'miga' + (x === el ? ' activa' : ''), function () { BP.lienzo.seleccionar(x); }, BP.nombreElemento(x));
      migas.appendChild(b);
      if (i < ruta.length - 1) migas.appendChild(e('span', 'sep', '›'));
    });
    caja.appendChild(migas);
    return caja;
  }

  function acciones(el) {
    var L = BP.lienzo, caja = e('div', 'prop-acciones');
    caja.appendChild(boton('↑ Subir', 'btn', function () { L.moverHermano(el, -1); }));
    caja.appendChild(boton('↓ Bajar', 'btn', function () { L.moverHermano(el, 1); }));
    caja.appendChild(boton('⧉ Duplicar', 'btn', function () { L.duplicar(el); }));
    caja.appendChild(boton('🗑 Eliminar', 'btn peligro', function () { L.eliminar(el); }));
    caja.appendChild(boton('↺ Restablecer estilos', 'btn ancho', function () {
      el.removeAttribute('style'); L.confirmar();
    }, 'Quita todos los estilos que cambiaste en este elemento'));
    return caja;
  }

  /* ---------- Render principal ---------- */
  function render() {
    var el = BP.lienzo.seleccionado();
    cont.innerHTML = '';
    if (!el || !el.isConnected) { renderPagina(); return; }

    var comp = BP.lienzo.estiloComputado(el);
    cont.appendChild(cabecera(el));

    var cont1 = contenido(el);
    if (cont1.length) cont.appendChild(grupo('Contenido', cont1));

    GRUPOS.forEach(function (g) {
      var campos = g.campos.filter(function (c) {
        if (c.soloFlex) return /flex|grid/.test(comp.display);
        return true;
      });
      if (!campos.length) return;
      var cuerpo = e('div', 'campos');
      campos.forEach(function (c) { cuerpo.appendChild(campo(c, el, comp)); });
      cont.appendChild(grupo(g.t, [cuerpo]));
    });
    cont.appendChild(acciones(el));
  }

  function grupo(titulo, hijos) {
    var d = document.createElement('details');
    d.className = 'prop-grupo';
    d.open = !!abiertos[titulo];
    d.addEventListener('toggle', function () { abiertos[titulo] = d.open; });
    d.appendChild(e('summary', null, titulo));
    var c = e('div', 'prop-grupo-cuerpo');
    hijos.forEach(function (h) { c.appendChild(h); });
    d.appendChild(c);
    return d;
  }

  /* ---------- Tema general (sin selección) ---------- */
  function renderPagina() {
    var T = BP.tema;
    cont.appendChild(e('div', 'prop-nombre', 'Tema de la página'));
    cont.appendChild(e('p', 'tip', 'Estos colores y la tipografía se aplican a todos los bloques. Haz clic en un elemento del lienzo para modificarlo individualmente.'));

    var g = e('div', 'campos');
    g.appendChild(simple('Título del documento', T.titulo, function (v) { T.titulo = v; }, 'Mi página', function () { BP.lienzo.confirmar(); }));

    [['primario', 'Color principal'], ['secundario', 'Color secundario'], ['fondo', 'Color de fondo'], ['texto', 'Color del texto']].forEach(function (c) {
      var fila = e('div', 'campo'), id = 'prop-' + (++contador);
      var lab = e('label', null, c[1]); lab.htmlFor = id;
      var w = e('div', 'color-fila');
      var ci = document.createElement('input'); ci.type = 'color'; ci.id = id; ci.value = T[c[0]];
      var ti = document.createElement('input'); ti.type = 'text'; ti.value = T[c[0]]; ti.maxLength = 7;
      ci.addEventListener('input', function () { T[c[0]] = ci.value; ti.value = ci.value; BP.lienzo.aplicarTema(); });
      ci.addEventListener('change', function () { BP.lienzo.confirmar(); });
      ti.addEventListener('change', function () {
        if (hexValido(ti.value.trim())) { T[c[0]] = aHex(ti.value.trim()); ci.value = T[c[0]]; BP.lienzo.aplicarTema(); BP.lienzo.confirmar(); }
        else ti.value = T[c[0]];
      });
      w.appendChild(ci); w.appendChild(ti);
      fila.appendChild(lab); fila.appendChild(w); g.appendChild(fila);
    });

    var ff = e('div', 'campo'), idf = 'prop-' + (++contador);
    var lf = e('label', null, 'Tipografía'); lf.htmlFor = idf;
    var sf = document.createElement('select'); sf.id = idf;
    Object.keys(BP.fuentes).forEach(function (k) { var o = e('option', null, BP.fuentes[k][0]); o.value = k; sf.appendChild(o); });
    sf.value = T.fuente;
    sf.addEventListener('change', function () { T.fuente = sf.value; BP.lienzo.aplicarTema(); BP.lienzo.confirmar(); });
    ff.appendChild(lf); ff.appendChild(sf); g.appendChild(ff);

    var fr = e('div', 'campo'), idr = 'prop-' + (++contador);
    var lr = e('label', null, 'Esquinas redondeadas'); lr.htmlFor = idr;
    var rr = e('div', 'rango-fila');
    var ri = document.createElement('input'); ri.type = 'range'; ri.id = idr; ri.min = 0; ri.max = 32; ri.step = 1; ri.value = T.radio;
    var ro = e('output', null, T.radio + ' px');
    ri.addEventListener('input', function () { T.radio = +ri.value; ro.textContent = ri.value + ' px'; BP.lienzo.aplicarTema(); });
    ri.addEventListener('change', function () { BP.lienzo.confirmar(); });
    rr.appendChild(ri); rr.appendChild(ro);
    fr.appendChild(lr); fr.appendChild(rr); g.appendChild(fr);

    cont.appendChild(grupo('Colores y tipografía', [g]));

    var acc = e('div', 'prop-acciones');
    acc.appendChild(boton('↺ Restablecer tema', 'btn ancho', function () {
      var titulo = T.titulo;
      BP.tema = Object.assign({}, BP.temaDefecto, { titulo: titulo });
      BP.lienzo.aplicarTema(); BP.lienzo.confirmar();
    }));
    acc.appendChild(boton('🗑 Vaciar la página', 'btn ancho peligro', function () {
      if (window.confirm('¿Quitar todos los bloques de la página? Podrás deshacerlo con Ctrl+Z.')) BP.lienzo.vaciar();
    }));
    cont.appendChild(acc);

    var ayuda = e('div', 'atajos');
    ayuda.innerHTML = '<h4>Atajos</h4><ul>' +
      '<li><kbd>Clic</kbd> seleccionar</li>' +
      '<li><kbd>Doble clic</kbd> editar texto</li>' +
      '<li><kbd>Supr</kbd> eliminar selección</li>' +
      '<li><kbd>Esc</kbd> quitar selección</li>' +
      '<li><kbd>Ctrl</kbd>+<kbd>Z</kbd> deshacer</li>' +
      '<li><kbd>Ctrl</kbd>+<kbd>Y</kbd> rehacer</li></ul>';
    cont.appendChild(ayuda);
  }

  BP.props = {
    iniciar: function () {
      cont = BP.$('props');
      abiertos['Colores y tipografía'] = true;
      BP.on('seleccion', render);
      BP.on('cambio', render);
      render();
    }
  };
})();
