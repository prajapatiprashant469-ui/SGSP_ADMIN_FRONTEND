import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import productApi from "../../api/productApi";

const ProductFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    categoryId: "",
    status: "DRAFT",
    attributes: {
      materialUsed: "",
      machineUsed: "Handloom",
      workerAssigned: "",
      zariUsed: "",
      design: "",
      color: "",
      length: "",
      fabricType: "",
      washCare: "",
    },
    pricing: {
      price: "",
      currency: "INR",
      discountType: "NONE",
      discountValue: "",
    },
    inventory: {
      sku: "",
      stockQuantity: "",
      lowStockThreshold: "",
    },
    images: [],
  });
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAuthImageUrl = async (url) => {
    const token = localStorage.getItem("authToken");

    // Prepend base URL if the URL is relative
    const absoluteUrl = url.startsWith("http")
      ? url
      : `http://localhost:8080${url}`;

    const res = await fetch(absoluteUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        "http://localhost:8080/api/admin/v1/categories",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setCategories(data.data || []);
    };

    const fetchProduct = async () => {
      if (isEditMode) {
        const fetchedProduct = await productApi.getProductById(id);
    
       const imagesWithPreview = await Promise.all(
         (fetchedProduct.images || []).map(async (img) => ({
           ...img,
           previewUrl: await getAuthImageUrl(img.url),
         }))
       );
    
       fetchedProduct.images = imagesWithPreview;
    
        setProduct(fetchedProduct);
      }
    };
    

    fetchCategories();
    fetchProduct();

    return () => {
      product.images?.forEach((img) => {
        if (img.previewUrl) {
          URL.revokeObjectURL(img.previewUrl);
        }
      });
    };
  }, [id, isEditMode]); // Removed `product.images` from the dependency array

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleNestedInputChange = (e, section) => {
    const { name, value, type } = e.target;
    const convertedValue = type === "number" ? Number(value) : value;

    setProduct((prev) => ({
      ...prev,
      [section]: { ...prev[section], [name]: convertedValue },
    }));
  };

  const handleImageChange = (e) => {
    setNewImages([...e.target.files]);
  };

  const handleDeleteImage = async (imageId) => {
    if (window.confirm("Delete this image?")) {
      await fetch(
        `${import.meta.env.VITE_BASE_URL}/products/${id}/images/${imageId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        }
      );
      setProduct((prev) => ({
        ...prev,
        images: prev.images.filter((img) => img.id !== imageId),
      }));
    }
  };

  const handleSubmit = async (status) => {
    if (!product.name || !product.pricing.price || !product.inventory.stockQuantity) {
      alert("Fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const method = isEditMode ? "PUT" : "POST";
      const url = isEditMode
        ? `${import.meta.env.VITE_BASE_URL}/products/${id}`
        : `${import.meta.env.VITE_BASE_URL}/products`;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...product, status }),
      });

      const savedProduct = await response.json();
      const productId = savedProduct.data?.id;

      if (!productId) throw new Error("Product ID not returned from API");

      if (newImages.length > 0) {
        if (!isEditMode && !productId) return;
        const formData = new FormData();
        newImages.forEach((file) => formData.append("files[]", file));
        await fetch(
          `${import.meta.env.VITE_BASE_URL}/products/${productId}/images`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          }
        );
      }

      navigate("/products");
    } catch (err) {
      alert("Failed to save product: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-primary mb-6">
        {isEditMode ? "Edit Product" : "Add Product"}
      </h1>
      <form className="bg-white shadow-md rounded-lg p-6 space-y-6">
        {/* Basic Details */}
        <div>
          <h2 className="text-xl font-semibold text-secondary mb-4">
            Basic Details
          </h2>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleInputChange}
            placeholder="Product Name"
            className="border px-4 py-2 w-full mb-2 rounded"
          />
          <textarea
            name="description"
            value={product.description}
            onChange={handleInputChange}
            placeholder="Description"
            className="border px-4 py-2 w-full mb-2 rounded"
          />
          <select
            name="categoryId"
            value={product.categoryId}
            onChange={handleInputChange}
            className="border px-4 py-2 w-full mb-2 rounded"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <select
            name="status"
            value={product.status}
            onChange={handleInputChange}
            className="border px-4 py-2 w-full mb-2 rounded"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </div>

        {/* Saree Attributes */}
        <div>
          <h2 className="text-xl font-semibold text-secondary mb-4">Saree Attributes</h2>
          <input
            type="text"
            name="materialUsed"
            value={product.attributes.materialUsed}
            onChange={(e) => handleNestedInputChange(e, "attributes")}
            placeholder="Material Used"
            className="border px-4 py-2 w-full mb-2 rounded"
          />
          <select
            name="machineUsed"
            value={product.attributes.machineUsed}
            onChange={(e) => handleNestedInputChange(e, "attributes")}
            className="border px-4 py-2 w-full mb-2 rounded"
          >
            <option value="Handloom">Handloom</option>
            <option value="Powerloom">Powerloom</option>
            <option value="Machine">Machine</option>
          </select>
          <input
            type="text"
            name="workerAssigned"
            value={product.attributes.workerAssigned}
            onChange={(e) => handleNestedInputChange(e, "attributes")}
            placeholder="Worker Assigned"
            className="border px-4 py-2 w-full mb-2 rounded"
          />
          <input
            type="text"
            name="zariUsed"
            value={product.attributes.zariUsed}
            onChange={(e) => handleNestedInputChange(e, "attributes")}
            placeholder="Zari Used"
            className="border px-4 py-2 w-full mb-2 rounded"
          />
          <textarea
            name="design"
            value={product.attributes.design}
            onChange={(e) => handleNestedInputChange(e, "attributes")}
            placeholder="Design"
            className="border px-4 py-2 w-full mb-2 rounded"
          />
          <input
            type="text"
            name="color"
            value={product.attributes.color}
            onChange={(e) => handleNestedInputChange(e, "attributes")}
            placeholder="Color"
            className="border px-4 py-2 w-full mb-2 rounded"
          />
          <input
            type="text"
            name="length"
            value={product.attributes.length}
            onChange={(e) => handleNestedInputChange(e, "attributes")}
            placeholder="Length"
            className="border px-4 py-2 w-full mb-2 rounded"
          />
          <input
            type="text"
            name="fabricType"
            value={product.attributes.fabricType}
            onChange={(e) => handleNestedInputChange(e, "attributes")}
            placeholder="Fabric Type"
            className="border px-4 py-2 w-full mb-2 rounded"
          />
          <select
            name="washCare"
            value={product.attributes.washCare}
            onChange={(e) => handleNestedInputChange(e, "attributes")}
            className="border px-4 py-2 w-full mb-2 rounded"
          >
            <option value="Handloom">Dry Clean</option>
            <option value="Powerloom">Soft Hand Wash</option>
            <option value="Machine">Dry Wash</option>
            <option value="Machine">Machine Wash</option>
            <option value="Machine">Salt Water Wash</option>
          </select>
        </div>

        {/* Pricing */}
        <div>
          <h2 className="text-xl font-semibold text-secondary mb-4">Pricing</h2>
          <input
            type="number"
            name="price"
            value={product.pricing.price}
            onChange={(e) => handleNestedInputChange(e, "pricing")}
            placeholder="Price"
            className="border px-4 py-2 w-full mb-2 rounded"
          />
          <select
            name="discountType"
            value={product.pricing.discountType}
            onChange={(e) => handleNestedInputChange(e, "pricing")}
            className="border px-4 py-2 w-full mb-2 rounded"
          >
            <option value="NONE">Select Discount Type</option>
            <option value="FLAT">Flat</option>
            <option value="PERCENTAGE">Percentage</option>
          </select>
          <input
            type="number"
            name="discountValue"
            value={product.pricing.discountValue}
            onChange={(e) => handleNestedInputChange(e, "pricing")}
            placeholder="Discount Value"
            className="border px-4 py-2 w-full mb-2 rounded"
          />
        </div>

        {/* Inventory */}
        <div>
          <h2 className="text-xl font-semibold text-secondary mb-4">Inventory</h2>
          <select
            name="Inventory Name"
            value={product.inventory.sku}
            onChange={(e) => handleNestedInputChange(e, "inventory")}
            className="border px-4 py-2 w-full mb-2 rounded"
          >
            <option value="NONE">Select Inventory</option>
            <option value="NONE">Shashank Saree Center</option>
            <option value="FLAT">Soni Devi Silk & Saree</option>
            <option value="PERCENTAGE">Dayal Brothers</option>
          </select>
          <input
            type="number"
            name="stockQuantity"
            value={product.inventory.stockQuantity}
            onChange={(e) => handleNestedInputChange(e, "inventory")}
            placeholder="Stock Quantity"
            className="border px-4 py-2 w-full mb-2 rounded"
          />
          <input
            type="number"
            name="lowStockThreshold"
            value={product.inventory.lowStockThreshold}
            onChange={(e) => handleNestedInputChange(e, "inventory")}
            placeholder="Low Stock Threshold"
            className="border px-4 py-2 w-full mb-2 rounded"
          />
        </div>

        {/* Images */}
        <div>
          <h2 className="text-xl font-semibold text-secondary mb-4">Images</h2>
          {isEditMode &&
            product.images.map((img) => (
              <div key={img.id} className="flex items-center space-x-2 mb-2">
                <img src={img.previewUrl} alt="Product" className="w-32 h-32 object-cover border rounded" />
                <button
                  type="button"
                  onClick={() => handleDeleteImage(img.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            ))}
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            className="border px-4 py-2 w-full rounded"
          />
        </div>

        {/* Buttons */}
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => handleSubmit("DRAFT")}
            className="bg-gray-500 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            Save as Draft
          </button>
          <button
            type="button"
            onClick={() => handleSubmit("PUBLISHED")}
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => navigate("/products")}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductFormPage;