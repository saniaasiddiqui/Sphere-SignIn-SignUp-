import { useState } from "react";
import Login from "./pages/login";
import Signup from "./pages/signup";
import { Routes, Route, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import ProjectsList from "./pages/ProjectsList";
import ProjectDetail from "./pages/ProjectDetail";
import InitiateMeetingModal from "./components/modals/InitiateMeetingModal";
import CreateProjectModal from "./components/modals/CreateProjectModal";
import SendBotModal from "./components/modals/SendBotModal";
import { ProjectsProvider, useProjects } from "./context/ProjectsContext";

function Placeholder({ title }) {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-8 text-center">
      <h1 className="text-[22px] font-bold text-ink-950">{title}</h1>
      <p className="mt-2 max-w-sm text-[13.5px] text-ink-950/50">
        This area isn't part of the current flow yet — start from the
        Dashboard to create or open a project repository.
      </p>
    </main>
  );
}

function AppShell() {
  const [initiateOpen, setInitiateOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [sendBotOpen, setSendBotOpen] = useState(false);
  const [botProject, setBotProject] = useState(null);
  const { createProject, launchMeeting } = useProjects();
  const navigate = useNavigate();

  function openInitiate() {
    setInitiateOpen(true);
  }

  function handleCreateNew() {
    setInitiateOpen(false);
    setCreateOpen(true);
  }

  function handleOpenExisting() {
    setInitiateOpen(false);
    navigate("/projects");
  }

  function handleCreateSubmit(form) {
    const project = createProject(form);
    setCreateOpen(false);
    setBotProject(project);
    setSendBotOpen(true);
    navigate(`/projects/${project.id}`);
  }

  function handleMeetingLaunched(projectId, meetingUrl) {
    launchMeeting(projectId, meetingUrl);
  }

  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar />
      <div className="pl-[280px]">
        <Routes>
          <Route path="/" element={<Dashboard onInitiateMeeting={openInitiate} />} />
          <Route path="/projects" element={<ProjectsList onCreateNew={handleCreateNew} />} />
          <Route
            path="/projects/:id"
            element={
              <ProjectDetail
                onLaunchMeeting={(project) => {
                  setBotProject(project);
                  setSendBotOpen(true);
                }}
              />
            }
          />
          <Route path="/meetings" element={<Placeholder title="Meetings" />} />
          <Route path="/insights" element={<Placeholder title="Insights" />} />
          <Route path="/documents" element={<Placeholder title="Documents / Outputs" />} />
        </Routes>
      </div>

      <InitiateMeetingModal
        open={initiateOpen}
        onClose={() => setInitiateOpen(false)}
        onCreateNew={handleCreateNew}
        onOpenExisting={handleOpenExisting}
      />

      <CreateProjectModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreateSubmit}
      />

      <SendBotModal
        open={sendBotOpen}
        onClose={() => setSendBotOpen(false)}
        project={botProject}
        onMeetingLaunched={handleMeetingLaunched}
      />
    </div>
  );
}

export default function App() {
  return (
    <ProjectsProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} /> {/* 👈 Yeh route add kar diya gaya hai */}
        <Route path="/*" element={<AppShell />} />
      </Routes>
    </ProjectsProvider>
  );
}