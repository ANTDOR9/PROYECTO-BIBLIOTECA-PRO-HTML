/* ==========================================================
   Tema y estilos base de toda página creada con el editor
   ========================================================== */
(function () {
  'use strict';
  var BP = window.BP = window.BP || {};

  BP.fuentes = {
    sistema:   ['Moderna (sistema)', 'system-ui,-apple-system,"Segoe UI",Roboto,sans-serif'],
    redondeada:['Redondeada',        '"Trebuchet MS","Segoe UI",sans-serif'],
    serif:     ['Con serifa',        'Georgia,"Times New Roman",serif'],
    elegante:  ['Elegante',          '"Palatino Linotype",Palatino,Georgia,serif'],
    mono:      ['Monoespaciada',     'ui-monospace,"Cascadia Code",Consolas,monospace']
  };

  BP.temaDefecto = { primario: '#5b4bff', secundario: '#38d6c4', fondo: '#ffffff', texto: '#1b2036', fuente: 'sistema', radio: 12, titulo: 'Mi página' };
  BP.tema = Object.assign({}, BP.temaDefecto);

  BP.temaCSS = function (t) {
    t = t || BP.tema;
    var f = (BP.fuentes[t.fuente] || BP.fuentes.sistema)[1];
    return ':root{--primario:' + t.primario + ';--secundario:' + t.secundario + ';--fondo:' + t.fondo +
      ';--texto:' + t.texto + ';--fuente:' + f + ';--radio:' + t.radio + 'px}';
  };

  BP.baseCSS = [
    ':root{--suave:color-mix(in srgb,var(--texto) 62%,var(--fondo));--tarjeta:color-mix(in srgb,var(--texto) 5%,var(--fondo));--linea:color-mix(in srgb,var(--texto) 14%,var(--fondo))}',
    '*,*::before,*::after{box-sizing:border-box}',
    'html{scroll-behavior:smooth}',
    'body{margin:0;font-family:var(--fuente);background:var(--fondo);color:var(--texto);line-height:1.6}',
    'h1,h2,h3,h4,p,ul,ol,figure,blockquote{margin:0}',
    'img{display:block;max-width:100%}',
    'a{color:inherit}',
    '.contenedor{width:min(1120px,100% - 40px);margin-inline:auto}',
    '.boton{display:inline-block;padding:12px 26px;border:0;border-radius:var(--radio);background:var(--primario);color:#fff;font:inherit;font-weight:600;text-decoration:none;cursor:pointer;transition:transform .2s,box-shadow .2s}',
    '.boton:hover{transform:translateY(-2px);box-shadow:0 10px 22px color-mix(in srgb,var(--primario) 40%,transparent)}',
    '.boton.contorno{background:transparent;color:var(--primario);box-shadow:inset 0 0 0 2px var(--primario)}',
    '.boton.claro{background:#fff;color:var(--primario)}',
    '.boton.contorno-claro{background:transparent;color:#fff;box-shadow:inset 0 0 0 2px rgba(255,255,255,.75)}',
    '.insignia{display:inline-block;padding:4px 14px;border-radius:99px;background:color-mix(in srgb,var(--primario) 14%,var(--fondo));color:var(--primario);font-size:.82rem;font-weight:700}'
  ].join('\n');
})();
