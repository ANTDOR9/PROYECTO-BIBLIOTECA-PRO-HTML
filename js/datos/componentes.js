/* ==========================================================
   Catálogo de componentes
   ----------------------------------------------------------
   Para agregar uno nuevo, copia un bloque y cambia los campos:
   id · nombre · categoria · nivel · descripcion · etiquetas
   autor · licencia · html · css · js (opcional)
   Si copias código de otra fuente, indica su autor y licencia.
   ========================================================== */
const BASE = `*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;font-family:system-ui,-apple-system,"Segoe UI",sans-serif;background:#f4f6fb;color:#1b2036}`;
const BASE_OSCURA = `*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;font-family:system-ui,-apple-system,"Segoe UI",sans-serif;background:#0f1220;color:#e8eaf6}`;

window.COMPONENTES = [

/* ---------- BOTONES ---------- */
{
  id: 'boton-degradado',
  nombre: 'Botón degradado con brillo',
  categoria: 'Botones', nivel: 'Principiante',
  descripcion: 'Botón con degradado y un destello que cruza al pasar el cursor.',
  etiquetas: ['degradado', 'animación', 'llamada a la acción'],
  autor: 'Anthony', licencia: 'MIT',
  html: `<button class="boton">Comenzar ahora</button>`,
  css: BASE_OSCURA + `
.boton{position:relative;overflow:hidden;padding:14px 32px;border:0;border-radius:12px;font-size:1rem;font-weight:600;color:#fff;cursor:pointer;background:linear-gradient(135deg,#7c6cff,#38d6c4);transition:transform .2s,box-shadow .2s}
.boton::after{content:"";position:absolute;inset:0;background:linear-gradient(100deg,transparent 30%,rgba(255,255,255,.45) 50%,transparent 70%);transform:translateX(-120%);transition:transform .6s}
.boton:hover{transform:translateY(-2px);box-shadow:0 10px 24px rgba(124,108,255,.45)}
.boton:hover::after{transform:translateX(120%)}
.boton:active{transform:translateY(0)}
.boton:focus-visible{outline:3px solid #fff;outline-offset:3px}`
},
{
  id: 'boton-contorno',
  nombre: 'Botón contorno con relleno',
  categoria: 'Botones', nivel: 'Principiante',
  descripcion: 'Botón de borde simple que se rellena desde la izquierda.',
  etiquetas: ['contorno', 'hover', 'minimalista'],
  autor: 'Anthony', licencia: 'MIT',
  html: `<button class="boton">Ver detalles</button>`,
  css: BASE + `
.boton{position:relative;z-index:0;overflow:hidden;padding:12px 28px;border:2px solid #5b4bff;border-radius:10px;background:transparent;color:#5b4bff;font-size:1rem;font-weight:600;cursor:pointer;transition:color .3s}
.boton::before{content:"";position:absolute;inset:0;z-index:-1;background:#5b4bff;transform:scaleX(0);transform-origin:left;transition:transform .3s}
.boton:hover{color:#fff}
.boton:hover::before{transform:scaleX(1)}
.boton:focus-visible{outline:3px solid #38d6c4;outline-offset:3px}`
},
{
  id: 'boton-cargando',
  nombre: 'Botón con estado de carga',
  categoria: 'Botones', nivel: 'Intermedio',
  descripcion: 'Al hacer clic muestra un indicador de carga y vuelve a su estado normal.',
  etiquetas: ['carga', 'spinner', 'javascript'],
  autor: 'Anthony', licencia: 'MIT',
  html: `<button class="boton" id="enviar"><span class="giro" aria-hidden="true"></span><span class="texto">Enviar</span></button>`,
  css: BASE + `
.boton{display:inline-flex;align-items:center;gap:10px;padding:13px 28px;border:0;border-radius:10px;background:#1f9d6b;color:#fff;font-size:1rem;font-weight:600;cursor:pointer;transition:opacity .2s}
.boton[disabled]{opacity:.75;cursor:wait}
.giro{display:none;width:16px;height:16px;border:3px solid rgba(255,255,255,.4);border-top-color:#fff;border-radius:50%;animation:girar .7s linear infinite}
.boton.cargando .giro{display:inline-block}
@keyframes girar{to{transform:rotate(360deg)}}`,
  js: `var boton = document.getElementById('enviar');
var texto = boton.querySelector('.texto');
boton.addEventListener('click', function () {
  boton.disabled = true;
  boton.classList.add('cargando');
  texto.textContent = 'Enviando…';
  setTimeout(function () {
    boton.disabled = false;
    boton.classList.remove('cargando');
    texto.textContent = '¡Enviado!';
    setTimeout(function () { texto.textContent = 'Enviar'; }, 1500);
  }, 1800);
});`
},

/* ---------- TARJETAS ---------- */
{
  id: 'tarjeta-producto',
  nombre: 'Tarjeta de producto',
  categoria: 'Tarjetas', nivel: 'Principiante',
  descripcion: 'Tarjeta con imagen, precio, etiqueta de oferta y botón de compra.',
  etiquetas: ['tienda', 'producto', 'precio'],
  autor: 'Anthony', licencia: 'MIT',
  html: `<article class="tarjeta">
  <div class="imagen"><span class="oferta">-20%</span></div>
  <div class="cuerpo">
    <p class="categoria">Pantallas interactivas</p>
    <h3>Panel táctil 65"</h3>
    <p class="descripcion">Resolución 4K, ideal para aulas y salas de reuniones.</p>
    <div class="pie">
      <span class="precio">S/ 4,990 <s>S/ 6,240</s></span>
      <button>Cotizar</button>
    </div>
  </div>
</article>`,
  css: BASE + `
.tarjeta{width:300px;background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 12px 30px rgba(30,40,90,.15);transition:transform .25s}
.tarjeta:hover{transform:translateY(-6px)}
.imagen{position:relative;height:160px;background:linear-gradient(135deg,#7c6cff,#38d6c4)}
.oferta{position:absolute;top:12px;left:12px;background:#ff4d6d;color:#fff;font-weight:700;font-size:.8rem;padding:4px 10px;border-radius:99px}
.cuerpo{padding:18px 20px 20px}
.categoria{margin:0;font-size:.75rem;text-transform:uppercase;letter-spacing:.06em;color:#7a82a3}
h3{margin:4px 0 6px;font-size:1.2rem}
.descripcion{margin:0 0 16px;font-size:.9rem;color:#5d6585}
.pie{display:flex;justify-content:space-between;align-items:center}
.precio{font-weight:700}
.precio s{font-weight:400;font-size:.8rem;color:#9aa1c4;margin-left:4px}
button{padding:9px 18px;border:0;border-radius:10px;background:#1b2036;color:#fff;font-weight:600;cursor:pointer}
button:hover{background:#5b4bff}`
},
{
  id: 'tarjeta-perfil',
  nombre: 'Tarjeta de perfil',
  categoria: 'Tarjetas', nivel: 'Principiante',
  descripcion: 'Tarjeta de presentación con avatar, cargo, estadísticas y botón de contacto.',
  etiquetas: ['perfil', 'equipo', 'avatar'],
  autor: 'Anthony', licencia: 'MIT',
  html: `<article class="perfil">
  <div class="avatar">A</div>
  <h3>Anthony</h3>
  <p class="cargo">Desarrollador de software</p>
  <ul class="datos">
    <li><strong>24</strong><span>Proyectos</span></li>
    <li><strong>8</strong><span>Clientes</span></li>
    <li><strong>3</strong><span>Años</span></li>
  </ul>
  <a href="#" class="contacto">Contactar</a>
</article>`,
  css: BASE_OSCURA + `
.perfil{width:280px;text-align:center;padding:30px 24px;background:#181c30;border:1px solid #2d3354;border-radius:20px}
.avatar{width:84px;height:84px;margin:0 auto 14px;display:grid;place-items:center;border-radius:50%;font-size:2rem;font-weight:700;background:linear-gradient(135deg,#7c6cff,#38d6c4)}
h3{margin:0}
.cargo{margin:4px 0 18px;color:#9aa1c4;font-size:.9rem}
.datos{display:flex;justify-content:space-around;list-style:none;margin:0 0 20px;padding:14px 0;border-block:1px solid #2d3354}
.datos strong{display:block;font-size:1.2rem}
.datos span{font-size:.75rem;color:#9aa1c4}
.contacto{display:inline-block;padding:10px 26px;border-radius:99px;background:#7c6cff;color:#fff;text-decoration:none;font-weight:600}
.contacto:hover{background:#6a59f0}`
},
{
  id: 'tarjeta-cristal',
  nombre: 'Tarjeta de cristal',
  categoria: 'Tarjetas', nivel: 'Intermedio',
  descripcion: 'Efecto vidrio esmerilado (glassmorphism) sobre un fondo de colores.',
  etiquetas: ['cristal', 'blur', 'moderno'],
  autor: 'Anthony', licencia: 'MIT',
  html: `<div class="escena">
  <article class="cristal">
    <h3>Reunión de equipo</h3>
    <p>Mañana, 10:00 a. m.</p>
    <span class="etiqueta">Confirmada</span>
  </article>
</div>`,
  css: `*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;font-family:system-ui,sans-serif}
.escena{display:grid;place-items:center;width:100%;min-height:100vh;background:radial-gradient(circle at 20% 25%,#ff6ec4 0,transparent 40%),radial-gradient(circle at 80% 70%,#38d6c4 0,transparent 45%),#3a2fb3}
.cristal{width:290px;padding:26px;color:#fff;border-radius:20px;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.35);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);box-shadow:0 12px 40px rgba(0,0,0,.25)}
h3{margin:0 0 6px}
p{margin:0 0 16px;opacity:.9}
.etiqueta{font-size:.78rem;font-weight:600;padding:4px 12px;border-radius:99px;background:rgba(255,255,255,.25)}`
},

/* ---------- FORMULARIOS ---------- */
{
  id: 'campo-flotante',
  nombre: 'Campo con etiqueta flotante',
  categoria: 'Formularios', nivel: 'Intermedio',
  descripcion: 'La etiqueta sube y se reduce al escribir, sin usar JavaScript.',
  etiquetas: ['input', 'etiqueta', 'solo CSS'],
  autor: 'Anthony', licencia: 'MIT',
  html: `<div class="campo">
  <input type="email" id="correo" placeholder=" " required>
  <label for="correo">Correo electrónico</label>
</div>`,
  css: BASE + `
.campo{position:relative;width:300px}
input{width:100%;padding:20px 14px 8px;border:2px solid #cfd5e8;border-radius:12px;font-size:1rem;background:#fff;color:inherit;transition:border-color .2s}
label{position:absolute;left:16px;top:16px;color:#7a82a3;pointer-events:none;transition:all .2s;transform-origin:left}
input:focus{outline:0;border-color:#5b4bff}
input:focus+label,input:not(:placeholder-shown)+label{top:6px;transform:scale(.78);color:#5b4bff}
input:not(:placeholder-shown):invalid{border-color:#e5484d}`
},
{
  id: 'interruptor',
  nombre: 'Interruptor (toggle)',
  categoria: 'Formularios', nivel: 'Principiante',
  descripcion: 'Interruptor accesible de encendido y apagado hecho con una casilla.',
  etiquetas: ['toggle', 'casilla', 'accesible'],
  autor: 'Anthony', licencia: 'MIT',
  html: `<label class="interruptor">
  <input type="checkbox" role="switch">
  <span class="pista"><span class="perilla"></span></span>
  <span class="texto">Notificaciones</span>
</label>`,
  css: BASE + `
.interruptor{display:inline-flex;align-items:center;gap:12px;cursor:pointer;font-weight:500}
input{position:absolute;opacity:0}
.pista{width:52px;height:30px;border-radius:99px;background:#c3c9de;padding:3px;transition:background .25s}
.perilla{display:block;width:24px;height:24px;border-radius:50%;background:#fff;box-shadow:0 2px 5px rgba(0,0,0,.25);transition:transform .25s}
input:checked+.pista{background:#1f9d6b}
input:checked+.pista .perilla{transform:translateX(22px)}
input:focus-visible+.pista{outline:3px solid #5b4bff;outline-offset:2px}`
},
{
  id: 'formulario-contacto',
  nombre: 'Formulario de contacto',
  categoria: 'Formularios', nivel: 'Intermedio',
  descripcion: 'Formulario con validación y mensaje de confirmación en español.',
  etiquetas: ['contacto', 'validación', 'javascript'],
  autor: 'Anthony', licencia: 'MIT',
  html: `<form class="formulario" id="contacto" novalidate>
  <h3>Escríbenos</h3>
  <label>Nombre<input type="text" name="nombre" required></label>
  <label>Correo<input type="email" name="correo" required></label>
  <label>Mensaje<textarea name="mensaje" rows="3" required></textarea></label>
  <p class="error" id="error" role="alert"></p>
  <button type="submit">Enviar mensaje</button>
</form>`,
  css: BASE + `
.formulario{width:340px;display:grid;gap:14px;padding:26px;background:#fff;border-radius:18px;box-shadow:0 12px 30px rgba(30,40,90,.15)}
h3{margin:0}
label{display:grid;gap:6px;font-size:.88rem;font-weight:600}
input,textarea{padding:11px 12px;border:2px solid #d5daea;border-radius:10px;font:inherit;font-weight:400;resize:vertical}
input:focus,textarea:focus{outline:0;border-color:#5b4bff}
.error{margin:0;min-height:1.2em;font-size:.85rem;color:#d1344b}
.error.ok{color:#1f9d6b}
button{padding:12px;border:0;border-radius:10px;background:#5b4bff;color:#fff;font-weight:600;cursor:pointer}
button:hover{background:#4a3ae6}`,
  js: `var form = document.getElementById('contacto');
var error = document.getElementById('error');
form.addEventListener('submit', function (e) {
  e.preventDefault();
  error.classList.remove('ok');
  if (!form.nombre.value.trim()) { error.textContent = 'Escribe tu nombre.'; return; }
  if (!/^\\S+@\\S+\\.\\S+$/.test(form.correo.value)) { error.textContent = 'Ingresa un correo válido.'; return; }
  if (form.mensaje.value.trim().length < 10) { error.textContent = 'El mensaje debe tener al menos 10 caracteres.'; return; }
  error.textContent = '¡Gracias! Tu mensaje fue enviado.';
  error.classList.add('ok');
  form.reset();
});`
},

/* ---------- NAVEGACIÓN ---------- */
{
  id: 'barra-navegacion',
  nombre: 'Barra de navegación responsiva',
  categoria: 'Navegación', nivel: 'Intermedio',
  descripcion: 'Menú superior que se convierte en menú desplegable en pantallas pequeñas.',
  etiquetas: ['menú', 'responsivo', 'cabecera'],
  autor: 'Anthony', licencia: 'MIT',
  html: `<header class="barra">
  <a href="#" class="logo">MiMarca</a>
  <button class="hamburguesa" id="menuBtn" aria-label="Abrir menú" aria-expanded="false">☰</button>
  <nav class="enlaces" id="enlaces">
    <a href="#" class="activo">Inicio</a>
    <a href="#">Servicios</a>
    <a href="#">Proyectos</a>
    <a href="#">Contacto</a>
  </nav>
</header>`,
  css: `*{box-sizing:border-box}body{margin:0;min-height:100vh;font-family:system-ui,sans-serif;background:#f4f6fb}
.barra{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;padding:14px 22px;background:#1b2036;color:#fff}
.logo{font-weight:800;font-size:1.2rem;color:#fff;text-decoration:none}
.enlaces{display:flex;gap:6px}
.enlaces a{padding:8px 14px;border-radius:8px;color:#c9cfee;text-decoration:none}
.enlaces a:hover,.enlaces a.activo{background:#7c6cff;color:#fff}
.hamburguesa{display:none;border:0;background:transparent;color:#fff;font-size:1.5rem;cursor:pointer}
@media(max-width:560px){
  .hamburguesa{display:block}
  .enlaces{display:none;width:100%;flex-direction:column;margin-top:10px}
  .enlaces.abierto{display:flex}
}`,
  js: `var btn = document.getElementById('menuBtn');
var enlaces = document.getElementById('enlaces');
btn.addEventListener('click', function () {
  var abierto = enlaces.classList.toggle('abierto');
  btn.setAttribute('aria-expanded', String(abierto));
});`
},
{
  id: 'pestanas',
  nombre: 'Pestañas',
  categoria: 'Navegación', nivel: 'Intermedio',
  descripcion: 'Contenido organizado en pestañas con navegación por teclado.',
  etiquetas: ['tabs', 'contenido', 'accesible'],
  autor: 'Anthony', licencia: 'MIT',
  html: `<div class="pestanas">
  <div class="lista" role="tablist">
    <button role="tab" aria-selected="true" aria-controls="p1">Descripción</button>
    <button role="tab" aria-selected="false" aria-controls="p2">Especificaciones</button>
    <button role="tab" aria-selected="false" aria-controls="p3">Garantía</button>
  </div>
  <div class="panel" id="p1" role="tabpanel">Pantalla interactiva pensada para educación y empresas.</div>
  <div class="panel" id="p2" role="tabpanel" hidden>Resolución 4K · 20 puntos táctiles · Android 13.</div>
  <div class="panel" id="p3" role="tabpanel" hidden>Garantía de 24 meses con soporte técnico local.</div>
</div>`,
  css: BASE + `
.pestanas{width:380px;background:#fff;border-radius:16px;box-shadow:0 12px 30px rgba(30,40,90,.15);overflow:hidden}
.lista{display:flex;border-bottom:1px solid #e1e5f2}
.lista button{flex:1;padding:14px 8px;border:0;background:transparent;font:inherit;font-weight:600;color:#7a82a3;cursor:pointer;border-bottom:3px solid transparent}
.lista button[aria-selected="true"]{color:#5b4bff;border-bottom-color:#5b4bff}
.panel{padding:22px;line-height:1.6}`,
  js: `var tabs = document.querySelectorAll('[role=tab]');
tabs.forEach(function (tab, i) {
  tab.addEventListener('click', function () { activar(tab); });
  tab.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { activar(tabs[(i + 1) % tabs.length]); }
    if (e.key === 'ArrowLeft') { activar(tabs[(i - 1 + tabs.length) % tabs.length]); }
  });
});
function activar(tab) {
  tabs.forEach(function (t) {
    var sel = t === tab;
    t.setAttribute('aria-selected', String(sel));
    document.getElementById(t.getAttribute('aria-controls')).hidden = !sel;
  });
  tab.focus();
}`
},

/* ---------- ELEMENTOS DE INTERFAZ ---------- */
{
  id: 'acordeon',
  nombre: 'Acordeón de preguntas',
  categoria: 'Interfaz', nivel: 'Principiante',
  descripcion: 'Preguntas frecuentes desplegables usando solo HTML y CSS.',
  etiquetas: ['faq', 'desplegable', 'details'],
  autor: 'Anthony', licencia: 'MIT',
  html: `<section class="acordeon">
  <details open><summary>¿Cómo funciona el envío?</summary><p>Enviamos a todo el Perú en 3 a 5 días hábiles.</p></details>
  <details><summary>¿Tienen garantía?</summary><p>Sí, 24 meses en todos nuestros equipos.</p></details>
  <details><summary>¿Ofrecen capacitación?</summary><p>Incluimos una sesión de capacitación gratuita.</p></details>
</section>`,
  css: BASE + `
.acordeon{width:380px;display:grid;gap:10px}
details{background:#fff;border-radius:12px;box-shadow:0 4px 14px rgba(30,40,90,.1);overflow:hidden}
summary{padding:16px 18px;font-weight:600;cursor:pointer;list-style:none;display:flex;justify-content:space-between;align-items:center}
summary::-webkit-details-marker{display:none}
summary::after{content:"+";font-size:1.4rem;color:#5b4bff;transition:transform .25s}
details[open] summary::after{transform:rotate(45deg)}
details p{margin:0;padding:0 18px 18px;color:#5d6585;line-height:1.6}`
},
{
  id: 'alertas',
  nombre: 'Alertas con cierre',
  categoria: 'Interfaz', nivel: 'Principiante',
  descripcion: 'Mensajes de éxito, aviso y error que el usuario puede cerrar.',
  etiquetas: ['mensaje', 'aviso', 'cerrar'],
  autor: 'Anthony', licencia: 'MIT',
  html: `<div class="alertas">
  <div class="alerta exito"><span>✔ Cambios guardados correctamente.</span><button aria-label="Cerrar">✕</button></div>
  <div class="alerta aviso"><span>⚠ Tu sesión expirará pronto.</span><button aria-label="Cerrar">✕</button></div>
  <div class="alerta error"><span>✖ No se pudo conectar con el servidor.</span><button aria-label="Cerrar">✕</button></div>
</div>`,
  css: BASE + `
.alertas{width:380px;display:grid;gap:10px}
.alerta{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:13px 16px;border-radius:12px;border-left:5px solid;font-size:.92rem}
.alerta button{border:0;background:transparent;font-size:1rem;cursor:pointer;opacity:.6}
.alerta button:hover{opacity:1}
.exito{background:#e4f8ee;border-color:#1f9d6b;color:#0f5e40}
.aviso{background:#fff4dc;border-color:#e6a100;color:#7a5200}
.error{background:#ffe6ea;border-color:#d1344b;color:#8a1730}`,
  js: `document.querySelectorAll('.alerta button').forEach(function (b) {
  b.addEventListener('click', function () { b.parentElement.remove(); });
});`
},
{
  id: 'insignias',
  nombre: 'Insignias de estado',
  categoria: 'Interfaz', nivel: 'Principiante',
  descripcion: 'Etiquetas pequeñas para indicar estados: activo, pendiente, finalizado.',
  etiquetas: ['badge', 'estado', 'etiqueta'],
  autor: 'Anthony', licencia: 'MIT',
  html: `<div class="insignias">
  <span class="insignia verde">Activo</span>
  <span class="insignia amarilla">Pendiente</span>
  <span class="insignia roja">Vencido</span>
  <span class="insignia azul">En revisión</span>
</div>`,
  css: BASE + `
.insignias{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}
.insignia{display:inline-flex;align-items:center;gap:7px;padding:5px 14px;border-radius:99px;font-size:.82rem;font-weight:600}
.insignia::before{content:"";width:8px;height:8px;border-radius:50%;background:currentColor}
.verde{background:#e4f8ee;color:#0f7a52}
.amarilla{background:#fff4dc;color:#946200}
.roja{background:#ffe6ea;color:#b02540}
.azul{background:#e5eaff;color:#3a3fb3}`
},

/* ---------- SECCIONES ---------- */
{
  id: 'seccion-hero',
  nombre: 'Sección principal (hero)',
  categoria: 'Secciones', nivel: 'Intermedio',
  descripcion: 'Portada de página con título, texto, botones y fondo en degradado.',
  etiquetas: ['portada', 'landing', 'hero'],
  autor: 'Anthony', licencia: 'MIT',
  html: `<section class="hero">
  <p class="sobretitulo">Tecnología para tu negocio</p>
  <h1>Soluciones digitales que <span>impulsan</span> tu empresa</h1>
  <p class="texto">Desarrollo web, automatización y software a medida para pequeñas y medianas empresas.</p>
  <div class="botones">
    <a href="#" class="primario">Solicitar cotización</a>
    <a href="#" class="secundario">Ver proyectos</a>
  </div>
</section>`,
  css: `*{box-sizing:border-box}body{margin:0;font-family:system-ui,sans-serif}
.hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:18px;padding:40px 24px;color:#fff;background:linear-gradient(135deg,#1b1464,#5b4bff 55%,#38d6c4)}
.sobretitulo{margin:0;text-transform:uppercase;letter-spacing:.14em;font-size:.8rem;opacity:.85}
h1{margin:0;max-width:760px;font-size:clamp(1.9rem,5vw,3.2rem);line-height:1.15}
h1 span{color:#ffe27a}
.texto{margin:0;max-width:560px;opacity:.92;line-height:1.6}
.botones{display:flex;gap:12px;flex-wrap:wrap;justify-content:center;margin-top:8px}
.botones a{padding:13px 28px;border-radius:12px;font-weight:600;text-decoration:none}
.primario{background:#fff;color:#2b1fa8}
.secundario{border:2px solid rgba(255,255,255,.7);color:#fff}
.botones a:hover{transform:translateY(-2px)}`
}

];
