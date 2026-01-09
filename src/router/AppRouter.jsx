import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/dashboard/DashboardPage"; 
import ProductsPage from "../pages/products/ProductListPage";
import ProductFormPage from "../pages/products/ProductFormPage";
import ProductDetailPage from "../pages/products/ProductDetailPage";
import AdminLayout from "../components/layout/AdminLayout";
import { AuthContext } from "../context/AuthContext";
import CategoryListPage from "../pages/categories/CategoryListPage";
import CategoryFormPage from "../pages/categories/CategoryFormPage";
import AdminUserListPage from "../pages/adminUsers/AdminUserListPage";
import AdminUserFormPage from "../pages/adminUsers/AdminUserFormPage";
import InventoryLowStockPage from "../pages/inventory/InventoryLowStockPage";
import InvoicePage from "../pages/invoice/InvoicePage";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  console.log("ProtectedRoute: isAuthenticated =", isAuthenticated);

  if (!isAuthenticated) {
    console.warn("User is not authenticated. Redirecting to /login...");
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AdminLayout>
              <DashboardPage /> 
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <ProductsPage /> {/* FIXED */}
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/products/new"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <ProductFormPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/:id/edit"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <ProductFormPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/products/:id"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <ProductDetailPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <CategoryListPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/categories/new"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <CategoryFormPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/categories/:id/edit"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <CategoryFormPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/inventory/low-stock"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <InventoryLowStockPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-users"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminUserListPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-users/new"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminUserFormPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-users/:id/edit"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminUserFormPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/invoice"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <InvoicePage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
