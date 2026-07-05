import Button from '@/Components/Button';
import Modal from '@/Components/Modal';
import { TriangleAlert } from 'lucide-react';

export default function ConfirmDialog({
    show,
    title,
    message,
    confirmLabel = 'Delete',
    processing = false,
    onConfirm,
    onClose,
}) {
    return (
        <Modal show={show} onClose={onClose} maxWidth="sm">
            <div className="p-6">
                <div className="flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-warning-tint text-warning">
                        <TriangleAlert size={20} />
                    </span>
                    <div>
                        <h3 className="text-base font-bold text-ink">
                            {title}
                        </h3>
                        {message && (
                            <p className="mt-1 text-sm text-muted">{message}</p>
                        )}
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        onClick={onConfirm}
                        disabled={processing}
                    >
                        {processing ? 'Working…' : confirmLabel}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
