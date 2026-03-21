import { createClient } from '@supabase/supabase-js';

type SupabasePrimitive = string | number | boolean;
export type SupabaseRestQuery = Record<string, SupabasePrimitive | null | undefined>;
type SupabaseRestMethod = 'DELETE' | 'GET' | 'PATCH' | 'POST';
type SupabaseRestRequestOptions = {
    body?: unknown;
    headers?: HeadersInit;
    method?: SupabaseRestMethod;
    query?: SupabaseRestQuery;
    returnRepresentation?: boolean;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

export const supabase = supabaseUrl && supabasePublishableKey
    ? createClient(supabaseUrl, supabasePublishableKey)
    : null;

function getSupabaseUrl() {
    if (!supabaseUrl) {
        throw new Error('NEXT_PUBLIC_SUPABASE_URL is missing. Add it to .env.local before calling Supabase REST.');
    }

    return supabaseUrl.replace(/\/+$/, '');
}

function getSupabasePublishableKey() {
    if (!supabasePublishableKey) {
        throw new Error(
            'Add NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY to .env.local before calling Supabase REST.',
        );
    }

    return supabasePublishableKey;
}

function buildSupabaseRestUrl(path: string, query: SupabaseRestQuery = {}) {
    const url = new URL(`${getSupabaseUrl()}/rest/v1/${path.replace(/^\/+/, '')}`);
    const searchParams = new URLSearchParams();

    Object.entries(query).forEach(([key, value]) => {
        if (value === undefined || value === null) {
            return;
        }

        searchParams.set(key, String(value));
    });

    const queryString = searchParams.toString();

    if (queryString) {
        url.search = queryString;
    }

    return url.toString();
}

async function readSupabaseRestError(response: Response) {
    const contentType = response.headers.get('content-type') ?? '';

    if (contentType.includes('application/json')) {
        const data = await response.json().catch(() => null);

        if (data && typeof data === 'object') {
            if ('message' in data && typeof data.message === 'string') {
                return data.message;
            }

            if ('error' in data && typeof data.error === 'string') {
                return data.error;
            }
        }
    }

    const text = await response.text().catch(() => '');

    return text || 'Supabase REST request failed.';
}

function unwrapSingle<T>(value: T | T[] | null) {
    if (Array.isArray(value)) {
        return value[0] ?? null;
    }

    return value ?? null;
}

export function eq(value: SupabasePrimitive) {
    return `eq.${value}`;
}

export async function supabaseRestRequest<T>(
    path: string,
    {
        body,
        headers,
        method = 'GET',
        query = {},
        returnRepresentation = false,
    }: SupabaseRestRequestOptions = {},
) {
    const requestHeaders = new Headers(headers);
    const publishableKey = getSupabasePublishableKey();

    requestHeaders.set('apikey', publishableKey);
    requestHeaders.set('Authorization', `Bearer ${publishableKey}`);
    requestHeaders.set('Accept', 'application/json');

    if (body !== undefined) {
        requestHeaders.set('Content-Type', 'application/json');
    }

    if (returnRepresentation) {
        requestHeaders.set('Prefer', 'return=representation');
    }

    const response = await fetch(buildSupabaseRestUrl(path, query), {
        method,
        headers: requestHeaders,
        body: body === undefined ? undefined : JSON.stringify(body),
        cache: 'no-store',
    });

    if (!response.ok) {
        throw new Error(await readSupabaseRestError(response));
    }

    if (response.status === 204) {
        return null as T;
    }

    return response.json() as Promise<T>;
}

export function supabaseList<T>(path: string, query: SupabaseRestQuery = {}) {
    return supabaseRestRequest<T[]>(path, {
        method: 'GET',
        query: {
            select: '*',
            ...query,
        },
    });
}

export async function supabaseSingleStrict<T>(path: string, query: SupabaseRestQuery = {}) {
    const rows = await supabaseList<T>(path, query);
  
    if (rows.length > 1) {
      throw new Error(`Expected one row for ${path}, got ${rows.length}`);
    }
  
    return rows[0] ?? null;
  }

export async function supabaseInsertOne<T>(
    path: string,
    body: Record<string, unknown>,
    query: SupabaseRestQuery = {},
) {
    const response = await supabaseRestRequest<T | T[]>(path, {
        method: 'POST',
        body,
        query: {
            select: '*',
            ...query,
        },
        returnRepresentation: true,
    });

    return unwrapSingle(response);
}

export function supabaseInsertMany<T>(
    path: string,
    body: Array<Record<string, unknown>>,
    query: SupabaseRestQuery = {},
) {
    return supabaseRestRequest<T[]>(path, {
        method: 'POST',
        body,
        query: {
            select: '*',
            ...query,
        },
        returnRepresentation: true,
    });
}

export async function supabaseUpdateOne<T>(
    path: string,
    body: Record<string, unknown>,
    query: SupabaseRestQuery,
) {
    const response = await supabaseRestRequest<T | T[]>(path, {
        method: 'PATCH',
        body,
        query: {
            select: '*',
            ...query,
        },
        returnRepresentation: true,
    });

    return unwrapSingle(response);
}

export function supabaseUpdateMany<T>(
    path: string,
    body: Record<string, unknown>,
    query: SupabaseRestQuery,
) {
    return supabaseRestRequest<T[]>(path, {
        method: 'PATCH',
        body,
        query: {
            select: '*',
            ...query,
        },
        returnRepresentation: true,
    });
}

export function supabaseRemove(path: string, query: SupabaseRestQuery) {
    return supabaseRestRequest<null>(path, {
        method: 'DELETE',
        query,
    });
}
