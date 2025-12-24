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
import { updateTicket } from "@/api/ticket.api";
import { getUsers } from "@/api/user.api";
import { customToast } from "@/lib/toastConfig";
import { Loader2, Pencil, User2, BarChart3, CheckCircle2 } from "lucide-react";

const PRIORITY_OPTIONS = ["Low", "Medium", "High"];
const STATUS_OPTIONS = ["Open", "In Progress", "Closed"];

interface User {
  _id: string;
  name: string;
  email: string;
}

interface TicketUpdateModalProps {
  ticket: any;
  onClose: () => void;
  onTicketUpdated?: () => void;
}

const TicketUpdateModal = ({
  ticket,
  onClose,
  onTicketUpdated,
}: TicketUpdateModalProps) => {
  const [title, setTitle] = useState(ticket?.title || "");
  const [description, setDescription] = useState(ticket?.description || "");
  const [priority, setPriority] = useState(ticket?.priority || "Medium");
  const [status, setStatus] = useState(ticket?.status || "Open");
  const [assignedTo, setAssignedTo] = useState(ticket?.assignedTo?._id || "");
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

  const handleUpdate = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      customToast.error("Title is required");
      return;
    }

    setLoading(true);
    try {
      await updateTicket(ticket._id, {
        title,
        description,
        priority,
        status,
        assignedTo,
      });

      customToast.success("Ticket updated successfully");
      onTicketUpdated?.();
      onClose();
    } catch {
      customToast.error("Failed to update ticket");
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
              <Pencil className="w-5 h-5 text-white" />
            </div>
            <AlertDialogTitle className="text-xl font-bold tracking-tight">
              Update Ticket
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-blue-50 text-sm">
            Modify ticket details, change priority, or update status.
          </AlertDialogDescription>
        </div>

        <div className="p-6 space-y-5">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold uppercase tracking-wider text-slate-400 ml-1">
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
              placeholder="Detailed explanation..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded border-slate-300 focus-visible:ring-indigo-200 bg-slate-50/50 min-h-[80px] resize-none"
            />
          </div>

          <div className="space-y-4">
            {/* Status Section (New) */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3" /> Status
              </label>
              <div className="flex gap-2">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setStatus(opt)}
                    className={`flex-1 py-2 text-xs font-bold rounded border transition-all ${
                      status === opt
                        ? "bg-indigo-50 border-indigo-400 text-indigo-600 shadow-sm"
                        : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
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
        </div>

        <AlertDialogFooter className="p-6 bg-slate-50 flex items-center sm:justify-between gap-3">
          <AlertDialogCancel 
            disabled={loading}
            className="rounded border border-gray-500 bg-transparent hover:bg-slate-200 text-slate-500 font-semibold"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleUpdate}
            disabled={loading}
            className="rounded bg-indigo-400 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-100 min-w-[140px]"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Save Changes"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TicketUpdateModal;