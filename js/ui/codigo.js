/* ==========================================================
   Panel de código: muestra en vivo el HTML y CSS de la página
   ========================================================== */
(function () {
  'use strict';
  var BP = window.BP = window.BP || {};

  var pestana = 'html', visible = false;

  function texto() {
    if (pestana === 'css') return BP.exportar.css();
    if (pestana === 'todo') return BP.exportar.documento();
    return BP.exportar.html(0);
  }

  function pintar() {
    if (!visible) return;
    var t = texto();
    BP.$('codigoSalida').innerHTML = BP.resaltar(t, pestana === 'css' ? 'css' : 'html');
    var lineas = t.split('\n').length - 1;
    var bloques = BP.lienzo.bloques().length;
    BP.$('codigoPie').textContent = bloques + (bloques === 1 ? ' bloque' : ' bloques') + ' · ' + lineas + ' líneas · ' + t.length.toLocaleString('es') + ' caracteres';
    [].forEach.call(document.querySelectorAll('[data-codigo]'), function (b) {
      b.classList.toggle('activo', b.dataset.codigo === pestana);
    });
  }

  BP.codigo = {
    iniciar: function () {
      var lento = BP.debounce(pintar, 120);
      BP.on('vivo', lento);
      BP.on('cambio', pintar);
      BP.on('tema', lento);
      [].forEach.call(document.querySelectorAll('[data-codigo]'), function (b) {
        b.addEventListener('click', function () { pestana = b.dataset.codigo; pintar(); });
      });
      BP.$('copiarCodigo').addEventListener('click', function () { BP.copiar(texto(), 'Código copiado'); });
      BP.$('descargarCodigo').addEventListener('click', function () {
        BP.descargar('pagina.html', BP.exportar.documento());
        BP.aviso('Descarga iniciada');
      });
    },
    /* El panel solo trabaja cuando se ve, para no gastar recursos */
    mostrar: function (v) { visible = v; pintar(); },
    actualizar: pintar
  };
})();
