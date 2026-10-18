/* ==========================================================
   Arranque del editor
   ========================================================== */
(function () {
  'use strict';
  var BP = window.BP;

  /* Página de ejemplo para que el primer uso no empiece vacío */
  var INICIO = ['nav-simple', 'hero-dividido', 'caracteristicas'];

  function arrancar() {
    BP.lienzo.iniciar(BP.$('lienzo'), function () {
      if (!BP.lienzo.cargarGuardado()) {
        INICIO.forEach(function (id) { BP.lienzo.agregarBloque(id, BP.lienzo.bloques().length); });
        BP.lienzo.seleccionar(null);
      }
      BP.historial.reiniciar();

      BP.biblioteca.iniciar();
      BP.capas.iniciar();
      BP.props.iniciar();
      BP.codigo.iniciar();
      BP.galeria.iniciar();
      BP.barra.iniciar();
      BP.asistente.iniciar();
      BP.emitir('cambio');
    });
  }

  arrancar();
})();
