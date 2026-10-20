# Luma Store · Landing page para Shopify

Landing de prueba para una tienda ficticia de diseño y lifestyle. Es **una sola sección de Shopify** (Liquid + CSS + JS, sin dependencias) con todo configurable desde el editor de temas, más una vista previa local para probarla sin tocar ninguna tienda.

```
luma-store/
├── sections/luma-landing-page.liquid   ← LA SECCIÓN (HTML + CSS + JS + schema)
├── layout/luma.liquid                  ← layout opcional sin header/footer del tema
├── templates/page.luma.json            ← plantilla de página que usa la sección
└── preview/                            ← solo para la vista previa local (no se sube)
```

## 1. Dónde va cada archivo en Shopify

> Antes de nada: **Tienda online → Temas → ⋯ → Duplicar** y trabaja sobre la copia.

En la copia: **⋯ → Editar código**.

| Archivo local | En el editor de código de Shopify | Obligatorio |
|---|---|---|
| `sections/luma-landing-page.liquid` | Carpeta **Sections → Agregar una nueva sección** → nombre `luma-landing-page` → borra el contenido de ejemplo y pega el archivo completo | Sí |
| `layout/luma.liquid` | Carpeta **Layout → Agregar un nuevo diseño** → nombre `luma` → pega el archivo | Solo para la plantilla de página |
| `templates/page.luma.json` | Carpeta **Templates → Agregar una nueva plantilla** → tipo `page`, formato **JSON**, nombre `luma` → pega el archivo | Solo para la plantilla de página |

**¿Dónde está el CSS y el JS?** Dentro de la sección:

- `{% style %}`: variables de color que salen del editor (se actualizan en vivo).
- `{% stylesheet %}`: todo el CSS estático. Shopify lo agrupa en un solo archivo y lo carga en el `<head>`.
- `{% javascript %}`: un custom element `<luma-landing>` (menú móvil, scroll suave, carrito, favoritos, newsletter y animaciones). Shopify lo agrupa y lo carga diferido.

No hay que crear archivos en `assets/`.

## 2. Dos formas de usarla

### A) Como plantilla de página (recomendado, página completa)

1. Sube los tres archivos de la tabla.
2. **Tienda online → Páginas → Agregar página**, título p. ej. «Luma», y en **Plantilla del tema** elige `luma`.
3. Guarda y abre **Personalizar** → arriba, en el selector de páginas, elige *Páginas → luma*.

El layout `luma` no muestra el header ni el footer del tema, así que no se duplican con los de la sección. Carga las fuentes del tema si este usa los ids estándar (`type_body_font`, `type_header_font`, como Dawn).

### B) Como sección dentro de cualquier plantilla

1. Sube solo `sections/luma-landing-page.liquid`.
2. **Personalizar** → abre la plantilla que quieras → **Agregar sección** → **Luma · Landing page**.
3. Como el tema ya tiene header y footer, en los ajustes de la sección desactiva **Mostrar barra de anuncio**, **Mostrar header propio** y **Mostrar footer propio**.

## 3. Qué configurar en el editor de temas

- **Productos destacados → Colección**: elige una colección con productos. Sin colección se ven 4 tarjetas de ejemplo.
- **Hero, editorial, logo y categorías**: sube imágenes con `image_picker`. Sin imagen se muestran los placeholders de Shopify.
- **Categorías**: cada bloque acepta una colección; si dejas vacíos imagen, título o enlace, los toma de la colección.
- **Menú**: los bloques «Enlace del menú» traen anclas a secciones de la propia landing (scroll suave). Pon un **Enlace** para mandar a otra página, o elige un menú de Shopify en «Menú de Shopify» para reemplazar todos los bloques.
- **Footer**: los bloques «Enlace del footer» apuntan por defecto a la página de contacto y a las políticas de **Configuración → Políticas**. Redes sociales: si no pones URL, usa las de Configuración del tema o la portada de cada red.
- **Tipografía**: «Títulos del tema» (por defecto), «Cuerpo del tema» o «Serif editorial del sistema» (Palatino/Georgia, sin descargar fuentes).
- **Colores**: fondo, texto, tarjetas, terracota, oliva, barra de anuncio, newsletter y footer.

## 4. Comportamiento

- **Agregar al carrito**: usa `{% form 'product' %}` estándar. Con JS se envía a `/cart/add.js`, muestra spinner → «Agregado ✓», actualiza el contador del header y lanza el evento `luma:cart:added` en `document` (por si quieres abrir el cajón de carrito de tu tema). Sin JS, el formulario va a `/cart` como siempre. Los errores de Shopify (sin inventario, etc.) se muestran bajo el botón.
- **Variantes**: si el producto tiene variantes aparece un selector con la primera disponible preseleccionada; las agotadas salen deshabilitadas y el precio/descuento cambia al elegir. Para selectores por opción (color / talla) se puede extender con `product.options_with_values`.
- **Favoritos**: el corazón solo es visual (`aria-pressed`), no guarda nada.
- **Newsletter**: `{% form 'customer' %}` con la etiqueta `newsletter`; los suscriptores aparecen en **Clientes** con aceptación de marketing. Valida el correo antes de enviar y muestra los mensajes de éxito o error que devuelve Shopify. Shopify puede pedir un captcha (hCaptcha) en el primer envío; es normal.
- **Accesibilidad**: enlace «Saltar al contenido», foco visible, menú con `aria-expanded` que se cierra con Esc y deja inerte el resto de la página, textos alternativos, estrellas con `aria-label`, avisos en una región `aria-live` y contraste AA en los colores por defecto. Respeta «reducir movimiento».

## 5. Vista previa local (sin Shopify)

Requiere Node 20+.

```bash
npm install
npm run dev
```

Abre http://localhost:8790. El servidor (`preview/server.mjs`) renderiza la sección y el layout reales con [liquidjs](https://liquidjs.com/), simula los objetos de Shopify (`section`, `product`, `cart`, `routes`…) con `preview/mock-data.mjs` y responde a `/cart/add.js`, `/cart.js` y `/contact`. Las ilustraciones son SVG generados en `preview/art.mjs`.

Parámetros útiles:

| URL | Qué muestra |
|---|---|
| `/?hero=background` | Hero con imagen de fondo |
| `/?collection=none` | Sin colección (tarjetas de ejemplo) |
| `/?images=none` | Sin imágenes (placeholders) |
| `/?heading=serif` · `/?heading=body` | Otras fuentes de títulos |
| `/?design_mode=1` | Como en el editor de temas (sin animación de entrada) |

Para probar el error del carrito: agrega dos veces la «Lámpara Arco» en variante *Blanco* (el ejemplo solo tiene 1 unidad). El carrito simulado se vacía en `/cart`.

La vista previa simula un tema con títulos serif; en Dawn los títulos saldrán con la fuente de títulos de Dawn salvo que elijas «Serif editorial del sistema».

## 6. Comandos

```bash
npm run check      # Shopify Theme Check sobre sections/, layout/ y templates/
npm run template   # regenera templates/page.luma.json desde el preset de la sección
```

Theme Check da 0 errores y 2 avisos esperados: `ExcessiveSettingsCount` y `LiquidComplexity`, porque las diez partes de la landing viven en una sola sección configurable. Si más adelante se quiere dividir, cada parte (hero, productos, newsletter…) puede ser su propia sección con el mismo CSS.
