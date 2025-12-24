import { useEffect, useState, useCallback, useMemo } from "react";
import Header from "./Header";
import TicketBoard from "./TicketBoard";
import Sidebar from "./Sidebar";
import CreateProjectModal from "./CreateProjectModal";
import { getProjects, deleteProject } from "@/api/project.api";
import { getTicketsByProject } from "@/api/ticket.api";
import { useAuth } from "../context/AuthContext";
import { customToast } from "@/lib/toastConfig";

// Define strict interfaces to match UI expectations
interface Project {
  _id: string;
  name: string;
  ticketCount?: number;
}

const STATUS_OPTIONS = ["Open", "In Progress", "Closed"];
const PRIORITY_OPTIONS = ["Low", "Medium", "High"];

const DashboardLayout = () => {
  const { user, logout } = useAuth();

  // State Management
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");

  // Memoize the selected project object
  const selectedProject = useMemo(() => 
    projects.find(p => p._id === selectedProjectId) || null
  , [projects, selectedProjectId]);

  // Fetch projects
  const loadProjects = useCallback(async () => {
    try {
      setLoadingProjects(true);
      const data = await getProjects();
      setProjects(data.projects || []);
    } catch (error) {
      console.error("Failed to load projects:", error);
      customToast.error("Could not load projects");
    } finally {
      setLoadingProjects(false);
    }
  }, []);

  // Fetch tickets when project changes
  const loadTickets = useCallback(async () => {
    if (!selectedProjectId) {
      setTickets([]);
      return;
    };
    setLoadingTickets(true);
    try {
      const data = await getTicketsByProject(selectedProjectId);
      setTickets(data.tickets || []);
    } catch (error) {
      console.error("Failed to load tickets:", error);
      setTickets([]);
    } finally {
      setLoadingTickets(false);
    }
  }, [selectedProjectId]);

  // Initial Load
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  // Load tickets when selection changes
  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  // Project Deletion Logic
  const handleDeleteProject = async (projectId: string) => {
    try {
      await deleteProject(projectId);
      customToast.success("Project deleted successfully");
      
      // If we deleted the project currently being viewed, reset the view
      if (selectedProjectId === projectId) {
        setSelectedProjectId(null);
      }
      
      // Refresh the list
      await loadProjects();
    } catch (error) {
      customToast.error("Failed to delete project");
      throw error; // Throwing so Sidebar can stop its loading state
    }
  };

  // Reset filters when project changes
  useEffect(() => {
    setSearchQuery("");
    setStatusFilter("");
    setPriorityFilter("");
  }, [selectedProjectId]);

  // Client-side filtering logic
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesSearch = !searchQuery || 
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = !statusFilter || ticket.status === statusFilter;
      const matchesPriority = !priorityFilter || ticket.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tickets, searchQuery, statusFilter, priorityFilter]);

  return (
    <div className="min-h-screen bg-slate-50/50 flex overflow-hidden">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Component */}
      <Sidebar
        projects={projects.map(p => ({
          id: p._id,
          name: p.name,
          ticketCount: p.ticketCount ?? 0,
        }))}
        selectedProjectId={selectedProjectId}
        onSelectProject={(id) => {
          setSelectedProjectId(id);
          setIsSidebarOpen(false);
        }}
        isOpen={isSidebarOpen}
        isLoading={loadingProjects}
        onCreateProject={() => setIsCreateProjectModalOpen(true)}
        onDeleteProject={handleDeleteProject}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          projectName={selectedProject?.name || null}
          userEmail={user?.email || "User"}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onLogout={logout}
        />

        <main className="flex-1 overflow-y-auto">
          <TicketBoard
            projectId={selectedProjectId}
            projectName={selectedProject?.name || null}
            tickets={filteredTickets}
            allTickets={tickets}
            loading={loadingTickets}
            onTicketUpdated={loadTickets}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            priorityFilter={priorityFilter}
            onPriorityFilterChange={setPriorityFilter}
            statusOptions={STATUS_OPTIONS}
            priorityOptions={PRIORITY_OPTIONS}
          />
        </main>
      </div>

      {/* Create Project Modal */}
      {isCreateProjectModalOpen && (
        <CreateProjectModal
          onClose={() => setIsCreateProjectModalOpen(false)}
          onCreated={() => {
            loadProjects();
            setIsCreateProjectModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default DashboardLayout;