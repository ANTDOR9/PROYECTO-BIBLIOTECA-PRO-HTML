/* ==========================================================
   Capas: lista ordenada de los bloques de la página
   ========================================================== */
(function () {
  'use strict';
  var BP = window.BP = window.BP || {};

  var desde = null;

  function pintar() {
    var cont = BP.$('listaCapas');
    var bloques = BP.lienzo.bloques();
    var activo = BP.lienzo.seleccionado() ? BP.lienzo.bloqueDe(BP.lienzo.seleccionado()) : null;
    BP.$('cuentaCapas').textContent = bloques.length;
    cont.innerHTML = '';

    if (!bloques.length) {
      var v = document.createElement('p');
      v.className = 'ayuda-panel'; v.textContent = 'Todavía no hay bloques. Añade uno desde la pestaña Bloques.';
      cont.appendChild(v); return;
    }

    bloques.forEach(function (b, i) {
      var fila = document.createElement('div');
      fila.className = 'capa' + (b === activo ? ' activa' : '');
      fila.draggable = true;
      fila.dataset.i = i;

      var asa = document.createElement('span'); asa.className = 'capa-asa'; asa.textContent = '⠿'; asa.setAttribute('aria-hidden', 'true');
      var nombre = document.createElement('button');
      nombre.type = 'button'; nombre.className = 'capa-nombre'; nombre.textContent = BP.nombreElemento(b);
      nombre.addEventListener('click', function () { BP.lienzo.seleccionar(b); BP.lienzo.verBloque(b); });

      var acc = document.createElement('span'); acc.className = 'capa-acciones';
      [['↑', 'Subir', function () { BP.lienzo.moverHermano(b, -1); }],
       ['↓', 'Bajar', function () { BP.lienzo.moverHermano(b, 1); }],
       ['⧉', 'Duplicar', function () { BP.lienzo.duplicar(b); }],
       ['✕', 'Eliminar', function () { BP.lienzo.eliminar(b); }]].forEach(function (a) {
        var x = document.createElement('button');
        x.type = 'button'; x.textContent = a[0]; x.title = a[1]; x.setAttribute('aria-label', a[1] + ' ' + nombre.textContent);
        x.addEventListener('click', function (e) { e.stopPropagation(); a[2](); });
        acc.appendChild(x);
      });

      fila.appendChild(asa); fila.appendChild(nombre); fila.appendChild(acc);

      fila.addEventListener('dragstart', function (e) {
        desde = i; e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', 'capa');
        fila.classList.add('arrastrando');
      });
      fila.addEventListener('dragend', function () { desde = null; fila.classList.remove('arrastrando'); limpiarMarcas(); });
      fila.addEventListener('dragover', function (e) {
        if (desde === null) return;
        e.preventDefault();
        var r = fila.getBoundingClientRect(), antes = e.clientY < r.top + r.height / 2;
        limpiarMarcas();
        fila.classList.add(antes ? 'marca-antes' : 'marca-despues');
      });
      fila.addEventListener('drop', function (e) {
        if (desde === null) return;
        e.preventDefault();
        var r = fila.getBoundingClientRect(), antes = e.clientY < r.top + r.height / 2;
        var destino = antes ? i : i + 1, origen = desde;
        desde = null; limpiarMarcas();
        BP.lienzo.moverBloqueIndice(origen, destino);
      });
      cont.appendChild(fila);
    });
  }

  function limpiarMarcas() {
    [].forEach.call(document.querySelectorAll('.capa'), function (c) { c.classList.remove('marca-antes', 'marca-despues'); });
  }

  BP.capas = {
    iniciar: function () {
      BP.on('cambio', pintar);
      BP.on('seleccion', pintar);
      pintar();
    }
  };
})();
