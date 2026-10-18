# Biblioteca Pro HTML

Biblioteca de componentes HTML, CSS y JavaScript, todo en español, con vista previa, código listo para copiar y registro de autor y licencia por componente.

## Estructura

```
PROYECTO-BIBLIOTECA-PRO-HTML/
├── index.html              Página principal
├── css/
│   └── estilos.css         Estilos de la biblioteca (temas claro/oscuro)
└── js/
    ├── app.js              Lógica: filtros, búsqueda, vista previa, copiar, descargar
    └── datos/
        └── componentes.js  Catálogo de componentes (aquí se agregan los nuevos)
```

## Cómo usarla

Abre `index.html` en el navegador. No necesita instalación ni servidor.

## Cómo agregar un componente

Edita `js/datos/componentes.js` y añade un bloque al arreglo `window.COMPONENTES`:

```js
{
  id: 'mi-componente',
  nombre: 'Mi componente',
  categoria: 'Botones',        // las categorías nuevas aparecen solas en el menú
  nivel: 'Principiante',
  descripcion: 'Qué hace en una frase.',
  etiquetas: ['etiqueta1', 'etiqueta2'],
  autor: 'Tu nombre',
  licencia: 'MIT',
  html: `<button>Hola</button>`,
  css: BASE + `button{padding:10px}`,
  js: ``                       // opcional
}
```

## Licencias

Los componentes incluidos son originales (MIT). Si agregas código de terceros, por ejemplo de FreeFrontend, CodePen o Uiverse, copia su **autor** y su **licencia** en los campos correspondientes y conserva el aviso de copyright. No copies textos, capturas ni el diseño de otros sitios.
