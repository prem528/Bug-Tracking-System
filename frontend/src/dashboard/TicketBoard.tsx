import { Inbox, Plus, Filter, Search, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import TicketUpdateModal from "./TicketUpdateModal";
import CreateTicketModal from "./CreateTicketModal";

interface Ticket {
  _id: string;
  title: string;
  status: string;
  priority: string;
  assignedTo?: {
    name?: string;
  } | null;
}

interface TicketBoardProps {
  projectId: string | null;
  projectName: string | null;
  tickets: Ticket[];
  allTickets: Ticket[];
  loading: boolean;
  onTicketUpdated?: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  priorityFilter: string;
  onPriorityFilterChange: (priority: string) => void;
  statusOptions: string[];
  priorityOptions: string[];
}

const TicketBoard = ({
  projectId,
  tickets,
  loading,
  onTicketUpdated,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  statusOptions,
  priorityOptions,
}: TicketBoardProps) => {
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  const hasActiveFilters = statusFilter || priorityFilter || searchQuery;

  const clearFilters = () => {
    onSearchChange("");
    onStatusFilterChange("");
    onPriorityFilterChange("");
  };

  if (!projectId) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center bg-slate-50/50">
        <div className="text-center">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-4">
            <Inbox className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-slate-900 font-semibold">No Project Selected</h3>
          <p className="text-sm text-slate-500 max-w-[200px] mx-auto mt-1">
            Select a project from the sidebar to manage your tickets.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 p-4 lg:p-8 bg-slate-50/50  ">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header & Controls */}
          <div className="flex flex-col gap-4 ">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">Tickets</h2>
                </div>
                <p className="text-lg text-slate-500 font-medium">
                  {loading ? "Loading..." : `${tickets.length} total tickets`}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative group">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <Input
                    className="pl-9 bg-white border-slate-400 w-full sm:w-[240px] rounded-xl focus-visible:ring-indigo-100 focus-visible:border-indigo-300"
                    placeholder="Search tickets..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                  />
                </div>
                <Button
                  variant="outline"
                  className={`rounded-xl border-slate-400 transition-all ${showFilters ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white'}`}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
                <Button 
                  onClick={() => setShowCreateModal(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-100"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  New Ticket
                </Button>
              </div>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="bg-white p-4 rounded-2xl border border-slate-300 shadow-sm flex flex-wrap gap-4 items-center animate-in fade-in slide-in-from-top-2">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => onStatusFilterChange(e.target.value)}
                    className="block w-40 rounded-lg border-slate-200 text-sm focus:ring-indigo-600 focus:border-indigo-600"
                  >
                    <option value="">All Status</option>
                    {statusOptions.map((status: string) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">Priority</label>
                  <select
                    value={priorityFilter}
                    onChange={(e) => onPriorityFilterChange(e.target.value)}
                    className="block w-40 rounded-lg border-slate-200 text-sm focus:ring-indigo-600 focus:border-indigo-600"
                  >
                    <option value="">All Priority</option>
                    {priorityOptions.map((priority: string) => (
                      <option key={priority} value={priority}>{priority}</option>
                    ))}
                  </select>
                </div>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="mt-5 text-slate-400 hover:text-red-500">
                    <X className="w-3 h-3 mr-1" /> Clear
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Ticket List */}
          <div className="space-y-3">
            {loading ? (
              [1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white p-5 rounded-2xl border border-slate-300 animate-pulse flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div className="space-y-2 flex-1">
                    {/* Title skeleton */}
                    <div className="h-5 bg-slate-200 rounded-md w-3/4" />
                    {/* Badges and info skeleton */}
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="h-5 bg-slate-200 rounded-md w-16" />
                      <div className="h-5 bg-slate-200 rounded-md w-20" />
                      <div className="h-4 bg-slate-200 rounded-md w-24 ml-2" />
                    </div>
                  </div>
                  {/* Button skeleton */}
                  <div className="h-10 bg-slate-200 rounded-xl w-32" />
                </div>
              ))
            ) : tickets.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                <p className="text-slate-400 font-medium">No tickets found for this project.</p>
              </div>
            ) : (
              tickets.map((ticket: Ticket) => (
                <div
                  key={ticket._id}
                  className="group bg-white p-5 rounded-2xl border border-slate-300 hover:border-indigo-200 hover:shadow-md hover:bg-gray-100 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div className="space-y-2">
                    <h4 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors leading-none">
                      {ticket.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider
                        ${ticket.priority === 'High' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                        {ticket.priority}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600">
                        {ticket.status}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1 ml-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                        {ticket.assignedTo?.name || "Unassigned"}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={() => setSelectedTicket(ticket)}
                    className="rounded-xl bg-indigo-500 hover:bg-indigo-600 cursor-pointer"
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit Ticket
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {showCreateModal && projectId && (
        <CreateTicketModal 
          projectId={projectId} 
          onClose={() => setShowCreateModal(false)} 
          onCreated={onTicketUpdated} 
        />
      )}
      {selectedTicket && (
        <TicketUpdateModal 
          ticket={selectedTicket} 
          onClose={() => setSelectedTicket(null)} 
          onTicketUpdated={onTicketUpdated} 
        />
      )}
    </>
  );
};

export default TicketBoard;