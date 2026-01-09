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
    if (err?.error?.code === "INVALID_TOKEN") {
      localStorage.removeItem("admin_token");
      window.location.href = "/login"; // Redirect to login on token expiration
    }
    throw new Error(err?.error?.message || "Request failed");
  }

  return res.json();
}

const categoryApi = {
  getCategories: () => request("GET", "/api/admin/v1/categories"),
  getCategoryById: (id) => request("GET", `/api/admin/v1/categories/${id}`), // Ensure this is a GET request
  createCategory: (payload) => request("POST", "/api/admin/v1/categories", payload),
  updateCategory: (id, payload) => request("PUT", `/api/admin/v1/categories/${id}`, payload),
  deleteCategory: (id) => request("DELETE", `/api/admin/v1/categories/${id}`)
};

export default categoryApi;