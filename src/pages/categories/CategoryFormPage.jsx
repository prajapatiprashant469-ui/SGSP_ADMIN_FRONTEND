import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import categoryApi from "../../api/categoryApi";

const CategoryFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [parentId, setParentId] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isEditMode = !!id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allCategoriesResponse = await categoryApi.getCategories();
        const allCategories = allCategoriesResponse.data || [];
        setCategories(allCategories);

        if (isEditMode) {
          console.log("Filtering category with ID:", id); // Debugging line
          const category = allCategories.find((cat) => cat.id === id);
          console.log("Filtered category:", category); // Debugging line

          if (category) {
            setName(category.name);
            setSlug(category.slug);
            setParentId(category.parentId || "");
            setDescription(category.description);
          } else {
            setError("Category not found");
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !slug) {
      alert("Name and slug are required");
      return;
    }

    const payload = { name, slug, parentId: parentId || null, description };

    try {
      if (isEditMode) {
        await categoryApi.updateCategory(id, payload);
      } else {
        await categoryApi.createCategory(payload);
      }
      navigate("/categories");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-50 shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-primary mb-6">
        {isEditMode ? "Edit Category" : "Add Category"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-semibold text-secondary mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div>
          <label className="block font-semibold text-secondary mb-2">Slug</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div>
          <label className="block font-semibold text-secondary mb-2">Parent Category</label>
          <select
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">None</option>
            {categories
              .filter((cat) => !isEditMode || cat.id !== parseInt(id))
              .map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold text-secondary mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => navigate("/categories")}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryFormPage;