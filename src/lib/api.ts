export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function unwrap<T>(response: Response): Promise<T> {
  const body = (await response.json().catch(() => null)) as (T & { message?: string }) | null;
  if (!response.ok) {
    // Sessão expirou no meio do uso do painel: volta pro login.
    if (response.status === 401 && typeof window !== "undefined" && window.location.pathname.startsWith("/admin")) {
      window.location.href = "/admin/login";
    }
    throw new ApiError(body?.message ?? `Requisição falhou (${response.status}).`, response.status);
  }
  return body as T;
}

/// Fetcher usado pelo SWR.
export async function fetcher<T>(path: string): Promise<T> {
  return unwrap<T>(await fetch(path, { credentials: "same-origin" }));
}

async function request<T>(path: string, method: string, body?: unknown): Promise<T> {
  const response = await fetch(path, {
    method,
    credentials: "same-origin",
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return unwrap<T>(response);
}

export const api = {
  post: <T = unknown>(path: string, body?: unknown) => request<T>(path, "POST", body),
  patch: <T = unknown>(path: string, body?: unknown) => request<T>(path, "PATCH", body),
  delete: <T = unknown>(path: string) => request<T>(path, "DELETE"),
};

export function errorMessage(err: unknown, fallback: string) {
  return err instanceof ApiError ? err.message : fallback;
}
