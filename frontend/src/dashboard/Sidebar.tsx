import { useState } from "react";
import { FolderKanban, Bug, Plus, Trash2, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Project {
  id: string;
  name: string;
  ticketCount?: number;
}

interface SidebarProps {
  projects: Project[];
  selectedProjectId: string | null;
  onSelectProject: (projectId: string) => void;
  isOpen: boolean;
  isLoading?: boolean;
  onCreateProject?: () => void;
  onDeleteProject?: (projectId: string) => Promise<void>; // Updated to Promise for loading state
}

const Sidebar = ({
  projects,
  selectedProjectId,
  onSelectProject,
  isOpen,
  isLoading,
  onCreateProject,
  onDeleteProject,
}: SidebarProps) => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  // State for Delete Confirmation
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!projectToDelete || !onDeleteProject) return;
    
    setIsDeleting(true);
    try {
      await onDeleteProject(projectToDelete.id);
      setProjectToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-[280px] bg-white
          border-r border-slate-200/60
          transition-all duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          flex flex-col overflow-x-hidden
        `}
      >
        {/* Header */}
        <div className="h-20 px-6 flex items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md">
              <Bug className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-lg text-slate-800 leading-none">
                Bug Tracking
              </p>
              <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest">
                System
              </span>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pb-4">
          <div className="flex items-center justify-between px-3 mb-3 min-w-0">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Projects
            </h2>

            {isAdmin && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onCreateProject}
                className="h-7 w-7 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full"
              >
                <Plus className="w-4 h-4" />
              </Button>
            )}
          </div>

          {isLoading ? (
            <div className="space-y-3 px-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 bg-slate-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="px-4 py-8 text-center border-2 border-dashed border-slate-100 rounded-xl">
              <p className="text-sm text-slate-400">No active projects</p>
            </div>
          ) : (
            <nav className="space-y-1">
              {projects.map((project) => {
                const isSelected = selectedProjectId === project.id;

                return (
                  <div key={project.id} className="group flex items-center gap-1 pr-2">
                    <button
                      onClick={() => onSelectProject(project.id)}
                      className={`
                        flex-1 flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium min-w-0
                        transition-all
                        ${
                          isSelected
                            ? "bg-indigo-50 text-indigo-700"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }
                      `}
                    >
                      <FolderKanban className={`w-4 h-4 ${isSelected ? "text-indigo-600" : "text-slate-400"}`} />
                      <span className="flex-1 text-left truncate">{project.name}</span>
                      {project.ticketCount !== undefined && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${isSelected ? 'bg-indigo-200/50 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
                          {project.ticketCount}
                        </span>
                      )}
                    </button>

                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setProjectToDelete(project)}
                        className="opacity-0 group-hover:opacity-100 h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </nav>
          )}
        </div>
      </aside>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!projectToDelete} onOpenChange={() => !isDeleting && setProjectToDelete(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the project <span className="font-bold text-slate-900">"{projectToDelete?.name}"</span> and all associated tickets. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDeleteConfirm();
              }}
              className="bg-red-600 hover:bg-red-700 rounded-xl"
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
              Delete Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Sidebar;