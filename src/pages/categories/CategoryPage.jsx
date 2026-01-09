import React, { useEffect, useState } from "react";
import categoryApi from "../../api/categoryApi";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await categoryApi.getCategories();
      setCategories(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-primary mb-6">Category List</h1>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-secondary mb-4">Categories</h2>

        {loading && <p>Loading categories...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Description</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{category.name}</td>
                  <td className="border px-4 py-2">{category.description || "N/A"}</td>
                  <td className="border px-4 py-2 space-x-2">
                    <button
                      className="bg-yellow-500 text-white px-2 py-1 rounded-md"
                      onClick={() => console.log(`Edit category ${category.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded-md"
                      onClick={async () => {
                        await categoryApi.deleteCategory(category.id);
                        fetchCategories();
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

export default CategoryPage;