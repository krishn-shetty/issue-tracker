import { Link } from "react-router-dom";
import { buttonClasses } from "../components/Button";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export function NotFoundPage() {
  useDocumentTitle("Page Not Found");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <p className="text-sm font-semibold text-indigo-700">404</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Page Not Found</h1>
      <p className="mt-2 max-w-sm text-sm text-slate-600">The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/dashboard" className={`${buttonClasses()} mt-6`}>
        Back to Dashboard
      </Link>
    </main>);

}