import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/providers/theme-provider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { AuthLayoutSkeleton } from "@/components/AuthLayoutSkeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  GraduationCap,
  LayoutDashboard,
  Target,
  GitBranch,
  Award,
  BookOpen,
  ClipboardList,
  Users,
  BarChart3,
  FileText,
  Settings,
  UserCircle,
  LogOut,
  Moon,
  Sun,
  Bell,
  Menu,
  ChevronLeft,
  School,
  StickyNote,
} from "lucide-react";

const sidebarItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/course-outcomes", label: "Course Outcomes", icon: Target },
  { path: "/co-po-mapping", label: "CO-PO Mapping", icon: GitBranch },
  { path: "/assessments", label: "Assessment", icon: ClipboardList },
  { path: "/students", label: "Students", icon: Users },
  { path: "/attainment", label: "Attainment", icon: BarChart3 },
  { path: "/reports", label: "Reports", icon: FileText },
];

const managementItems = [
  { path: "/program-outcomes", label: "Program Outcomes", icon: Award },
  { path: "/pso-management", label: "PSO Management", icon: School },
  { path: "/question-bank", label: "Question Bank", icon: BookOpen },
  { path: "/surveys", label: "Surveys", icon: StickyNote },
];

const bottomItems = [
  { path: "/settings", label: "Settings", icon: Settings },
  { path: "/profile", label: "Profile", icon: UserCircle },
];

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoading, logout } = useAuth({ redirectOnUnauthenticated: true });
  const { setTheme, resolvedTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const isActive = (path: string) => location.pathname === path;

  // Filter sidebar items according to user role
  const filteredSidebarItems = sidebarItems.filter((item) => {
    if (!user) return false;
    if (user.role === "student") {
      return ["/dashboard", "/course-outcomes", "/assessments", "/attainment", "/reports"].includes(item.path);
    }
    if (user.role === "faculty") {
      return ["/dashboard", "/course-outcomes", "/co-po-mapping", "/assessments", "/attainment", "/reports"].includes(item.path);
    }
    return true; // admin, hod, super_admin get all
  });

  const filteredManagementItems = managementItems.filter((item) => {
    if (!user) return false;
    if (user.role === "student") {
      return ["/surveys"].includes(item.path);
    }
    if (user.role === "faculty") {
      return ["/question-bank", "/surveys"].includes(item.path);
    }
    return true; // admin, hod, super_admin get all
  });

  if (isLoading) {
    return <AuthLayoutSkeleton />;
  }

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] dark:bg-background overflow-hidden">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } fixed lg:relative z-50 h-full bg-[#0B1F4D] text-white flex flex-col transition-all duration-300 ease-in-out shadow-2xl shadow-[#0B1F4D]/20`}
      >
        {/* Logo Area */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-lg bg-[#F4B942] flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-5 h-5 text-[#0B1F4D]" />
            </div>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                sidebarOpen ? "w-auto opacity-100" : "w-0 opacity-0"
              }`}
            >
              <span className="font-bold text-sm whitespace-nowrap">OBE System</span>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex w-6 h-6 items-center justify-center rounded-md hover:bg-white/10 transition-colors"
          >
            <ChevronLeft
              className={`w-4 h-4 transition-transform duration-300 ${
                sidebarOpen ? "" : "rotate-180"
              }`}
            />
          </button>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-4">
          <TooltipProvider delayDuration={0}>
            <nav className="space-y-1 px-3">
              {filteredSidebarItems.map((item) => (
                <Tooltip key={item.path}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => {
                        navigate(item.path);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive(item.path)
                          ? "bg-[#F4B942] text-[#0B1F4D] shadow-lg shadow-[#F4B942]/25"
                          : "text-blue-100/70 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
                      <span
                        className={`whitespace-nowrap transition-all duration-300 ${
                          sidebarOpen ? "opacity-100 w-auto" : "opacity-0 w-0"
                        }`}
                      >
                        {item.label}
                      </span>
                    </button>
                  </TooltipTrigger>
                  {!sidebarOpen && (
                    <TooltipContent side="right" className="bg-[#0B1F4D] border-white/10">
                      {item.label}
                    </TooltipContent>
                  )}
                </Tooltip>
              ))}
            </nav>

            {filteredManagementItems.length > 0 && (
              <>
                <div className="px-6 my-4">
                  <Separator className="bg-white/10" />
                </div>

                <nav className="space-y-1 px-3">
                  {filteredManagementItems.map((item) => (
                    <Tooltip key={item.path}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => {
                            navigate(item.path);
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                            isActive(item.path)
                              ? "bg-[#F4B942] text-[#0B1F4D] shadow-lg shadow-[#F4B942]/25"
                              : "text-blue-100/70 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
                          <span
                            className={`whitespace-nowrap transition-all duration-300 ${
                              sidebarOpen ? "opacity-100 w-auto" : "opacity-0 w-0"
                            }`}
                          >
                            {item.label}
                          </span>
                        </button>
                      </TooltipTrigger>
                      {!sidebarOpen && (
                        <TooltipContent side="right" className="bg-[#0B1F4D] border-white/10">
                          {item.label}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  ))}
                </nav>
              </>
            )}
          </TooltipProvider>
        </ScrollArea>

        {/* Bottom Section */}
        <div className="px-3 py-4 border-t border-white/10 space-y-1 flex-shrink-0">
          {bottomItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive(item.path)
                  ? "bg-[#F4B942] text-[#0B1F4D]"
                  : "text-blue-100/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
              <span
                className={`whitespace-nowrap transition-all duration-300 ${
                  sidebarOpen ? "opacity-100 w-auto" : "opacity-0 w-0 hidden"
                }`}
              >
                {item.label}
              </span>
            </button>
          ))}
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-300 hover:bg-red-500/20 transition-all duration-200"
          >
            <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
            <span
              className={`whitespace-nowrap transition-all duration-300 ${
                sidebarOpen ? "opacity-100 w-auto" : "opacity-0 w-0 hidden"
              }`}
            >
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-card border-b border-border flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold text-[#0B1F4D] dark:text-foreground">
              {sidebarItems.find((i) => isActive(i.path))?.label ||
                managementItems.find((i) => isActive(i.path))?.label ||
                bottomItems.find((i) => isActive(i.path))?.label ||
                "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="w-5 h-5 text-[#F4B942]" />
              ) : (
                <Moon className="w-5 h-5 text-[#0B1F4D]" />
              )}
            </button>
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2 mr-2">
              <span className="text-sm font-medium text-[#0B1F4D] dark:text-white hidden sm:inline-block">
                {user?.name || "User"}
              </span>
              <span className="text-xs text-[#0B1F4D]/75 dark:text-white/75 bg-[#F4B942]/20 border border-[#F4B942]/30 px-2 py-0.5 rounded-full capitalize font-semibold hidden md:inline-block">
                {user?.role || "student"}
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#0B1F4D] flex items-center justify-center ml-2 border border-white/20">
              {user?.name ? (
                <span className="text-xs font-bold text-[#F4B942]">
                  {user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                </span>
              ) : (
                <UserCircle className="w-5 h-5 text-[#F4B942]" />
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
