/* ==========================================================
   Biblioteca: panel izquierdo con todos los bloques disponibles
   ========================================================== */
(function () {
  'use strict';
  var BP = window.BP = window.BP || {};

  var estado = { busqueda: '', categoria: 'Todas' };
  var modalDef = null, modalLeng = 'html';
  var ANCHO_MINIATURA = 1200, ALTO_MINIATURA = 620;

  function normalizar(t) {
    return String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  function documentoMiniatura(def) {
    return '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><style>' +
      BP.temaCSS() + '\n' + BP.baseCSS + '\n' + def.css + '\nhtml{overflow:hidden}</style></head><body>' + def.html + '</body></html>';
  }

  function filtrar() {
    var q = normalizar(estado.busqueda);
    return BP.bloques.filter(function (b) {
      if (estado.categoria !== 'Todas' && b.categoria !== estado.categoria) return false;
      if (!q) return true;
      return normalizar([b.nombre, b.descripcion, b.categoria, b.etiquetas.join(' ')].join(' ')).indexOf(q) !== -1;
    });
  }

  function pintarFiltro() {
    var s = BP.$('filtroCategoria');
    s.innerHTML = '';
    ['Todas'].concat(BP.categorias).forEach(function (c) {
      var o = document.createElement('option');
      o.value = c; o.textContent = c; s.appendChild(o);
    });
    s.addEventListener('change', function () { estado.categoria = s.value; pintar(); });
    BP.$('buscarBloque').addEventListener('input', function (e) { estado.busqueda = e.target.value; pintar(); });
  }

  var observador = null;
  function pintar() {
    var cont = BP.$('listaBloques');
    cont.innerHTML = '';
    var lista = filtrar();
    if (!lista.length) {
      var v = document.createElement('p');
      v.className = 'ayuda-panel'; v.textContent = 'No hay bloques que coincidan con tu búsqueda.';
      cont.appendChild(v); return;
    }
    if (observador) observador.disconnect();
    observador = ('IntersectionObserver' in window) ? new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (!en.isIntersecting) return;
        var f = en.target; observador.unobserve(f);
        f.srcdoc = f.dataset.doc;
      });
    }, { root: BP.$('vistaBloques'), rootMargin: '200px' }) : null;

    var categoriaActual = null;
    lista.forEach(function (def) {
      if (estado.categoria === 'Todas' && def.categoria !== categoriaActual) {
        categoriaActual = def.categoria;
        var h = document.createElement('h4');
        h.className = 'grupo-titulo'; h.textContent = categoriaActual;
        cont.appendChild(h);
      }
      cont.appendChild(tarjeta(def));
    });
    ajustarEscala();
  }

  function tarjeta(def) {
    var c = document.createElement('article');
    c.className = 'bloque-card'; c.draggable = true; c.tabIndex = 0;
    c.setAttribute('role', 'button');
    c.setAttribute('aria-label', 'Añadir ' + def.nombre);
    c.dataset.id = def.id;

    var mini = document.createElement('div');
    mini.className = 'bloque-mini';
    var f = document.createElement('iframe');
    f.tabIndex = -1; f.title = 'Vista previa de ' + def.nombre; f.setAttribute('aria-hidden', 'true');
    f.dataset.doc = documentoMiniatura(def);
    if (observador) observador.observe(f); else f.srcdoc = f.dataset.doc;
    mini.appendChild(f);

    var info = document.createElement('div');
    info.className = 'bloque-info';
    var t = document.createElement('div'); t.className = 'bloque-titulo'; t.textContent = def.nombre;
    var d = document.createElement('div'); d.className = 'bloque-desc'; d.textContent = def.descripcion;
    var acc = document.createElement('div'); acc.className = 'bloque-acciones';
    var add = document.createElement('button'); add.type = 'button'; add.className = 'mini primario'; add.textContent = '+ Añadir';
    var ver = document.createElement('button'); ver.type = 'button'; ver.className = 'mini'; ver.textContent = '</> Ver código';
    acc.appendChild(add); acc.appendChild(ver);
    info.appendChild(t); info.appendChild(d); info.appendChild(acc);

    c.appendChild(mini); c.appendChild(info);

    function agregar() { BP.lienzo.agregarBloque(def.id); cerrarPanelEstrecho(); }
    c.addEventListener('click', function (e) {
      if (e.target.closest('.mini') && e.target.closest('.mini') !== add) return;
      agregar();
    });
    ver.addEventListener('click', function (e) { e.stopPropagation(); abrirModal(def); });
    c.addEventListener('keydown', function (e) {
      if (e.target === c && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); agregar(); }
    });
    c.addEventListener('dragstart', function (e) {
      e.dataTransfer.setData('text/bp-bloque', def.id);
      e.dataTransfer.setData('text/plain', def.nombre);
      e.dataTransfer.effectAllowed = 'copy';
      c.classList.add('arrastrando');
    });
    c.addEventListener('dragend', function () { c.classList.remove('arrastrando'); });
    return c;
  }

  function cerrarPanelEstrecho() {
    if (window.matchMedia('(max-width:1100px)').matches) BP.emitir('cerrar-paneles');
  }

  /* Las miniaturas se dibujan a 1200 px de ancho y se reducen al ancho del panel */
  function ajustarEscala() {
    var cont = BP.$('listaBloques');
    var ancho = cont.clientWidth;
    if (!ancho) return;
    var esc = ancho / ANCHO_MINIATURA;
    cont.style.setProperty('--esc', esc.toFixed(4));
    cont.style.setProperty('--alto-mini', Math.round(ALTO_MINIATURA * esc) + 'px');
  }

  /* ---- Ventana "Ver código" ---- */
  function abrirModal(def) {
    modalDef = def; modalLeng = 'html';
    BP.$('modalTitulo').textContent = def.nombre;
    BP.$('modalDescripcion').textContent = def.descripcion;
    BP.$('modalFicha').textContent = 'Autor: ' + def.autor + ' · Licencia: ' + def.licencia;
    BP.$('modal').hidden = false;
    pintarModal();
    BP.$('cerrarModal').focus();
  }
  function cerrarModal() { BP.$('modal').hidden = true; modalDef = null; }
  function textoModal() {
    return modalLeng === 'css' ? BP.exportar.bloqueCSS(modalDef) : BP.exportar.bloqueHTML(modalDef);
  }
  function pintarModal() {
    BP.$('modalCodigo').innerHTML = BP.resaltar(textoModal(), modalLeng);
    [].forEach.call(document.querySelectorAll('[data-modal]'), function (b) {
      b.classList.toggle('activo', b.dataset.modal === modalLeng);
    });
  }

  BP.biblioteca = {
    iniciar: function () {
      pintarFiltro(); pintar();
      BP.$('cerrarModal').addEventListener('click', cerrarModal);
      BP.$('modal').addEventListener('click', function (e) { if (e.target === BP.$('modal')) cerrarModal(); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !BP.$('modal').hidden) cerrarModal(); });
      [].forEach.call(document.querySelectorAll('[data-modal]'), function (b) {
        b.addEventListener('click', function () { modalLeng = b.dataset.modal; pintarModal(); });
      });
      BP.$('modalCopiar').addEventListener('click', function () { if (modalDef) BP.copiar(textoModal(), 'Código copiado'); });
      BP.$('modalAgregar').addEventListener('click', function () {
        if (!modalDef) return;
        BP.lienzo.agregarBloque(modalDef.id); cerrarModal(); cerrarPanelEstrecho();
      });
      if (window.ResizeObserver) new ResizeObserver(ajustarEscala).observe(BP.$('listaBloques'));
      /* Al cambiar el tema, las miniaturas se repintan con los colores nuevos */
      BP.on('tema', BP.debounce(function () {
        [].forEach.call(document.querySelectorAll('.bloque-mini iframe'), function (f) {
          var def = BP.bloque(f.closest('.bloque-card').dataset.id);
          f.dataset.doc = documentoMiniatura(def);
          if (f.srcdoc) f.srcdoc = f.dataset.doc;
        });
      }, 250));
    },
    ajustarEscala: ajustarEscala
  };
})();
