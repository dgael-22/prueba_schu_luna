// Genera templates/page.luma.json a partir del preset de la sección.
import { writeFile } from 'node:fs/promises';
import { readSection, presetBlocks } from './schema.mjs';

const { schema } = await readSection();
const blocks = presetBlocks(schema);

const template = {
  layout: 'luma',
  sections: {
    main: {
      type: 'luma-landing-page',
      blocks: Object.fromEntries(blocks.map((b) => [b.id, { type: b.type, settings: b.settings }])),
      block_order: blocks.map((b) => b.id),
      settings: {},
    },
  },
  order: ['main'],
};

const out = new URL('../templates/page.luma.json', import.meta.url);
await writeFile(out, JSON.stringify(template, null, 2) + '\n');
console.log(`templates/page.luma.json: ${blocks.length} bloques`);
