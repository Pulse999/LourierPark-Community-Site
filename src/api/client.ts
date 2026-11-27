
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

type ApiErrorResponse = {
  status?: string;
  message?: string;
};

type CsrfResponse = {
  status: string;
  data: {
    csrfToken: string;
  };
};

export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

let csrfToken: string | null = null;
let csrfTokenRequest: Promise<string> | null = null;

async function fetchCsrfToken(refresh = false): Promise<string> {
  if (!refresh && csrfToken) {
    return csrfToken;
  }

  if (!refresh && csrfTokenRequest) {
    return csrfTokenRequest;
  }

  const request = (async () => {
    const response = await fetch(
      `${API_URL}/csrf-token${refresh ? "?refresh=1" : ""}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      }
    );

    const data = (await response.json().catch(() => ({}))) as
      | CsrfResponse
      | ApiErrorResponse;

    if (!response.ok || !("data" in data) || !data.data?.csrfToken) {
      throw new ApiError(
        (data as ApiErrorResponse).message ||
          "Unable to establish a secure request token.",
        response.status
      );
    }

    csrfToken = data.data.csrfToken;
    return csrfToken;
  })();

  if (!refresh) {
    csrfTokenRequest = request;
  }

  try {
    return await request;
  } finally {
    if (csrfTokenRequest === request) {
      csrfTokenRequest = null;
    }
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const method = (options.method || "GET").toUpperCase();
  const requiresCsrf = !["GET", "HEAD", "OPTIONS"].includes(method);

  const headers = new Headers(options.headers);

  headers.set("X-Requested-With", "XMLHttpRequest");

  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (requiresCsrf) {
    const token = await fetchCsrfToken();
    headers.set("X-CSRF-Token", token);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    method,
    credentials: "include",
    headers,
  });

  const data = (await response.json().catch(() => ({}))) as
    | T
    | ApiErrorResponse;

  if (!response.ok) {
    const message =
      (data as ApiErrorResponse).message ||
      "Something went wrong. Please try again.";

    throw new ApiError(message, response.status);
  }

  // The administrator JWT cookie changes after login/logout.
  // Obtain a fresh CSRF token bound to the new authentication state.
  const normalizedEndpoint = endpoint.split("?")[0];

  if (
    method === "POST" &&
    (normalizedEndpoint === "/auth/login" ||
      normalizedEndpoint === "/auth/logout")
  ) {
    csrfToken = null;
    csrfTokenRequest = null;

    await fetchCsrfToken(true);
  }

  return data as T;
}
