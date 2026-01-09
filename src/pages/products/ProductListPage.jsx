import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import productApi from "../../api/productApi";

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = { page: 0, size: 20 };

      if (status !== "ALL") params.status = status;
      if (search.trim()) params.search = search.trim();

      const data = await productApi.getProducts(params);
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [status, search]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-primary mb-6">Product List</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-secondary mb-4">Filters</h2>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-4 py-2 rounded-md"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border px-4 py-2 rounded-md"
          >
            <option value="ALL">All</option>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
          <button
            onClick={() => navigate("/products/new")}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Add New Product
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-secondary mb-4">Product List</h2>

        {loading && <p>Loading products...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Category</th>
                <th className="border px-4 py-2">Price</th>
                <th className="border px-4 py-2">Stock</th>
                <th className="border px-4 py-2">Worker Name</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{product.name}</td>
                  <td className="border px-4 py-2">
                    {product.categoryName || "N/A"}
                  </td>
                  <td className="border px-4 py-2">{product.price}</td>
                  <td className="border px-4 py-2">{product.stockQuantity}</td>
                  <td className="border px-4 py-2">{product.workerAssigned || "Not Assigned"}</td>
                  <td className="border px-4 py-2">{product.status}</td>
                  <td className="border px-4 py-2 space-x-2">
                    <button
                      onClick={() => navigate(`/products/${product.id}`)}
                      className="bg-gray-500 text-white px-2 py-1 rounded-md"
                    >
                      View
                    </button>
                    <button
                      onClick={() => navigate(`/products/${product.id}/edit`)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded-md"
                    >
                      Edit
                    </button>
                    {product.status === "PUBLISHED" ? (
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded-md"
                        onClick={async () => {
                          await productApi.unpublishProduct(product.id);
                          fetchProducts();
                        }}
                      >
                        Unpublish
                      </button>
                    ) : (
                      <button
                        className="bg-green-500 text-white px-2 py-1 rounded-md"
                        onClick={async () => {
                          await productApi.publishProduct(product.id);
                          fetchProducts();
                        }}
                      >
                        Publish
                      </button>
                    )}
                    <button
                      className="bg-red-700 text-white px-2 py-1 rounded-md"
                      onClick={async () => {
                        await productApi.deleteProduct(product.id);
                        fetchProducts();
                      }}
                    >
                      Delete
                    </button>
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

export default ProductListPage;
