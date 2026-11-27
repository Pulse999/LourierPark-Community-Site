
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

type ApiErrorResponse = {
  status?: string;
  message?: string;
};

export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers);

  headers.set("Content-Type", "application/json");
  headers.set("X-Requested-With", "XMLHttpRequest");

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
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

  return data as T;
}