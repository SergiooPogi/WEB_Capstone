import { BrowserRouter, Routes, Route } from "react-router";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ScrollToTop } from "./components/ScrollToTop";
import { Root } from "./Root";
import { Home } from "./pages/Home";
import { QAChat } from "./pages/QAChat";
import { ARNavigation } from "./pages/ARNavigation";
import { EnrollmentGuide } from "./pages/EnrollmentGuide";
import { CampusMap } from "./pages/CampusMap";
import { Login } from "./pages/Login";
import { SignUp } from "./pages/SignUp";
import { AdminDashboard } from "./pages/AdminDashboard";
import { RegistrarDashboard } from "./pages/RegistrarDashboard";
import { HSEnrollmentForm } from "./pages/HSEnrollmentForm";
import { MyEnrollments } from "./pages/MyEnrollments";
import { EnrollmentDetail } from "./pages/EnrollmentDetail";
import { AdminEnrollments } from "./pages/AdminEnrollments";
import { LevelSelection } from "./pages/LevelSelection";
import { StudentDashboard } from "./pages/StudentDashboard";
import { SectionManagement } from "./pages/SectionManagement";
import { ResubmitPage } from "./pages/ResubmitPage";
import { VerifyEmailPage } from "./pages/VerifyEmailPage";
import { TeacherDashboard } from "./pages/TeacherDashboard";
import { Toaster } from "sonner";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Toaster richColors position="top-right" />
        <Routes>
          {/* Pages with Navbar + Footer layout */}
          <Route element={<Root />}>
            <Route index element={<Home />} />
            <Route path="qa" element={<QAChat />} />
            <Route path="ar-navigation" element={<ARNavigation />} />
            <Route path="enrollment-guide" element={<EnrollmentGuide />} />
            <Route path="campus-map" element={<CampusMap />} />
            <Route
              path="enroll"
              element={
                <ProtectedRoute>
                  <LevelSelection />
                </ProtectedRoute>
              }
            />
            <Route
              path="hs-enrollment-form"
              element={
                <ProtectedRoute>
                  <HSEnrollmentForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="hs-enrollment-form/:id"
              element={
                <ProtectedRoute>
                  <HSEnrollmentForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="my-enrollments"
              element={
                <ProtectedRoute>
                  <MyEnrollments />
                </ProtectedRoute>
              }
            />
            <Route
              path="resubmit/:id"
              element={
                <ProtectedRoute>
                  <ResubmitPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="student-dashboard/:id"
              element={
                <ProtectedRoute>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Standalone pages without layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/registrar"
            element={
              <ProtectedRoute>
                <RegistrarDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/registrar/enrollment/:id"
            element={
              <ProtectedRoute>
                <RegistrarDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher"
            element={
              <ProtectedRoute>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/enrollments"
            element={
              <ProtectedRoute requireAdmin>
                <AdminEnrollments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/sections"
            element={
              <ProtectedRoute requireAdmin>
                <SectionManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/enrollment/:id"
            element={
              <ProtectedRoute>
                <EnrollmentDetail />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
