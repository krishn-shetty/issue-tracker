import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "../../../components/FormField";
import { Textarea } from "../../../components/Textarea";
import { Button } from "../../../components/Button";
import { COMMENT_MAX_LENGTH, commentSchema } from "../schemas";

export function CommentForm({
  label,
  defaultValue = "",
  placeholder,
  submitLabel,
  pendingLabel,
  isPending,
  onSubmit,
  onCancel,
  autoFocus = false
}) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { errors }
  } = useForm({ resolver: zodResolver(commentSchema), defaultValues: { content: defaultValue } });
  const content = watch("content") ?? "";
  const isEmpty = content.trim().length === 0;

  const submit = handleSubmit(({ content: value }) =>
  onSubmit(value, { reset: () => reset({ content: "" }), setError })
  );

  return (
    <form noValidate onSubmit={submit}>
      <FormField label={label} error={errors.content?.message} hint={`${content.length} / ${COMMENT_MAX_LENGTH}`}>
        {(field) =>
        <Textarea {...field} rows={3} placeholder={placeholder} autoFocus={autoFocus} {...register("content")} />
        }
      </FormField>
      <div className="mt-3 flex justify-end gap-2">
        {onCancel &&
        <Button variant="secondary" size="sm" onClick={onCancel} disabled={isPending}>
            Cancel
          </Button>
        }
        <Button type="submit" size="sm" disabled={isEmpty} isLoading={isPending} loadingText={pendingLabel}>
          {submitLabel}
        </Button>
      </div>
    </form>);

}