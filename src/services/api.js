export const API_URL = import.meta.env.VITE_API_URL || "https://www.theafricalaureateawards.org/api";

export const TOKEN_KEY = "tala_admin_token";

export function getAuthHeaders(extra = {}) {
  const token = localStorage.getItem(TOKEN_KEY);
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

async function parseResponse(res) {
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }
  if (!res.ok) {
    const message = data?.error || data?.message || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data;
}

export async function apiGet(path, params) {
  const query = params
    ? "?" +
      new URLSearchParams(
        Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ""))
      ).toString()
    : "";
  const res = await fetch(`${API_URL}${path}${query}`, { headers: getAuthHeaders() });
  return parseResponse(res);
}

export async function apiSend(method, path, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  return parseResponse(res);
}

export const apiPost = (path, body) => apiSend("POST", path, body);
export const apiPut = (path, body) => apiSend("PUT", path, body);
export const apiPatch = (path, body) => apiSend("PATCH", path, body);
export const apiDelete = (path, body) => apiSend("DELETE", path, body);

export async function apiUpload(path, formData, method = "POST") {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: getAuthHeaders(),
    body: formData,
  });
  return parseResponse(res);
}
