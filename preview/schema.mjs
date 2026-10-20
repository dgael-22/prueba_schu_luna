// Lee el {% schema %} de la sección para reutilizar defaults y preset.
import { readFile } from 'node:fs/promises';

export const SECTION_PATH = new URL('../sections/luma-landing-page.liquid', import.meta.url);

export async function readSection() {
  const source = await readFile(SECTION_PATH, 'utf8');
  const match = source.match(/{%-?\s*schema\s*-?%}([\s\S]*?){%-?\s*endschema\s*-?%}/);
  if (!match) throw new Error('La sección no tiene {% schema %}');
  return { source, schema: JSON.parse(match[1]) };
}

export function defaultsOf(settings = []) {
  const values = {};
  for (const setting of settings) {
    if (!setting.id) continue;
    values[setting.id] = setting.default ?? (setting.type === 'checkbox' ? false : null);
  }
  return values;
}

// Bloques del preset con ids estables: nav_link_1, category_2, ...
export function presetBlocks(schema) {
  const counters = {};
  return schema.presets[0].blocks.map((block) => {
    counters[block.type] = (counters[block.type] || 0) + 1;
    return { id: `${block.type}_${counters[block.type]}`, type: block.type, settings: block.settings || {} };
  });
}
