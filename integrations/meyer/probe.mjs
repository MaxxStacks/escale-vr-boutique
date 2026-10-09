// Meyer API discovery probe. Records only status codes and response SHAPE (keys, types),
// never values, because this repo is public. The key itself is never printed.
import { writeFileSync } from 'node:fs';
const KEY = (process.env.MEYER_API_KEY || '').trim();
if (!KEY) { writeFileSync('integrations/meyer/probe-report.md', '# Meyer probe\n\nMEYER_API_KEY secret is missing or empty.\n'); process.exit(0); }

const BASES = [
  'https://meyerapi.meyerdistributing.com/http/default/ProdAPI/v2/',
  'https://meyerapi.meyerdistributing.com/http/default/TestAPI/v2/',
  'https://meyerapi.meyerdistributing.com/http/default/ProdAPI/v1/'
];
const AUTH = {
  'Espresso key:1': { Authorization: `Espresso ${KEY}:1` },
  'Espresso key': { Authorization: `Espresso ${KEY}` },
  'Bearer key': { Authorization: `Bearer ${KEY}` },
  'X-API-Key': { 'X-API-Key': KEY },
  'ApiKey header': { ApiKey: KEY }
};
const PATHS = ['ItemInformation?ItemNumber=BOS1000', 'ItemInventory?ItemNumber=BOS1000'];
const OTHER = [
  'https://meyerapi.meyerdistributing.com/',
  'https://meyerapi.meyerdistributing.com/http/default/ProdAPI/v2/swagger',
  'https://api.meyerdistributing.com/',
  'https://online.meyerdistributing.com/api/'
];

const shape = (v, d = 0) => {
  if (Array.isArray(v)) return v.length ? [`array(${v.length})`, shape(v[0], d + 1)] : 'array(0)';
  if (v && typeof v === 'object') return d > 3 ? 'object' : Object.fromEntries(Object.keys(v).slice(0, 40).map((k) => [k, shape(v[k], d + 1)]));
  return typeof v;
};
const redact = (s) => s.split(KEY).join('[KEY]');
async function hit(url, headers = {}) {
  try {
    const r = await fetch(url, { headers: { Accept: 'application/json', ...headers }, signal: AbortSignal.timeout(20000), redirect: 'manual' });
    const ct = r.headers.get('content-type') || '';
    const txt = await r.text();
    let body;
    try { body = JSON.stringify(shape(JSON.parse(txt))); } catch { body = `non-JSON, ${txt.length} chars` + (r.status >= 400 && txt.length < 300 ? `: ${redact(txt).replace(/\s+/g, ' ').replace(/\d{3,}/g, '#')}` : ''); }
    return `${r.status} | ${ct.split(';')[0]} | ${body}${r.headers.get('www-authenticate') ? ` | www-authenticate: ${r.headers.get('www-authenticate')}` : ''}${r.headers.get('location') ? ` | location: ${r.headers.get('location')}` : ''}`;
  } catch (e) { return `ERR ${e.cause?.code || e.name}: ${redact(String(e.cause?.message || e.message)).slice(0, 120)}`; }
}
const out = ['# Meyer API probe', '', `Run: ${new Date().toISOString()} · key length ${KEY.length} · key looks like ${/^[0-9a-f-]{36}$/i.test(KEY) ? 'a GUID' : /^[A-Za-z0-9+/=]+$/.test(KEY) ? 'base64/alphanumeric' : 'other'}`, ''];
out.push('## Discovery', '');
for (const u of OTHER) out.push(`- \`${u}\` → ${await hit(u)}`);
for (const b of BASES) {
  out.push('', `## ${b}`, '');
  out.push(`- no auth, ${PATHS[0]} → ${await hit(b + PATHS[0])}`);
  for (const [name, h] of Object.entries(AUTH)) for (const p of PATHS) out.push(`- ${name}, ${p} → ${await hit(b + p, h)}`);
}
writeFileSync('integrations/meyer/probe-report.md', out.join('\n') + '\n');
console.log('probe done');
