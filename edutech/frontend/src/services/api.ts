type TokenGetter = () => Promise<string>;

let _getToken: TokenGetter | null = null;
let _currentUserId: number | null = null;

export function initializeAuth(getToken: TokenGetter): void {
  _getToken = getToken;
}

export function initializeCurrentUser(id: number): void {
  _currentUserId = id;
}

export function getCurrentUserId(): number | null {
  return _currentUserId;
}

export async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  if (_getToken) {
    const token = await _getToken();
    const existingHeaders = normalizeHeaders(options.headers);
    options = {
      ...options,
      headers: { ...existingHeaders, Authorization: `Bearer ${token}` },
    };
  }
  return fetch(url, options);
}

function normalizeHeaders(headers: HeadersInit | undefined): Record<string, string> {
  if (!headers) return {};
  if (headers instanceof Headers) {
    const result: Record<string, string> = {};
    headers.forEach((v, k) => { result[k] = v; });
    return result;
  }
  if (Array.isArray(headers)) return Object.fromEntries(headers);
  return headers as Record<string, string>;
}
