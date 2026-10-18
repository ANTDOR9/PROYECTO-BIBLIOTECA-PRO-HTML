/* ==========================================================
   Biblioteca Pro HTML — Lógica de la aplicación
   Índice: 1 Estado · 2 Utilidades · 3 Render · 4 Modal · 5 Eventos
   ========================================================== */
(function () {
  'use strict';

  /* 1. Estado ----------------------------------------------- */
  var componentes = window.COMPONENTES || [];
  var estado = { categoria: 'Todos', busqueda: '', actual: null, lenguaje: 'html' };

  var $ = function (id) { return document.getElementById(id); };
  var el = {
    categorias: $('listaCategorias'), cuadricula: $('cuadricula'), vacio: $('mensajeVacio'),
    titulo: $('tituloSeccion'), contador: $('contadorResultados'), total: $('totalComponentes'),
    buscar: $('buscar'), lateral: $('lateral'), botonMenu: $('botonMenu'), botonTema: $('botonTema'),
    modal: $('modal'), modalTitulo: $('modalTitulo'), modalDesc: $('modalDescripcion'),
    vista: $('vistaPrevia'), codigo: $('bloqueCodigo'), aviso: $('aviso')
  };

  /* 2. Utilidades ------------------------------------------- */
  function normalizar(t) {
    return String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  function armarDocumento(c) {
    return '<!DOCTYPE html>\n<html lang="es">\n<head>\n<meta charset="UTF-8">\n' +
      '<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
      '<title>' + c.nombre + '</title>\n<style>\n' + (c.css || '') + '\n</style>\n</head>\n<body>\n' +
      c.html + '\n' + (c.js ? '<script>\n' + c.js + '\n<\/script>\n' : '') + '</body>\n</html>';
  }

  function mostrarAviso(texto) {
    el.aviso.textContent = texto;
    el.aviso.hidden = false;
    clearTimeout(mostrarAviso.t);
    mostrarAviso.t = setTimeout(function () { el.aviso.hidden = true; }, 2200);
  }

  function copiar(texto) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(texto);
    }
    return new Promise(function (ok, fallo) {
      var a = document.createElement('textarea');
      a.value = texto; document.body.appendChild(a); a.select();
      try { document.execCommand('copy') ? ok() : fallo(); } catch (e) { fallo(e); }
      a.remove();
    });
  }

  /* 3. Render ----------------------------------------------- */
  function categoriasDisponibles() {
    var mapa = {};
    componentes.forEach(function (c) { mapa[c.categoria] = (mapa[c.categoria] || 0) + 1; });
    var lista = [{ nombre: 'Todos', n: componentes.length }];
    Object.keys(mapa).sort().forEach(function (k) { lista.push({ nombre: k, n: mapa[k] }); });
    return lista;
  }

  function pintarCategorias() {
    el.categorias.innerHTML = '';
    categoriasDisponibles().forEach(function (cat) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'categoria' + (cat.nombre === estado.categoria ? ' activa' : '');
      b.innerHTML = '<span></span><span class="cuenta">' + cat.n + '</span>';
      b.firstChild.textContent = cat.nombre;
      b.addEventListener('click', function () {
        estado.categoria = cat.nombre;
        el.lateral.classList.remove('abierto');
        el.botonMenu.setAttribute('aria-expanded', 'false');
        pintarCategorias(); pintarCuadricula();
      });
      el.categorias.appendChild(b);
    });
  }

  function filtrar() {
    var q = normalizar(estado.busqueda);
    return componentes.filter(function (c) {
      if (estado.categoria !== 'Todos' && c.categoria !== estado.categoria) return false;
      if (!q) return true;
      var texto = normalizar([c.nombre, c.descripcion, c.categoria, c.autor, (c.etiquetas || []).join(' ')].join(' '));
      return texto.indexOf(q) !== -1;
    });
  }

  function pintarCuadricula() {
    var lista = filtrar();
    el.cuadricula.innerHTML = '';
    el.titulo.textContent = estado.categoria === 'Todos' ? 'Todos los componentes' : estado.categoria;
    el.contador.textContent = lista.length + (lista.length === 1 ? ' resultado' : ' resultados');
    el.vacio.hidden = lista.length > 0;

    lista.forEach(function (c) {
      var t = document.createElement('button');
      t.type = 'button';
      t.className = 'ficha-tarjeta';
      t.setAttribute('aria-label', 'Abrir ' + c.nombre);

      var mini = document.createElement('div');
      mini.className = 'ficha-miniatura';
      var f = document.createElement('iframe');
      f.setAttribute('sandbox', 'allow-scripts');
      f.setAttribute('loading', 'lazy');
      f.setAttribute('tabindex', '-1');
      f.title = 'Miniatura de ' + c.nombre;
      f.srcdoc = armarDocumento(c);
      mini.appendChild(f);

      var info = document.createElement('div');
      info.className = 'ficha-info';
      var h = document.createElement('h3'); h.textContent = c.nombre;
      var p = document.createElement('p'); p.textContent = c.descripcion;
      var chips = document.createElement('div'); chips.className = 'chips';
      var n = document.createElement('span'); n.className = 'chip nivel'; n.textContent = c.nivel;
      chips.appendChild(n);
      (c.etiquetas || []).slice(0, 2).forEach(function (e) {
        var s = document.createElement('span'); s.className = 'chip'; s.textContent = e; chips.appendChild(s);
      });
      info.appendChild(h); info.appendChild(p); info.appendChild(chips);

      t.appendChild(mini); t.appendChild(info);
      t.addEventListener('click', function () { abrirModal(c); });
      el.cuadricula.appendChild(t);
    });
  }

  /* 4. Modal ------------------------------------------------ */
  function mostrarCodigo() {
    var c = estado.actual; if (!c) return;
    el.codigo.textContent = c[estado.lenguaje] || '/* Este componente no usa ' + estado.lenguaje.toUpperCase() + ' */';
    document.querySelectorAll('.pestanas button').forEach(function (b) {
      b.classList.toggle('activo', b.dataset.lenguaje === estado.lenguaje);
    });
  }

  function abrirModal(c) {
    estado.actual = c; estado.lenguaje = 'html';
    el.modalTitulo.textContent = c.nombre;
    el.modalDesc.textContent = c.descripcion;
    el.vista.srcdoc = armarDocumento(c);
    $('fichaCategoria').textContent = c.categoria;
    $('fichaNivel').textContent = c.nivel;
    $('fichaAutor').textContent = c.autor;
    $('fichaLicencia').textContent = c.licencia;
    $('fichaEtiquetas').textContent = (c.etiquetas || []).join(', ');
    document.querySelectorAll('.grupo-botones button').forEach(function (b, i) { b.classList.toggle('activo', i === 0); });
    el.vista.style.width = '100%';
    mostrarCodigo();
    el.modal.hidden = false;
    document.body.style.overflow = 'hidden';
    $('cerrarModal').focus();
  }

  function cerrarModal() {
    el.modal.hidden = true;
    el.vista.srcdoc = '';
    document.body.style.overflow = '';
  }

  /* 5. Eventos ---------------------------------------------- */
  el.buscar.addEventListener('input', function (e) { estado.busqueda = e.target.value; pintarCuadricula(); });
  el.botonMenu.addEventListener('click', function () {
    var abierto = el.lateral.classList.toggle('abierto');
    el.botonMenu.setAttribute('aria-expanded', String(abierto));
  });
  el.botonTema.addEventListener('click', function () {
    var raiz = document.documentElement;
    var claro = raiz.dataset.tema === 'claro';
    if (claro) { delete raiz.dataset.tema; } else { raiz.dataset.tema = 'claro'; }
    el.botonTema.textContent = claro ? '🌙' : '☀️';
    try { localStorage.setItem('bph-tema', claro ? 'oscuro' : 'claro'); } catch (e) {}
  });
  $('cerrarModal').addEventListener('click', cerrarModal);
  el.modal.addEventListener('click', function (e) { if (e.target === el.modal) cerrarModal(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !el.modal.hidden) cerrarModal(); });

  document.querySelectorAll('.pestanas button').forEach(function (b) {
    b.addEventListener('click', function () { estado.lenguaje = b.dataset.lenguaje; mostrarCodigo(); });
  });
  document.querySelectorAll('.grupo-botones button').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('.grupo-botones button').forEach(function (x) { x.classList.remove('activo'); });
      b.classList.add('activo');
      el.vista.style.width = b.dataset.ancho;
    });
  });

  $('copiarCodigo').addEventListener('click', function () {
    copiar(el.codigo.textContent).then(
      function () { mostrarAviso('Código copiado'); },
      function () { mostrarAviso('No se pudo copiar'); }
    );
  });
  $('descargarPagina').addEventListener('click', function () {
    var c = estado.actual; if (!c) return;
    var blob = new Blob([armarDocumento(c)], { type: 'text/html;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = c.id + '.html';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    mostrarAviso('Descarga iniciada');
  });

  /* Inicio */
  try {
    if (localStorage.getItem('bph-tema') === 'claro') {
      document.documentElement.dataset.tema = 'claro'; el.botonTema.textContent = '☀️';
    }
  } catch (e) {}
  el.total.textContent = componentes.length;
  pintarCategorias();
  pintarCuadricula();
})();
