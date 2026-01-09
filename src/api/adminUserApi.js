
const BASE_URL = "http://localhost:8080";

async function request(method, url, body) {
  const token = localStorage.getItem("admin_token");

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": token ? `Bearer ${token}` : ""
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(BASE_URL + url, options);

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || "Request failed");
  }

  return res.json();
}

export function getAdminUsers() {
  return request("GET", "/api/admin/v1/admin-users");
}

export function getAdminUserById(id) {
  return request("GET", `/api/admin/v1/admin-users/${id}`);
}

export function createAdminUser(payload) {
  return request("POST", "/api/admin/v1/admin-users", payload);
}

export function updateAdminUser(id, payload) {
  return request("PUT", `/api/admin/v1/admin-users/${id}`, payload);
}

export function toggleAdminActive(id, active) {
  return request("PUT", `/api/admin/v1/admin-users/${id}`, { active });
}

export function resetAdminPassword(id) {
  return request("POST", `/api/admin/v1/admin-users/${id}/reset-password`);
}

export default {
  getAdminUsers,
  getAdminUserById,
  createAdminUser,
  updateAdminUser,
  toggleAdminActive,
  resetAdminPassword
};