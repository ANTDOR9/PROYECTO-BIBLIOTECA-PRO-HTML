# Generador de bloques HTML

Editor visual para armar páginas web con bloques, al estilo Elementor u Odoo. Todo en español, sin instalación ni dependencias.

## Cómo usarlo

1. Abre `index.html` en el navegador (doble clic).
2. **Botón "Ir a biblioteca"** (barra superior o panel izquierdo): abre la biblioteca a pantalla completa con vistas grandes, búsqueda y categorías. Cada bloque tiene "+ Añadir a mi página" y "Ver código"; "Volver al editor" (o Esc) regresa al lienzo.
3. **Panel izquierdo – Bloques**: biblioteca de elementos. Haz clic o arrastra un bloque a la página. "Ver código" muestra su HTML/CSS.
4. **Centro**: la página que estás construyendo. Haz clic en un elemento para seleccionarlo; doble clic para editar el texto. El asa ⠿ de la barra flotante permite arrastrar el bloque para reordenarlo.
5. **Panel derecho**: propiedades del elemento (texto, enlace, imagen, colores, espaciado, tamaño). Sin selección, muestra el tema global (colores, fuente, radio).
6. **Capas**: lista de bloques para reordenar, duplicar o eliminar.
7. **Barra superior**: Escritorio/Tableta/Móvil, modo Visual/Dividido/Código, deshacer/rehacer (Ctrl+Z / Ctrl+Y), Probar, Descargar `pagina.html`.

El trabajo se guarda solo en el navegador (localStorage).

## Estructura

```
index.html
css/estilos.css            Estilos del editor
js/app.js                  Arranque
js/datos/base.js           Tema y CSS base de las páginas
js/datos/componentes.js    Categorías y bloques de la biblioteca
js/nucleo/                 Utilidades, exportación, historial, lienzo
js/ui/                     Biblioteca (panel), galería (pantalla completa), capas, propiedades, código, barra
```

## Cómo agregar un bloque nuevo

En `js/datos/componentes.js`, añade un objeto a `BP.bloques`:

- `id`, `nombre`, `categoria`, `descripcion`, `etiquetas`
- `autor` y `licencia` (si es código de otra persona, conserva su autor y licencia)
- `html`: la raíz debe tener la clase `bq-<id>`
- `css`: todas las reglas bajo `.bq-<id>`, usando las variables del tema: `--primario`, `--secundario`, `--fondo`, `--texto`, `--fuente`, `--radio`, `--suave`, `--tarjeta`, `--linea`

## Próximos pasos posibles

- Editar el código y aplicarlo al lienzo.
- Más bloques y plantillas de página completas.
- Importador de ejemplos de FreeFrontend (respetando autor y licencia).

## Pendientes

- **Importar ejemplos de FreeFrontend a la biblioteca Pro** (por categorías, empezando por Botones).
  FreeFrontend solo enlaza a CodePen, así que cada ejemplo se adapta a mano: se toma el HTML/CSS del pen,
  se convierte al formato de bloque y se guarda en `js/datos/pro.js` con `autor`, `licencia`, `fuente` y `urlFuente`.
  Solo se incluyen los que tengan licencia clara.
- Código editable en el panel y aplicarlo al lienzo.
- Más bloques y plantillas de página completas.
