import { Routes, Route } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import Home from "./pages/app/Home";
import Library from "./pages/app/Library";
import ProjectDetail from "./pages/app/ProjectDetail";
import Strategic from "./pages/app/Strategic";
import Gantt from "./pages/app/Gantt";
import Galaxy from "./pages/app/Galaxy";
import VPPortal from "./pages/VPPortal";

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/library" element={<Library />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/strategic" element={<Strategic />} />
        <Route path="/gantt" element={<Gantt />} />
        <Route path="/galaxy" element={<Galaxy />} />
        <Route path="*" element={<Home />} />
        <Route path="/vp-portal" element={<VPPortal />} />
      </Routes>
    </AppShell>
  );
}
