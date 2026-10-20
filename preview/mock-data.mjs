// Datos de ejemplo que simulan lo que Shopify entrega a Liquid.
const image = (name, alt, width = 800, height = 1000) => ({
  src: `/preview-assets/${name}.svg`,
  alt,
  width,
  height,
  aspect_ratio: width / height,
  media_type: 'image',
});

export const images = {
  hero: image('hero', 'Florero de cerámica terracota con una rama de olivo junto a libros apilados'),
  editorial: image('editorial', 'Piezas de cerámica y una vela sobre una repisa', 1000, 1000),
  hogar: image('hogar', 'Florero y vela aromática'),
  accesorios: image('accesorios', 'Bolsa de lona y cartera de piel'),
  oficina: image('oficina', 'Lámpara de escritorio y libreta'),
};

let nextVariantId = 4400001;
const variant = (title, price, compare = null, available = true, inventory = 99) => ({
  id: nextVariantId++,
  title,
  price,
  compare_at_price: compare,
  available,
  inventory,
});

const product = ({ id, title, handle, vendor, media, variants }) => {
  const available = variants.some((v) => v.available);
  return {
    id,
    title,
    handle,
    vendor,
    url: `/products/${handle}`,
    available,
    media,
    featured_media: media[0] || null,
    variants,
    has_only_default_variant: variants.length === 1 && variants[0].title === 'Default Title',
    selected_or_first_available_variant: variants.find((v) => v.available) || variants[0],
    price: Math.min(...variants.map((v) => v.price)),
  };
};

const products = [
  product({
    id: 9101,
    title: 'Florero Cerámico Terra',
    handle: 'florero-ceramico-terra',
    vendor: 'Taller Barro',
    media: [image('p-vase', 'Florero cerámico Terra color terracota'), image('p-vase-2', 'Florero Terra con rama de olivo')],
    variants: [
      variant('Terracota', 89900, 119900),
      variant('Arena', 89900, 119900),
      variant('Oliva', 89900, 119900, false, 0),
    ],
  }),
  product({
    id: 9102,
    title: 'Taza Esmaltada Alba',
    handle: 'taza-esmaltada-alba',
    vendor: 'Luma Studio',
    media: [image('p-mug', 'Taza esmaltada Alba color crema'), image('p-mug-2', 'Dos tazas Alba en crema y oliva')],
    variants: [variant('Default Title', 34900)],
  }),
  product({
    id: 9103,
    title: 'Lámpara de Escritorio Arco',
    handle: 'lampara-escritorio-arco',
    vendor: 'Norte Objetos',
    media: [image('p-lamp', 'Lámpara de escritorio Arco en negro'), image('p-lamp-2', 'Lámpara Arco sobre un escritorio')],
    variants: [variant('Negro', 249000), variant('Blanco', 259000, null, true, 1)],
  }),
  product({
    id: 9104,
    title: 'Libreta de Lino A5',
    handle: 'libreta-lino-a5',
    vendor: 'Papel Lento',
    media: [image('p-notebook', 'Libreta A5 con tapa de lino verde'), image('p-notebook-2', 'Libreta de lino con lápices')],
    variants: [variant('Default Title', 28900, 34000)],
  }),
  product({
    id: 9105,
    title: 'Vela de Soya Higo',
    handle: 'vela-soya-higo',
    vendor: 'Luma Studio',
    media: [image('p-candle', 'Vela de soya en frasco terracota')],
    variants: [variant('Default Title', 39900, null, false, 0)],
  }),
];

export const collection = {
  id: 501,
  title: 'Favoritos',
  handle: 'favoritos',
  url: '/collections/favoritos',
  products,
  products_count: products.length,
  featured_image: images.hogar,
};

export const categoryCollections = {
  category_1: { title: 'Hogar', url: '/collections/hogar', featured_image: images.hogar },
  category_2: { title: 'Accesorios', url: '/collections/accesorios', featured_image: images.accesorios },
  category_3: { title: 'Oficina', url: '/collections/oficina', featured_image: images.oficina },
};

export const allVariants = new Map(products.flatMap((p) => p.variants.map((v) => [v.id, { product: p, variant: v }])));

export const shop = {
  name: 'Luma Store (dev)',
  customer_accounts_enabled: true,
  privacy_policy: { url: '/policies/privacy-policy' },
  terms_of_service: { url: '/policies/terms-of-service' },
  refund_policy: { url: '/policies/refund-policy' },
  shipping_policy: { url: '/policies/shipping-policy' },
};

export const routes = {
  root_url: '/',
  search_url: '/search',
  account_url: '/account',
  cart_url: '/cart',
  collections_url: '/collections',
  all_products_collection_url: '/collections/all',
};

// Simula un tema con títulos serif y cuerpo sans (como lo haría «Configuración del tema > Tipografía»).
export const themeSettings = {
  favicon: null,
  type_body_font: {
    family: "system-ui, -apple-system, 'Segoe UI', Roboto",
    fallback_families: 'sans-serif',
    weight: 400,
  },
  type_header_font: {
    family: "'Iowan Old Style', 'Palatino Linotype', Palatino, Georgia",
    fallback_families: 'serif',
    weight: 400,
  },
  social_instagram_link: '',
  social_facebook_link: '',
  social_tiktok_link: '',
};
