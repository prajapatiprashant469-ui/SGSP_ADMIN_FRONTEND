import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import categoryApi from "../../api/categoryApi";

const CategoryListPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await categoryApi.getCategories();
      setCategories(response.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this category?")) {
      try {
        await categoryApi.deleteCategory(id);
        fetchCategories();
      } catch (err) {
        alert("Failed to delete category: " + err.message);
      }
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* PAGE TITLE */}
      <h1 className="text-3xl font-bold text-purple-600 mb-6">
        Categories
      </h1>

      {/* CARD */}
      <div className="bg-white shadow-md rounded-lg p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-purple-500">
            Category List
          </h2>

          <button
            onClick={() => navigate("/categories/new")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Add Category
          </button>
        </div>

        {/* STATES */}
        {loading && <p>Loading categories...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && categories.length === 0 && (
          <p className="text-gray-500">No categories found.</p>
        )}

        {/* TABLE */}
        {!loading && !error && categories.length > 0 && (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Parent Category</th>
                <th className="border px-4 py-2">Description</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {categories.map((category) => (
                <tr
                  key={category.id}
                  className="hover:bg-gray-50"
                >
                  <td className="border px-4 py-2">
                    {category.id}
                  </td>
                  <td className="border px-4 py-2 font-medium">
                    {category.name}
                  </td>
                  <td className="border px-4 py-2 text-gray-600">
                    {category.parentCategoryName || "-"}
                  </td>
                  <td className="border px-4 py-2">
                    {category.description}
                  </td>
                  <td className="border px-4 py-2 space-x-2">
                    <button
                      onClick={() =>
                        navigate(`/categories/${category.id}/edit`)
                      }
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(category.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
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

export default CategoryListPage;
