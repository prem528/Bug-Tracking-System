import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createProject } from "@/api/project.api";
import { customToast } from "@/lib/toastConfig";
import { FolderPlus, Loader2 } from "lucide-react";

interface CreateProjectModalProps {
  onClose: () => void;
  onCreated?: () => void;
}

const CreateProjectModal = ({
  onClose,
  onCreated,
}: CreateProjectModalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      customToast.error("Project name is required");
      return;
    }

    setLoading(true);
    try {
      await createProject({
        name,
        description,
      });

      customToast.success("Project created successfully");
      onCreated?.();
      onClose();
    } catch {
      customToast.error("Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md bg-white rounded-lg border-none shadow-2xl p-0 overflow-hidden">
        
        {/* Header */}
        <div className="bg-indigo-500 p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg">
              <FolderPlus className="w-5 h-5 text-white" />
            </div>
            <AlertDialogTitle className="text-xl font-bold">
              Create New Project
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-indigo-100 text-sm">
            Create a project to organize and track related tickets.
          </AlertDialogDescription>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Project Name */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold uppercase tracking-wider text-slate-400 ml-1">
              Project Name
            </label>
            <Input
              placeholder="e.g., Android App"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded border-slate-300 bg-slate-50/50 focus-visible:ring-indigo-200"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold uppercase tracking-wider text-slate-400 ml-1">
              Description
            </label>
            <Textarea
              placeholder="Short description of the project"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded border-slate-300 bg-slate-50/50 min-h-[90px] resize-none focus-visible:ring-indigo-200"
            />
          </div>
        </div>

        {/* Footer */}
        <AlertDialogFooter className="p-6 bg-slate-50 flex items-center sm:justify-between gap-3">
          <AlertDialogCancel
            disabled={loading}
            className="rounded border border-slate-300 bg-transparent hover:bg-slate-200 text-slate-600 font-semibold"
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleCreate}
            disabled={loading}
            className="rounded bg-indigo-500 hover:bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-100 min-w-[140px]"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Create Project"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CreateProjectModal;
