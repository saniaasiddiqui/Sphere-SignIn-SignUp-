import { useNavigate } from "react-router-dom";
import {
  Plus,
  Mic,
  Split,
  Rocket,
  FolderKanban,
  FileWarning,
  FileText,
  HelpCircle,
  Radio,
  Info,
  Boxes,
  Mail,
} from "lucide-react";
import Topbar from "../components/Topbar";
import { useProjects } from "../context/ProjectsContext";

const STATS = [
  {
    label: "Active Projects",
    value: "24",
    sub: "Active pre-sales opportunities",
    icon: FolderKanban,
    tint: "text-indigo-600 bg-indigo-50",
    tag: { text: "+12% this month", tone: "text-ok" },
  },
  {
    label: "Needs Review",
    value: "7",
    sub: "AI analyses awaiting human validation",
    icon: FileWarning,
    tint: "text-danger bg-red-50",
    tag: { text: "Action required", tone: "text-danger" },
  },
  {
    label: "Proposals",
    value: "12",
    sub: "Draft and finalized proposals",
    icon: FileText,
    tint: "text-indigo-600 bg-indigo-50",
    tag: { text: "4 ready to export", tone: "text-indigo-600" },
  },
  {
    label: "Clarifications",
    value: "8",
    sub: "Missing info items across projects",
    icon: HelpCircle,
    tint: "text-ink-950 bg-canvas",
    tag: { text: "High priority", tone: "text-warn" },
  },
];

const ORBIT_NODES = [
  { label: "Information", sub: "Specs & Context", icon: Boxes, pos: "left-1/2 top-0 -translate-x-1/2" },
  { label: "Meetings", sub: "Audio & Voice", icon: Mic, pos: "left-0 top-1/2 -translate-y-1/2" },
  { label: "Insights", sub: "Decisions & Triage", icon: Radio, pos: "right-[18%] bottom-0" },
  { label: "Outputs", sub: "PRs & Tickets", icon: Mail, pos: "right-0 top-1/2 -translate-y-1/2" },
];

export default function Dashboard({ onInitiateMeeting }) {
  const { projects } = useProjects();
  const navigate = useNavigate();
  const featured = projects.find((p) => p.featured) || projects[0];

  return (
    <>
      <Topbar onNewStage={onInitiateMeeting} />
      <main className="px-8 py-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-bold tracking-tight text-ink-950">
              Good morning, Ayesha.
            </h1>
            <p className="mt-1.5 max-w-xl text-[14px] leading-relaxed text-ink-950/55">
              What would you like to work on today? Turn collaborative
              discussions into structured engineering outputs and code
              deliverables.
            </p>
          </div>
          <div className="flex shrink-0 gap-2.5">
            <span className="rounded-pill border border-line bg-white px-3.5 py-1.5 text-[12.5px] font-medium text-ink-950/70">
              2 Meetings Scheduled
            </span>
            <span className="rounded-pill border border-line bg-white px-3.5 py-1.5 text-[12.5px] font-medium text-ink-950/70">
              {projects.length} Active Repositories
            </span>
          </div>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.1fr]">
          {/* Initiate Meeting card */}
          <div className="flex flex-col justify-between rounded-card bg-ink-950 p-7 text-white">
            <div>
              <span className="inline-block rounded-pill bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white/80">
                Synthesis Ready
              </span>
              <h2 className="mt-4 text-[22px] font-bold">Initiate Meeting</h2>
              <p className="mt-2 max-w-sm text-[13.5px] leading-relaxed text-white/60">
                Start a new discussion and turn raw audio, debate, and screen
                sharing into structured project tickets, system architecture,
                and PRDs.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-2 border-t border-white/10 pt-5">
              {[
                { icon: Mic, label: "Transcribe", sub: "Real-time Audio" },
                { icon: Split, label: "Deconstruct", sub: "Action Extraction" },
                { icon: Rocket, label: "Deliver", sub: "Direct Prototype" },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex flex-col gap-1">
                  <Icon size={15} className="text-white/70" />
                  <span className="text-[12.5px] font-semibold">{label}</span>
                  <span className="text-[11px] text-white/45">{sub}</span>
                </div>
              ))}
            </div>

            <button
              onClick={onInitiateMeeting}
              className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-white py-3 text-[14px] font-semibold text-ink-950 transition-transform hover:scale-[1.01]"
            >
              <Plus size={16} />
              Initiate Meeting
            </button>
          </div>

          {/* Active Project Orbit card */}
          <div className="rounded-card border border-line bg-white p-7">
            <div className="flex items-start justify-between">
              <h3 className="text-[16px] font-semibold text-ink-950">
                Active Project Orbit — {featured?.name.split(" ")[0]}
              </h3>
              <span className="rounded-pill bg-canvas px-2.5 py-1 text-[11.5px] font-medium text-ink-950/60">
                {featured?.actionItems ?? 0} Action Items This Week
              </span>
            </div>

            <div className="relative mx-auto my-8 h-[220px] w-[220px]">
              <div className="absolute inset-0 rounded-full border border-dashed border-line" />
              <div className="absolute inset-[15%] rounded-full border border-line" />
              <div className="absolute inset-0 grid place-items-center">
                <div
                  onClick={() => featured && navigate(`/projects/${featured.id}`)}
                  className="grid h-[76px] w-[76px] cursor-pointer place-items-center rounded-full bg-ink-950 text-center text-white shadow-pop"
                >
                  <span className="text-[11px] font-bold leading-tight">
                    {featured?.name.split(" ")[0]}
                  </span>
                  <span className="text-[9px] text-white/50">Central Hub</span>
                </div>
              </div>
              {ORBIT_NODES.map(({ label, sub, icon: Icon, pos }) => (
                <div
                  key={label}
                  className={`absolute flex w-[86px] flex-col items-center gap-1 text-center ${pos}`}
                >
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-line bg-white text-ink-950/70 shadow-card">
                    <Icon size={15} />
                  </span>
                  <span className="text-[11.5px] font-medium text-ink-950">
                    {label}
                  </span>
                  <span className="text-[10px] text-ink-950/40">{sub}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-line pt-4 text-[12px]">
              <span className="flex items-center gap-1.5 text-ink-950/45">
                <Info size={13} /> Auto-synchronized with Project repository
              </span>
              <button
                onClick={() => featured && navigate(`/projects/${featured.id}`)}
                className="font-medium text-indigo-600 hover:text-indigo-700"
              >
                Inspect Live Flow →
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <button
            onClick={() => navigate("/projects")}
            className="text-[13.5px] font-medium text-indigo-600 hover:text-indigo-700"
          >
            View Project Archives →
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {STATS.map(({ label, value, sub, icon: Icon, tint, tag }) => (
            <div
              key={label}
              className="rounded-card border border-line bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[12.5px] font-medium text-ink-950/50">
                  {label}
                </span>
                <span className={`grid h-7 w-7 place-items-center rounded-md ${tint}`}>
                  <Icon size={14} />
                </span>
              </div>
              <p className="mt-2 text-[26px] font-bold text-ink-950">{value}</p>
              <p className="mt-1 text-[12px] leading-snug text-ink-950/45">
                {sub}
              </p>
              <p className={`mt-2.5 text-[12px] font-medium ${tag.tone}`}>
                {tag.text}
              </p>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
