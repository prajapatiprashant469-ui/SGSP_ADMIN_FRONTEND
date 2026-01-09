import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Sidebar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="w-64 h-screen bg-gray-800 text-white flex flex-col">
      <div className="flex-grow">
        <nav className="mt-4">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `block px-4 py-2 ${isActive ? "bg-gray-700" : ""}`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `block px-4 py-2 ${isActive ? "bg-gray-700" : ""}`
            }
          >
            Products
          </NavLink>
          <NavLink
            to="/categories"
            className={({ isActive }) =>
              `block px-4 py-2 ${isActive ? "bg-gray-700" : ""}`
            }
          >
            Categories
          </NavLink>
          <NavLink
            to="/inventory/low-stock"
            className={({ isActive }) =>
              `block px-4 py-2 ${isActive ? "bg-gray-700" : ""}`
            }
          >
            Inventory (Low Stock)
          </NavLink>
          <NavLink
            to="/admin-users"
            className={({ isActive }) =>
              `block px-4 py-2 ${isActive ? "bg-gray-700" : ""}`
            }
          >
            Admin Users
          </NavLink>
          <NavLink
            to="/invoice"
            className={({ isActive }) =>
              `block px-4 py-2 ${isActive ? "bg-gray-700" : ""}`
            }
          >
            Invoice
          </NavLink>
        </nav>
      </div>
      <button
        onClick={handleLogout}
        className="w-full px-4 py-2 bg-red-600 hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
};

export default Sidebar;