import { createContext, useContext, useMemo, useState, useCallback } from "react";
import { initialProjects } from "../data/seed";
import { slugify } from "../lib/utils";

const ProjectsContext = createContext(null);

export function ProjectsProvider({ children }) {
  const [projects, setProjects] = useState(initialProjects);

  const createProject = useCallback((form) => {
    const id = slugify(form.name) || `project-${Date.now()}`;
    const project = {
      id,
      name: form.name,
      repoPath: form.repoUrl
        ? form.repoUrl.replace(/^https?:\/\//, "").replace(/\.git$/, "")
        : `${id}/staging`,
      description: form.scope,
      statusLabel: "Initialized",
      statusTone: "new",
      stats: { synthesized: 0, staged: 0, syncHealth: "—" },
      avatars: ["A"],
      extraAvatars: 0,
      updated: new Date().toISOString(),
      featured: false,
      initialized: false, // no meetings yet -> empty state
      isNew: true,
      tabsCount: { meetings: 0, prs: 0, schemas: 0, tickets: 0 },
      meetingsProcessed: 0,
      syncHealth: 0,
      actionItems: 0,
      lastActivity: null,
      recentMeetings: [],
      topology: { linked: 0, nodes: [] },
      connection: form.connection,
    };
    setProjects((prev) => [project, ...prev]);
    return project;
  }, []);

  const launchMeeting = useCallback((projectId, meetingUrl) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const newMeeting = {
          id: `m-${Date.now()}`,
          date: "Just now",
          duration: "In progress",
          title: "Live Synthesis Session",
          summary: `Sphere joined ${meetingUrl} as a silent participant and is building the contextual graph.`,
          participants: 1,
          avatars: ["A"],
          extraAvatars: 0,
          verified: false,
        };
        return {
          ...p,
          initialized: true,
          isNew: false,
          meetingsProcessed: p.meetingsProcessed + 1,
          tabsCount: { ...p.tabsCount, meetings: p.tabsCount.meetings + 1 },
          lastActivity: { time: "just now", by: "Ayesha", via: "Live Meeting" },
          recentMeetings: [newMeeting, ...p.recentMeetings],
        };
      })
    );
  }, []);

  const getProject = useCallback(
    (id) => projects.find((p) => p.id === id),
    [projects]
  );

  const value = useMemo(
    () => ({ projects, createProject, launchMeeting, getProject }),
    [projects, createProject, launchMeeting, getProject]
  );

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const ctx = useContext(ProjectsContext);
  if (!ctx) throw new Error("useProjects must be used within ProjectsProvider");
  return ctx;
}
