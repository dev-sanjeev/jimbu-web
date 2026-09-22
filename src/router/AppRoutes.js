import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsxs(Routes, { children: [_jsxs(Route, { element: _jsx(AuthLayout, {}), children: [_jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/register", element: _jsx(RegisterPage, {}) }), _jsx(Route, { path: "/forgot-password", element: _jsx(ForgotPasswordPage, {}) }), _jsx(Route, { path: "/verify", element: _jsx(OtpVerificationPage, {}) }), _jsx(Route, { path: "/reset-password", element: _jsx(ResetPasswordPage, {}) })] }), _jsx(Route, { path: "/auth/callback", element: _jsx(AuthCallbackPage, {}) }), _jsx(Route, { element: _jsx(AuthGuard, {}), children: _jsxs(Route, { path: "main", element: _jsx(AppLayout, {}), children: [_jsx(Route, { index: true, element: _jsx(HomePage, {}) }), _jsx(Route, { path: "spend-categories", element: _jsx(SpendCategoriesPage, {}) }), _jsx(Route, { path: "category-activity", element: _jsx(SpendCategoryActivityPage, {}) }), _jsx(Route, { path: "accounts", element: _jsx(AccountsPage, {}) }), _jsx(Route, { path: "accounts/new", element: _jsx(AddAccountPage, {}) }), _jsx(Route, { path: "accounts/:id", element: _jsx(AccountDetailsPage, {}) }), _jsx(Route, { path: "accounts/:id/edit", element: _jsx(AddAccountPage, {}) }), _jsx(Route, { path: "accounts/:id/transactions", element: _jsx(TransactionsPage, {}) }), _jsx(Route, { path: "transactions", element: _jsx(TransactionsPage, {}) }), _jsx(Route, { path: "transactions/new", element: _jsx(AddTransactionPage, {}) }), _jsx(Route, { path: "transactions/:id", element: _jsx(TransactionDetailsPage, {}) }), _jsx(Route, { path: "categories", element: _jsx(CategoriesPage, {}) }), _jsx(Route, { path: "categories/new", element: _jsx(AddCategoryPage, {}) }), _jsx(Route, { path: "categories/:id/edit", element: _jsx(AddCategoryPage, {}) }), _jsx(Route, { path: "settings", element: _jsx(SettingsPage, {}) }), _jsx(Route, { path: "terms", element: _jsx(TermsPage, {}) }), _jsx(Route, { path: "privacy", element: _jsx(PrivacyPage, {}) })] }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/main", replace: true }) })] }));
}
