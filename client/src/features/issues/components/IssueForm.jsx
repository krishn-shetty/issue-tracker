import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { FormField } from "../../../components/FormField";
import { Input } from "../../../components/Input";
import { Textarea } from "../../../components/Textarea";
import { Select } from "../../../components/Select";
import { Button, buttonClasses } from "../../../components/Button";
import { useAssignableUsers } from "../../users/hooks";
import { issueFormSchema } from "../schemas";
import { ISSUE_DESCRIPTION_MAX, PRIORITY_OPTIONS, STATUS_OPTIONS } from "../constants";
import { AssigneeOptions } from "./AssigneeOptions";

export function IssueForm({ defaultValues, currentAssignee = null, onSubmit, isPending, submitLabel, pendingLabel, cancelTo }) {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors }
  } = useForm({ resolver: zodResolver(issueFormSchema), defaultValues });
  const { data: usersData, isError: usersFailed } = useAssignableUsers();
  const descriptionLength = (watch("description") ?? "").length;
  const submit = handleSubmit((values) => onSubmit(values, { setError }));

  return (
    <form noValidate onSubmit={submit} className="space-y-5">
      <FormField label="Title" error={errors.title?.message}>
        {(field) => <Input {...field} placeholder="Short, descriptive summary" autoComplete="off" {...register("title")} />}
      </FormField>

      <FormField
        label="Description"
        error={errors.description?.message}
        hint={`${descriptionLength} / ${ISSUE_DESCRIPTION_MAX}`}>
        
        {(field) =>
        <Textarea
          {...field}
          rows={8}
          placeholder="What happened, steps to reproduce, expected vs. actual behaviour..."
          {...register("description")} />

        }
      </FormField>

      <div className="grid gap-5 sm:grid-cols-3">
        <FormField label="Status" error={errors.status?.message}>
          {(field) =>
          <Select {...field} {...register("status")}>
              {STATUS_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </Select>
          }
        </FormField>
        <FormField label="Priority" error={errors.priority?.message}>
          {(field) =>
          <Select {...field} {...register("priority")}>
              {PRIORITY_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </Select>
          }
        </FormField>
        <FormField
          label="Assignee"
          error={errors.assignedTo?.message}
          hint={usersFailed ? "Couldn't load users." : undefined}>
          
          {(field) =>
          <Select {...field} {...register("assignedTo")}>
              <AssigneeOptions users={usersData?.items} currentAssignee={currentAssignee} />
            </Select>
          }
        </FormField>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
        <Link to={cancelTo} className={buttonClasses({ variant: "secondary" })}>
          Cancel
        </Link>
        <Button type="submit" isLoading={isPending} loadingText={pendingLabel}>
          {submitLabel}
        </Button>
      </div>
    </form>);

}