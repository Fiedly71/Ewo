import "server-only";

/**
 * Accès minimal à Supabase via son API REST (pas de dépendance).
 * Utilise la clé service_role : à n'appeler que côté serveur.
 */
const url = process.env.SUPABASE_URL?.replace(/\/$/, "") ?? "";
const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export const supabaseEnabled = () => Boolean(url && key);

export async function supabase<T>(path: string, init?: RequestInit & { revalidate?: number; tags?: string[] }): Promise<T> {
  const res = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
    next:
      init?.method && init.method !== "GET"
        ? undefined
        : { revalidate: init?.revalidate ?? 60, tags: init?.tags },
  });
  if (!res.ok) throw new Error(`Supabase ${res.status} sur ${path}: ${await res.text()}`);
  const text = await res.text();
  return (text ? JSON.parse(text) : null) as T;
}
