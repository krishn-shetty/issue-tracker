import { Link } from "react-router-dom";
import { ListTodo, Plus } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { buttonClasses } from "../components/Button";
import { DashboardOverview } from "../features/dashboard/components/DashboardOverview";
import { useCurrentUser } from "../features/auth/hooks";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export function DashboardPage() {
  useDocumentTitle("Dashboard");
  const { data: user } = useCurrentUser();
  const firstName = user?.name?.trim().split(/\s+/)[0];

  return (
    <>
      <PageHeader
        title={firstName ? `Welcome back, ${firstName}` : "Dashboard"}
        description="A snapshot of every issue in the workspace."
        actions={
        <>
            <Link to="/issues" className={buttonClasses({ variant: "secondary" })}>
              <ListTodo className="h-4 w-4" aria-hidden="true" />
              View Issues
            </Link>
            <Link to="/issues/new" className={buttonClasses()}>
              <Plus className="h-4 w-4" aria-hidden="true" />
              Create Issue
            </Link>
          </>
        } />
      
      <DashboardOverview />
    </>);

}