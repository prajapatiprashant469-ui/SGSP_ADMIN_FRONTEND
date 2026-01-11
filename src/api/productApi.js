const BASE_URL = `${import.meta.env.VITE_BASE_URL}`;

export default {
  async getProducts(params) {
    const token = localStorage.getItem("authToken");
    const query = new URLSearchParams(params).toString();

    const response = await fetch(`${BASE_URL}/products?${query}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Failed to load products");

    const json = await response.json();

    // Flatten data
    return json.data.content.map((p) => ({
      ...p,
      categoryName: p.categoryName ?? p.categoryId,
      price: p.price ?? p.pricing?.price ?? 0,
      stockQuantity: p.stockQuantity ?? p.inventory?.stockQuantity ?? 0
    }));
  },

  async getProductById(id) {
    const token = localStorage.getItem("authToken");

    const res = await fetch(`${BASE_URL}/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const json = await res.json();
    const p = json.data;

    return {
      ...p,
      categoryName: p.categoryName ?? p.categoryId,
      price: p.price ?? p.pricing?.price ?? 0,
      stockQuantity: p.stockQuantity ?? p.inventory?.stockQuantity ?? 0,
      workerAssigned: p.attributes.workerAssigned ?? null,
    };
  },

  async publishProduct(id) {
    const token = localStorage.getItem("authToken");

    return fetch(`${BASE_URL}/products/${id}/publish`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).then((r) => r.json());
  },

  async unpublishProduct(id) {
    const token = localStorage.getItem("authToken");

    return fetch(`${BASE_URL}/products/${id}/unpublish`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).then((r) => r.json());
  },

  async deleteProduct(id) {
    const token = localStorage.getItem("authToken");

    return fetch(`${BASE_URL}/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
