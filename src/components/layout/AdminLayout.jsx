import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Footer from "./Footer";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-grow flex flex-col">
        <Topbar />
        <div className="flex-grow overflow-auto p-6 bg-gray-100">
          {children}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default AdminLayout;