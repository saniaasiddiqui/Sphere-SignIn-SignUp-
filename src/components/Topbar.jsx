import { Search, Plus, User } from "lucide-react";

export default function Topbar({ onNewStage, crumbs }) {
  return (
    <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-line bg-white/90 px-8 py-4 backdrop-blur">
      <div className="relative w-full max-w-md">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-950/35"
        />
        <input
          type="text"
          placeholder="Search workspace, files, meetings..."
          className="w-full rounded-lg border border-line bg-canvas py-2 pl-9 pr-3 text-[13.5px] text-ink-950 placeholder:text-ink-950/40 focus:border-indigo-500 focus:bg-white focus:outline-none"
        />
      </div>

      {crumbs && (
        <p className="hidden truncate text-[12.5px] text-ink-950/40 md:block">
          {crumbs}
        </p>
      )}

      <div className="ml-auto flex shrink-0 items-center gap-3">
        <button
          onClick={onNewStage}
          className="flex items-center gap-1.5 rounded-lg bg-ink-950 px-3.5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-ink-900"
        >
          <Plus size={15} />
          New Stage
        </button>
        <span className="grid h-9 w-9 place-items-center rounded-full bg-ink-950 text-white">
          <User size={16} />
        </span>
      </div>
    </header>
  );
}
