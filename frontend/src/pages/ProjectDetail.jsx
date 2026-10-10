import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Video,
  ArrowRight,
  Mic,
  Radio,
  Clock3,
  CheckSquare,
  HeartPulse,
  MessagesSquare,
  GitPullRequest,
  Boxes,
  Ticket,
  History,
  ShieldCheck,
  ChevronRight,
  Waypoints,
  Loader2,
} from "lucide-react";
import Topbar from "../components/Topbar";
import { useProjects } from "../context/ProjectsContext";
import { statusToneClasses } from "../data/seed";
import { timeAgo, cn } from "../lib/utils";
import { joinMeeting, detectPlatform } from "../api/botApi"; // ✅ NEW

const AVATAR_TINTS = [
  "bg-indigo-100 text-indigo-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
];

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProject, launchMeeting } = useProjects();
  const project = getProject(id);
  const [meetingUrl, setMeetingUrl] = useState("");
  const [tab, setTab] = useState("Overview");
  const [launching, setLaunching] = useState(false); // ✅ NEW
  const [launchStatus, setLaunchStatus] = useState(null); // ✅ NEW

  if (!project) {
    return (
      <>
        <Topbar />
        <main className="px-8 py-16 text-center">
          <p className="text-[15px] text-ink-950/50">
            This repository doesn't exist in the workspace.
          </p>
          <button
            onClick={() => navigate("/projects")}
            className="mt-4 text-[13.5px] font-medium text-indigo-600"
          >
            ← Back to Project Repositories
          </button>
        </main>
      </>
    );
  }

  const isEmpty = !project.initialized;

  // ✅ UPDATED: ab Vexa ko call karta hai
  async function handleLaunch() {
    if (!meetingUrl.trim() || launching) return;

    const url = meetingUrl.trim();
    const platform = detectPlatform(url);

    setLaunching(true);
    setLaunchStatus(null);

    try {
      // 1. Vexa bot ko meeting mein bhejo
      const data = await joinMeeting({ platform, meetingUrl: url });

      // 2. Local state update karo (project ke andar meeting log)
      launchMeeting(project.id, url);

      setLaunchStatus({
        type: "success",
        text: data.message || "Sphere bot meeting join kar raha hai!",
      });
      setMeetingUrl("");

      // 5 second baad status clear
      setTimeout(() => setLaunchStatus(null), 5000);
    } catch (err) {
      setLaunchStatus({ type: "error", text: err.message });
    } finally {
      setLaunching(false);
    }
  }

  const tabs = [
    { label: "Overview" },
    { label: "Synced Meetings", count: project.tabsCount.meetings },
    { label: "Code Deliverables & PRs", count: project.tabsCount.prs },
    { label: "Architecture Schemas", count: project.tabsCount.schemas },
    { label: "Linear Tickets", count: project.tabsCount.tickets },
  ];

  return (
    <>
      <Topbar />
      <main className="px-8 py-8">
        <p className="flex flex-wrap items-center gap-1.5 text-[12px] font-medium uppercase tracking-wide text-ink-950/35">
          <Link to="/projects" className="hover:text-ink-950/60">Projects</Link>
          <ChevronRight size={12} />
          <Link to="/projects" className="hover:text-ink-950/60">Repositories</Link>
          <ChevronRight size={12} />
          <span className="text-ink-950/60">{project.name}</span>
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="text-[26px] font-bold tracking-tight text-ink-950">
            {project.name}
          </h1>
          {project.isNew && (
            <span className="rounded-pill bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-600">
              New Workspace
            </span>
          )}
        </div>
        <span
          className={cn(
            "mt-2 inline-block rounded-pill px-2.5 py-1 text-[11px] font-medium",
            statusToneClasses[project.statusTone]
          )}
        >
          {isEmpty ? "Initialized · Awaiting First Meeting" : project.statusLabel}
        </span>
        <p className="mt-2 max-w-2xl text-[13.5px] text-ink-950/55">
          {project.description}
        </p>

        {/* Enter Meeting URL */}
        <div className="mt-6 rounded-card bg-ink-950 p-7 text-white">
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-white/60">
            <Radio size={12} className="animate-pulse" />
            {isEmpty ? "INSTANT NEURAL INGESTION" : "LIVE AUTONOMOUS SYNTHESIZER"}
          </span>
          <h2 className="mt-2 text-[22px] font-bold">Enter Meeting URL</h2>
          {isEmpty && (
            <p className="mt-1.5 max-w-md text-[13.5px] leading-relaxed text-white/60">
              Initiate your first meeting to populate this repository with
              architecture schemas, diarized decisions, and auto-generated
              code deltas.
            </p>
          )}

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <div className="flex flex-1 items-center gap-2.5 rounded-lg bg-white px-3.5 py-3">
              <Video size={16} className="shrink-0 text-ink-950/40" />
              <input
                value={meetingUrl}
                onChange={(e) => setMeetingUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLaunch()}
                placeholder="https://meet.google.com/xyz-abcd-efg or Zoom link..."
                disabled={launching}
                className="w-full bg-transparent text-[13.5px] text-ink-950 placeholder:text-ink-950/40 focus:outline-none disabled:opacity-60"
              />
            </div>
            <button
              onClick={handleLaunch}
              disabled={!meetingUrl.trim() || launching}
              className="flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-white px-5 py-3 text-[13.5px] font-semibold text-ink-950 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {launching ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Launching...
                </>
              ) : (
                <>
                  {isEmpty ? "Launch First Meeting" : "Launch Meeting Stage"}
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </div>

          {/* ✅ Status message */}
          {launchStatus && (
            <div
              className={cn(
                "mt-3 rounded-lg border p-3 text-[12.5px]",
                launchStatus.type === "success"
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                  : "border-red-500/30 bg-red-500/10 text-red-200"
              )}
            >
              {launchStatus.text}
            </div>
          )}

          {isEmpty ? (
            <p className="mt-3.5 text-[11.5px] text-white/40">
              Supported bridges:{" "}
              {["Google Meet", "Zoom Rooms", "Microsoft Teams", "Raw SIP/WebRTC"].map(
                (b, i, arr) => (
                  <span key={b}>
                    <span className="text-white/60">● {b}</span>
                    {i < arr.length - 1 ? "  " : ""}
                  </span>
                )
              )}
            </p>
          ) : (
            <button className="mt-3.5 flex items-center gap-1.5 text-[12.5px] font-medium text-white/70 hover:text-white">
              <Mic size={13} /> Start Instant Audio Room
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-b border-line">
          <div className="flex flex-wrap gap-1">
            {tabs.map((t) => (
              <button
                key={t.label}
                onClick={() => setTab(t.label)}
                className={cn(
                  "flex items-center gap-1.5 rounded-t-lg border-b-2 px-3.5 py-2.5 text-[13.5px] font-medium transition-colors",
                  tab === t.label
                    ? "border-ink-950 text-ink-950"
                    : "border-transparent text-ink-950/45 hover:text-ink-950/70"
                )}
              >
                {t.label}
                {typeof t.count === "number" && (
                  <span
                    className={cn(
                      "rounded-pill px-1.5 py-[1px] text-[10.5px] font-semibold",
                      tab === t.label ? "bg-ink-950 text-white" : "bg-canvas text-ink-950/50"
                    )}
                  >
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </div>
          <span className="flex shrink-0 items-center gap-1.5 pb-2 text-[11.5px] text-ink-950/40">
            <History size={13} /> Repo Sync: Auto-polling Active
          </span>
        </div>

        {isEmpty ? (
          <EmptyState />
        ) : (
          <ProjectOverview project={project} />
        )}
      </main>
    </>
  );
}

function EmptyState() {
  const items = [
    { icon: MessagesSquare, label: "Diarized meeting transcripts" },
    { icon: Boxes, label: "Synced architecture schemas" },
    { icon: GitPullRequest, label: "Auto-generated pull requests" },
    { icon: Ticket, label: "Linear tickets & action items" },
  ];
  return (
    <div className="mt-10 flex flex-col items-center rounded-card border border-line bg-white px-6 py-16 text-center">
      <div className="relative grid h-[110px] w-[110px] place-items-center rounded-full border border-dashed border-line">
        <div className="absolute inset-[16%] rounded-full border border-line" />
        <span className="grid h-12 w-12 place-items-center rounded-full bg-ink-950 text-white">
          <Waypoints size={20} />
        </span>
        {[0, 90, 180, 270].map((deg) => (
          <span
            key={deg}
            className="absolute h-2.5 w-2.5 rounded-full bg-ink-950/70"
            style={{
              top: `${50 - 50 * Math.cos((deg * Math.PI) / 180)}%`,
              left: `${50 + 50 * Math.sin((deg * Math.PI) / 180)}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
      </div>
      <h3 className="mt-6 text-[17px] font-semibold text-ink-950">
        Repository Initialized — No Meetings or Deliverables Yet
      </h3>
      <p className="mt-1.5 max-w-md text-[13.5px] leading-relaxed text-ink-950/50">
        Once you paste a meeting URL above and start your discussion, Sphere
        will automatically populate this space with:
      </p>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex w-32 flex-col items-center gap-2 rounded-lg bg-canvas p-4 text-center"
          >
            <Icon size={16} className="text-ink-950/50" />
            <span className="text-[11.5px] leading-snug text-ink-950/60">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectOverview({ project }) {
  const stats = [
    {
      label: "MEETINGS PROCESSED",
      icon: Video,
      value: project.meetingsProcessed,
      sub: `+${project.tabsCount.meetings > 0 ? 1 : 0} this sprint`,
    },
    {
      label: "SYNC HEALTH",
      icon: HeartPulse,
      value: `${project.syncHealth}%`,
      sub: "Optimal",
      bar: project.syncHealth,
    },
    {
      label: "ACTION ITEMS",
      icon: CheckSquare,
      value: project.actionItems,
      sub: "Pending commit",
    },
    {
      label: "LAST ACTIVITY",
      icon: Clock3,
      value: project.lastActivity?.time || "—",
      sub: project.lastActivity ? `by ${project.lastActivity.by}` : "No activity yet",
    },
  ];

  return (
    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      <div>
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          {stats.map(({ label, icon: Icon, value, sub, bar }) => (
            <div key={label} className="rounded-card border border-line bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] font-semibold tracking-wide text-ink-950/40">
                  {label}
                </span>
                <Icon size={14} className="text-ink-950/30" />
              </div>
              <p className="mt-1.5 text-[24px] font-bold leading-tight text-ink-950">
                {value}{" "}
                <span className="text-[12px] font-medium text-ink-950/40">
                  {sub}
                </span>
              </p>
              {typeof bar === "number" && (
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-pill bg-canvas">
                  <div
                    className="h-full rounded-pill bg-ink-950"
                    style={{ width: `${bar}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <h3 className="text-[15px] font-semibold text-ink-950">
            Recent Synced Meetings{" "}
            <span className="ml-1 text-[12px] font-normal text-ink-950/40">
              {project.recentMeetings.length} active stages
            </span>
          </h3>
          <button className="text-[12.5px] font-medium text-indigo-600 hover:text-indigo-700">
            View Archive
          </button>
        </div>

        <div className="mt-3 flex flex-col gap-3">
          {project.recentMeetings.length === 0 && (
            <p className="rounded-card border border-dashed border-line py-8 text-center text-[13px] text-ink-950/40">
              No synced meetings yet.
            </p>
          )}
          {project.recentMeetings.map((m) => (
            <div
              key={m.id}
              className="rounded-card border border-line bg-white p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-canvas text-ink-950/60">
                  <Waypoints size={15} />
                </span>
                <div className="flex-1">
                  <p className="flex flex-wrap items-center gap-2 text-[12px] text-ink-950/45">
                    <span className="rounded-pill bg-canvas px-2 py-0.5 font-medium text-ink-950/70">
                      {m.date}
                    </span>
                    {m.duration}
                  </p>
                  <h4 className="mt-1.5 text-[15px] font-semibold text-ink-950">
                    {m.title}
                  </h4>
                  <p className="mt-1 text-[13px] leading-relaxed text-ink-950/55">
                    {m.summary}
                  </p>
                </div>
                <ChevronRight size={16} className="mt-1 shrink-0 text-ink-950/25" />
              </div>

              {m.prsStaged && (
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-canvas px-3 py-2 text-[12.5px]">
                  <GitPullRequest size={13} className="text-ink-950/40" />
                  {m.prsStaged} PRs staged:
                  <span className="rounded-md bg-white px-2 py-0.5 text-[11.5px] font-medium text-ink-950/60">
                    +{Math.max(m.prsStaged - 2, 0)} more
                  </span>
                </div>
              )}
              {m.merged && (
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[12.5px] text-ink-950/50">
                  <span className="rounded-pill bg-canvas px-2.5 py-1 font-medium text-ink-950/70">
                    ↑ {m.merged}
                  </span>
                  <span>Reviewer: {m.reviewer}</span>
                </div>
              )}

              {(m.participants || m.verified) && (
                <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {(m.avatars || []).map((a, i) => (
                        <span
                          key={i}
                          className={cn(
                            "grid h-6 w-6 place-items-center rounded-full border-2 border-white text-[10px] font-semibold",
                            AVATAR_TINTS[i % AVATAR_TINTS.length]
                          )}
                        >
                          {a}
                        </span>
                      ))}
                      {m.extraAvatars > 0 && (
                        <span className="grid h-6 w-6 place-items-center rounded-full border-2 border-white bg-line text-[10px] font-semibold text-ink-950/60">
                          +{m.extraAvatars}
                        </span>
                      )}
                    </div>
                    {m.participants && (
                      <span className="text-[12px] text-ink-950/45">
                        {m.participants} Participants
                      </span>
                    )}
                  </div>
                  {m.verified && (
                    <span className="text-[12px] font-medium text-indigo-600">
                      Synthesis verified
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <aside className="flex flex-col gap-5">
        <div className="rounded-card border border-line bg-white p-5">
          <div className="flex items-center justify-between">
            <h4 className="text-[14.5px] font-semibold text-ink-950">
              Topology &amp; Synced Nodes
            </h4>
            <Waypoints size={14} className="text-ink-950/30" />
          </div>
          <p className="mt-1 text-[12px] text-ink-950/45">
            Live gateway microservice dependencies
          </p>

          <div className="relative mt-4 h-[150px] rounded-lg bg-canvas">
            <span className="absolute right-3 top-2 text-[10.5px] text-ink-950/35">
              {project.topology.linked} Services Linked
            </span>
            <div className="absolute inset-0 grid place-items-center">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-ink-950 text-[10px] font-bold text-white">
                GAT
              </span>
            </div>
            {project.topology.nodes.slice(0, 4).map((n, i) => {
              const positions = [
                "left-[15%] top-[20%]",
                "right-[15%] top-[20%]",
                "left-[15%] bottom-[15%]",
                "right-[15%] bottom-[15%]",
              ];
              return (
                <span
                  key={n.label}
                  className={cn(
                    "absolute grid h-7 w-7 place-items-center rounded-full border border-line bg-white text-[9px] font-semibold text-ink-950/60 shadow-card",
                    positions[i]
                  )}
                >
                  {n.label.slice(0, 3).toUpperCase()}
                </span>
              );
            })}
          </div>

          <div className="mt-3 flex flex-col gap-2">
            {project.topology.nodes.map((n) => (
              <div key={n.label} className="flex items-center justify-between text-[12px]">
                <span className="flex items-center gap-1.5 text-ink-950/65">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                  {n.label}
                </span>
                <span className="font-mono-data text-ink-950/35">{n.meta}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-card border border-line bg-white p-5">
          <h4 className="flex items-center gap-1.5 text-[14.5px] font-semibold text-ink-950">
            <ShieldCheck size={15} className="text-indigo-500" />
            Sphere Orchestrator Ready
          </h4>
          <p className="mt-2 text-[12.5px] leading-relaxed text-ink-950/50">
            When a meeting URL is attached, Sphere registers as a silent bot
            participant, builds a contextual graph against {project.name}'s
            git history, and generates ready-to-merge pull requests before
            the meeting ends.
          </p>
          <div className="mt-3.5 flex items-center justify-between rounded-lg bg-canvas px-3 py-2">
            <span className="text-[12px] text-ink-950/60">
              Repo Staging Permissions
            </span>
            <span className="text-[12px] font-semibold text-ok">Granted</span>
          </div>
        </div>
      </aside>
    </div>
  );
}