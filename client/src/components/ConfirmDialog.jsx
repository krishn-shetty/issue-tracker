import { useId } from "react";
import { TriangleAlert } from "lucide-react";
import { Modal } from "./Modal";
import { Button } from "./Button";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Delete",
  pendingLabel = "Deleting...",
  onConfirm,
  onCancel,
  isPending = false
}) {
  const titleId = useId();
  const descriptionId = useId();
  const handleClose = () => {
    if (!isPending) onCancel();
  };

  return (
    <Modal open={open} onClose={handleClose} role="alertdialog" labelledBy={titleId} describedBy={descriptionId}>
      <div className="flex gap-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-red-50 text-red-600">
          <TriangleAlert className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h2 id={titleId} className="text-base font-semibold text-slate-900">
            {title}
          </h2>
          <p id={descriptionId} className="mt-1 text-sm text-slate-600">
            {description}
          </p>
        </div>
      </div>
      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={handleClose} disabled={isPending}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} isLoading={isPending} loadingText={pendingLabel}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>);

}