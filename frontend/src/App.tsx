import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./auth/Loginpage";
import RegisterPage from "./auth/RegisterPage";
import ScrollToTop from "./pages/ScrollToTop";
import Dashboard from "./pages/Dashboard";
import { Toaster } from "sonner";

function App() {
  return (
    <>
    <Toaster
        position="top-center"
        toastOptions={{ className: "toast-animated toast-hover" }}
      />

    <AuthProvider>
      <Router>
        <ScrollToTop/>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />



          {/* Protected Routes */}
          <Route  
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </Router>
    </AuthProvider>
    </>
  );
}

export default App;
