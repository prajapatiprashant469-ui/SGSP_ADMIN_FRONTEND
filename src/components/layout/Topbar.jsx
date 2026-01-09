
import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Topbar = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="sticky top-0 bg-white shadow-md flex items-center justify-between px-6 py-4">
      <h1 className="text-xl font-bold">Admin Panel</h1>
      <div className="flex items-center space-x-4">
        <span>{user?.name || "Admin"}</span>
        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
      </div>
    </div>
  );
};

export default Topbar;