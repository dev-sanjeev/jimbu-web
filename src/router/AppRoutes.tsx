import { Routes, Route, Navigate } from "react-router-dom";
import { AuthGuard } from "./AuthGuard";
import { AuthLayout } from "./AuthLayout";
import { AppLayout } from "@/components/layout/AppLayout";

// Auth pages
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import OtpVerificationPage from "@/pages/auth/OtpVerificationPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";
import AuthCallbackPage from "@/pages/auth/AuthCallbackPage";

// App pages
import HomePage from "@/pages/app/HomePage";
import SpendCategoriesPage from "@/pages/app/SpendCategoriesPage";
import SpendCategoryActivityPage from "@/pages/app/SpendCategoryActivityPage";
import AccountsPage from "@/pages/app/AccountsPage";
import AccountDetailsPage from "@/pages/app/AccountDetailsPage";
import AddAccountPage from "@/pages/app/AddAccountPage";
import TransactionsPage from "@/pages/app/TransactionsPage";
import AddTransactionPage from "@/pages/app/AddTransactionPage";
import TransactionDetailsPage from "@/pages/app/TransactionDetailsPage";
import CategoriesPage from "@/pages/app/CategoriesPage";
import AddCategoryPage from "@/pages/app/AddCategoryPage";
import SettingsPage from "@/pages/app/SettingsPage";
import TermsPage from "@/pages/app/TermsPage";
import PrivacyPage from "@/pages/app/PrivacyPage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Auth routes — redirect to / if already authenticated */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify" element={<OtpVerificationPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      {/* OAuth callback — no auth guard, handles token exchange */}
      <Route path="/auth/callback" element={<AuthCallbackPage />} />

      {/* Protected app routes */}
      <Route element={<AuthGuard />}>
        <Route path="main" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="spend-categories" element={<SpendCategoriesPage />} />
          <Route
            path="category-activity"
            element={<SpendCategoryActivityPage />}
          />

          <Route path="accounts" element={<AccountsPage />} />
          <Route path="accounts/new" element={<AddAccountPage />} />
          <Route path="accounts/:id" element={<AccountDetailsPage />} />
          <Route path="accounts/:id/edit" element={<AddAccountPage />} />
          <Route
            path="accounts/:id/transactions"
            element={<TransactionsPage />}
          />

          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="transactions/new" element={<AddTransactionPage />} />
          <Route path="transactions/:id" element={<TransactionDetailsPage />} />

          <Route path="categories" element={<CategoriesPage />} />
          <Route path="categories/new" element={<AddCategoryPage />} />
          <Route path="categories/:id/edit" element={<AddCategoryPage />} />

          <Route path="settings" element={<SettingsPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
        </Route>
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/main" replace />} />
    </Routes>
  );
}
