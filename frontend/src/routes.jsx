import { createBrowserRouter } from "react-router";
import { Root } from "./Root";
import { Home } from "./pages/Home";
import { QAChat } from "./pages/QAChat";
import { EnrollmentGuide } from "./pages/EnrollmentGuide";
import { CampusMap } from "./pages/CampusMap";
import { Login } from "./pages/Login";
import { SignUp } from "./pages/SignUp";
import { AdminDashboard } from "./pages/AdminDashboard";
import { RegistrarDashboard } from "./pages/RegistrarDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "qa", Component: QAChat },
      { path: "enrollment-guide", Component: EnrollmentGuide },
      { path: "campus-map", Component: CampusMap },
    ],
  },
  // Standalone pages without Root layout
  { path: "/login", Component: Login },
  { path: "/signup", Component: SignUp },
  { path: "/admin", Component: AdminDashboard },
  { path: "/registrar", Component: RegistrarDashboard },
]);