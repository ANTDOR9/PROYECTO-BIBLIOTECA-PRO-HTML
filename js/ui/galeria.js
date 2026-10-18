/* ==========================================================
   Galería: pantalla completa con toda la biblioteca de bloques.
   Se abre con "Ir a biblioteca" y permite añadir bloques a la
   página sin salir de ella; "Volver al editor" regresa al lienzo.
   ========================================================== */
(function () {
  'use strict';
  var BP = window.BP = window.BP || {};

  var estado = { busqueda: '', categoria: 'Todas', conjunto: 'base' };

  function coleccion() { return estado.conjunto === 'pro' ? BP.bloquesPro : BP.bloques; }
  function categorias() { return estado.conjunto === 'pro' ? BP.categoriasPro() : BP.categorias; }
  var observador = null;

  function filtrar() {
    var q = BP.biblioteca.normalizar(estado.busqueda);
    return coleccion().filter(function (b) {
      if (estado.categoria !== 'Todas' && b.categoria !== estado.categoria) return false;
      if (!q) return true;
      return BP.biblioteca.normalizar([b.nombre, b.descripcion, b.categoria, b.etiquetas.join(' ')].join(' ')).indexOf(q) !== -1;
    });
  }

  function pintarCategorias() {
    var cont = BP.$('galeriaCategorias');
    cont.innerHTML = '';
    ['Todas'].concat(categorias()).forEach(function (c) {
      var n = c === 'Todas' ? coleccion().length : coleccion().filter(function (b) { return b.categoria === c; }).length;
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'chip' + (c === estado.categoria ? ' activo' : '');
      b.textContent = c + ' · ' + n;
      b.addEventListener('click', function () { estado.categoria = c; pintarCategorias(); pintar(); });
      cont.appendChild(b);
    });
  }

  function cuantos(id) {
    return BP.lienzo.bloques().filter(function (b) { return b.dataset.bloque === id; }).length;
  }

  function tarjeta(def) {
    var c = document.createElement('article');
    c.className = 'gal-card'; c.dataset.id = def.id;

    var mini = document.createElement('div'); mini.className = 'gal-mini';
    if (def.miniatura) {
      var im = document.createElement('img');
      im.src = def.miniatura; im.alt = 'Vista previa de ' + def.nombre; im.loading = 'lazy';
      mini.classList.add('con-imagen'); mini.appendChild(im);
    } else {
      var f = document.createElement('iframe');
      f.tabIndex = -1; f.title = 'Vista previa de ' + def.nombre; f.setAttribute('aria-hidden', 'true');
      f.dataset.doc = BP.biblioteca.documentoMiniatura(def);
      /* Los bloques bajitos (botones, separadores…) recortan el espacio en blanco de la vista previa */
      f.addEventListener('load', function () {
        try {
          var h = f.contentDocument.body.scrollHeight;
          if (h && h < BP.biblioteca.ALTO) {
            var esc = parseFloat(BP.$('galeriaRejilla').style.getPropertyValue('--esc')) || 0.3;
            mini.style.height = Math.max(70, Math.round((h + 4) * esc)) + 'px';
          }
        } catch (e) {}
      });
      if (observador) observador.observe(f); else f.srcdoc = f.dataset.doc;
      mini.appendChild(f);
    }

    var info = document.createElement('div'); info.className = 'gal-info';
    var cab = document.createElement('div'); cab.className = 'gal-cab';
    var t = document.createElement('h3'); t.textContent = def.nombre;
    var tag = document.createElement('span'); tag.className = 'cuenta'; tag.textContent = def.categoria;
    cab.appendChild(t); cab.appendChild(tag);
    var d = document.createElement('p'); d.textContent = def.descripcion;

    var acc = document.createElement('div'); acc.className = 'gal-acciones';
    var add = document.createElement('button'); add.type = 'button'; add.className = 'btn primario'; add.textContent = '+ Añadir a mi página';
    var ver = document.createElement('button'); ver.type = 'button'; ver.className = 'btn'; ver.textContent = '</> Ver código';
    var usado = document.createElement('span'); usado.className = 'gal-usado';
    acc.appendChild(add); acc.appendChild(ver); acc.appendChild(usado);

    info.appendChild(cab); info.appendChild(d);
    if (def.fuente) {
      var cr = document.createElement('p'); cr.className = 'gal-credito';
      cr.appendChild(document.createTextNode('Autor: ' + def.autor + ' · Licencia ' + def.licencia + ' · '));
      if (/^https?:\/\//.test(def.urlFuente || '')) {
        var a = document.createElement('a'); a.href = def.urlFuente; a.target = '_blank'; a.rel = 'noopener noreferrer';
        a.textContent = 'Original en ' + def.fuente; cr.appendChild(a);
      } else cr.appendChild(document.createTextNode(def.fuente));
      info.appendChild(cr);
    }
    info.appendChild(acc);
    c.appendChild(mini); c.appendChild(info);

    add.addEventListener('click', function () {
      BP.lienzo.agregarBloque(def.id);
      BP.aviso('«' + def.nombre + '» añadido a tu página');
    });
    ver.addEventListener('click', function () { BP.biblioteca.abrirModal(def); });
    return c;
  }

  function marcarUsados() {
    [].forEach.call(document.querySelectorAll('.gal-card'), function (c) {
      var n = cuantos(c.dataset.id), u = c.querySelector('.gal-usado');
      u.textContent = n ? '✓ En tu página' + (n > 1 ? ' ×' + n : '') : '';
    });
    var total = BP.lienzo.bloques().length;
    BP.$('cuentaBarra').textContent = total;
  }

  function pintar() {
    var cont = BP.$('galeriaRejilla');
    cont.innerHTML = '';
    var lista = filtrar();
    if (!lista.length) {
      var v = document.createElement('p');
      v.className = 'bv-vacio';
      v.textContent = estado.conjunto === 'pro' && !BP.bloquesPro.length
        ? 'La biblioteca Pro todavía está vacía. Aquí aparecerán los bloques adaptados de ejemplos externos, con su autor y enlace original.'
        : 'No hay bloques que coincidan con tu búsqueda.';
      cont.appendChild(v); return;
    }
    if (observador) observador.disconnect();
    observador = ('IntersectionObserver' in window) ? new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (!en.isIntersecting) return;
        var f = en.target; observador.unobserve(f); f.srcdoc = f.dataset.doc;
      });
    }, { root: BP.$('galeriaCuerpo'), rootMargin: '300px' }) : null;
    lista.forEach(function (def) { cont.appendChild(tarjeta(def)); });
    ajustarEscala(); marcarUsados();
  }

  /* Las miniaturas se dibujan a 1200 px y se reducen al ancho de la tarjeta */
  function ajustarEscala() {
    var m = document.querySelector('.gal-mini');
    if (!m || !m.clientWidth) return;
    var esc = m.clientWidth / BP.biblioteca.ANCHO;
    var r = BP.$('galeriaRejilla');
    r.style.setProperty('--esc', esc.toFixed(4));
    r.style.setProperty('--alto-mini', Math.round(BP.biblioteca.ALTO * esc) + 'px');
  }

  function elegirConjunto(c) {
    estado.conjunto = c; estado.categoria = 'Todas';
    [].forEach.call(document.querySelectorAll('#galeriaConjuntos button'), function (b) {
      b.classList.toggle('activo', b.dataset.conjunto === c);
    });
    pintarCategorias(); pintar();
  }

  function abrir(conjunto) {
    if (conjunto === 'base' || conjunto === 'pro') elegirConjunto(conjunto);
    document.body.dataset.vista = 'biblioteca';
    BP.$('vistaBiblioteca').hidden = false;
    BP.emitir('cerrar-paneles');
    ajustarEscala(); marcarUsados();
    BP.$('galeriaBuscar').focus();
  }
  function cerrar() {
    document.body.dataset.vista = 'editor';
    BP.$('vistaBiblioteca').hidden = true;
    setTimeout(BP.lienzo.ubicarBarra, 60);
  }
  function alternar() { if (document.body.dataset.vista === 'biblioteca') cerrar(); else abrir('base'); }

  BP.galeria = {
    iniciar: function () {
      document.body.dataset.vista = 'editor';
      pintarCategorias(); pintar();
      BP.$('galeriaBuscar').addEventListener('input', function (e) { estado.busqueda = e.target.value; pintar(); });
      BP.$('btnBiblioteca').addEventListener('click', alternar);
      BP.$('btnBibliotecaPanel').addEventListener('click', function () { abrir('base'); });
      BP.$('btnPro').addEventListener('click', function () { abrir('pro'); });
      [].forEach.call(document.querySelectorAll('#galeriaConjuntos button'), function (b) {
        b.addEventListener('click', function () { elegirConjunto(b.dataset.conjunto); });
      });
      BP.$('galeriaVolver').addEventListener('click', cerrar);
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && document.body.dataset.vista === 'biblioteca' && BP.$('modal').hidden) cerrar();
      });
      BP.on('cambio', marcarUsados);
      BP.on('historial', marcarUsados);
      if (window.ResizeObserver) new ResizeObserver(ajustarEscala).observe(BP.$('galeriaCuerpo'));
      BP.on('tema', BP.debounce(function () {
        [].forEach.call(document.querySelectorAll('.gal-mini iframe'), function (f) {
          var def = BP.bloque(f.closest('.gal-card').dataset.id);
          f.dataset.doc = BP.biblioteca.documentoMiniatura(def);
          if (f.srcdoc) f.srcdoc = f.dataset.doc;
        });
      }, 250));
    },
    abrir: abrir, cerrar: cerrar
  };
})();
