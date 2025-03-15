export const TMDB_ACCESS_TOKEN = process.env.NEXT_PUBLIC_ACCESS_TOKEN;

if (!TMDB_ACCESS_TOKEN) {
  console.error('TMDB_ACCESS_TOKEN is not defined.');
}

export function getRootUrl(): string {
  const { protocol, hostname, port } = window.location;
  return `${protocol}//${hostname}${port ? `:${port}` : ''}`;
}
