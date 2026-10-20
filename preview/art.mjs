// Ilustraciones SVG locales para la vista previa (no se usan en Shopify).
const W = 800;
const H = 1000;

const shadow = (cx, y, rx) =>
  `<ellipse cx="${cx}" cy="${y}" rx="${rx}" ry="${rx * 0.12}" fill="#000" opacity=".12"/>`;

const vase = (cx, base, color, scale = 1) => `
  <g transform="translate(${cx} ${base}) scale(${scale})">
    ${shadow(0, 0, 120)}
    <path d="M-34 -420h68v46c0 34 92 70 92 196 0 112-64 178-126 178s-126-66-126-178c0-126 92-162 92-196z" fill="${color}"/>
    <path d="M-34 -420h68v18h-68z" fill="#000" opacity=".12"/>
    <path d="M-70 -300c-30 30-50 70-50 122 0 60 18 104 44 132-12-40-16-80-12-128 4-50 10-90 18-126z" fill="#fff" opacity=".16"/>
  </g>`;

const branch = (x, y) => `
  <g stroke="#55603f" stroke-width="5" fill="none" stroke-linecap="round">
    <path d="M${x} ${y}c-10-120 20-230 90-330"/>
    <path d="M${x - 4} ${y - 120}c-40-50-90-80-150-90"/>
  </g>
  <g fill="#6D7657">
    ${[[x + 40, y - 270, -35], [x + 70, y - 320, 20], [x + 10, y - 200, -60], [x + 50, y - 230, 40], [x - 70, y - 175, -20], [x - 120, y - 200, 10], [x - 10, y - 150, 50]]
      .map(([lx, ly, r]) => `<ellipse cx="${lx}" cy="${ly}" rx="34" ry="14" transform="rotate(${r} ${lx} ${ly})"/>`)
      .join('')}
  </g>`;

const mug = (cx, base, color, scale = 1) => `
  <g transform="translate(${cx} ${base}) scale(${scale})">
    ${shadow(0, 0, 110)}
    <path d="M78 -150c56 0 56 90 0 90" fill="none" stroke="${color}" stroke-width="20"/>
    <path d="M-90 -200h180l-12 186c-2 10-10 14-20 14h-116c-10 0-18-4-20-14z" fill="${color}"/>
    <ellipse cx="0" cy="-200" rx="90" ry="16" fill="#000" opacity=".1"/>
    <path d="M-60 -180l6 150" stroke="#fff" stroke-width="14" opacity=".18" stroke-linecap="round"/>
  </g>`;

const books = (cx, base, colors) => `
  <g transform="translate(${cx} ${base})">
    ${shadow(0, 0, 170)}
    <rect x="-160" y="-46" width="320" height="46" rx="4" fill="${colors[0]}"/>
    <rect x="-140" y="-88" width="290" height="42" rx="4" fill="${colors[1]}"/>
    <rect x="-150" y="-118" width="270" height="30" rx="4" fill="${colors[2]}"/>
    <path d="M-160 -12h320M-140 -54h290" stroke="#fff" opacity=".25" stroke-width="3"/>
  </g>`;

const candle = (cx, base, color) => `
  <g transform="translate(${cx} ${base})">
    ${shadow(0, 0, 80)}
    <rect x="-70" y="-170" width="140" height="170" rx="18" fill="${color}"/>
    <rect x="-70" y="-120" width="140" height="56" fill="#fff" opacity=".7"/>
    <path d="M0 -170v-26" stroke="#1F2933" stroke-width="4"/>
    <path d="M0 -250c22 26 18 50 0 54-18-4-22-28 0-54z" fill="#E8A75B"/>
  </g>`;

const lamp = (cx, base, color, scale = 1) => `
  <g transform="translate(${cx} ${base}) scale(${scale})">
    ${shadow(0, 0, 120)}
    <ellipse cx="0" cy="-14" rx="100" ry="18" fill="${color}"/>
    <rect x="-100" y="-30" width="200" height="16" fill="${color}"/>
    <path d="M0 -30 -40 -330 140 -470" fill="none" stroke="${color}" stroke-width="14" stroke-linecap="round"/>
    <circle cx="-40" cy="-330" r="16" fill="${color}"/>
    <path d="M110 -500 250 -380 170 -300 30 -420z" fill="${color}"/>
    <path d="M250 -380 170 -300" stroke="#F3D9A4" stroke-width="10" stroke-linecap="round"/>
  </g>`;

const notebook = (cx, base, color, scale = 1) => `
  <g transform="translate(${cx} ${base}) scale(${scale})">
    ${shadow(0, 0, 170)}
    <g transform="rotate(-8)">
      <rect x="-150" y="-400" width="300" height="400" rx="14" fill="${color}"/>
      <rect x="70" y="-400" width="22" height="400" fill="#1F2933" opacity=".75"/>
      <rect x="-110" y="-320" width="140" height="10" rx="5" fill="#fff" opacity=".45"/>
      <rect x="-110" y="-296" width="90" height="10" rx="5" fill="#fff" opacity=".3"/>
    </g>
  </g>`;

const tote = (cx, base, color) => `
  <g transform="translate(${cx} ${base})">
    ${shadow(0, 0, 170)}
    <path d="M-90 -380c0-120 180-120 180 0" fill="none" stroke="#B9A88C" stroke-width="16"/>
    <path d="M-170 -380h340l-20 380h-300z" fill="${color}"/>
    <path d="M-170 -380h340v26h-340z" fill="#000" opacity=".08"/>
    <circle cx="0" cy="-200" r="46" fill="none" stroke="#C96B4B" stroke-width="6"/>
  </g>`;

const wallet = (cx, base, color) => `
  <g transform="translate(${cx} ${base})">
    ${shadow(0, 0, 90)}
    <rect x="-90" y="-120" width="180" height="120" rx="16" fill="${color}"/>
    <path d="M-90 -80h180" stroke="#000" opacity=".15" stroke-width="4"/>
    <circle cx="56" cy="-80" r="10" fill="#E9D6B6"/>
  </g>`;

const pencils = (cx, base) => `
  <g transform="translate(${cx} ${base})">
    ${shadow(0, 0, 70)}
    <path d="M-30 -160 -60 -330M0 -160v-200M30 -160 70 -320" stroke-width="12" stroke-linecap="round" stroke="#C96B4B"/>
    <path d="M0 -160v-200" stroke="#6D7657" stroke-width="12" stroke-linecap="round"/>
    <rect x="-64" y="-180" width="128" height="180" rx="10" fill="#1F2933"/>
  </g>`;

const scene = (bg, floor, content, { arch = true, w = W, h = H } = {}) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${bg}"/>
      <stop offset="1" stop-color="${bg}" stop-opacity=".82"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  ${arch ? `<path d="M${w * 0.2} ${h * 0.78}V${h * 0.36}a${w * 0.3} ${w * 0.3} 0 0 1 ${w * 0.6} 0V${h * 0.78}z" fill="#fff" opacity=".28"/>` : ''}
  <rect y="${h * 0.78}" width="${w}" height="${h * 0.22}" fill="${floor}"/>
  ${content}
</svg>`;

const B = H * 0.84;

export const art = {
  hero: () => scene('#E8DFD2', '#D6C8B4', `${branch(330, 470)}${vase(330, B, '#C96B4B')}${books(590, B, ['#6D7657', '#E9E2D6', '#1F2933'])}${mug(590, B - 118, '#F7F6F2', 0.62)}`),
  editorial: () =>
    scene('#DCDCCF', '#C9C7B6', `${vase(260, 840, '#F2EEE6', 0.8)}${vase(470, 840, '#6D7657', 0.62)}${candle(640, 840, '#C96B4B')}${mug(800, 840, '#1F2933', 0.7)}`, { w: 1000, h: 1000 }),
  hogar: () => scene('#EAD9C9', '#D9C3AE', `${branch(330, 490)}${vase(330, B, '#F2EEE6', 0.95)}${candle(570, B, '#C96B4B')}`),
  accesorios: () => scene('#DDDFD1', '#C8CBB7', `${tote(330, B, '#EFE8DA')}${wallet(590, B, '#C96B4B')}`),
  oficina: () => scene('#E6E3DC', '#D2CDC2', `${lamp(250, B, '#1F2933', 0.9)}${notebook(560, B, '#6D7657', 0.7)}`),
  'p-vase': () => scene('#EFE7DD', '#E2D6C7', vase(400, B, '#C96B4B', 1.1), { arch: false }),
  'p-vase-2': () => scene('#E3E5D9', '#D3D6C4', `${branch(400, 450)}${vase(400, B, '#C96B4B', 1.1)}`, { arch: false }),
  'p-mug': () => scene('#E9EBE4', '#D9DCD2', mug(400, B, '#F7F6F2', 1.4), { arch: false }),
  'p-mug-2': () => scene('#E8DCCD', '#D8C8B5', `${mug(300, B, '#F7F6F2', 1.1)}${mug(540, B, '#6D7657', 1.1)}`, { arch: false }),
  'p-lamp': () => scene('#ECE6DC', '#DDD3C5', lamp(330, B, '#1F2933', 1.05), { arch: false }),
  'p-lamp-2': () => scene('#E0E2D6', '#CFD2C2', `${lamp(250, B, '#1F2933', 0.85)}${notebook(600, B, '#C96B4B', 0.55)}`, { arch: false }),
  'p-notebook': () => scene('#E6E1D7', '#D6CFC1', notebook(400, B, '#6D7657', 1), { arch: false }),
  'p-notebook-2': () => scene('#ECDCCD', '#DCC7B3', `${notebook(330, B, '#C96B4B', 0.8)}${pencils(600, B)}`, { arch: false }),
  'p-candle': () => scene('#EEE6DA', '#DED2C1', candle(400, B, '#C96B4B'), { arch: false }),
  logo: () => '',
};

// Equivalente local de placeholder_svg_tag.
export function placeholderSvg(name, className = '') {
  return `<svg class="${className}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 525 525" role="img" aria-label="Imagen de ejemplo (${name})" preserveAspectRatio="xMidYMid slice">
  <rect width="525" height="525" fill="currentColor" opacity=".04"/>
  <path d="M152 340l70-90 52 62 38-44 61 72z" opacity=".55"/>
  <circle cx="320" cy="200" r="28" opacity=".55"/>
</svg>`;
}
