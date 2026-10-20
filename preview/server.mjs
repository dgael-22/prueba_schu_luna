// Vista previa local de la sección con liquidjs y objetos de Shopify simulados.
// Uso: npm run dev  ->  http://localhost:8790
//   ?hero=background       hero con imagen de fondo
//   ?collection=none       sin colección (tarjetas de ejemplo)
//   ?images=none           sin imágenes (placeholders de Shopify)
//   ?heading=serif|body    fuente de títulos
//   ?design_mode=1         simula el editor de temas
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { Liquid, Tag, Hash } from 'liquidjs';
import { readSection, defaultsOf, presetBlocks } from './schema.mjs';
import { art, placeholderSvg } from './art.mjs';
import * as mock from './mock-data.mjs';

const PORT = Number(process.env.PORT) || 8790;
const LAYOUT_PATH = new URL('../layout/luma.liquid', import.meta.url);
const SECTION_ID = 'template--luma__main';

const engine = new Liquid({ strictFilters: true });
const cart = { items: [] };
const itemCount = () => cart.items.reduce((sum, item) => sum + item.quantity, 0);

/* ---------- Tags de Shopify ---------- */

// {% schema %}, {% stylesheet %}, {% javascript %}: contenido crudo.
function rawTag(name, wrap) {
  return class extends Tag {
    constructor(token, remainTokens, liquid) {
      super(token, remainTokens, liquid);
      this.text = '';
      while (remainTokens.length) {
        const next = remainTokens.shift();
        if (next.name === `end${name}`) return;
        this.text += next.getText();
      }
      throw new Error(`{% ${name} %} sin cerrar`);
    }
    render(ctx, emitter) {
      emitter.write(wrap(this.text));
    }
  };
}
engine.registerTag('schema', rawTag('schema', () => ''));
engine.registerTag('stylesheet', rawTag('stylesheet', (css) => `<style data-shopify-stylesheet>${css}</style>`));
engine.registerTag('javascript', rawTag('javascript', (js) => `<script>${js}</script>`));

// Bloques con Liquid dentro: {% style %} y {% form %}.
function parseBody(tag, name, remainTokens, liquid) {
  tag.templates = [];
  const stream = liquid.parser
    .parseStream(remainTokens)
    .on(`tag:end${name}`, () => stream.stop())
    .on('template', (tpl) => tag.templates.push(tpl))
    .on('end', () => {
      throw new Error(`{% ${name} %} sin cerrar`);
    });
  stream.start();
}

engine.registerTag(
  'style',
  class extends Tag {
    constructor(token, remainTokens, liquid) {
      super(token, remainTokens, liquid);
      parseBody(this, 'style', remainTokens, liquid);
    }
    *render(ctx, emitter) {
      emitter.write('<style data-shopify>');
      yield this.liquid.renderer.renderTemplates(this.templates, ctx, emitter);
      emitter.write('</style>');
    }
  }
);

engine.registerTag(
  'form',
  class extends Tag {
    constructor(token, remainTokens, liquid) {
      super(token, remainTokens, liquid);
      const match = token.args.match(/^\s*'(\w+)'\s*(?:,\s*([\w.]+)(?=\s*(?:,|$)))?\s*,?\s*([\s\S]*)$/);
      if (!match) throw new Error(`form: argumentos no válidos (${token.args})`);
      this.formType = match[1];
      this.hash = new Hash(match[3] || '');
      parseBody(this, 'form', remainTokens, liquid);
    }
    *render(ctx, emitter) {
      const attrs = yield this.hash.render(ctx);
      const state = ctx.environments.__request;
      const id = attrs.id || `${this.formType}_form`;
      const action = this.formType === 'product' ? '/cart/add' : `/contact#${id}`;
      const extra = this.formType === 'product' ? ' enctype="multipart/form-data"' : '';
      const htmlAttrs = Object.entries(attrs)
        .filter(([key]) => key !== 'id')
        .map(([key, value]) => `${key}="${String(value ?? '').replace(/"/g, '&quot;')}"`)
        .join(' ');

      emitter.write(
        `<form method="post" action="${action}" id="${id}" accept-charset="UTF-8"${extra} ${htmlAttrs}>` +
          `<input type="hidden" name="form_type" value="${this.formType}"><input type="hidden" name="utf8" value="✓">`
      );

      const form = { email: '', errors: null, 'posted_successfully?': false };
      if (this.formType === 'customer') {
        form['posted_successfully?'] = state.customerPosted;
        if (state.newsletterError) {
          form.email = state.newsletterError.email;
          const errors = ['email'];
          errors.messages = { email: 'no es válido.' };
          errors.translated_fields = { email: 'correo electrónico' };
          form.errors = errors;
        }
      }
      ctx.push({ form });
      yield this.liquid.renderer.renderTemplates(this.templates, ctx, emitter);
      ctx.pop();
      emitter.write('</form>');
    }
  }
);

/* ---------- Filtros de Shopify ---------- */

const kwargs = (args) => Object.fromEntries(args.filter(Array.isArray));
const escapeAttr = (value) => String(value ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const imageByUrl = new Map();

engine.registerFilter('money', (cents) => {
  const value = Number(cents || 0) / 100;
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
});

engine.registerFilter('image_url', (image, ...args) => {
  if (!image || !image.src) return '';
  const { width } = kwargs(args);
  const url = `${image.src}?width=${width || image.width}`;
  imageByUrl.set(url, image);
  return url;
});

engine.registerFilter('image_tag', (url, ...args) => {
  const image = imageByUrl.get(url) || {};
  const options = kwargs(args);
  const src = String(url);
  const widths = String(options.widths || '')
    .split(',')
    .map((w) => w.trim())
    .filter(Boolean);
  const attrs = {
    src,
    srcset: widths.length ? widths.map((w) => `${src.split('?')[0]}?width=${w} ${w}w`).join(', ') : undefined,
    alt: options.alt ?? image.alt ?? '',
    width: options.width ?? image.width,
    height: options.height ?? image.height,
  };
  for (const [key, value] of Object.entries(options)) {
    if (!['widths', 'alt', 'width', 'height'].includes(key)) attrs[key] = value;
  }
  return `<img ${Object.entries(attrs)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${key}="${escapeAttr(value)}"`)
    .join(' ')}>`;
});

engine.registerFilter('placeholder_svg_tag', (name, className) => placeholderSvg(name, className));
engine.registerFilter('font_face', () => '');
engine.registerFilter('font_modify', (font) => font);

/* ---------- Render de la página ---------- */

async function renderPage(url, request = {}) {
  const { source, schema } = await readSection();
  const q = url.searchParams;
  const noImages = q.get('images') === 'none';

  const settings = defaultsOf(schema.settings);
  settings.featured_collection = q.get('collection') === 'none' ? null : mock.collection;
  if (!noImages) {
    settings.hero_image = mock.images.hero;
    settings.editorial_image = mock.images.editorial;
  }
  if (q.get('hero')) settings.hero_layout = q.get('hero');
  if (q.get('heading')) settings.heading_font = q.get('heading');

  const blockSchemas = Object.fromEntries(schema.blocks.map((b) => [b.type, b]));
  const blocks = presetBlocks(schema).map((block) => {
    const merged = { ...defaultsOf(blockSchemas[block.type].settings), ...block.settings };
    if (block.type === 'category' && !noImages) merged.image = mock.categoryCollections[block.id]?.featured_image;
    if (block.type === 'category') merged.link = mock.categoryCollections[block.id]?.url;
    return {
      id: block.id,
      type: block.type,
      settings: merged,
      shopify_attributes: `data-shopify-editor-block='${JSON.stringify({ id: block.id, type: block.type })}'`,
    };
  });

  const scope = {
    __request: {
      customerPosted: q.get('customer_posted') === 'true',
      newsletterError: request.newsletterError || null,
    },
    section: { id: SECTION_ID, settings, blocks },
    shop: mock.shop,
    routes: mock.routes,
    cart: { item_count: itemCount() },
    request: { design_mode: q.get('design_mode') === '1', locale: { iso_code: 'es' } },
    settings: mock.themeSettings,
    page_title: 'Luma · Diseño que acompaña tu día',
    page_description: 'Landing de prueba de Luma Store.',
    canonical_url: `http://localhost:${PORT}/`,
  };

  const sectionHtml = await engine.parseAndRender(source, scope);
  const designMode = scope.request.design_mode;
  const contentForHeader = `<script>window.Shopify = { routes: { root: '/' }, designMode: ${designMode} };</script>`;
  const layout = await readFile(LAYOUT_PATH, 'utf8');
  return engine.parseAndRender(layout, {
    ...scope,
    content_for_header: contentForHeader,
    content_for_layout: `<div id="shopify-section-${SECTION_ID}" class="shopify-section">${sectionHtml}</div>`,
  });
}

/* ---------- Servidor ---------- */

const readBody = (req) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });

const send = (res, status, body, type = 'text/html; charset=utf-8', headers = {}) => {
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store', ...headers });
  res.end(body);
};
const json = (res, status, data) => send(res, status, JSON.stringify(data), 'application/json; charset=utf-8');

const stubPage = (title, body) => `<!doctype html><html lang="es"><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title>
<body style="font-family:system-ui;background:#F7F6F2;color:#1F2933;max-width:640px;margin:64px auto;padding:0 16px">
<p style="color:#6D7657;font-weight:600">Vista previa local</p><h1>${title}</h1>${body}<p><a href="/">← Volver a la landing</a></p></body></html>`;

async function addToCart(formData) {
  const id = Number(formData.get('id'));
  const quantity = Number(formData.get('quantity') || 1);
  const found = mock.allVariants.get(id);
  if (!found) return { status: 404, data: { status: 404, message: 'Cart Error', description: 'No se encontró la variante.' } };

  const { product, variant } = found;
  const name = product.has_only_default_variant ? product.title : `${product.title} - ${variant.title}`;
  const line = cart.items.find((item) => item.id === id);
  const inCart = line ? line.quantity : 0;
  if (!variant.available || inCart + quantity > variant.inventory) {
    return {
      status: 422,
      data: { status: 422, message: 'Cart Error', description: `Todas las unidades de ${name} ya están en tu carrito.` },
    };
  }
  if (line) line.quantity += quantity;
  else cart.items.push({ id, quantity, title: name, product_title: product.title, price: variant.price });
  return { status: 200, data: { id, quantity, title: name, product_title: product.title, price: variant.price } };
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  try {
    if (req.method === 'GET' && url.pathname.startsWith('/preview-assets/')) {
      const name = url.pathname.replace('/preview-assets/', '').replace(/\.svg$/, '');
      if (!art[name]) return send(res, 404, 'No existe');
      return send(res, 200, art[name](), 'image/svg+xml');
    }

    if (req.method === 'POST' && url.pathname === '/cart/add.js') {
      const body = await readBody(req);
      const formData = await new Request('http://local/', { method: 'POST', headers: { 'content-type': req.headers['content-type'] }, body }).formData();
      await new Promise((r) => setTimeout(r, 650)); // latencia simulada para ver el estado de carga
      const { status, data } = await addToCart(formData);
      return json(res, status, data);
    }

    if (req.method === 'POST' && url.pathname === '/cart/add') {
      const body = await readBody(req);
      const formData = await new Request('http://local/', { method: 'POST', headers: { 'content-type': req.headers['content-type'] }, body }).formData();
      await addToCart(formData);
      return send(res, 302, '', 'text/plain', { Location: '/cart' });
    }

    if (req.method === 'GET' && url.pathname === '/cart.js') {
      return json(res, 200, { item_count: itemCount(), items: cart.items });
    }

    if (req.method === 'GET' && url.pathname === '/cart') {
      const rows = cart.items.map((i) => `<li>${i.quantity} × ${i.title}</li>`).join('') || '<li>El carrito está vacío.</li>';
      return send(res, 200, stubPage('Carrito', `<ul>${rows}</ul><form method="post" action="/cart/clear"><button>Vaciar carrito</button></form>`));
    }

    if (req.method === 'POST' && url.pathname === '/cart/clear') {
      cart.items = [];
      return send(res, 302, '', 'text/plain', { Location: '/cart' });
    }

    if (req.method === 'POST' && url.pathname === '/contact') {
      const params = new URLSearchParams((await readBody(req)).toString());
      const email = (params.get('contact[email]') || '').trim();
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return send(res, 302, '', 'text/plain', { Location: `/?customer_posted=true#luma-newsletter-form-${SECTION_ID}` });
      }
      return send(res, 200, await renderPage(url, { newsletterError: { email } }));
    }

    if (req.method === 'GET' && (url.pathname === '/' || url.pathname === '/pages/luma')) {
      return send(res, 200, await renderPage(url));
    }

    if (req.method === 'GET') {
      return send(res, 200, stubPage(decodeURIComponent(url.pathname), '<p>Página simulada: en Shopify este enlace lleva a la página real.</p>'));
    }
    return send(res, 405, 'Método no permitido', 'text/plain');
  } catch (err) {
    console.error(err);
    return send(res, 500, `<pre>${escapeAttr(err.stack || err.message)}</pre>`);
  }
});

server.listen(PORT, () => console.log(`Luma preview: http://localhost:${PORT}`));
