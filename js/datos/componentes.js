/* ==========================================================
   Catálogo de bloques
   ----------------------------------------------------------
   Cada bloque es una sección completa que se apila en la página.
   Campos: id · nombre · categoria · descripcion · etiquetas
           autor · licencia · html · css
   Reglas para que el bloque sea editable y reutilizable:
   - El elemento raíz lleva la clase  bq-<id>
   - Todo el CSS empieza con  .bq-<id>  (así no choca con otros)
   - Usa las variables del tema: --primario, --secundario,
     --fondo, --texto, --suave, --tarjeta, --linea, --radio
   Si copias código de otra fuente, indica su autor y licencia.
   ========================================================== */
(function () {
  'use strict';
  var BP = window.BP = window.BP || {};

  /* Imagen de relleno en degradado (SVG incrustado, no necesita internet) */
  function img(c1, c2, ancho, alto) {
    var svg = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 " + ancho + " " + alto + "'>" +
      "<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='" + c1 + "'/><stop offset='1' stop-color='" + c2 + "'/></linearGradient></defs>" +
      "<rect width='" + ancho + "' height='" + alto + "' fill='url(#g)'/>" +
      "<circle cx='" + Math.round(ancho * 0.78) + "' cy='" + Math.round(alto * 0.3) + "' r='" + Math.round(alto * 0.28) + "' fill='#fff' fill-opacity='.18'/>" +
      "<circle cx='" + Math.round(ancho * 0.2) + "' cy='" + Math.round(alto * 0.85) + "' r='" + Math.round(alto * 0.36) + "' fill='#fff' fill-opacity='.12'/></svg>";
    return 'data:image/svg+xml,' + encodeURIComponent(svg);
  }

  BP.categorias = ['Navegación', 'Portadas', 'Contenido', 'Llamadas a la acción', 'Formularios', 'Pie de página', 'Básicos'];

  BP.bloques = [

  /* ================= NAVEGACIÓN ================= */
  {
    id: 'nav-simple', nombre: 'Barra de navegación', categoria: 'Navegación',
    descripcion: 'Logo, enlaces y botón. En móvil se convierte en menú desplegable.',
    etiquetas: ['menú', 'cabecera', 'responsivo'], autor: 'Anthony', licencia: 'MIT',
    html: `<header class="bq-nav-simple">
  <div class="contenedor fila">
    <a href="#" class="logo">MiMarca</a>
    <input type="checkbox" id="menu-nav" class="interruptor">
    <label for="menu-nav" class="hamburguesa" aria-label="Abrir menú">☰</label>
    <nav class="enlaces">
      <a href="#inicio">Inicio</a>
      <a href="#servicios">Servicios</a>
      <a href="#precios">Precios</a>
      <a href="#contacto">Contacto</a>
      <a href="#contacto" class="boton">Empezar</a>
    </nav>
  </div>
</header>`,
    css: `.bq-nav-simple{background:var(--fondo);border-bottom:1px solid var(--linea)}
.bq-nav-simple .fila{display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap;padding:16px 0}
.bq-nav-simple .logo{font-size:1.3rem;font-weight:800;color:var(--primario);text-decoration:none}
.bq-nav-simple .enlaces{display:flex;align-items:center;gap:6px}
.bq-nav-simple .enlaces a{padding:8px 14px;border-radius:8px;color:var(--suave);font-weight:500;text-decoration:none}
.bq-nav-simple .enlaces a:hover{color:var(--texto);background:var(--tarjeta)}
.bq-nav-simple .enlaces a.boton,.bq-nav-simple .enlaces a.boton:hover{margin-left:8px;color:#fff;background:var(--primario)}
.bq-nav-simple .interruptor{display:none}
.bq-nav-simple .hamburguesa{display:none;padding:0 8px;font-size:1.6rem;cursor:pointer}
@media (max-width:760px){
.bq-nav-simple .hamburguesa{display:block}
.bq-nav-simple .enlaces{display:none;width:100%;flex-direction:column;align-items:stretch}
.bq-nav-simple .interruptor:checked~.enlaces{display:flex}
.bq-nav-simple .enlaces a.boton{margin:6px 0 0;text-align:center}
}`
  },

  /* ================= PORTADAS ================= */
  {
    id: 'hero-centrado', nombre: 'Portada centrada', categoria: 'Portadas',
    descripcion: 'Título grande y botones sobre un fondo degradado con los colores del tema.',
    etiquetas: ['hero', 'portada', 'degradado'], autor: 'Anthony', licencia: 'MIT',
    html: `<section class="bq-hero-centrado" id="inicio">
  <div class="contenedor">
    <span class="sobretitulo">Tecnología para tu negocio</span>
    <h1>Soluciones digitales que impulsan tu empresa</h1>
    <p>Desarrollo web, automatización y software a medida para pequeñas y medianas empresas.</p>
    <div class="botones">
      <a href="#contacto" class="boton claro">Solicitar cotización</a>
      <a href="#servicios" class="boton contorno-claro">Ver servicios</a>
    </div>
  </div>
</section>`,
    css: `.bq-hero-centrado{padding:110px 0;text-align:center;color:#fff;background:linear-gradient(135deg,var(--primario),var(--secundario))}
.bq-hero-centrado .sobretitulo{display:block;margin-bottom:14px;font-size:.82rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;opacity:.85}
.bq-hero-centrado h1{max-width:800px;margin:0 auto;font-size:clamp(2rem,5vw,3.4rem);line-height:1.15}
.bq-hero-centrado p{max-width:620px;margin:20px auto 32px;font-size:1.15rem;opacity:.92}
.bq-hero-centrado .botones{display:flex;flex-wrap:wrap;justify-content:center;gap:12px}`
  },
  {
    id: 'hero-dividido', nombre: 'Portada con imagen', categoria: 'Portadas',
    descripcion: 'Texto a la izquierda e imagen a la derecha; se apila en pantallas pequeñas.',
    etiquetas: ['hero', 'imagen', 'dos columnas'], autor: 'Anthony', licencia: 'MIT',
    html: `<section class="bq-hero-dividido" id="inicio">
  <div class="contenedor rejilla">
    <div class="texto">
      <span class="insignia">Nuevo</span>
      <h1>Crea páginas web profesionales en minutos</h1>
      <p>Arma tu sitio bloque por bloque, personaliza colores y textos, y descarga el código listo para publicar.</p>
      <div class="botones">
        <a href="#contacto" class="boton">Empezar ahora</a>
        <a href="#servicios" class="boton contorno">Saber más</a>
      </div>
    </div>
    <img src="${img('#5b4bff', '#38d6c4', 800, 600)}" alt="Imagen de portada">
  </div>
</section>`,
    css: `.bq-hero-dividido{padding:80px 0}
.bq-hero-dividido .rejilla{display:grid;grid-template-columns:1.1fr 1fr;gap:48px;align-items:center}
.bq-hero-dividido .insignia{margin-bottom:16px}
.bq-hero-dividido h1{font-size:clamp(2rem,4.5vw,3.2rem);line-height:1.15}
.bq-hero-dividido p{margin:18px 0 30px;font-size:1.1rem;color:var(--suave)}
.bq-hero-dividido .botones{display:flex;flex-wrap:wrap;gap:12px}
.bq-hero-dividido img{width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:calc(var(--radio) * 1.6);box-shadow:0 24px 50px color-mix(in srgb,var(--texto) 22%,transparent)}
@media (max-width:820px){.bq-hero-dividido .rejilla{grid-template-columns:1fr}}`
  },

  /* ================= CONTENIDO ================= */
  {
    id: 'caracteristicas', nombre: 'Tres características', categoria: 'Contenido',
    descripcion: 'Título de sección y tres tarjetas con icono, título y descripción.',
    etiquetas: ['servicios', 'tarjetas', 'iconos'], autor: 'Anthony', licencia: 'MIT',
    html: `<section class="bq-caracteristicas" id="servicios">
  <div class="contenedor">
    <div class="cabecera">
      <h2>Todo lo que necesitas</h2>
      <p>Herramientas pensadas para que tu negocio crezca sin complicaciones.</p>
    </div>
    <div class="rejilla">
      <article class="tarjeta"><span class="icono">⚡</span><h3>Rápido</h3><p>Páginas livianas que cargan al instante en cualquier dispositivo.</p></article>
      <article class="tarjeta"><span class="icono">🎨</span><h3>Personalizable</h3><p>Cambia colores, tipografías y textos para que se vea como tu marca.</p></article>
      <article class="tarjeta"><span class="icono">🔒</span><h3>Confiable</h3><p>Código limpio y ordenado, fácil de mantener y de publicar.</p></article>
    </div>
  </div>
</section>`,
    css: `.bq-caracteristicas{padding:80px 0}
.bq-caracteristicas .cabecera{max-width:620px;margin:0 auto 48px;text-align:center}
.bq-caracteristicas h2{font-size:clamp(1.7rem,3.5vw,2.4rem)}
.bq-caracteristicas .cabecera p{margin-top:12px;color:var(--suave)}
.bq-caracteristicas .rejilla{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:24px}
.bq-caracteristicas .tarjeta{padding:30px;background:var(--tarjeta);border:1px solid var(--linea);border-radius:calc(var(--radio) * 1.3)}
.bq-caracteristicas .icono{display:grid;place-items:center;width:52px;height:52px;margin-bottom:18px;border-radius:calc(var(--radio) * 1.1);background:color-mix(in srgb,var(--primario) 14%,var(--fondo));font-size:1.5rem}
.bq-caracteristicas h3{margin-bottom:8px;font-size:1.2rem}
.bq-caracteristicas .tarjeta p{color:var(--suave)}`
  },
  {
    id: 'texto-imagen', nombre: 'Texto con imagen', categoria: 'Contenido',
    descripcion: 'Imagen a un lado y texto con lista de puntos al otro.',
    etiquetas: ['imagen', 'lista', 'dos columnas'], autor: 'Anthony', licencia: 'MIT',
    html: `<section class="bq-texto-imagen">
  <div class="contenedor rejilla">
    <img src="${img('#38d6c4', '#5b4bff', 800, 640)}" alt="Imagen ilustrativa">
    <div class="texto">
      <h2>Una forma más simple de trabajar</h2>
      <p>Cuéntales a tus clientes qué te hace diferente. Usa pocas palabras y ve directo a los beneficios.</p>
      <ul>
        <li>Atención personalizada en cada proyecto</li>
        <li>Entrega puntual y soporte posterior</li>
        <li>Precios claros, sin sorpresas</li>
      </ul>
      <a href="#contacto" class="boton">Hablemos</a>
    </div>
  </div>
</section>`,
    css: `.bq-texto-imagen{padding:80px 0}
.bq-texto-imagen .rejilla{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center}
.bq-texto-imagen img{width:100%;aspect-ratio:5/4;object-fit:cover;border-radius:calc(var(--radio) * 1.6)}
.bq-texto-imagen h2{font-size:clamp(1.7rem,3.5vw,2.3rem)}
.bq-texto-imagen p{margin:14px 0 20px;color:var(--suave)}
.bq-texto-imagen ul{display:grid;gap:10px;margin:0 0 28px;padding:0;list-style:none}
.bq-texto-imagen li{position:relative;padding-left:30px}
.bq-texto-imagen li::before{content:"✓";position:absolute;left:0;top:1px;display:grid;place-items:center;width:20px;height:20px;border-radius:50%;background:var(--primario);color:#fff;font-size:.72rem;font-weight:700}
@media (max-width:820px){.bq-texto-imagen .rejilla{grid-template-columns:1fr;gap:32px}}`
  },
  {
    id: 'estadisticas', nombre: 'Cifras destacadas', categoria: 'Contenido',
    descripcion: 'Cuatro números grandes con su descripción sobre fondo oscuro.',
    etiquetas: ['números', 'métricas', 'logros'], autor: 'Anthony', licencia: 'MIT',
    html: `<section class="bq-estadisticas">
  <div class="contenedor rejilla">
    <div class="dato"><strong>120+</strong><span>Proyectos entregados</span></div>
    <div class="dato"><strong>45</strong><span>Clientes activos</span></div>
    <div class="dato"><strong>98%</strong><span>Clientes satisfechos</span></div>
    <div class="dato"><strong>5 años</strong><span>De experiencia</span></div>
  </div>
</section>`,
    css: `.bq-estadisticas{padding:60px 0;background:var(--texto);color:var(--fondo)}
.bq-estadisticas .rejilla{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:28px;text-align:center}
.bq-estadisticas strong{display:block;font-size:clamp(2rem,4vw,2.8rem);line-height:1.1;color:var(--secundario)}
.bq-estadisticas span{opacity:.8}`
  },
  {
    id: 'testimonios', nombre: 'Testimonios', categoria: 'Contenido',
    descripcion: 'Tres opiniones de clientes con nombre y cargo.',
    etiquetas: ['opiniones', 'clientes', 'tarjetas'], autor: 'Anthony', licencia: 'MIT',
    html: `<section class="bq-testimonios">
  <div class="contenedor">
    <h2>Lo que dicen nuestros clientes</h2>
    <div class="rejilla">
      <figure class="tarjeta"><blockquote>“Entregaron mi página antes de lo prometido y quedó exactamente como la imaginaba.”</blockquote><figcaption><strong>Lucía Ramos</strong><span>Dueña de tienda</span></figcaption></figure>
      <figure class="tarjeta"><blockquote>“Ahora recibimos consultas todos los días gracias a nuestro nuevo sitio web.”</blockquote><figcaption><strong>Carlos Vega</strong><span>Gerente comercial</span></figcaption></figure>
      <figure class="tarjeta"><blockquote>“Trato cercano, comunicación clara y un resultado profesional. Los recomiendo.”</blockquote><figcaption><strong>Marta Quispe</strong><span>Emprendedora</span></figcaption></figure>
    </div>
  </div>
</section>`,
    css: `.bq-testimonios{padding:80px 0;background:var(--tarjeta)}
.bq-testimonios h2{margin-bottom:44px;text-align:center;font-size:clamp(1.7rem,3.5vw,2.4rem)}
.bq-testimonios .rejilla{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:24px}
.bq-testimonios .tarjeta{margin:0;padding:28px;background:var(--fondo);border:1px solid var(--linea);border-radius:calc(var(--radio) * 1.3)}
.bq-testimonios blockquote{margin:0 0 20px;font-size:1.05rem}
.bq-testimonios figcaption strong{display:block}
.bq-testimonios figcaption span{font-size:.88rem;color:var(--suave)}`
  },
  {
    id: 'galeria', nombre: 'Galería de imágenes', categoria: 'Contenido',
    descripcion: 'Seis imágenes en cuadrícula que se adapta al ancho de la pantalla.',
    etiquetas: ['fotos', 'cuadrícula', 'imágenes'], autor: 'Anthony', licencia: 'MIT',
    html: `<section class="bq-galeria">
  <div class="contenedor">
    <h2>Nuestros trabajos</h2>
    <div class="rejilla">
      <img src="${img('#5b4bff', '#8f7bff', 600, 450)}" alt="Trabajo 1">
      <img src="${img('#38d6c4', '#1b9a8c', 600, 450)}" alt="Trabajo 2">
      <img src="${img('#ff7a59', '#ffb347', 600, 450)}" alt="Trabajo 3">
      <img src="${img('#2b2f54', '#5b4bff', 600, 450)}" alt="Trabajo 4">
      <img src="${img('#ff5d8f', '#ff9ec0', 600, 450)}" alt="Trabajo 5">
      <img src="${img('#2fbf71', '#38d6c4', 600, 450)}" alt="Trabajo 6">
    </div>
  </div>
</section>`,
    css: `.bq-galeria{padding:80px 0}
.bq-galeria h2{margin-bottom:40px;text-align:center;font-size:clamp(1.7rem,3.5vw,2.4rem)}
.bq-galeria .rejilla{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px}
.bq-galeria img{width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:var(--radio);transition:transform .25s}
.bq-galeria img:hover{transform:scale(1.03)}`
  },
  {
    id: 'precios', nombre: 'Planes y precios', categoria: 'Contenido',
    descripcion: 'Tres planes con lista de beneficios; el del medio aparece destacado.',
    etiquetas: ['planes', 'tarifas', 'tarjetas'], autor: 'Anthony', licencia: 'MIT',
    html: `<section class="bq-precios" id="precios">
  <div class="contenedor">
    <div class="cabecera"><h2>Elige tu plan</h2><p>Sin contratos largos. Cambia o cancela cuando quieras.</p></div>
    <div class="rejilla">
      <article class="plan">
        <h3>Básico</h3>
        <p class="precio"><strong>S/ 99</strong> / mes</p>
        <ul><li>1 página web</li><li>Formulario de contacto</li><li>Soporte por correo</li></ul>
        <a href="#contacto" class="boton contorno">Elegir plan</a>
      </article>
      <article class="plan destacado">
        <span class="insignia">Más popular</span>
        <h3>Profesional</h3>
        <p class="precio"><strong>S/ 199</strong> / mes</p>
        <ul><li>Hasta 5 páginas</li><li>Diseño personalizado</li><li>Soporte prioritario</li></ul>
        <a href="#contacto" class="boton">Elegir plan</a>
      </article>
      <article class="plan">
        <h3>Empresa</h3>
        <p class="precio"><strong>S/ 399</strong> / mes</p>
        <ul><li>Páginas ilimitadas</li><li>Integraciones a medida</li><li>Asesor dedicado</li></ul>
        <a href="#contacto" class="boton contorno">Elegir plan</a>
      </article>
    </div>
  </div>
</section>`,
    css: `.bq-precios{padding:80px 0}
.bq-precios .cabecera{max-width:560px;margin:0 auto 48px;text-align:center}
.bq-precios h2{font-size:clamp(1.7rem,3.5vw,2.4rem)}
.bq-precios .cabecera p{margin-top:12px;color:var(--suave)}
.bq-precios .rejilla{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:24px;align-items:stretch}
.bq-precios .plan{position:relative;display:flex;flex-direction:column;gap:14px;padding:32px;background:var(--fondo);border:1px solid var(--linea);border-radius:calc(var(--radio) * 1.4)}
.bq-precios .plan.destacado{border:2px solid var(--primario);box-shadow:0 18px 40px color-mix(in srgb,var(--primario) 22%,transparent)}
.bq-precios .insignia{align-self:flex-start}
.bq-precios .precio{color:var(--suave)}
.bq-precios .precio strong{font-size:2.4rem;color:var(--texto)}
.bq-precios ul{display:grid;gap:8px;flex:1;margin:0 0 10px;padding:0;list-style:none;color:var(--suave)}
.bq-precios li::before{content:"✓ ";color:var(--primario);font-weight:700}
.bq-precios .boton{text-align:center}`
  },
  {
    id: 'equipo', nombre: 'Equipo', categoria: 'Contenido',
    descripcion: 'Tres personas del equipo con avatar, nombre y cargo.',
    etiquetas: ['personas', 'perfil', 'nosotros'], autor: 'Anthony', licencia: 'MIT',
    html: `<section class="bq-equipo">
  <div class="contenedor">
    <h2>Conoce al equipo</h2>
    <div class="rejilla">
      <article class="persona"><div class="avatar">A</div><h3>Ana Torres</h3><p>Diseñadora UX</p></article>
      <article class="persona"><div class="avatar">L</div><h3>Luis Paredes</h3><p>Desarrollador web</p></article>
      <article class="persona"><div class="avatar">M</div><h3>María Salas</h3><p>Gestora de proyectos</p></article>
    </div>
  </div>
</section>`,
    css: `.bq-equipo{padding:80px 0;background:var(--tarjeta)}
.bq-equipo h2{margin-bottom:44px;text-align:center;font-size:clamp(1.7rem,3.5vw,2.4rem)}
.bq-equipo .rejilla{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:24px}
.bq-equipo .persona{padding:30px 20px;text-align:center;background:var(--fondo);border:1px solid var(--linea);border-radius:calc(var(--radio) * 1.3)}
.bq-equipo .avatar{display:grid;place-items:center;width:84px;height:84px;margin:0 auto 16px;border-radius:50%;background:linear-gradient(135deg,var(--primario),var(--secundario));color:#fff;font-size:2rem;font-weight:700}
.bq-equipo h3{font-size:1.15rem}
.bq-equipo .persona p{color:var(--suave)}`
  },
  {
    id: 'faq', nombre: 'Preguntas frecuentes', categoria: 'Contenido',
    descripcion: 'Acordeón de preguntas y respuestas hecho solo con HTML y CSS.',
    etiquetas: ['faq', 'acordeón', 'desplegable'], autor: 'Anthony', licencia: 'MIT',
    html: `<section class="bq-faq">
  <div class="contenedor">
    <h2>Preguntas frecuentes</h2>
    <div class="lista">
      <details open><summary>¿Cuánto tarda en estar lista mi página?</summary><p>Entre 5 y 10 días hábiles, según la cantidad de secciones.</p></details>
      <details><summary>¿Puedo cambiar los textos después?</summary><p>Sí, puedes pedirnos cambios o editarlos tú mismo desde el código.</p></details>
      <details><summary>¿Incluye dominio y alojamiento?</summary><p>Podemos gestionarlos por ti o publicar en el que ya tengas.</p></details>
    </div>
  </div>
</section>`,
    css: `.bq-faq{padding:80px 0}
.bq-faq .contenedor{max-width:760px}
.bq-faq h2{margin-bottom:36px;text-align:center;font-size:clamp(1.7rem,3.5vw,2.4rem)}
.bq-faq .lista{display:grid;gap:12px}
.bq-faq details{background:var(--tarjeta);border:1px solid var(--linea);border-radius:var(--radio);overflow:hidden}
.bq-faq summary{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:18px 22px;font-weight:600;cursor:pointer;list-style:none}
.bq-faq summary::-webkit-details-marker{display:none}
.bq-faq summary::after{content:"+";font-size:1.5rem;line-height:1;color:var(--primario);transition:transform .25s}
.bq-faq details[open] summary::after{transform:rotate(45deg)}
.bq-faq details p{padding:0 22px 20px;color:var(--suave)}`
  },

  /* ================= LLAMADAS A LA ACCIÓN ================= */
  {
    id: 'cta-banner', nombre: 'Banner de llamada a la acción', categoria: 'Llamadas a la acción',
    descripcion: 'Recuadro llamativo con mensaje corto y un botón.',
    etiquetas: ['cta', 'banner', 'botón'], autor: 'Anthony', licencia: 'MIT',
    html: `<section class="bq-cta-banner">
  <div class="contenedor">
    <div class="caja">
      <h2>¿Listo para empezar tu proyecto?</h2>
      <p>Escríbenos hoy y recibe una cotización gratuita en menos de 24 horas.</p>
      <a href="#contacto" class="boton claro">Pedir cotización</a>
    </div>
  </div>
</section>`,
    css: `.bq-cta-banner{padding:60px 0}
.bq-cta-banner .caja{padding:56px 32px;text-align:center;color:#fff;border-radius:calc(var(--radio) * 2);background:linear-gradient(135deg,var(--primario),var(--secundario))}
.bq-cta-banner h2{font-size:clamp(1.6rem,3.5vw,2.3rem)}
.bq-cta-banner p{max-width:520px;margin:12px auto 26px;opacity:.92}`
  },
  {
    id: 'botones', nombre: 'Fila de botones', categoria: 'Llamadas a la acción',
    descripcion: 'Dos botones centrados, uno relleno y otro con contorno.',
    etiquetas: ['botones', 'enlaces'], autor: 'Anthony', licencia: 'MIT',
    html: `<div class="bq-botones">
  <div class="contenedor fila">
    <a href="#" class="boton">Botón principal</a>
    <a href="#" class="boton contorno">Botón secundario</a>
  </div>
</div>`,
    css: `.bq-botones{padding:32px 0}
.bq-botones .fila{display:flex;flex-wrap:wrap;justify-content:center;gap:14px}`
  },

  /* ================= FORMULARIOS ================= */
  {
    id: 'contacto', nombre: 'Contacto con formulario', categoria: 'Formularios',
    descripcion: 'Datos de contacto a un lado y formulario al otro.',
    etiquetas: ['formulario', 'contacto', 'campos'], autor: 'Anthony', licencia: 'MIT',
    html: `<section class="bq-contacto" id="contacto">
  <div class="contenedor rejilla">
    <div class="info">
      <h2>Hablemos de tu proyecto</h2>
      <p>Cuéntanos qué necesitas y te responderemos lo antes posible.</p>
      <ul>
        <li>📍 Arequipa, Perú</li>
        <li>📧 contacto@mimarca.com</li>
        <li>📞 +51 900 000 000</li>
      </ul>
    </div>
    <form class="formulario" action="#" method="post">
      <label>Nombre<input type="text" name="nombre" placeholder="Tu nombre" required></label>
      <label>Correo electrónico<input type="email" name="correo" placeholder="tucorreo@ejemplo.com" required></label>
      <label>Mensaje<textarea name="mensaje" rows="4" placeholder="Cuéntanos sobre tu proyecto" required></textarea></label>
      <button type="submit" class="boton">Enviar mensaje</button>
    </form>
  </div>
</section>`,
    css: `.bq-contacto{padding:80px 0;background:var(--tarjeta)}
.bq-contacto .rejilla{display:grid;grid-template-columns:1fr 1.1fr;gap:56px;align-items:start}
.bq-contacto h2{font-size:clamp(1.7rem,3.5vw,2.3rem)}
.bq-contacto .info p{margin:12px 0 24px;color:var(--suave)}
.bq-contacto ul{display:grid;gap:10px;margin:0;padding:0;list-style:none}
.bq-contacto .formulario{display:grid;gap:16px;padding:30px;background:var(--fondo);border:1px solid var(--linea);border-radius:calc(var(--radio) * 1.4)}
.bq-contacto label{display:grid;gap:6px;font-size:.9rem;font-weight:600}
.bq-contacto input,.bq-contacto textarea{width:100%;padding:12px 14px;border:2px solid var(--linea);border-radius:var(--radio);background:var(--fondo);color:var(--texto);font:inherit;font-weight:400;resize:vertical}
.bq-contacto input:focus,.bq-contacto textarea:focus{outline:0;border-color:var(--primario)}
@media (max-width:820px){.bq-contacto .rejilla{grid-template-columns:1fr;gap:32px}}`
  },
  {
    id: 'suscripcion', nombre: 'Suscripción al boletín', categoria: 'Formularios',
    descripcion: 'Campo de correo y botón en una sola línea.',
    etiquetas: ['boletín', 'correo', 'newsletter'], autor: 'Anthony', licencia: 'MIT',
    html: `<section class="bq-suscripcion">
  <div class="contenedor">
    <h2>Recibe novedades en tu correo</h2>
    <p>Una vez al mes, sin spam. Puedes darte de baja cuando quieras.</p>
    <form class="formulario" action="#" method="post">
      <input type="email" name="correo" placeholder="tucorreo@ejemplo.com" required>
      <button type="submit" class="boton">Suscribirme</button>
    </form>
  </div>
</section>`,
    css: `.bq-suscripcion{padding:70px 0;text-align:center}
.bq-suscripcion h2{font-size:clamp(1.6rem,3.5vw,2.2rem)}
.bq-suscripcion p{margin:10px 0 26px;color:var(--suave)}
.bq-suscripcion .formulario{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;max-width:520px;margin:0 auto}
.bq-suscripcion input{flex:1;min-width:220px;padding:12px 16px;border:2px solid var(--linea);border-radius:var(--radio);background:var(--fondo);color:var(--texto);font:inherit}
.bq-suscripcion input:focus{outline:0;border-color:var(--primario)}`
  },

  /* ================= PIE DE PÁGINA ================= */
  {
    id: 'pie-pagina', nombre: 'Pie de página', categoria: 'Pie de página',
    descripcion: 'Descripción de la marca, dos columnas de enlaces y derechos reservados.',
    etiquetas: ['footer', 'enlaces', 'copyright'], autor: 'Anthony', licencia: 'MIT',
    html: `<footer class="bq-pie-pagina">
  <div class="contenedor">
    <div class="rejilla">
      <div class="marca"><strong>MiMarca</strong><p>Soluciones digitales para negocios que quieren crecer.</p></div>
      <div class="columna"><h4>Empresa</h4><a href="#">Nosotros</a><a href="#">Servicios</a><a href="#">Contacto</a></div>
      <div class="columna"><h4>Recursos</h4><a href="#">Blog</a><a href="#">Preguntas frecuentes</a><a href="#">Soporte</a></div>
    </div>
    <p class="derechos">© 2026 MiMarca. Todos los derechos reservados.</p>
  </div>
</footer>`,
    css: `.bq-pie-pagina{padding:60px 0 28px;background:var(--texto);color:var(--fondo)}
.bq-pie-pagina .rejilla{display:grid;grid-template-columns:2fr 1fr 1fr;gap:40px}
.bq-pie-pagina .marca strong{font-size:1.4rem;color:var(--secundario)}
.bq-pie-pagina .marca p{max-width:320px;margin-top:10px;opacity:.75}
.bq-pie-pagina h4{margin-bottom:14px;font-size:.95rem;text-transform:uppercase;letter-spacing:.08em}
.bq-pie-pagina .columna a{display:block;margin-bottom:8px;text-decoration:none;opacity:.75}
.bq-pie-pagina .columna a:hover{opacity:1}
.bq-pie-pagina .derechos{margin-top:40px;padding-top:22px;border-top:1px solid color-mix(in srgb,var(--fondo) 22%,transparent);font-size:.88rem;opacity:.65}
@media (max-width:700px){.bq-pie-pagina .rejilla{grid-template-columns:1fr}}`
  },

  /* ================= BÁSICOS ================= */
  {
    id: 'titulo-seccion', nombre: 'Título de sección', categoria: 'Básicos',
    descripcion: 'Un título con subtítulo centrados, para separar partes de la página.',
    etiquetas: ['título', 'texto', 'encabezado'], autor: 'Anthony', licencia: 'MIT',
    html: `<div class="bq-titulo-seccion">
  <div class="contenedor">
    <h2>Título de la sección</h2>
    <p>Escribe aquí un breve subtítulo que explique de qué trata esta parte.</p>
  </div>
</div>`,
    css: `.bq-titulo-seccion{padding:64px 0 24px;text-align:center}
.bq-titulo-seccion h2{font-size:clamp(1.7rem,3.5vw,2.4rem)}
.bq-titulo-seccion p{max-width:600px;margin:12px auto 0;color:var(--suave)}`
  },
  {
    id: 'parrafo', nombre: 'Párrafo de texto', categoria: 'Básicos',
    descripcion: 'Un bloque de texto con ancho cómodo para leer.',
    etiquetas: ['texto', 'párrafo'], autor: 'Anthony', licencia: 'MIT',
    html: `<section class="bq-parrafo">
  <div class="contenedor">
    <p>Escribe aquí tu texto. Haz doble clic sobre él en el lienzo para editarlo directamente, o usa el panel de propiedades para cambiar su tamaño, color y alineación.</p>
  </div>
</section>`,
    css: `.bq-parrafo{padding:32px 0}
.bq-parrafo .contenedor{max-width:760px}
.bq-parrafo p{font-size:1.1rem;color:var(--suave)}`
  },
  {
    id: 'imagen', nombre: 'Imagen ancha', categoria: 'Básicos',
    descripcion: 'Una imagen a todo el ancho del contenedor.',
    etiquetas: ['imagen', 'foto'], autor: 'Anthony', licencia: 'MIT',
    html: `<section class="bq-imagen">
  <div class="contenedor">
    <img src="${img('#5b4bff', '#ff7a59', 1200, 500)}" alt="Imagen descriptiva">
  </div>
</section>`,
    css: `.bq-imagen{padding:40px 0}
.bq-imagen img{width:100%;aspect-ratio:12/5;object-fit:cover;border-radius:calc(var(--radio) * 1.5)}`
  },
  {
    id: 'separador', nombre: 'Línea separadora', categoria: 'Básicos',
    descripcion: 'Una línea fina para dividir secciones.',
    etiquetas: ['línea', 'divisor'], autor: 'Anthony', licencia: 'MIT',
    html: `<div class="bq-separador">
  <div class="contenedor"><hr></div>
</div>`,
    css: `.bq-separador{padding:20px 0}
.bq-separador hr{height:1px;margin:0;border:0;background:var(--linea)}`
  },
  {
    id: 'espacio', nombre: 'Espacio en blanco', categoria: 'Básicos',
    descripcion: 'Un hueco vertical. Selecciónalo y cambia su alto en las propiedades.',
    etiquetas: ['espacio', 'separación'], autor: 'Anthony', licencia: 'MIT',
    html: `<div class="bq-espacio"></div>`,
    css: `.bq-espacio{height:80px}`
  }

  ];

  BP.bloque = function (id) {
    for (var i = 0; i < BP.bloques.length; i++) { if (BP.bloques[i].id === id) return BP.bloques[i]; }
    return null;
  };

  BP.todoCSSBloques = function () {
    return BP.bloques.map(function (b) { return b.css; }).join('\n');
  };
})();
