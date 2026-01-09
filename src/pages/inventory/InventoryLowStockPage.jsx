import React, { useEffect, useState } from "react";

const InventoryLowStockPage = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLowStockInventory = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        "http://localhost:8080/api/admin/v1/inventory/low-stock-summary",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      const data = await response.json();
      if (data?.success) {
        setInventory(data.data.items);
      } else {
        setError(data?.error?.message || "Failed to fetch inventory data.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLowStockInventory();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* PAGE TITLE */}
      <h1 className="text-3xl font-bold text-purple-600 mb-6">
        Low Stock Inventory
      </h1>

      {/* CARD */}
      <div className="bg-white shadow-md rounded-lg p-6">
        {/* SECTION TITLE */}
        <h2 className="text-2xl font-semibold text-purple-500 mb-4">
          Products Near Reorder Level
        </h2>

        {/* STATES */}
        {loading && <p>Loading inventory data...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && inventory.length === 0 && (
          <p className="text-gray-500">No low-stock items found.</p>
        )}

        {/* TABLE */}
        {!loading && !error && inventory.length > 0 && (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Product Name</th>
                <th className="border px-4 py-2">SKU</th>
                <th className="border px-4 py-2">Stock</th>
                <th className="border px-4 py-2">Reorder Level</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr
                  key={item.productId}
                  className="hover:bg-gray-50"
                >
                  <td className="border px-4 py-2">
                    {item.name}
                  </td>
                  <td className="border px-4 py-2 text-gray-500">
                    N/A
                  </td>
                  <td className="border px-4 py-2 font-semibold">
                    {item.stockQuantity}
                  </td>
                  <td className="border px-4 py-2 text-gray-500">
                    N/A
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default InventoryLowStockPage;
