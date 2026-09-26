import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SlidersHorizontal, Plus, ArrowRight, Radio } from "lucide-react";
import Topbar from "../components/Topbar";
import { useProjects } from "../context/ProjectsContext";
import { statusToneClasses } from "../data/seed";
import { timeAgo, cn } from "../lib/utils";

const TABS = ["All Repositories", "Production Synced", "Discovery", "Archived"];

const AVATAR_TINTS = [
  "bg-indigo-100 text-indigo-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
];

export default function ProjectsList({ onCreateNew }) {
  const { projects } = useProjects();
  const navigate = useNavigate();
  const [tab, setTab] = useState(TABS[0]);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    let list = projects;
    if (tab === "Production Synced") list = list.filter((p) => p.statusTone === "active");
    if (tab === "Discovery") list = list.filter((p) => p.statusTone === "discovery" || p.statusTone === "new");
    if (tab === "Archived") list = [];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.repoPath.toLowerCase().includes(q)
      );
    }
    return list;
  }, [projects, tab, query]);

  return (
    <>
      <Topbar crumbs="SPHERE STRATEGIC WORKSPACE > REPOSITORIES" />
      <main className="px-8 py-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[26px] font-bold tracking-tight text-ink-950">
              Project Repositories
            </h1>
            <p className="mt-1 max-w-lg text-[13.5px] text-ink-950/55">
              Select an active repository to inspect synced architectural
              schemas or launch a real-time synthesis meeting.
            </p>
          </div>
          <button
            onClick={onCreateNew}
            className="flex shrink-0 items-center gap-1.5 rounded-lg bg-ink-950 px-4 py-2.5 text-[13.5px] font-medium text-white hover:bg-ink-900"
          >
            <Plus size={15} />
            New Repository
          </button>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1 rounded-lg border border-line bg-white p-1">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors",
                  tab === t
                    ? "bg-ink-950 text-white"
                    : "text-ink-950/55 hover:bg-canvas"
                )}
              >
                {t}
                {t === "All Repositories" && (
                  <span className="ml-1 text-ink-950/40 group-hover:text-inherit">
                    ({projects.length})
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2">
              <SlidersHorizontal size={14} className="text-ink-950/40" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter repositories..."
                className="w-40 bg-transparent text-[13px] text-ink-950 placeholder:text-ink-950/40 focus:outline-none"
              />
            </div>
            <span className="flex items-center gap-1.5 text-[12px] text-ink-950/40">
              <Radio size={12} className="text-indigo-500" /> Auto-synthesis active
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {filtered.map((p, idx) => (
            <div
              key={p.id}
              className="flex flex-col rounded-card border border-line bg-white p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-canvas text-ink-950/70">
                    <Radio size={17} />
                  </span>
                  <div>
                    <h3 className="text-[16px] font-semibold leading-tight text-ink-950">
                      {p.name}
                    </h3>
                    <p className="font-mono-data mt-0.5 text-[11.5px] text-ink-950/40">
                      {p.repoPath}
                    </p>
                  </div>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-pill px-2.5 py-1 text-[11px] font-medium",
                    statusToneClasses[p.statusTone]
                  )}
                >
                  {p.isNew && "● "}
                  {p.statusLabel}
                </span>
              </div>

              <p className="mt-3 text-[13.5px] leading-relaxed text-ink-950/55">
                {p.description}
              </p>

              <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg bg-canvas p-3.5">
                <div>
                  <p className="text-[18px] font-bold text-ink-950">
                    {p.stats.synthesized}
                  </p>
                  <p className="text-[11px] text-ink-950/45">Synthesized</p>
                </div>
                <div>
                  <p className="text-[18px] font-bold text-ink-950">
                    {p.stats.staged}
                  </p>
                  <p className="text-[11px] text-ink-950/45">Staged PRs</p>
                </div>
                <div>
                  <p className="text-[18px] font-bold text-ink-950">
                    {p.stats.syncHealth}
                  </p>
                  <p className="text-[11px] text-ink-950/45">Sync Health</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {p.avatars.map((a, i) => (
                    <span
                      key={i}
                      className={cn(
                        "grid h-7 w-7 place-items-center rounded-full border-2 border-white text-[11px] font-semibold",
                        AVATAR_TINTS[i % AVATAR_TINTS.length]
                      )}
                    >
                      {a}
                    </span>
                  ))}
                  {p.extraAvatars > 0 && (
                    <span className="grid h-7 w-7 place-items-center rounded-full border-2 border-white bg-line text-[11px] font-semibold text-ink-950/60">
                      +{p.extraAvatars}
                    </span>
                  )}
                </div>
                <span className="text-[11.5px] text-ink-950/40">
                  Updated {timeAgo(p.updated)}
                </span>
              </div>

              <button
                onClick={() => navigate(`/projects/${p.id}`)}
                className={cn(
                  "mt-5 flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-[13.5px] font-medium transition-colors",
                  idx === 0
                    ? "bg-ink-950 text-white hover:bg-ink-900"
                    : "bg-canvas text-ink-950 hover:bg-line"
                )}
              >
                {idx === 0 ? "Open Repository & Launch Meeting" : "Open Repository"}
                <ArrowRight size={14} />
              </button>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full rounded-card border border-dashed border-line py-16 text-center text-[13.5px] text-ink-950/40">
              No repositories match this filter yet.
            </div>
          )}
        </div>
      </main>
    </>
  );
}
