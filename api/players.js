import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL
  || process.env.POSTGRES_URL
  || process.env.POSTGRES_DATABASE_URL
  || process.env.POSTGRESS_DATABASE_URL;
const sql = databaseUrl ? neon(databaseUrl) : null;

function getDatabase() {
  if (!sql) throw new Error('DATABASE_URL or POSTGRES_URL is not configured.');
  return sql;
}

function cleanName(value) {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ').slice(0, 28) : '';
}

async function getRequestBody(request) {
  // Vercel's Node serverless runtime exposes the parsed payload as `body`,
  // while Fetch-style requests expose it through `json()`.
  if (typeof request.json === 'function') return request.json();
  if (request.body && typeof request.body === 'string') return JSON.parse(request.body);
  return request.body || {};
}

function getQueryParam(request, name) {
  if (request.query && typeof request.query[name] === 'string') return request.query[name];
  const requestUrl = request.url || '';
  return new URL(requestUrl, 'http://localhost').searchParams.get(name) || '';
}

async function ensureTable() {
  await getDatabase()`CREATE TABLE IF NOT EXISTS players (
    id SERIAL PRIMARY KEY,
    name VARCHAR(28) NOT NULL,
    name_key VARCHAR(28) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;
}

async function listPlayers() {
  try {
    await ensureTable();
    const rows = await getDatabase()`SELECT name FROM players ORDER BY name ASC`;
    return rows.map((row) => row.name);
  } catch (error) {
    console.error(error);
    throw new Error('Player database is not configured.');
  }
}

async function addPlayer(request) {
  try {
    const name = cleanName((await getRequestBody(request)).name);
    if (!name) return { error: 'Enter a player name.', status: 400 };
    await ensureTable();
    const nameKey = name.toLocaleLowerCase();
    const result = await getDatabase()`
      INSERT INTO players (name, name_key) VALUES (${name}, ${nameKey})
      ON CONFLICT (name_key) DO UPDATE SET name = players.name
      RETURNING name
    `;
    return { name: result[0].name };
  } catch (error) {
    console.error(error);
    throw new Error('Could not save player.');
  }
}

async function removePlayer(request) {
  try {
    const name = cleanName(getQueryParam(request, 'name'));
    if (!name) return { error: 'Player name is required.', status: 400 };
    await ensureTable();
    await getDatabase()`DELETE FROM players WHERE name_key = ${name.toLocaleLowerCase()}`;
    return { ok: true };
  } catch (error) {
    console.error(error);
    throw new Error('Could not delete player.');
  }
}

export default async function handler(request, response) {
  try {
    if (request.method === 'GET') return response.status(200).json(await listPlayers());
    if (request.method === 'POST') {
      const result = await addPlayer(request);
      return response.status(result.status || 200).json(result.status ? { error: result.error } : result);
    }
    if (request.method === 'DELETE') {
      const result = await removePlayer(request);
      return response.status(result.status || 200).json(result.status ? { error: result.error } : result);
    }
    return response.status(405).json({ error: 'Method not allowed.' });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: error.message || 'Player database error.' });
  }
}
