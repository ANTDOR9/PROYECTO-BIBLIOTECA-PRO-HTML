/* ==========================================================
   Barra superior: tamaños de pantalla, modos de vista,
   deshacer/rehacer, probar, descargar y paneles en pantallas chicas
   ========================================================== */
(function () {
  'use strict';
  var BP = window.BP = window.BP || {};

  function esCampo(t) { return t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName); }

  /* Atajos de teclado (también se usan desde dentro del lienzo) */
  BP.atajos = function (e) {
    if (!(e.ctrlKey || e.metaKey)) return false;
    var k = e.key.toLowerCase();
    if (k === 'z' && !e.shiftKey) { e.preventDefault(); BP.historial.deshacer(); return true; }
    if (k === 'y' || (k === 'z' && e.shiftKey)) { e.preventDefault(); BP.historial.rehacer(); return true; }
    return false;
  };

  function modo(m) {
    BP.$('centro').dataset.modo = m;
    [].forEach.call(document.querySelectorAll('#grupoModo button'), function (b) { b.classList.toggle('activo', b.dataset.modo === m); });
    BP.codigo.mostrar(m !== 'visual');
    setTimeout(BP.lienzo.ubicarBarra, 50);
  }

  function cerrarPaneles() {
    BP.$('panelIzq').classList.remove('abierto');
    BP.$('panelDer').classList.remove('abierto');
    BP.$('velo').hidden = true;
  }
  function alternarPanel(id) {
    var p = BP.$(id), abrir = !p.classList.contains('abierto');
    cerrarPaneles();
    if (abrir) { p.classList.add('abierto'); BP.$('velo').hidden = false; if (id === 'panelIzq') setTimeout(BP.biblioteca.ajustarEscala, 50); }
  }

  BP.barra = {
    iniciar: function () {
      /* Tamaño de pantalla */
      [].forEach.call(document.querySelectorAll('#grupoVista button'), function (b) {
        b.addEventListener('click', function () {
          [].forEach.call(document.querySelectorAll('#grupoVista button'), function (x) { x.classList.toggle('activo', x === b); });
          BP.$('lienzo').style.width = b.dataset.ancho;
          BP.$('lienzo').classList.toggle('con-marco', b.dataset.ancho !== '100%');
          setTimeout(BP.lienzo.ubicarBarra, 280);
        });
      });

      /* Modo visual / dividido / código */
      [].forEach.call(document.querySelectorAll('#grupoModo button'), function (b) {
        b.addEventListener('click', function () { modo(b.dataset.modo); });
      });

      /* Deshacer y rehacer */
      BP.$('btnDeshacer').addEventListener('click', function () { BP.historial.deshacer(); });
      BP.$('btnRehacer').addEventListener('click', function () { BP.historial.rehacer(); });
      BP.on('historial', function (s) {
        BP.$('btnDeshacer').disabled = !s.deshacer;
        BP.$('btnRehacer').disabled = !s.rehacer;
      });

      /* Probar y descargar */
      BP.$('btnProbar').addEventListener('click', function () {
        var blob = new Blob([BP.exportar.documento()], { type: 'text/html;charset=utf-8' });
        var url = URL.createObjectURL(blob);
        var w = window.open(url, '_blank');
        if (!w) BP.aviso('El navegador bloqueó la pestaña nueva');
        setTimeout(function () { URL.revokeObjectURL(url); }, 60000);
      });
      BP.$('btnDescargar').addEventListener('click', function () {
        BP.descargar('pagina.html', BP.exportar.documento());
        BP.aviso('Descarga iniciada');
      });

      /* Tema del editor (claro / oscuro) */
      BP.$('btnTema').addEventListener('click', function () {
        var r = document.documentElement, claro = r.dataset.tema === 'claro';
        if (claro) delete r.dataset.tema; else r.dataset.tema = 'claro';
        BP.$('btnTema').textContent = claro ? '🌙' : '☀️';
        try { localStorage.setItem('bph-tema-editor', claro ? 'oscuro' : 'claro'); } catch (e) {}
      });
      try {
        if (localStorage.getItem('bph-tema-editor') === 'claro') { document.documentElement.dataset.tema = 'claro'; BP.$('btnTema').textContent = '☀️'; }
      } catch (e) {}

      /* Pestañas del panel izquierdo */
      [].forEach.call(document.querySelectorAll('.pestanas-panel button'), function (b) {
        b.addEventListener('click', function () {
          [].forEach.call(document.querySelectorAll('.pestanas-panel button'), function (x) { x.classList.toggle('activo', x === b); });
          BP.$('vistaBloques').hidden = b.dataset.vista !== 'bloques';
          BP.$('vistaCapas').hidden = b.dataset.vista !== 'capas';
          if (b.dataset.vista === 'bloques') BP.biblioteca.ajustarEscala();
        });
      });

      /* Paneles en pantallas pequeñas */
      BP.$('btnPanelIzq').addEventListener('click', function () { alternarPanel('panelIzq'); });
      BP.$('btnPanelDer').addEventListener('click', function () { alternarPanel('panelDer'); });
      BP.$('velo').addEventListener('click', cerrarPaneles);
      BP.on('cerrar-paneles', cerrarPaneles);
      BP.on('seleccion', function (el) {
        if (el && document.body.dataset.vista !== 'biblioteca' && window.matchMedia('(max-width:1100px)').matches) {
          cerrarPaneles(); BP.$('panelDer').classList.add('abierto'); BP.$('velo').hidden = false;
        }
      });

      /* Atajos desde fuera del lienzo */
      document.addEventListener('keydown', function (e) {
        if (esCampo(e.target)) return;
        BP.atajos(e);
      });
    }
  };
})();
