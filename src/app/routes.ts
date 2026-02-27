import { createBrowserRouter } from "react-router";
import { Root } from "./Root";
import { Home } from "./pages/Home";
import { FileComplaint } from "./pages/FileComplaint";
import { TrackCase } from "./pages/TrackCase";
import { About } from "./pages/About";
import { AdminLogin } from "./pages/AdminLogin";
import { AdminDashboard } from "./pages/AdminDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "complaint", Component: FileComplaint },
      { path: "track", Component: TrackCase },
      { path: "about", Component: About },
    ],
  },
  {
    path: "/admin",
    Component: AdminLogin,
  },
  {
    path: "/admin/dashboard",
    Component: AdminDashboard,
  },
]);
