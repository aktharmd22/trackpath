import {
    Dialog,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild,
} from '@headlessui/react';
import { X } from 'lucide-react';

/**
 * Slide-over panel: full-width bottom sheet on mobile,
 * right-hand side panel from `sm:` up.
 */
export default function Drawer({ show = false, title, onClose, children }) {
    return (
        <Transition show={show} leave="duration-200">
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <TransitionChild
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-ink/40" />
                </TransitionChild>

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 flex items-end justify-end sm:items-stretch">
                        <TransitionChild
                            enter="transform transition ease-out duration-300"
                            enterFrom="translate-y-full sm:translate-y-0 sm:translate-x-full"
                            enterTo="translate-y-0 sm:translate-x-0"
                            leave="transform transition ease-in duration-200"
                            leaveFrom="translate-y-0 sm:translate-x-0"
                            leaveTo="translate-y-full sm:translate-y-0 sm:translate-x-full"
                        >
                            <DialogPanel className="flex max-h-[92dvh] w-screen flex-col rounded-t-card border-t border-line bg-surface sm:h-full sm:max-h-none sm:w-[28rem] sm:rounded-none sm:border-l sm:border-t-0">
                                <div className="flex items-center justify-between border-b border-line px-5 py-4">
                                    <DialogTitle className="text-base font-bold text-ink">
                                        {title}
                                    </DialogTitle>
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        aria-label="Close"
                                        className="flex min-h-tap min-w-tap items-center justify-center rounded-field text-muted transition hover:bg-card hover:text-ink"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                                <div className="flex-1 overflow-y-auto px-5 py-5">
                                    {children}
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
