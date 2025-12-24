import { useEffect, useState } from "react";
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
import { createTicket } from "@/api/ticket.api";
import { getUsers } from "@/api/user.api";
import { customToast } from "@/lib/toastConfig";
import { Loader2, Plus, User2, BarChart3 } from "lucide-react";

const PRIORITY_OPTIONS = ["Low", "Medium", "High"];

interface User {
  _id: string;
  name: string;
  email: string;
}

interface CreateTicketModalProps {
  projectId: string;
  onClose: () => void;
  onCreated?: () => void;
}

const CreateTicketModal = ({
  projectId,
  onClose,
  onCreated,
}: CreateTicketModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [assignedTo, setAssignedTo] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch {
        customToast.error("Failed to load users");
      }
    };
    fetchUsers();
  }, []);

  const handleCreate = async (e: React.MouseEvent) => {
    // Prevent AlertDialog from closing automatically if validation fails
    e.preventDefault();

    if (!title.trim()) {
      customToast.error("Title is required");
      return;
    }

    if (!assignedTo) {
      customToast.error("Please assign the ticket to a user");
      return;
    }

    setLoading(true);
    try {
      await createTicket({
        title,
        description,
        priority,
        project: projectId,
        assignedTo,
      });

      customToast.success("Ticket created successfully");
      onCreated?.();
      onClose();
    } catch {
      customToast.error("Failed to create ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md bg-white rounded-lg border-none shadow-2xl p-0 overflow-hidden">
        {/* Decorative Header Area */}
        <div className="bg-blue-400 p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <AlertDialogTitle className="text-xl font-bold tracking-tight">
              Create New Ticket
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-indigo-100 text-sm">
            Identify the issue and assign it to a team member to start tracking.
          </AlertDialogDescription>
        </div>

        <div className="p-6 space-y-5">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-b uppercase tracking-wider text-slate-400 ml-1">
              Ticket Title
            </label>
            <Input
              placeholder="e.g., Fix navigation lag on mobile"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded border-slate-300 focus-visible:ring-indigo-200 bg-slate-50/50"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold uppercase tracking-wider text-slate-400 ml-1">
              Description
            </label>
            <Textarea
              placeholder="What's the issue exactly?..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded border-slate-300 focus-visible:ring-indigo-200 bg-slate-50/50 min-h-[100px] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Priority */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1 flex items-center gap-1.5">
                <BarChart3 className="w-3 h-3" /> Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full rounded border border-slate-400 bg-slate-50/50 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-600 transition-all cursor-pointer"
              >
                {PRIORITY_OPTIONS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Assignment */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1 flex items-center gap-1.5">
                <User2 className="w-3 h-3" /> Assign To
              </label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full rounded border border-slate-400 bg-slate-50/50 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-600 transition-all cursor-pointer"
              >
                <option value="">Select User</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <AlertDialogFooter className="p-6 bg-slate-50 flex items-center sm:justify-between gap-3">
          <AlertDialogCancel 
            disabled={loading}
            className="rounded border border-gray-500 bg-transparent hover:bg-slate-200 text-slate-500 font-semibold"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCreate}
            disabled={loading}
            className="rounded bg-indigo-400 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-100 min-w-[140px]"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Create Ticket"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CreateTicketModal;