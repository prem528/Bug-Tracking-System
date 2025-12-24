import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import RegisterForm from "./components/RegisterForm";
  import { Link } from "react-router-dom";
  
  const RegisterPage = () => {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
        <main className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
          
          {/* Left Illustration Container */}
          <div className="hidden md:flex items-center justify-center">
            <div className="relative w-full max-w-md h-full flex items-center justify-center rounded-2xl bg-white shadow p-6">
              
            
              
  
              <img
                src="/registerbg.avif"
                alt="Create account"
                className="relative z-10 w-full max-w-sm rounded-xl object-contain"
                loading="lazy"
              />
            </div>
          </div>
  
          {/* Right Card */}
          <div className="flex items-center justify-center">
            <Card className="w-full max-w-md rounded-2xl border border-gray-200 bg-white shadow-lg">
              
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-semibold text-slate-700">
                  Create Account
                </CardTitle>
                <CardDescription className="text-sm mt-2 text-slate-500">
                  Register to start tracking and managing bugs
                </CardDescription>
              </CardHeader>
  
              <CardContent>
                <RegisterForm />
              </CardContent>
  
              <CardFooter className="justify-center">
                <p className="text-sm text-slate-500">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-blue-600 hover:underline"
                  >
                    Login
                  </Link>
                </p>
              </CardFooter>
  
            </Card>
          </div>
        </main>
      </div>
    );
  };
  
  export default RegisterPage;
  