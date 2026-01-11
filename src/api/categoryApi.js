const BASE_URL = `${import.meta.env.VITE_BASE_URL}`;

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
  getCategories: () => request("GET", "/categories"),
  getCategoryById: (id) => request("GET", `/categories/${id}`), // Ensure this is a GET request
  createCategory: (payload) => request("POST", "/categories", payload),
  updateCategory: (id, payload) => request("PUT", `/categories/${id}`, payload),
  deleteCategory: (id) => request("DELETE", `/categories/${id}`)
};

export default categoryApi;