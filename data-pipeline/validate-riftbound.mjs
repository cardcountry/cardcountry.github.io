import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const policy = JSON.parse(fs.readFileSync(path.join(here, 'riftbound-source-policy.json'), 'utf8'));
const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root, 'riftbound-data.js'), 'utf8'), context);
const data = context.window.RIFTBOUND_DATA;

const errors = [];
const warnings = [];
const acceptedHosts = new Set(Object.values(policy.tiers).flatMap(tier => tier.hosts));

function hostOf(value) {
  try { return new URL(value).hostname; } catch { return ''; }
}
function trustedDeckSource(value) {
  try { const u=new URL(value);return u.protocol==='https:'&&(u.hostname==='riftdecks.com'||u.hostname==='playriftbound.com'&&u.pathname==='/en-us/news/organizedplay/best-ofs-for-the-european-championship/'); } catch { return false; }
}

function duplicateValues(items) {
  const seen = new Set();
  const duplicates = new Set();
  for (const item of items) seen.has(item) ? duplicates.add(item) : seen.add(item);
  return [...duplicates];
}

for (const id of duplicateValues(data.cards.map(card => card.id))) errors.push(`Duplicate card id: ${id}`);
for (const code of duplicateValues(data.cards.map(card => card.code))) warnings.push(`Repeated print code: ${code}`);

for (const card of data.cards) {
  if (!card.id || !card.code || !card.name) errors.push(`Incomplete card identity: ${card.id || card.code || 'unknown'}`);
  if (hostOf(card.image) !== 'cmsassets.rgpub.io') errors.push(`Non-official base image: ${card.id}`);
  for (const [locale, localized] of Object.entries(card.l || {})) {
    const image = localized?.[2];
    if (image && hostOf(image) !== 'cmsassets.rgpub.io') errors.push(`Non-official ${locale} image: ${card.id}`);
  }
}

for (const id of duplicateValues(data.decks.map(deck => String(deck.id)))) errors.push(`Duplicate deck id: ${id}`);
for (const deck of data.decks) {
  const groups = {};
  for (const entry of deck.entries || []) groups[entry.group] = (groups[entry.group] || 0) + Number(entry.count || 0);
  const mainDeck = (groups.champion || 0) + (groups.unit || 0) + (groups.gear || 0) + (groups.spell || 0);
  const total = (deck.entries || []).reduce((sum, entry) => sum + Number(entry.count || 0), 0);
  const expected = policy.deckComposition;
  if (groups.legend !== expected.legend) errors.push(`${deck.id}: legend total ${groups.legend || 0}`);
  if (mainDeck !== expected.mainDeck) errors.push(`${deck.id}: main-deck total ${mainDeck}`);
  if (groups.battlefields !== expected.battlefields) errors.push(`${deck.id}: battlefield total ${groups.battlefields || 0}`);
  if (groups.runes !== expected.runes) errors.push(`${deck.id}: rune total ${groups.runes || 0}`);
  if (groups.sideboard !== expected.sideboard) errors.push(`${deck.id}: sideboard total ${groups.sideboard || 0}`);
  if (total !== expected.totalExport || deck.total !== expected.totalExport) errors.push(`${deck.id}: export total ${total}`);
  if (!trustedDeckSource(deck.source)) errors.push(`${deck.id}: untrusted deck source`);
  const knownAttendance=Number(deck.players)>=2,explicitUnknown=deck.players===null&&typeof deck.playersNote==='string'&&deck.playersNote.trim()&&hostOf(deck.source)==='playriftbound.com';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(deck.date || '') || !knownAttendance&&!explicitUnknown) errors.push(`${deck.id}: incomplete event metadata`);
}

for (const event of data.events) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(event.date || '')) errors.push(`Invalid event date: ${event.name}`);
  if (event.format !== policy.format.split(' ')[0] || Number(event.players) < 2) errors.push(`Out-of-scope event: ${event.name}`);
}

for (const source of data.sources) {
  const host = hostOf(source.url);
  if (!acceptedHosts.has(host)) errors.push(`Untrusted source host: ${host || source.name}`);
}

for (const video of data.videos) {
  if (!/^[\w-]{11}$/.test(video.id || '')) errors.push(`Invalid YouTube id: ${video.id || video.title}`);
}

const report = {
  status: errors.length ? 'failed' : 'passed',
  policyVersion: policy.version,
  snapshot: data.snapshot,
  generatedAt: data.generatedAt,
  counts: {
    cards: data.cards.length,
    decklists: data.decks.length,
    events: data.events.length,
    videos: data.videos.length,
    sources: data.sources.length
  },
  errors,
  warnings
};

console.log(JSON.stringify(report, null, 2));
process.exitCode = errors.length ? 1 : 0;
