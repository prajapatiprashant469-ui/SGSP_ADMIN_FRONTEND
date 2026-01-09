import React, { useEffect, useState } from "react";
import dashboardApi from "../../api/dashboardApi";

const DashboardPage = () => {
  const [stats, setStats] = useState({});
  const [topProducts, setTopProducts] = useState([]);
  const [error, setError] = useState(null);
  const [lowStockItems, setLowStockItems] = useState([]);


  const AuthImageThumbnail = ({ url, alt }) => {
    const [src, setSrc] = useState(null);
  
    useEffect(() => {
      if (!url) return;
  
      const token = localStorage.getItem("authToken");
  
      fetch(`http://localhost:8080${url}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.blob())
        .then((blob) => setSrc(URL.createObjectURL(blob)))
        .catch(() => setSrc(null));
  
      return () => {
        if (src) URL.revokeObjectURL(src);
      };
    }, [url]);
  
    if (!src) {
      return (
        <div className="w-16 h-16 flex items-center justify-center border rounded text-gray-400">
          N/A
        </div>
      );
    }
  
    return (
      <img
        src={src}
        alt={alt}
        className="w-16 h-16 object-cover rounded"
      />
    );
  };
  

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        console.log("Fetching dashboard stats...");
        const res = await dashboardApi.getSummary();

        if (res.success) {
          console.log("Dashboard stats fetched successfully:", res.data);
          setStats(res.data);
        } else {
          console.error("Error fetching dashboard stats:", res.error);
          setError(res.error?.message || "Failed to fetch summary.");
        }
      } catch (err) {
        console.error("Error in fetchDashboardStats:", err);
        setError("Failed to fetch summary.");
      }
    };

    const fetchTopProducts = async () => {
      try {
        console.log("Fetching top products...");
        const res = await dashboardApi.getTopProducts();

        if (res.success) {
          console.log("Top products fetched successfully:", res.data);
          setTopProducts(res.data);
        } else {
          console.error("Error fetching top products:", res.error);
          setError(res.error?.message || "Failed to fetch top products.");
        }
      } catch (err) {
        console.error("Error in fetchTopProducts:", err);
        setError("Failed to fetch top products.");
      }
    };

    const fetchLowStockSummary = async () => {
      try {
        console.log("Fetching low stock summary...");
        const res = await dashboardApi.getLowStockSummary();

        if (res.success) {
          console.log("Low stock summary fetched successfully:", res.data);
          setLowStockItems(res.data.items || []);
        } else {
          console.error("Error fetching low stock summary:", res.error);
          setError(res.error?.message || "Failed to fetch low stock summary.");
        }
      } catch (err) {
        console.error("Error in fetchLowStockSummary:", err);
        setError("Failed to fetch low stock summary.");
      }
    };

    fetchDashboardStats();
    fetchTopProducts();
    fetchLowStockSummary();
  }, []);

  if (error) {
    console.error("Rendering error:", error);
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-primary mb-6">Dashboard</h1>

      {error && (
        <div className="bg-danger text-white p-4 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      {/* Statistics Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-secondary mb-4">Statistics</h2>

        <ul className="grid grid-cols-2 gap-4">
          <li className="bg-gray-100 p-4 rounded shadow">
            <span className="block text-sm text-gray-500">Total Products</span>
            <span className="text-lg font-bold">{stats.totalProducts ?? 0}</span>
          </li>
          <li className="bg-gray-100 p-4 rounded shadow">
            <span className="block text-sm text-gray-500">Published Products</span>
            <span className="text-lg font-bold">{stats.publishedProducts ?? 0}</span>
          </li>
          <li className="bg-gray-100 p-4 rounded shadow">
            <span className="block text-sm text-gray-500">Out of Stock</span>
            <span className="text-lg font-bold">{stats.outOfStockProducts ?? 0}</span>
          </li>
          <li className="bg-gray-100 p-4 rounded shadow">
            <span className="block text-sm text-gray-500">Total Categories</span>
            <span className="text-lg font-bold">{stats.totalCategories ?? 0}</span>
          </li>
          <li className="bg-gray-100 p-4 rounded shadow">
            <span className="block text-sm text-gray-500">Total Orders</span>
            <span className="text-lg font-bold">{stats.totalOrders ?? 0}</span>
          </li>
          <li className="bg-gray-100 p-4 rounded shadow">
            <span className="block text-sm text-gray-500">Today's Orders</span>
            <span className="text-lg font-bold">{stats.todayOrders ?? 0}</span>
          </li>
          <li className="bg-gray-100 p-4 rounded shadow col-span-2">
            <span className="block text-sm text-gray-500">Today's Revenue</span>
            <span className="text-lg font-bold">
              ₹{Number(stats.todayRevenue || 0).toFixed(2)}
            </span>
          </li>
        </ul>
      </div>

      {/* Top Products Section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-secondary mb-4">Top Products</h2>

        {topProducts.length === 0 ? (
          <p className="text-gray-500">No top products available.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300 mt-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left">Product Name</th>
                <th className="border px-4 py-2 text-left">Thumbnail</th>
                <th className="border px-4 py-2 text-left">Sold Quantity</th>
              </tr>
            </thead>

            <tbody>
              {topProducts.map((product) => (
                <tr key={product.productId} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{product.name}</td>

                  <td className="border px-4 py-2">
                    {product.thumbnailUrl ? (
                      <AuthImageThumbnail
                      url={product.thumbnailUrl}
                      alt={product.name}
                    />
                    ) : (
                      "N/A"
                    )}
                  </td>

                  <td className="border px-4 py-2">{product.soldQuantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Low Stock Items Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mt-8">
        <h2 className="text-2xl font-semibold text-secondary mb-4">Low Stock Items</h2>

        {lowStockItems.length === 0 ? (
          <p className="text-gray-500">No low stock items available.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300 mt-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left">Item Name</th>
                <th className="border px-4 py-2 text-left">Stock Quantity</th>
                <th className="border px-4 py-2 text-left">Reorder Level</th>
              </tr>
            </thead>

            <tbody>
              {lowStockItems.map((item) => (
                <tr key={item.productId} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{item.name}</td>
                  <td className="border px-4 py-2">{item.stockQuantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
