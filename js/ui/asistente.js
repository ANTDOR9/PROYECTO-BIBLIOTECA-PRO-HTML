/* ==========================================================
   Asistente IA: botón flotante + panel de chat.
   Dos modos:
   - CONSTRUCTOR IA (por defecto): arma y ajusta la página con acciones.
   - INTÉRPRETE IA (modo potente, interfaz roja): entiende peticiones vagas.
   Los modelos se conectan como "proveedores" en BP.ia.proveedores
   (ver README). Mientras no haya proveedor, se puede probar el
   sistema de acciones pegando un plan en JSON.
   ========================================================== */
(function () {
  'use strict';
  var BP = window.BP = window.BP || {};
  var CLAVE = 'bph-chat-v1', MAX_MENSAJES = 60;

  var modo = 'constructor', historial = [], el = {};

  var EJEMPLO = '{"acciones":[\n  {"accion":"agregar_bloque","id":"precios","posicion":"final"},\n  {"accion":"cambiar_tema","primario":"#e5484d","radio":20}\n]}';

  var NOMBRES = { constructor: 'Constructor IA', interprete: 'Intérprete IA' };

  function crear(tag, cls, txt) { var n = document.createElement(tag); if (cls) n.className = cls; if (txt != null) n.textContent = txt; return n; }

  /* ---------- Historial del chat ---------- */
  function cargar() {
    try { var d = JSON.parse(localStorage.getItem(CLAVE)); if (Array.isArray(d)) historial = d.slice(-MAX_MENSAJES); } catch (e) {}
  }
  function guardar() {
    try { localStorage.setItem(CLAVE, JSON.stringify(historial.slice(-MAX_MENSAJES))); } catch (e) {}
  }

  /* ---------- Mensajes ---------- */
  function desplazar() { el.mensajes.scrollTop = el.mensajes.scrollHeight; }

  function burbuja(m) {
    var b = crear('div', 'ia-msg ia-' + m.rol);
    if (m.rol === 'ia' && m.modo) b.appendChild(crear('span', 'ia-etiqueta', NOMBRES[m.modo] || 'IA'));
    b.appendChild(crear('p', null, m.texto));
    el.mensajes.appendChild(b);
    return b;
  }

  function pintarTodo() {
    el.mensajes.innerHTML = '';
    if (!historial.length) {
      var v = crear('div', 'ia-vacio');
      v.appendChild(crear('p', null, 'Pide cambios en tu página con tus palabras: agregar bloques, moverlos, cambiar textos, colores o imágenes.'));
      v.appendChild(crear('p', 'ia-nota', 'El modelo aún no está conectado (se conecta en el siguiente paso). Mientras tanto puedes probar las acciones con un plan en JSON.'));
      var b = crear('button', 'btn', 'Cargar un plan de ejemplo');
      b.type = 'button';
      b.addEventListener('click', function () { el.texto.value = EJEMPLO; el.texto.focus(); });
      v.appendChild(b);
      el.mensajes.appendChild(v);
      return;
    }
    historial.forEach(burbuja);
    desplazar();
  }

  function decir(rol, texto, m) {
    var msg = { rol: rol, texto: texto, modo: m || modo };
    historial.push(msg); guardar();
    if (historial.length === 1) pintarTodo(); else { burbuja(msg); desplazar(); }
  }

  /* ---------- Tarjeta de plan (resumen + Aplicar / Descartar) ---------- */
  function tarjetaPlan(res) {
    var t = crear('div', 'ia-plan');
    t.appendChild(crear('strong', null, 'Esto es lo que haré:'));
    var ul = crear('ul');
    res.items.forEach(function (it) {
      var li = crear('li', it.error ? 'mal' : 'bien');
      li.appendChild(crear('span', 'ia-marca', it.error ? '⚠' : '✓'));
      var txt = crear('span', null, it.resumen);
      li.appendChild(txt);
      if (it.error) li.appendChild(crear('em', null, ' — ' + it.error));
      ul.appendChild(li);
    });
    t.appendChild(ul);
    var fila = crear('div', 'ia-plan-acc');
    var ok = crear('button', 'btn primario', res.validas === res.items.length ? 'Aplicar' : 'Aplicar las ' + res.validas + ' válidas');
    ok.type = 'button'; ok.disabled = !res.validas;
    var no = crear('button', 'btn', 'Descartar'); no.type = 'button';
    fila.appendChild(ok); fila.appendChild(no); t.appendChild(fila);

    ok.addEventListener('click', function () {
      ok.disabled = no.disabled = true;
      var r = BP.ia.aplicar(res);
      t.remove();
      var txt = r.hechas === 1 ? 'Hecho: 1 cambio aplicado.' : 'Hecho: ' + r.hechas + ' cambios aplicados.';
      if (r.fallos.length) txt += ' No se pudo: ' + r.fallos.join('; ') + '.';
      decir('sistema', txt + ' Puedes deshacerlo con Ctrl+Z.');
      var ultimo = el.mensajes.lastElementChild;
      var d = crear('button', 'btn ia-deshacer', '↶ Deshacer todo'); d.type = 'button';
      d.addEventListener('click', function () { BP.historial.deshacer(); d.remove(); BP.aviso('Cambios deshechos'); });
      if (ultimo) ultimo.appendChild(d);
    });
    no.addEventListener('click', function () { t.remove(); decir('sistema', 'Plan descartado. No se cambió nada.'); });
    el.mensajes.appendChild(t); desplazar();
  }

  function mostrarPlan(plan) {
    var res;
    try { res = BP.ia.validar(plan); } catch (e) { decir('sistema', 'No pude usar ese plan: ' + e.message + '.'); return; }
    if (!res.items.length) { decir('sistema', 'El plan no tiene acciones.'); return; }
    tarjetaPlan(res);
  }

  /* ---------- Enviar ---------- */
  /* Solo proveedores registrados a propósito (evita propiedades heredadas como «constructor») */
  function proveedor() {
    var P = BP.ia.proveedores || {};
    return Object.prototype.hasOwnProperty.call(P, modo) ? P[modo] : null;
  }

  function pareceJSON(t) { t = t.trim(); return /^[\[{]/.test(t) || /^```/.test(t); }

  function enviar() {
    var texto = el.texto.value.trim();
    if (!texto) return;
    el.texto.value = '';
    decir('usuario', texto);

    if (pareceJSON(texto)) { mostrarPlan(texto); return; }

    var prov = proveedor();
    if (!prov) {
      decir('sistema', modo === 'constructor'
        ? 'El Constructor IA todavía no está conectado. Mientras tanto puedes pegar un plan en JSON para probar las acciones.'
        : 'El Intérprete IA todavía no está conectado.');
      return;
    }
    el.enviar.disabled = true;
    var espera = crear('div', 'ia-msg ia-sistema'); espera.appendChild(crear('p', null, 'Pensando…'));
    el.mensajes.appendChild(espera); desplazar();
    Promise.resolve(prov.planificar({ mensaje: texto, historial: historial.slice(-12), contexto: BP.ia.contexto() }))
      .then(function (r) {
        espera.remove();
        if (r && r.texto) decir('ia', r.texto);
        if (r && r.plan) mostrarPlan(r.plan);
      })
      .catch(function (e) { espera.remove(); decir('sistema', 'Error del modelo: ' + (e && e.message ? e.message : e)); })
      .then(function () { el.enviar.disabled = false; });
  }

  /* ---------- Estado y modos ---------- */
  function pintarEstado() {
    var prov = proveedor();
    var conectado = !!(prov && (prov.conectado ? prov.conectado() : true));
    el.estado.textContent = conectado ? '● Conectado' : '● Sin conexión';
    el.estado.className = conectado ? 'ia-estado ok' : 'ia-estado';
  }

  function ponerModo(m) {
    modo = m;
    el.panel.dataset.modo = m;
    el.btn.dataset.modo = m;
    el.nombre.textContent = NOMBRES[m];
    el.potente.hidden = m !== 'interprete';
    [].forEach.call(el.panel.querySelectorAll('[data-m]'), function (b) { b.classList.toggle('activo', b.dataset.m === m); });
    el.texto.placeholder = m === 'constructor'
      ? 'Ej.: agrega unos precios al final y pon el fondo del título en azul'
      : 'Escribe con libertad, aunque sea algo vago: «que se vea más elegante»';
    pintarEstado();
  }

  function abrir(v) {
    el.panel.hidden = !v;
    el.btn.setAttribute('aria-expanded', v ? 'true' : 'false');
    el.btn.classList.toggle('abierto', v);
    if (v) { pintarEstado(); setTimeout(function () { el.texto.focus(); }, 30); }
  }

  BP.asistente = {
    iniciar: function () {
      cargar();

      el.btn = crear('button', 'ia-btn');
      el.btn.type = 'button'; el.btn.id = 'iaBtn';
      el.btn.setAttribute('aria-label', 'Abrir el asistente de IA'); el.btn.setAttribute('aria-expanded', 'false');
      el.btn.innerHTML = '<span aria-hidden="true">✨</span><span class="ia-btn-txt">IA</span>';

      el.panel = crear('section', 'ia-panel');
      el.panel.id = 'iaPanel'; el.panel.hidden = true; el.panel.dataset.modo = 'constructor';
      el.panel.setAttribute('role', 'dialog'); el.panel.setAttribute('aria-label', 'Asistente de IA');

      var cab = crear('div', 'ia-cab');
      var tit = crear('div', 'ia-titulo');
      el.nombre = crear('strong', null, NOMBRES.constructor);
      el.estado = crear('small', 'ia-estado', '● Sin conexión');
      tit.appendChild(el.nombre); tit.appendChild(el.estado);
      var modos = crear('div', 'grupo ia-modos'); modos.setAttribute('role', 'group'); modos.setAttribute('aria-label', 'Modo de la IA');
      [['constructor', 'Constructor'], ['interprete', 'Intérprete']].forEach(function (p) {
        var b = crear('button', p[0] === 'constructor' ? 'activo' : '', p[1]);
        b.type = 'button'; b.dataset.m = p[0];
        b.addEventListener('click', function () { ponerModo(p[0]); });
        modos.appendChild(b);
      });
      var nuevo = crear('button', 'ico', '↺'); nuevo.type = 'button'; nuevo.title = 'Nuevo chat'; nuevo.setAttribute('aria-label', 'Nuevo chat');
      nuevo.addEventListener('click', function () { historial = []; guardar(); pintarTodo(); });
      var cerrar = crear('button', 'ico', '✕'); cerrar.type = 'button'; cerrar.title = 'Cerrar'; cerrar.setAttribute('aria-label', 'Cerrar el asistente');
      cerrar.addEventListener('click', function () { abrir(false); el.btn.focus(); });
      cab.appendChild(tit); cab.appendChild(modos); cab.appendChild(nuevo); cab.appendChild(cerrar);

      el.potente = crear('div', 'ia-potente', 'MODO POTENTE · entiende peticiones vagas y las convierte en instrucciones precisas'); el.potente.hidden = true;
      el.mensajes = crear('div', 'ia-mensajes'); el.mensajes.setAttribute('role', 'log'); el.mensajes.setAttribute('aria-live', 'polite');

      var form = crear('form', 'ia-form');
      el.texto = crear('textarea'); el.texto.rows = 2; el.texto.setAttribute('aria-label', 'Mensaje para la IA');
      el.enviar = crear('button', 'btn primario', 'Enviar'); el.enviar.type = 'submit';
      form.appendChild(el.texto); form.appendChild(el.enviar);
      form.addEventListener('submit', function (e) { e.preventDefault(); enviar(); });
      el.texto.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviar(); }
        if (e.key !== 'Escape') e.stopPropagation();
      });

      el.panel.appendChild(cab); el.panel.appendChild(el.potente); el.panel.appendChild(el.mensajes); el.panel.appendChild(form);
      document.body.appendChild(el.panel); document.body.appendChild(el.btn);

      el.btn.addEventListener('click', function () { abrir(el.panel.hidden); });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !el.panel.hidden && BP.$('modal').hidden && document.body.dataset.vista !== 'biblioteca') abrir(false);
      });

      ponerModo('constructor');
      pintarTodo();
    },
    abrir: abrir
  };
})();
