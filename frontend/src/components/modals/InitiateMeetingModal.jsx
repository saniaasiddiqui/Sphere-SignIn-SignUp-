import Modal, { ModalCloseButton } from "../Modal";
import { FolderPlus, FolderOpen } from "lucide-react";

export default function InitiateMeetingModal({
  open,
  onClose,
  onCreateNew,
  onOpenExisting,
}) {
  return (
    <Modal open={open} onClose={onClose} width="max-w-lg">
      <div className="p-8">
        <ModalCloseButton onClose={onClose} />
        <h2 className="text-[22px] font-bold text-ink-950">
          Initiate Meeting
        </h2>
        <p className="mt-1.5 text-[14px] leading-relaxed text-ink-950/55">
          Attach a repository so Sphere can build a contextual graph against
          your codebase before the meeting starts.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={onCreateNew}
            className="flex items-start gap-3.5 rounded-card border border-line px-4 py-4 text-left transition-colors hover:border-ink-950/25 hover:bg-canvas"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-ink-950 text-white">
              <FolderPlus size={18} />
            </span>
            <span>
              <span className="block text-[14.5px] font-semibold text-ink-950">
                Create New Project Repository
              </span>
              <span className="mt-0.5 block text-[13px] text-ink-950/50">
                Register a fresh codebase and start its first synthesis
                meeting.
              </span>
            </span>
          </button>

          <button
            onClick={onOpenExisting}
            className="flex items-start gap-3.5 rounded-card border border-line px-4 py-4 text-left transition-colors hover:border-ink-950/25 hover:bg-canvas"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-canvas text-ink-950">
              <FolderOpen size={18} />
            </span>
            <span>
              <span className="block text-[14.5px] font-semibold text-ink-950">
                Open Existing Project Repository
              </span>
              <span className="mt-0.5 block text-[13px] text-ink-950/50">
                Browse repositories already synced to this workspace.
              </span>
            </span>
          </button>
        </div>
      </div>
    </Modal>
  );
}