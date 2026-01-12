const BASE_URL = `${import.meta.env.VITE_BASE_URL}`;

function getAuthHeaders() {
  const token = localStorage.getItem("authToken");
  if (token && token !== "null") {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

export default {
  async getProducts(params) {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${BASE_URL}/products?${query}`, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });

    if (!response.ok) throw new Error("Failed to load products");

    const json = await response.json();

    return json.data.content.map((p) => ({
      ...p,
      categoryName: p.categoryName ?? p.categoryId,
      price: p.price ?? p.pricing?.price ?? 0,
      stockQuantity: p.stockQuantity ?? p.inventory?.stockQuantity ?? 0,
    }));
  },

  async getProductById(id) {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });

    if (!res.ok) throw new Error("Failed to fetch product");

    const json = await res.json();
    const p = json.data;

    return {
      ...p,
      categoryName: p.categoryName ?? p.categoryId,
      price: p.price ?? p.pricing?.price ?? 0,
      stockQuantity: p.stockQuantity ?? p.inventory?.stockQuantity ?? 0,
      workerAssigned: p.attributes?.workerAssigned ?? null,
    };
  },

  async publishProduct(id) {
    const res = await fetch(`${BASE_URL}/products/${id}/publish`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });

    if (!res.ok) throw new Error("Failed to publish product");
    return res.json();
  },

  async unpublishProduct(id) {
    const res = await fetch(`${BASE_URL}/products/${id}/unpublish`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });

    if (!res.ok) throw new Error("Failed to unpublish product");
    return res.json();
  },

  async deleteProduct(id) {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });

    if (!res.ok) throw new Error("Failed to delete product");
    return res.json();
  },
};
