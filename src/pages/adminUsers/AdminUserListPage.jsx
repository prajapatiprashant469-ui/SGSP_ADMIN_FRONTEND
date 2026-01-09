import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminUserListPage = () => {
  const [adminUsers, setAdminUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchAdminUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        "http://localhost:8080/api/admin/v1/admin-users",
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
        setAdminUsers(data.data);
      } else {
        setError(data?.error || "Failed to fetch admin users");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id, currentActive) => {
    try {
      const token = localStorage.getItem("authToken");
      await fetch(`http://localhost:8080/api/admin/v1/admin-users/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ active: !currentActive }),
      });
      fetchAdminUsers();
    } catch (err) {
      alert("Failed to toggle active status: " + err.message);
    }
  };

  const handleResetPassword = async (id) => {
    if (window.confirm("Reset password for this admin?")) {
      try {
        const token = localStorage.getItem("authToken");
        await fetch(
          `http://localhost:8080/api/admin/v1/admin-users/${id}/reset-password`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ password: "NewTemp@1234" }),
          }
        );
        alert("Password reset triggered");
      } catch (err) {
        alert("Failed to reset password: " + err.message);
      }
    }
  };

  useEffect(() => {
    fetchAdminUsers();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* PAGE TITLE */}
      <h1 className="text-3xl font-bold text-purple-600 mb-6">
        Admin Users
      </h1>

      {/* CARD */}
      <div className="bg-white shadow-md rounded-lg p-6">
        {/* CARD HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-purple-500">
            Users
          </h2>

          <button
            onClick={() => navigate("/admin-users/new")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Add Admin User
          </button>
        </div>

        {/* STATES */}
        {loading && <p>Loading admin users...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && adminUsers.length === 0 && (
          <p className="text-gray-500">No admin users found.</p>
        )}

        {/* TABLE */}
        {!loading && !error && adminUsers.length > 0 && (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Role</th>
                <th className="border px-4 py-2">Active</th>
                <th className="border px-4 py-2">Last Login</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {adminUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{user.name}</td>
                  <td className="border px-4 py-2">{user.email}</td>
                  <td className="border px-4 py-2">{user.role}</td>
                  <td className="border px-4 py-2">
                    {user.active ? "Yes" : "No"}
                  </td>
                  <td className="border px-4 py-2">
                    {user.lastLoginAt
                      ? new Date(user.lastLoginAt).toLocaleString()
                      : "-"}
                  </td>
                  <td className="border px-4 py-2 space-x-2">
                    <button
                      onClick={() =>
                        navigate(`/admin-users/${user.id}/edit`)
                      }
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleToggleActive(user.id, user.active)
                      }
                      className={`px-3 py-1 rounded-md text-white ${
                        user.active
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      {user.active ? "Deactivate" : "Activate"}
                    </button>

                    <button
                      onClick={() => handleResetPassword(user.id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
                    >
                      Reset Password
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

export default AdminUserListPage;
