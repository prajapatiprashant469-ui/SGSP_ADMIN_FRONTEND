import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import productApi from "../../api/productApi";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchImageWithAuth = async (url) => {
    const token = localStorage.getItem("authToken");
  
    const res = await fetch(`http://localhost:8080${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!res.ok) throw new Error("Image load failed");
  
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  };
  

  const fetchProduct = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await productApi.getProductById(id);
      setProduct(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePublishToggle = async () => {
    try {
      if (product.status === "PUBLISHED") {
        await productApi.unpublishProduct(id);
      } else {
        await productApi.publishProduct(id);
      }
      fetchProduct();
    } catch (err) {
      alert("Failed to update product status: " + err.message);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Delete this product?")) {
      try {
        await productApi.deleteProduct(id);
        navigate("/products");
      } catch (err) {
        alert("Failed to delete product: " + err.message);
      }
    }
  };

  const AuthImage = ({ url }) => {
    const [src, setSrc] = useState(null);
  
    useEffect(() => {
      let mounted = true;
  
      fetchImageWithAuth(url)
        .then((blobUrl) => {
          if (mounted) setSrc(blobUrl);
        })
        .catch(() => setSrc(null));
  
      return () => {
        mounted = false;
        if (src) URL.revokeObjectURL(src);
      };
    }, [url]);
  
    if (!src) {
      return (
        <div className="w-32 h-32 flex items-center justify-center border rounded text-gray-400">
          Loading…
        </div>
      );
    }
  
    return (
      <img
        src={src}
        alt="Product"
        className="w-32 h-32 object-cover border rounded shadow"
      />
    );
  };
  

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (loading || !product) return <p>Loading product details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">{product.name}</h1>
        <div className="space-x-4">
          <button
            onClick={() => navigate(`/products/${id}/edit`)}
            className="bg-yellow-500 text-white px-4 py-2 rounded shadow hover:bg-yellow-600"
          >
            Edit Product
          </button>
          <button
            onClick={handlePublishToggle}
            className={`px-4 py-2 rounded shadow ${
              product.status === "PUBLISHED" ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
            } text-white`}
          >
            {product.status === "PUBLISHED" ? "Unpublish" : "Publish"}
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-700 text-white px-4 py-2 rounded shadow hover:bg-red-800"
          >
            Delete Product
          </button>
        </div>
      </div>

      {/* Images Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-secondary mb-4">Images</h2>
        {Array.isArray(product.images) && product.images.length > 0 ? (
          <div className="flex space-x-4">
            {product.images.map((img) => (
              <AuthImage key={img.id} url={img.url} className="w-32 h-32 object-cover border rounded shadow"/>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No images uploaded</p>
        )}
      </div>

      {/* Basic Information Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-secondary mb-4">Basic Information</h2>
        <p className="mb-2"><strong>Name:</strong> {product.name}</p>
        <p className="mb-2"><strong>Category:</strong> {product.categoryName}</p>
        <p className="mb-2"><strong>Description:</strong> {product.description}</p>
        <p className="mb-2"><strong>Status:</strong> {product.status}</p>
        <p className="mb-2"><strong>Worker Assigned:</strong> {product.attributes?.workerAssigned}</p>
      </div>

      {/* Saree Attributes Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-secondary mb-4">Saree Attributes</h2>
        <p className="mb-2"><strong>Material Used:</strong> {product.attributes?.materialUsed}</p>
        <p className="mb-2"><strong>Machine Used:</strong> {product.attributes.machineUsed}</p>
        <p className="mb-2"><strong>Zari Used:</strong> {product.attributes.zariUsed}</p>
        <p className="mb-2"><strong>Design:</strong> {product.attributes.design}</p>
        <p className="mb-2"><strong>Color:</strong> {product.attributes.color}</p>
        <p className="mb-2"><strong>Length:</strong> {product.attributes.length}</p>
        <p className="mb-2"><strong>Fabric Type:</strong> {product.attributes.fabricType}</p>
        <p className="mb-2"><strong>Wash Care:</strong> {product.attributes.washCare}</p>
      </div>

      {/* Pricing Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-secondary mb-4">Pricing</h2>
        <p className="mb-2"><strong>Price:</strong> {product.pricing.price} {product.pricing.currency}</p>
        <p className="mb-2"><strong>Discount Type:</strong> {product.pricing.discountType}</p>
        <p className="mb-2"><strong>Discount Value:</strong> {product.pricing.discountValue}</p>
      </div>

      {/* Inventory Section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-secondary mb-4">Inventory</h2>
        <p className="mb-2"><strong>SKU:</strong> {product.inventory.sku}</p>
        <p className="mb-2"><strong>Stock Quantity:</strong> {product.inventory.stockQuantity}</p>
        <p className="mb-2"><strong>Low Stock Threshold:</strong> {product.inventory.lowStockThreshold}</p>
      </div>
    </div>
  );
};

export default ProductDetailPage;