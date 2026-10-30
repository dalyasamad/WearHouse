// Renders a reusable React interface component.


// Renders the reusable ConfirmModal interface component.
function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="confirm-modal-backdrop"
      onMouseDown={onCancel}
    >
      <div
        className="confirm-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <div className="confirm-modal-icon">
          !
        </div>

        <h2 id="confirm-modal-title">
          {title}
        </h2>

        <p>{message}</p>

        <div className="confirm-modal-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </button>

          <button
            type="button"
            className="danger-button"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading
              ? "Deleting..."
              : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;