import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginForm from "./components/LoginForm";

const LoginPage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden py-6 sm:py-8 lg:py-12 bg-slate-50">
      {/* Main Container */}
      <div className="relative z-10 w-full max-w-7xl mx-4 sm:mx-6 lg:mx-8 rounded-2xl bg-white shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">

          {/* LEFT — Illustration / Branding */}
          <div className="relative flex items-center justify-center bg-linear-to-br from-blue-500 via-sky-500 to-cyan-500 p-8 lg:p-12">
            <div className="absolute inset-0">
              <div className="absolute -top-24 -left-24 h-80 w-80 bg-white/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-0 h-64 w-64 bg-cyan-100/30 rounded-full blur-2xl" />
            </div>

            <div className="relative text-center text-white">
              <img
                src="/loginbg.avif"
                alt="Bug Tracking Illustration"
                className="max-w-sm mx-auto drop-shadow-xl"
                loading="lazy"
              />

              <p className="mt-6 text-sm opacity-90 max-w-md mx-auto">
                Track bugs, assign tasks, and manage projects efficiently —
                your team’s workflow, simplified.
              </p>
            </div>
          </div>

          {/* RIGHT — Login Form */}
          <div className="flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-10">
            <div className="max-w-sm w-full mx-auto">
              <h1 className="text-3xl font-semibold  text-slate-700">
                Sign in to Bug Tracker
              </h1>
              <p className="text-sm text-slate-500 mt-2">
                Enter your credentials to continue
              </p>

              {/* Login Form */}
              <div className="mt-8">
                <LoginForm />
              </div>

              {/* Register Link */}
              <div className="mt-6 text-sm text-center">
                <span className="text-slate-500">
                  Don’t have an account?
                </span>{" "}
                <Link
                  to="/register"
                  className="font-medium text-blue-600 hover:underline"
                >
                  Create account
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Decorative Wave Background */}
      <div className="absolute bottom-0 left-0 w-full z-0">
        <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="#dbeafe"
            fillOpacity="1"
            d="M0,320L40,288C80,256,160,192,240,170.7C320,149,400,171,480,186.7C560,203,640,213,720,197.3C800,181,880,139,960,144C1040,149,1120,203,1200,208C1280,213,1360,171,1400,149.3L1440,128L1440,320L0,320Z"
          />
        </svg>
      </div>
    </div>
  );
};

export default LoginPage;
