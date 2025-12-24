import { Menu, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  projectName: string | null;
  userEmail: string;
  userAvatar?: string;
  onToggleSidebar: () => void;
  onLogout: () => void;
}

const Header = ({
  projectName,
  userEmail,
  userAvatar,
  onToggleSidebar,
  onLogout,
}: HeaderProps) => {
  const userName =
    userEmail?.split("@")[0]?.replace(".", " ") || "User";

  const initials =
    userName
      .split(" ")
      .map((c) => c[0]?.toUpperCase())
      .join("")
      .slice(0, 2);

  return (
    <header className="h-20 bg-white border-b border-slate-300 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30">
      
      {/* Left: Project Context */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-slate-600"
          onClick={onToggleSidebar}
        >
          <Menu className="w-5 h-5" />
        </Button>

        <div>
          <p className="text-[11px] font-semibold text-indigo-600 uppercase tracking-widest">
            Current Project
          </p>
          <h1 className="text-xl font-semibold text-slate-700">
            {projectName || "Overview"}
          </h1>
        </div>
      </div>

      {/* Right: User Info + Logout */}
      <div className="flex items-center gap-6">
        
        {/* User */}
        <div className="flex items-center gap-3">
          <Avatar className="w-9 h-9 ring-2 ring-slate-300">
            <AvatarImage src={userAvatar} />
            <AvatarFallback className="bg-slate-200 text-slate-700 font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="hidden sm:flex flex-col leading-tight">
            <span className="text-sm font-semibold text-slate-800 capitalize">
              {userName}
            </span>
            <span className="text-xs text-slate-500">
              {userEmail}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-slate-300 hidden sm:block" />

        {/* Logout */}
        <Button
          variant="ghost"
          onClick={onLogout}
          className="flex items-center gap-2 text-red-600 hover:text-red-600 hover:bg-red-100 border border-red-300"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;
