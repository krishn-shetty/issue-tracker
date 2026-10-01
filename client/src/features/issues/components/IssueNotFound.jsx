import { Link } from "react-router-dom";
import { FileQuestion } from "lucide-react";
import { EmptyState } from "../../../components/EmptyState";
import { buttonClasses } from "../../../components/Button";

export function IssueNotFound() {
  return (
    <EmptyState
      className="rounded-xl border border-slate-200 bg-white py-16"
      icon={FileQuestion}
      title="Issue not found."
      description="It may have been deleted, or the link is incorrect."
      action={
      <Link to="/issues" className={buttonClasses({ variant: "secondary" })}>
          Back to issues
        </Link>
      } />);


}