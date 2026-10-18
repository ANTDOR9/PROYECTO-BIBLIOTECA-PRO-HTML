/* ==========================================================
   Biblioteca Pro: bloques adaptados de ejemplos externos
   (por ejemplo, los que recopila FreeFrontend en CodePen).

   Cada ejemplo se ADAPTA al formato de bloque del editor:
   - raíz con clase  bq-<id>  y todo el CSS dentro de  .bq-<id>
   - colores y fuentes con las variables del tema (--primario…)
   - sin JavaScript (el lienzo no ejecuta scripts de bloques)

   Para respetar a las personas autoras, cada bloque guarda:
     autor      nombre de quien lo creó
     licencia   licencia del ejemplo original (p. ej. 'MIT')
     fuente     'FreeFrontend' / 'CodePen' …
     urlFuente  enlace al ejemplo original
     adaptado   true (se modificó para este editor)
     miniatura  (opcional) ruta a una imagen; si no hay, se dibuja
                una vista previa automática con el propio código
   ========================================================== */
(function () {
  'use strict';
  var BP = window.BP = window.BP || {};

  BP.bloquesPro = [
    {
      id: 'pro-btn-brillo', nombre: 'Botón con brillo', categoria: 'Botones',
      descripcion: 'Degradado con un destello que cruza el botón al pasar el cursor.',
      etiquetas: ['botón','brillo','degradado'], autor: 'Anthony', licencia: 'MIT',
      html: `<div class="bq-pro-btn-brillo">
  <div class="contenedor">
    <div class="fila">
      <a class="b-brillo" href="#">Empezar ahora</a>
      <a class="b-brillo" href="#">Ver planes</a>
    </div>
  </div>
</div>`,
      css: `.bq-pro-btn-brillo{padding:56px 0;background:var(--fondo)}
.bq-pro-btn-brillo .fila{display:flex;flex-wrap:wrap;gap:16px;justify-content:center}
.bq-pro-btn-brillo .b-brillo{position:relative;overflow:hidden;padding:14px 30px;border-radius:var(--radio);background:linear-gradient(135deg,var(--primario),var(--secundario));color:#fff;font-weight:700;text-decoration:none;box-shadow:0 8px 22px color-mix(in srgb,var(--primario) 35%,transparent);transition:transform .2s}
.bq-pro-btn-brillo .b-brillo::after{content:'';position:absolute;top:0;left:-70%;width:45%;height:100%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.55),transparent);transform:skewX(-20deg);transition:left .6s}
.bq-pro-btn-brillo .b-brillo:hover{transform:translateY(-2px)}
.bq-pro-btn-brillo .b-brillo:hover::after{left:130%}`
    },
    {
      id: 'pro-btn-3d', nombre: 'Botón 3D', categoria: 'Botones',
      descripcion: 'Botón con relieve que se hunde al presionarlo.',
      etiquetas: ['botón','3d','presionar'], autor: 'Anthony', licencia: 'MIT',
      html: `<div class="bq-pro-btn-3d">
  <div class="contenedor">
    <div class="fila">
      <a class="b-3d" href="#">Comprar</a>
      <a class="b-3d" href="#">Suscribirme</a>
    </div>
  </div>
</div>`,
      css: `.bq-pro-btn-3d{padding:56px 0;background:var(--fondo)}
.bq-pro-btn-3d .fila{display:flex;flex-wrap:wrap;gap:18px;justify-content:center}
.bq-pro-btn-3d .b-3d{display:inline-block;padding:14px 32px;border-radius:var(--radio);background:var(--primario);color:#fff;font-weight:700;text-decoration:none;box-shadow:0 6px 0 color-mix(in srgb,var(--primario) 55%,#000);transition:transform .1s,box-shadow .1s}
.bq-pro-btn-3d .b-3d:hover{transform:translateY(2px);box-shadow:0 4px 0 color-mix(in srgb,var(--primario) 55%,#000)}
.bq-pro-btn-3d .b-3d:active{transform:translateY(6px);box-shadow:0 0 0 color-mix(in srgb,var(--primario) 55%,#000)}`
    },
    {
      id: 'pro-btn-relleno', nombre: 'Botón de relleno deslizante', categoria: 'Botones',
      descripcion: 'Contorno que se rellena de color de izquierda a derecha.',
      etiquetas: ['botón','contorno','relleno'], autor: 'Anthony', licencia: 'MIT',
      html: `<div class="bq-pro-btn-relleno">
  <div class="contenedor">
    <div class="fila">
      <a class="b-relleno" href="#">Saber más</a>
      <a class="b-relleno" href="#">Contactar</a>
    </div>
  </div>
</div>`,
      css: `.bq-pro-btn-relleno{padding:56px 0;background:var(--fondo)}
.bq-pro-btn-relleno .fila{display:flex;flex-wrap:wrap;gap:16px;justify-content:center}
.bq-pro-btn-relleno .b-relleno{padding:13px 30px;border:2px solid var(--primario);border-radius:var(--radio);color:var(--primario);font-weight:700;text-decoration:none;background:linear-gradient(var(--primario),var(--primario)) no-repeat left/0 100%;transition:background-size .35s,color .35s}
.bq-pro-btn-relleno .b-relleno:hover{background-size:100% 100%;color:#fff}`
    },
    {
      id: 'pro-btn-neon', nombre: 'Botón neón', categoria: 'Botones',
      descripcion: 'Contorno luminoso sobre fondo oscuro.',
      etiquetas: ['botón','neón','brillo'], autor: 'Anthony', licencia: 'MIT',
      html: `<div class="bq-pro-btn-neon">
  <div class="contenedor">
    <div class="fila">
      <a class="b-neon" href="#">Jugar</a>
      <a class="b-neon" href="#">Unirme</a>
    </div>
  </div>
</div>`,
      css: `.bq-pro-btn-neon{padding:64px 0;background:#0b0e1a}
.bq-pro-btn-neon .fila{display:flex;flex-wrap:wrap;gap:20px;justify-content:center}
.bq-pro-btn-neon .b-neon{padding:13px 32px;border:2px solid var(--secundario);border-radius:var(--radio);color:var(--secundario);font-weight:700;letter-spacing:.06em;text-transform:uppercase;text-decoration:none;box-shadow:0 0 10px color-mix(in srgb,var(--secundario) 60%,transparent),inset 0 0 10px color-mix(in srgb,var(--secundario) 25%,transparent);transition:background .25s,color .25s,box-shadow .25s}
.bq-pro-btn-neon .b-neon:hover{background:var(--secundario);color:#0b0e1a;box-shadow:0 0 24px var(--secundario),0 0 48px color-mix(in srgb,var(--secundario) 60%,transparent)}`
    },
    {
      id: 'pro-btn-flecha', nombre: 'Botón con flecha', categoria: 'Botones',
      descripcion: 'Píldora con una flecha que se desplaza al pasar el cursor.',
      etiquetas: ['botón','flecha','píldora'], autor: 'Anthony', licencia: 'MIT',
      html: `<div class="bq-pro-btn-flecha">
  <div class="contenedor">
    <div class="fila">
      <a class="b-flecha" href="#">Ver proyectos</a>
      <a class="b-flecha" href="#">Hablemos</a>
    </div>
  </div>
</div>`,
      css: `.bq-pro-btn-flecha{padding:56px 0;background:var(--fondo)}
.bq-pro-btn-flecha .fila{display:flex;flex-wrap:wrap;gap:16px;justify-content:center}
.bq-pro-btn-flecha .b-flecha{display:inline-flex;align-items:center;gap:10px;padding:13px 28px;border-radius:999px;background:var(--texto);color:var(--fondo);font-weight:700;text-decoration:none;transition:background .25s,gap .25s}
.bq-pro-btn-flecha .b-flecha::after{content:'→';transition:transform .25s}
.bq-pro-btn-flecha .b-flecha:hover{background:var(--primario);color:#fff}
.bq-pro-btn-flecha .b-flecha:hover::after{transform:translateX(6px)}`
    },
    {
      id: 'pro-btn-cristal', nombre: 'Botón de cristal', categoria: 'Botones',
      descripcion: 'Efecto vidrio translúcido sobre un fondo de color.',
      etiquetas: ['botón','cristal','translúcido'], autor: 'Anthony', licencia: 'MIT',
      html: `<div class="bq-pro-btn-cristal">
  <div class="contenedor">
    <div class="fila">
      <a class="b-cristal" href="#">Descubrir</a>
      <a class="b-cristal" href="#">Entrar</a>
    </div>
  </div>
</div>`,
      css: `.bq-pro-btn-cristal{padding:64px 0;background:linear-gradient(135deg,var(--primario),var(--secundario))}
.bq-pro-btn-cristal .fila{display:flex;flex-wrap:wrap;gap:16px;justify-content:center}
.bq-pro-btn-cristal .b-cristal{padding:13px 30px;border:1px solid rgba(255,255,255,.45);border-radius:var(--radio);background:rgba(255,255,255,.18);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);color:#fff;font-weight:700;text-decoration:none;box-shadow:0 8px 24px rgba(0,0,0,.15);transition:background .25s,transform .25s}
.bq-pro-btn-cristal .b-cristal:hover{background:rgba(255,255,255,.32);transform:translateY(-2px)}`
    }

    /* Aquí van los bloques Pro. Ejemplo de entrada:
    {
      id: 'pro-precios-cintas', nombre: 'Precios con cintas', categoria: 'Precios',
      descripcion: 'Tres planes con cinta de color en la esquina.',
      etiquetas: ['precios', 'planes'],
      autor: 'Nombre del autor', licencia: 'MIT',
      fuente: 'FreeFrontend', urlFuente: 'https://codepen.io/…', adaptado: true,
      html: `<div class="bq-pro-precios-cintas">…</div>`,
      css: `.bq-pro-precios-cintas{…}`
    }
    */
  ];

  /* Categorías que existen en Pro (se calculan solas) */
  BP.categoriasPro = function () {
    var v = [];
    BP.bloquesPro.forEach(function (b) { if (v.indexOf(b.categoria) === -1) v.push(b.categoria); });
    return v;
  };
})();
