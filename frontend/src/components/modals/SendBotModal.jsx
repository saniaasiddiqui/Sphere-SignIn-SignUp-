import { useState } from "react";
import Modal, { ModalCloseButton } from "../Modal";
import { Video, Radio } from "lucide-react";
import { joinMeeting, leaveMeeting } from "../../api/botApi";

export default function SendBotModal({
  open,
  onClose,
  project,
  onMeetingLaunched,
}) {
  const [platform, setPlatform] = useState("google_meet");
  const [meetingUrl, setMeetingUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [botActive, setBotActive] = useState(false);
  const [status, setStatus] = useState(null);

  function handleClose() {
    setStatus(null);
    onClose();
  }

  async function handleStart(e) {
    e.preventDefault();
    if (!meetingUrl) return;

    setLoading(true);
    setStatus(null);

    try {
      const data = await joinMeeting({ platform, meetingUrl });
      setStatus({
        type: "success",
        text: data.message || "Sphere bot meeting join kar raha hai!",
      });
      setBotActive(true);

      // ✅ Project ke andar meeting log karo
      if (onMeetingLaunched && project?.id) {
        onMeetingLaunched(project.id, meetingUrl);
      }
    } catch (err) {
      setStatus({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  }

  async function handleLeave() {
    if (!meetingUrl) return;

    setLeaving(true);
    setStatus(null);

    try {
      const data = await leaveMeeting({ platform, meetingUrl });
      setStatus({
        type: "success",
        text: data.message || "Sphere bot meeting leave kar raha hai!",
      });
      setBotActive(false);
      setMeetingUrl("");
    } catch (err) {
      setStatus({ type: "error", text: err.message });
    } finally {
      setLeaving(false);
    }
  }

  return (
    <Modal open={open} onClose={handleClose} width="max-w-lg">
      <div className="p-8">
        <ModalCloseButton onClose={handleClose} />

        <p className="text-[11px] font-semibold tracking-wide text-indigo-600">
          LIVE SYNTHESIS SESSION
        </p>
        <h2 className="mt-1 text-[22px] font-bold text-ink-950">
          Send Sphere Bot
        </h2>

        {project && (
          <p className="mt-1.5 text-[13px] text-ink-950/55">
            Linking to repository:{" "}
            <span className="font-mono-data text-ink-950">
              {project.repoPath}
            </span>
          </p>
        )}

        <form onSubmit={handleStart} className="mt-6 flex flex-col gap-4">
          {/* Platform Selector */}
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold text-ink-950">
              Meeting Platform
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              disabled={botActive}
              className="w-full rounded-lg border border-line px-3.5 py-2.5 text-[14px] text-ink-950 focus:border-indigo-500 focus:outline-none disabled:opacity-50"
            >
              <option value="google_meet">Google Meet</option>
              <option value="zoom">Zoom</option>
              <option value="teams">Microsoft Teams</option>
            </select>
          </div>

          {/* URL INPUT */}
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold text-ink-950">
              Meeting URL <span className="text-danger">*</span>
            </label>
            <div className="relative">
              <Video
                size={15}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-950/40"
              />
              <input
                type="url"
                required
                value={meetingUrl}
                onChange={(e) => setMeetingUrl(e.target.value)}
                placeholder="https://meet.google.com/abc-defg-hij"
                disabled={botActive}
                className="w-full rounded-lg border border-line py-2.5 pl-10 pr-3.5 text-[14px] text-ink-950 focus:border-indigo-500 focus:outline-none disabled:opacity-50"
              />
            </div>
            <p className="mt-1.5 text-[11.5px] text-ink-950/40">
              Paste the full meeting link. Sphere will parse the meeting ID
              automatically.
            </p>
          </div>

          {/* Status */}
          {status && (
            <div
              className={`rounded-lg border p-3 text-[13px] ${
                status.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-red-200 bg-red-50 text-danger"
              }`}
            >
              {status.text}
            </div>
          )}

          {/* Buttons */}
          <div className="mt-2 flex gap-2.5">
            <button
              type="submit"
              disabled={loading || botActive || !meetingUrl}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-ink-950 px-4 py-2.5 text-[13.5px] font-medium text-white transition-colors hover:bg-ink-900 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Radio size={14} />
              {loading
                ? "Starting Bot..."
                : botActive
                ? "Bot Active"
                : "Start Synthesis"}
            </button>

            <button
              type="button"
              onClick={handleLeave}
              disabled={leaving || !botActive}
              className="flex-1 rounded-lg border border-line px-4 py-2.5 text-[13.5px] font-medium text-ink-950/70 transition-colors hover:bg-canvas disabled:cursor-not-allowed disabled:opacity-40"
            >
              {leaving ? "Leaving..." : "Leave Meeting"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}