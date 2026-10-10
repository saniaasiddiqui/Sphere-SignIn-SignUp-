import { NavLink, useNavigate, useParams } from "react-router-dom";
import {
  LayoutGrid,
  Video,
  FolderKanban,
  LineChart,
  FileStack,
  Settings,
} from "lucide-react";
import { useProjects } from "../context/ProjectsContext";
import { cn } from "../lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", to: "/", icon: LayoutGrid },
  { label: "Meetings", to: "/meetings", icon: Video },
  { label: "Projects / Repositories", to: "/projects", icon: FolderKanban },
  { label: "Insights", to: "/insights", icon: LineChart },
  { label: "Documents / Outputs", to: "/documents", icon: FileStack },
];

const dotColor = {
  active: "bg-ink-950",
  discovery: "bg-ink-950/25",
  review: "bg-indigo-500",
  rfc: "bg-ink-950",
  new: "bg-indigo-500",
};

export default function Sidebar() {
  const { projects } = useProjects();
  const navigate = useNavigate();
  const { id: activeId } = useParams();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-[280px] flex-col border-r border-line bg-white">
      <div className="flex items-center gap-2 px-6 pt-7 pb-6">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink-950 text-[13px] text-white">
          ✧
        </span>
        <span className="text-[18px] font-bold tracking-tight text-ink-950">
          SPHERE
        </span>
      </div>

      <nav className="flex flex-col gap-0.5 px-4">
        {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={label}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14.5px] transition-colors",
                isActive
                  ? "bg-ink-950 text-white font-medium"
                  : "text-ink-950/70 hover:bg-canvas hover:text-ink-950"
              )
            }
          >
            <Icon size={17} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-7 flex-1 overflow-y-auto px-6">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[11px] font-semibold tracking-wide text-ink-950/45">
            YOUR PROJECTS
          </span>
          <button
            onClick={() => navigate("/projects")}
            aria-label="Browse all projects"
            className="grid h-5 w-5 place-items-center rounded text-ink-950/40 hover:bg-canvas hover:text-ink-950"
          >
            +
          </button>
        </div>
        <ul className="flex flex-col gap-0.5 pb-6">
          {projects.map((p) => (
            <li key={p.id}>
              <button
                onClick={() => navigate(`/projects/${p.id}`)}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-[13.5px] transition-colors",
                  activeId === p.id
                    ? "bg-canvas text-ink-950 font-medium"
                    : "text-ink-950/70 hover:bg-canvas"
                )}
              >
                <span className="truncate">{p.name}</span>
                <span className="flex shrink-0 items-center gap-1.5">
                  {p.isNew && (
                    <span className="rounded-pill bg-indigo-50 px-1.5 py-[1px] text-[10px] font-semibold text-indigo-600">
                      New
                    </span>
                  )}
                  <span
                    className={cn(
                      "h-[7px] w-[7px] rounded-full",
                      dotColor[p.statusTone] || "bg-ink-950/30"
                    )}
                  />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center gap-2.5 border-t border-line px-5 py-4">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-indigo-100 text-[13px] font-semibold text-indigo-600">
          A
        </span>
        <div className="min-w-0 leading-tight">
          <p className="truncate text-[13.5px] font-semibold text-ink-950">
            Ayesha
          </p>
          <p className="truncate text-[12px] text-ink-950/45">
            Workspace Admin
          </p>
        </div>
        <button
          aria-label="Settings"
          className="ml-auto grid h-7 w-7 shrink-0 place-items-center rounded-md text-ink-950/40 hover:bg-canvas hover:text-ink-950"
        >
          <Settings size={16} />
        </button>
      </div>
    </aside>
  );
}
