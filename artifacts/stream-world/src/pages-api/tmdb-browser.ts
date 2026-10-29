const TMDB_API_BASE = 'https://api.themoviedb.org/3';
const CACHE_TTL_MS = 2 * 60 * 1000;

export class TmdbError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = 'TmdbError';
  }
}

const cache = new Map<string, { expiresAt: number; value: unknown }>();

export async function getTmdb(
  path: string,
  params: Record<string, string | number | undefined> = {},
): Promise<unknown> {
  const token = import.meta.env.VITE_TMDB_API_KEY as string | undefined;
  if (!token) throw new TmdbError('TMDb is not configured.', 503);

  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) query.set(key, String(value));
  }

  const cacheKey = `${path}?${query.toString()}`;
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  const url = new URL(`${TMDB_API_BASE}${path}`);
  url.searchParams.set('api_key', token);
  query.forEach((value, key) => url.searchParams.set(key, value));

  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new TmdbError('TMDb request failed.', response.status);

  const value: unknown = await response.json();
  cache.set(cacheKey, { value, expiresAt: Date.now() + CACHE_TTL_MS });
  return value;
}
