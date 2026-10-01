import { Navigate, createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicOnlyRoute } from "./PublicOnlyRoute";
import { AppLayout } from "../layouts/AppLayout";
import { AuthLayout } from "../layouts/AuthLayout";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { DashboardPage } from "../pages/DashboardPage";
import { IssuesPage } from "../pages/IssuesPage";
import { IssueCreatePage } from "../pages/IssueCreatePage";
import { IssueDetailPage } from "../pages/IssueDetailPage";
import { IssueEditPage } from "../pages/IssueEditPage";
import { ProfilePage } from "../pages/ProfilePage";
import { NotFoundPage } from "../pages/NotFoundPage";

export const router = createBrowserRouter(
  [
  { path: "/", element: <Navigate to="/dashboard" replace /> },
  {
    element: <PublicOnlyRoute />,
    children: [
    {
      element: <AuthLayout />,
      children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> }]

    }]

  },
  {
    element: <ProtectedRoute />,
    children: [
    {
      element: <AppLayout />,
      children: [
      { path: "dashboard", element: <DashboardPage />, handle: { title: "Dashboard" } },
      { path: "issues", element: <IssuesPage />, handle: { title: "Issues" } },
      { path: "issues/new", element: <IssueCreatePage />, handle: { title: "Create Issue" } },
      { path: "issues/:id", element: <IssueDetailPage />, handle: { title: "Issue" } },
      { path: "issues/:id/edit", element: <IssueEditPage />, handle: { title: "Edit Issue" } },
      { path: "profile", element: <ProfilePage />, handle: { title: "Profile" } }]

    }]

  },
  { path: "*", element: <NotFoundPage /> }],

  {
    future: {
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_relativeSplatPath: true,
      v7_skipActionErrorRevalidation: true
    }
  }
);