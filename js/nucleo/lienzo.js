/* ==========================================================
   Lienzo: la página que se está armando
   ----------------------------------------------------------
   Vive dentro de un iframe para que los estilos del editor no
   se mezclen con los de la página y para que las vistas de
   tableta y móvil usen media queries reales.
   Índice: 1 Estilos del editor · 2 Arranque · 3 Selección
           4 Edición de texto · 5 Operaciones · 6 Arrastrar
           7 Persistencia · 8 API pública
   ========================================================== */
(function () {
  'use strict';
  var BP = window.BP = window.BP || {};

  var ifr, win, doc, pagina, barra, linea;
  var sel = null, hover = null, editando = null, valorAntes = '', arrastrado = null;
  var CLAVE = 'bph-proyecto-v2';

  /* 1. Estilos del editor (solo existen dentro del iframe) ---- */
  var CSS_EDITOR = [
    'html,body{min-height:100%}',
    '#pagina{min-height:100vh}',
    '#pagina:empty::before{content:"Tu página está vacía. Haz clic en un bloque de la biblioteca o arrástralo hasta aquí.";display:grid;place-items:center;min-height:60vh;margin:24px;padding:40px;border:2px dashed #c5cae6;border-radius:16px;color:#7c84ab;font:500 1rem system-ui,sans-serif;text-align:center}',
    '.bp-hover{outline:1px dashed #7c6cff!important;outline-offset:-1px}',
    '.bp-sel{outline:2px solid #7c6cff!important;outline-offset:-2px}',
    '[contenteditable="true"]{outline:2px solid #38d6c4!important;outline-offset:2px;cursor:text}',
    '#pagina a,#pagina button,#pagina summary,#pagina label{cursor:default}',
    '#pagina img{-webkit-user-drag:none}',
    '.bq-espacio{background:repeating-linear-gradient(45deg,rgba(124,108,255,.09) 0 8px,transparent 8px 16px)}',
    '.bp-barra{position:absolute;z-index:99999;display:none;align-items:center;gap:2px;padding:3px;border-radius:9px;background:#7c6cff;box-shadow:0 6px 18px rgba(0,0,0,.3);font:12px system-ui,sans-serif;color:#fff;user-select:none}',
    '.bp-barra .bp-etq{padding:0 8px;font-weight:600;white-space:nowrap}',
    '.bp-barra button{width:26px;height:26px;border:0;border-radius:6px;background:transparent;color:#fff;font:inherit;font-size:14px;cursor:pointer}',
    '.bp-barra button:hover{background:rgba(255,255,255,.25)}',
    '.bp-barra #bp-asa{display:grid;place-items:center;width:26px;height:26px;border-radius:6px;font-size:14px;cursor:grab}',
    '.bp-barra #bp-asa:hover{background:rgba(255,255,255,.25)}',
    '.bp-linea{position:fixed;left:12px;right:12px;height:4px;display:none;border-radius:2px;background:#38d6c4;box-shadow:0 0 0 3px rgba(56,214,196,.3);pointer-events:none;z-index:99998}'
  ].join('\n');

  function documentoBase() {
    return '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">' +
      '<meta name="viewport" content="width=device-width,initial-scale=1">' +
      '<style id="base">' + BP.baseCSS + '\n' + BP.todoCSSBloques() + '</style>' +
      '<style id="tema"></style>' +
      '<style id="editor">' + CSS_EDITOR + '</style></head>' +
      '<body><main id="pagina"></main></body></html>';
  }

  /* 2. Arranque ------------------------------------------------ */
  function iniciar(iframe, listo) {
    ifr = iframe;
    ifr.addEventListener('load', function () {
      win = ifr.contentWindow; doc = ifr.contentDocument;
      pagina = doc.getElementById('pagina');
      montar();
      aplicarTema();
      if (listo) listo();
    }, { once: true });
    ifr.srcdoc = documentoBase();
  }

  function montar() {
    barra = doc.createElement('div');
    barra.id = 'bp-barra'; barra.className = 'bp-barra';
    barra.innerHTML =
      '<span class="bp-etq" id="bp-etq"></span>' +
      '<span id="bp-asa" draggable="true" title="Arrastra para mover el bloque">⠿</span>' +
      '<button type="button" data-a="bloque" title="Seleccionar el bloque completo">⬚</button>' +
      '<button type="button" data-a="subir" title="Subir">↑</button>' +
      '<button type="button" data-a="bajar" title="Bajar">↓</button>' +
      '<button type="button" data-a="duplicar" title="Duplicar">⧉</button>' +
      '<button type="button" data-a="eliminar" title="Eliminar">🗑</button>';
    doc.body.appendChild(barra);
    linea = doc.createElement('div');
    linea.className = 'bp-linea';
    doc.body.appendChild(linea);

    doc.addEventListener('mouseover', onSobre);
    doc.documentElement.addEventListener('mouseleave', quitarHover);
    doc.addEventListener('mousedown', onMousedown, true);
    doc.addEventListener('click', onClick, true);
    doc.addEventListener('dblclick', onDblclick, true);
    doc.addEventListener('keydown', onTecla);
    doc.addEventListener('paste', onPegar);
    doc.addEventListener('dragstart', onDragstart);
    doc.addEventListener('dragover', onDragover);
    doc.addEventListener('drop', onDrop);
    doc.addEventListener('dragend', finArrastre);
    doc.addEventListener('load', ubicarBarra, true);
    win.addEventListener('resize', ubicarBarra);
    if (win.ResizeObserver) new win.ResizeObserver(ubicarBarra).observe(pagina);
  }

  function dentro(n) { return n && n !== pagina && pagina.contains(n); }
  function bloqueDe(el) {
    while (el && el.parentNode !== pagina) el = el.parentNode;
    return el || null;
  }

  /* 3. Selección ----------------------------------------------- */
  function quitarHover() { if (hover) { hover.classList.remove('bp-hover'); hover = null; } }

  function onSobre(e) {
    if (editando || arrastrado) return;
    var t = e.target;
    if (!dentro(t) || t.closest('#bp-barra')) { quitarHover(); return; }
    if (t === hover) return;
    quitarHover(); hover = t; t.classList.add('bp-hover');
  }

  function onMousedown(e) {
    var t = e.target;
    if (t.closest && t.closest('#bp-barra')) return;
    if (!editando && /^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(t.tagName)) e.preventDefault();
  }

  function onClick(e) {
    var t = e.target;
    if (t.closest && t.closest('#bp-barra')) {
      e.preventDefault(); e.stopPropagation();
      var b = t.closest('button');
      if (b) accion(b.dataset.a);
      return;
    }
    if (editando && editando.contains(t)) return;
    e.preventDefault(); e.stopPropagation();
    if (editando) terminarEdicion();
    seleccionar(dentro(t) ? t : null);
  }

  function seleccionar(el) {
    if (sel) sel.classList.remove('bp-sel');
    sel = el || null;
    if (sel) sel.classList.add('bp-sel');
    quitarHover();
    ubicarBarra();
    BP.emitir('seleccion', sel);
  }

  function ubicarBarra() {
    if (!barra) return;
    if (!sel || !sel.isConnected) { barra.style.display = 'none'; return; }
    barra.style.display = 'flex';
    doc.getElementById('bp-etq').textContent = BP.nombreElemento(sel);
    var r = sel.getBoundingClientRect(), sx = win.pageXOffset, sy = win.pageYOffset;
    var w = barra.offsetWidth, h = barra.offsetHeight;
    var arriba = r.top - h - 6;
    var top = (arriba >= 4 ? arriba : Math.max(r.top + 6, 4)) + sy;
    var left = Math.min(Math.max(r.right + sx - w, sx + 4), sx + doc.documentElement.clientWidth - w - 4);
    barra.style.top = top + 'px';
    barra.style.left = left + 'px';
  }

  /* 4. Edición de texto ---------------------------------------- */
  function esEditable(el) {
    var t = el.tagName.toLowerCase();
    if (BP.SIN_TEXTO[t]) return false;
    return [].every.call(el.children, function (h) { return BP.EN_LINEA[h.tagName.toLowerCase()]; });
  }

  function onDblclick(e) {
    var t = e.target;
    if (!dentro(t) || t.closest('#bp-barra')) return;
    e.preventDefault(); e.stopPropagation();
    if (!esEditable(t)) { BP.aviso('Este elemento es un contenedor. Haz doble clic sobre un texto.'); return; }
    seleccionar(t);
    editando = t; valorAntes = t.innerHTML;
    quitarHover();
    t.setAttribute('contenteditable', 'true');
    t.focus();
    t.addEventListener('input', alEscribir);
    t.addEventListener('blur', terminarEdicion, { once: true });
  }

  function alEscribir() { BP.emitir('vivo'); ubicarBarra(); }

  function terminarEdicion() {
    if (!editando) return;
    var el = editando; editando = null;
    el.removeEventListener('input', alEscribir);
    el.removeAttribute('contenteditable');
    if (el.innerHTML !== valorAntes) confirmar(); else ubicarBarra();
  }

  function onPegar(e) {
    if (!editando) return;
    e.preventDefault();
    var txt = (e.clipboardData || win.clipboardData).getData('text/plain');
    doc.execCommand('insertText', false, txt);
  }

  function onTecla(e) {
    if (editando) {
      if (e.key === 'Escape') { e.preventDefault(); terminarEdicion(); }
      else if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); doc.execCommand('insertLineBreak'); }
      return;
    }
    if (BP.atajos && BP.atajos(e)) return;
    if ((e.key === 'Delete' || e.key === 'Backspace') && sel) { e.preventDefault(); eliminar(sel); }
    else if (e.key === 'Escape') seleccionar(null);
  }

  /* 5. Operaciones sobre la página ----------------------------- */
  function accion(a) {
    if (!sel) return;
    if (a === 'bloque') seleccionar(bloqueDe(sel));
    else if (a === 'subir') moverHermano(sel, -1);
    else if (a === 'bajar') moverHermano(sel, 1);
    else if (a === 'duplicar') duplicar(sel);
    else if (a === 'eliminar') eliminar(sel);
  }

  /* Evita ids repetidos al insertar o duplicar (menú móvil, etiquetas for=) */
  function ids(el) {
    var usados = {};
    [].forEach.call(pagina.querySelectorAll('[id]'), function (n) { usados[n.id] = 1; });
    [].forEach.call(el.querySelectorAll('[id]'), function (n) {
      var viejo = n.id;
      if (!usados[viejo]) { usados[viejo] = 1; return; }
      var base = viejo.replace(/-\d+$/, ''), k = 2, nuevo = base + '-' + k;
      while (usados[nuevo]) { k++; nuevo = base + '-' + k; }
      n.id = nuevo; usados[nuevo] = 1;
      [].forEach.call(el.querySelectorAll('[for="' + viejo + '"]'), function (l) { l.setAttribute('for', nuevo); });
      [].forEach.call(el.querySelectorAll('[aria-controls="' + viejo + '"]'), function (l) { l.setAttribute('aria-controls', nuevo); });
    });
  }

  function agregarBloque(id, indice) {
    var def = BP.bloque(id);
    if (!def) return null;
    var t = doc.createElement('template');
    t.innerHTML = def.html.trim();
    var el = t.content.firstElementChild;
    el.setAttribute('data-bloque', id);
    ids(el);
    var hijos = pagina.children;
    if (indice == null) {
      var b = sel ? bloqueDe(sel) : null;
      indice = b ? [].indexOf.call(hijos, b) + 1 : hijos.length;
    }
    pagina.insertBefore(el, hijos[indice] || null);
    seleccionar(el);
    el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    confirmar();
    return el;
  }

  function moverHermano(el, dir) {
    var padre = el.parentNode;
    if (dir < 0 && el.previousElementSibling) padre.insertBefore(el, el.previousElementSibling);
    else if (dir > 0 && el.nextElementSibling) padre.insertBefore(el.nextElementSibling, el);
    else return;
    ubicarBarra(); confirmar();
  }

  function moverBloqueIndice(desde, hasta) {
    var hijos = [].slice.call(pagina.children), b = hijos[desde];
    if (!b) return;
    if (hasta > desde) hasta--;
    if (hasta === desde) return;
    pagina.removeChild(b);
    pagina.insertBefore(b, pagina.children[hasta] || null);
    ubicarBarra(); confirmar();
  }

  function duplicar(el) {
    var c = el.cloneNode(true);
    BP.exportar.limpiarClon(c, true);
    ids(c);
    el.parentNode.insertBefore(c, el.nextSibling);
    seleccionar(c);
    confirmar();
  }

  function eliminar(el) {
    var sig = el.nextElementSibling || el.previousElementSibling || (el.parentNode !== pagina ? el.parentNode : null);
    el.remove();
    seleccionar(sig && sig !== pagina ? sig : null);
    confirmar();
  }

  function vaciar() {
    pagina.innerHTML = '';
    seleccionar(null);
    confirmar();
  }

  /* Aplica o quita un estilo en línea a un elemento */
  function estilo(el, prop, valor) {
    el.style[prop] = (valor == null) ? '' : valor;
    if (!el.getAttribute('style')) el.removeAttribute('style');
    ubicarBarra();
    BP.emitir('vivo');
  }

  /* 6. Arrastrar y soltar -------------------------------------- */
  function hayArrastre(e) {
    var tipos = e.dataTransfer ? [].slice.call(e.dataTransfer.types) : [];
    if (tipos.indexOf('text/bp-bloque') >= 0) return 'nuevo';
    return arrastrado ? 'mover' : null;
  }

  function indiceDesde(y) {
    var h = pagina.children;
    for (var i = 0; i < h.length; i++) {
      var r = h[i].getBoundingClientRect();
      if (y < r.top + r.height / 2) return i;
    }
    return h.length;
  }

  function mostrarLinea(i) {
    var h = pagina.children, y;
    if (!h.length) y = 28;
    else if (i < h.length) y = h[i].getBoundingClientRect().top;
    else y = h[h.length - 1].getBoundingClientRect().bottom;
    linea.style.top = (y - 2) + 'px';
    linea.style.display = 'block';
  }

  function onDragstart(e) {
    if (e.target && e.target.id === 'bp-asa' && sel) {
      arrastrado = bloqueDe(sel);
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', 'mover');
      try { e.dataTransfer.setDragImage(arrastrado, 24, 24); } catch (x) {}
    } else {
      e.preventDefault();
    }
  }

  function onDragover(e) {
    var tipo = hayArrastre(e);
    if (!tipo) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = (tipo === 'nuevo') ? 'copy' : 'move';
    mostrarLinea(indiceDesde(e.clientY));
    if (e.clientY < 70) win.scrollBy(0, -14);
    else if (e.clientY > win.innerHeight - 70) win.scrollBy(0, 14);
  }

  function onDrop(e) {
    var tipo = hayArrastre(e);
    if (!tipo) return;
    e.preventDefault();
    var i = indiceDesde(e.clientY);
    linea.style.display = 'none';
    if (tipo === 'nuevo') {
      agregarBloque(e.dataTransfer.getData('text/bp-bloque'), i);
    } else {
      moverBloqueIndice([].indexOf.call(pagina.children, arrastrado), i);
      arrastrado = null;
    }
  }

  function finArrastre() { arrastrado = null; if (linea) linea.style.display = 'none'; }

  /* 7. Persistencia -------------------------------------------- */
  function htmlPersistente() {
    return BP.exportar.clonPagina(true).innerHTML;
  }

  function guardar() {
    try { localStorage.setItem(CLAVE, JSON.stringify({ html: htmlPersistente(), tema: BP.tema })); } catch (e) {}
  }

  function cargarGuardado() {
    try {
      var d = JSON.parse(localStorage.getItem(CLAVE));
      if (d && typeof d.html === 'string') { restaurar(d, true); return true; }
    } catch (e) {}
    return false;
  }

  function restaurar(estado, silencioso) {
    pagina.innerHTML = estado.html;
    BP.tema = Object.assign({}, BP.temaDefecto, estado.tema || {});
    aplicarTema();
    sel = null; hover = null; editando = null;
    ubicarBarra();
    BP.emitir('seleccion', null);
    BP.emitir('tema');
    if (!silencioso) { guardar(); BP.emitir('cambio'); }
  }

  function aplicarTema() {
    if (doc) doc.getElementById('tema').textContent = BP.temaCSS();
  }

  /* Un cambio terminado: guarda historial y avisa a los paneles */
  function confirmar() {
    BP.historial.registrar();
    guardar();
    BP.emitir('cambio');
  }

  /* 8. API pública --------------------------------------------- */
  BP.lienzo = {
    iniciar: iniciar,
    pagina: function () { return pagina; },
    ventana: function () { return win; },
    seleccionado: function () { return sel; },
    seleccionar: seleccionar,
    bloqueDe: bloqueDe,
    bloques: function () { return [].slice.call(pagina.children); },
    agregarBloque: agregarBloque,
    moverHermano: moverHermano,
    moverBloqueIndice: moverBloqueIndice,
    duplicar: duplicar,
    eliminar: eliminar,
    vaciar: vaciar,
    estilo: estilo,
    confirmar: confirmar,
    vivo: function () { ubicarBarra(); BP.emitir('vivo'); },
    ubicarBarra: ubicarBarra,
    restaurar: restaurar,
    htmlPersistente: htmlPersistente,
    cargarGuardado: cargarGuardado,
    aplicarTema: function () { aplicarTema(); BP.emitir('tema'); BP.emitir('vivo'); },
    estiloComputado: function (el) { return win.getComputedStyle(el); },
    verBloque: function (el) { if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
  };
})();
