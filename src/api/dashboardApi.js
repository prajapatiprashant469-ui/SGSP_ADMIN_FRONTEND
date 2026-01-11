const BASE_URL = `${import.meta.env.VITE_BASE_URL}`;

export default {
  // Fetch dashboard summary
  async getSummary() {
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("authToken is missing in localStorage");
      throw new Error("User is not authenticated");
    }

    try {
      const response = await fetch(`${BASE_URL}/dashboard/summary`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error("Failed to load dashboard summary:", response.status, response.statusText);
        throw new Error("Failed to load dashboard summary");
      }

      const data = await response.json();
      console.log("Dashboard summary response:", data);
      return data;
    } catch (err) {
      console.error("Error in getSummary:", err);
      throw err;
    }
  },

  // Fetch top products
  async getTopProducts() {
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("authToken is missing in localStorage");
      throw new Error("User is not authenticated");
    }

    try {
      const response = await fetch(`${BASE_URL}/dashboard/top-products`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error("Failed to load top products:", response.status, response.statusText);
        throw new Error("Failed to load top products");
      }

      const data = await response.json();
      console.log("Top products response:", data);
      return data;
    } catch (err) {
      console.error("Error in getTopProducts:", err);
      throw err;
    }
  },

  async getLowStockSummary() {
       const token = localStorage.getItem("authToken");
      if (!token) throw new Error("User is not authenticated");

      const response = await fetch(
         `${BASE_URL}/inventory/low-stock-summary`,
        {
           headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
         }
      );
      return response.json();
     },
};
