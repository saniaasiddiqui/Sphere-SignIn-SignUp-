import { useMemo, useState } from "react";
import Modal, { ModalCloseButton } from "../Modal";
import { ArrowRight, Braces, Check } from "lucide-react";
import { slugify } from "../../lib/utils";

const SCOPE_LIMIT = 200;

const emptyForm = {
  name: "",
  scope: "",
  connection: "remote",
  repoUrl: "",
};

export default function CreateProjectModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyForm);
  const slug = useMemo(() => slugify(form.name) || "your-project-slug", [form.name]);
  const canSubmit = form.name.trim().length > 1 && form.scope.trim().length > 0;

  function reset() {
    setForm(emptyForm);
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleSubmit() {
    if (!canSubmit) return;
    onSubmit(form);
    reset();
  }

  return (
    <Modal open={open} onClose={handleClose} width="max-w-xl">
      <div className="p-8">
        <ModalCloseButton onClose={handleClose} />
        <p className="text-[11px] font-semibold tracking-wide text-indigo-600">
          REPOSITORY INITIALIZATION
        </p>
        <h2 className="mt-1 text-[22px] font-bold text-ink-950">
          Create Project Repository
        </h2>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-950/55">
          Establish a persistent synthesis space linking architectural
          meeting tracks to live engineering assets.
        </p>

        <div className="mt-6 flex flex-col gap-5">
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-[13px] font-semibold text-ink-950">
                Project Name <span className="text-danger">*</span>
              </label>
              <span className="text-[12px] text-ink-950/40">
                Slug: {slug}
              </span>
            </div>
            <div className="relative">
              <input
                autoFocus
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="PulseAI Health Engine"
                className="w-full rounded-lg border border-line px-3.5 py-2.5 pr-10 text-[14px] text-ink-950 focus:border-indigo-500 focus:outline-none"
              />
              {form.name.trim().length > 1 && (
                <Check
                  size={16}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ok"
                />
              )}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-[13px] font-semibold text-ink-950">
              Scope &amp; Domain Objective
            </label>
            <textarea
              rows={3}
              maxLength={SCOPE_LIMIT}
              value={form.scope}
              onChange={(e) => setForm((f) => ({ ...f, scope: e.target.value }))}
              placeholder="Real-time biometric telemetry processing and clinical microservice orchestration."
              className="w-full resize-none rounded-lg border border-line px-3.5 py-2.5 text-[14px] text-ink-950 focus:border-indigo-500 focus:outline-none"
            />
            <div className="mt-1 flex items-center justify-between text-[11.5px] text-ink-950/40">
              <span>Used by Sphere AI engine to contextualize agenda transcription</span>
              <span className="font-mono-data shrink-0 pl-3">
                {form.scope.length} / {SCOPE_LIMIT}
              </span>
            </div>
          </div>

          <div className="rounded-card border border-line p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[13px] font-semibold text-ink-950">
                <Braces size={14} /> Codebase &amp; VCS Connection
              </span>
              <span className="text-[11px] text-indigo-600">Configurable</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { key: "remote", title: "Link Remote Git", sub: "github.com/your-org/repo" },
                { key: "staging", title: "Auto-Provision Staging", sub: `${slug}/staging` },
              ].map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, connection: opt.key }))}
                  className={`flex flex-col items-start gap-0.5 rounded-lg border px-3.5 py-2.5 text-left transition-colors ${
                    form.connection === opt.key
                      ? "border-ink-950 bg-canvas"
                      : "border-line hover:bg-canvas/60"
                  }`}
                >
                  <span className="flex items-center gap-2 text-[13px] font-medium text-ink-950">
                    <span
                      className={`grid h-3.5 w-3.5 place-items-center rounded-full border ${
                        form.connection === opt.key
                          ? "border-ink-950"
                          : "border-ink-950/30"
                      }`}
                    >
                      {form.connection === opt.key && (
                        <span className="h-1.5 w-1.5 rounded-full bg-ink-950" />
                      )}
                    </span>
                    {opt.title}
                  </span>
                  <span className="pl-5 text-[11.5px] text-ink-950/40">
                    {opt.sub}
                  </span>
                </button>
              ))}
            </div>
            {form.connection === "remote" && (
              <div className="mt-3 flex items-center rounded-lg border border-line px-3.5 py-2">
                <span className="text-[13px] text-ink-950/40">https://</span>
                <input
                  value={form.repoUrl}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, repoUrl: e.target.value }))
                  }
                  placeholder="github.com/your-org/your-repo"
                  className="w-full bg-transparent px-1 text-[13px] text-ink-950 focus:outline-none"
                />
              </div>
            )}
          </div>
        </div>

        <div className="mt-7 flex items-center justify-between gap-3 border-t border-line pt-5">
          <p className="text-[12px] text-ink-950/40">
            You will proceed directly to meeting link input.
          </p>
          <div className="flex shrink-0 gap-2.5">
            <button
              onClick={handleClose}
              className="rounded-lg border border-line px-4 py-2 text-[13.5px] font-medium text-ink-950/70 hover:bg-canvas"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="flex items-center gap-1.5 rounded-lg bg-ink-950 px-4 py-2 text-[13.5px] font-medium text-white transition-colors hover:bg-ink-900 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Create Repository &amp; Continue
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
