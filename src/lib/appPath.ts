const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

export function getAppPath(path: string): string {
  return path;
}

export function resolveAssetPath(path?: string | null): string {
  if (!path) return '';
  if (/^(https?:|data:|blob:)/i.test(path)) return path;
  return `${BASE}${path}`;
}
