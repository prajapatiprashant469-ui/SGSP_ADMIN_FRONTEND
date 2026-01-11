import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import adminUserApi from "../../api/adminUserApi";

const AdminUserFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("SUPPORT");
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isEditMode = !!id;

  useEffect(() => {
    if (isEditMode) {
      const fetchAdminUser = async () => {
        setLoading(true);
        setError(null);
        try {
          const user = await adminUserApi.getAdminUserById(id);
          setName(user.name);
          setEmail(user.email);
          setRole(user.role);
          setActive(user.active);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchAdminUser();
    } else {
      setLoading(false);
    }
  }, [id, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || (!isEditMode && !password)) {
      alert("Name, email, and password (in create mode) are required");
      return;
    }

    const payload = { name, email, role, active };
    if (!isEditMode) {
      payload.password = password;
    }

    try {
      const token = localStorage.getItem("authToken");
      const url = isEditMode
        ? `${import.meta.env.VITE_BASE_URL}/admin-users/${id}`
        : `${import.meta.env.VITE_BASE_URL}/admin-users`;
      const method = isEditMode ? "PUT" : "POST";

      await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      navigate("/admin-users");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-primary mb-6">
        {isEditMode ? "Edit Admin User" : "Add Admin User"}
      </h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-6">
        <div>
          <label className="block font-semibold text-secondary mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border px-4 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-semibold text-secondary mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-4 py-2 rounded"
            required
          />
        </div>
        {!isEditMode && (
          <div>
            <label className="block font-semibold text-secondary mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-4 py-2 rounded"
              required
            />
          </div>
        )}
        <div>
          <label className="block font-semibold text-secondary mb-2">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border px-4 py-2 rounded"
          >
            <option value="SUPER_ADMIN">SUPER_ADMIN</option>
            <option value="CATALOG_ADMIN">CATALOG_ADMIN</option>
            <option value="SUPPORT">SUPPORT</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold text-secondary mb-2">Active</label>
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="h-5 w-5"
          />
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin-users")}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminUserFormPage;