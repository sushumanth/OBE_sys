import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/providers/theme-provider";
import {
  UserCircle,
  Mail,
  Building2,
  Shield,
  Calendar,
  Award,
  BookOpen,
  Edit3,
} from "lucide-react";
import { toast } from "sonner";

export default function Profile() {
  const { user } = useAuth();
  useTheme();

  const userInfo = {
    name: user?.name || "Dr. Rajesh Kumar",
    email: user?.email || "rajesh.kumar@college.edu",
    role: (user?.role || "faculty").replace("_", " ").toUpperCase(),
    department: "Computer Science & Engineering",
    joined: "August 2018",
    subjects: 4,
    students: 186,
  };

  const roleColors: Record<string, string> = {
    "SUPER ADMIN": "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400",
    ADMIN: "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-400",
    HOD: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
    FACULTY: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
    STUDENT: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Profile Header */}
      <Card className="border-0 shadow-md rounded-2xl overflow-hidden">
        <div className="obe-gradient p-8 text-center relative">
          <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 border-2 border-white/30">
            <UserCircle className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">{userInfo.name}</h2>
          <p className="text-blue-200/80 text-sm mt-1">{userInfo.email}</p>
          <Badge className={`mt-3 ${roleColors[userInfo.role] || "bg-muted"}`}>
            {userInfo.role}
          </Badge>
        </div>
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-[#0B1F4D] dark:text-foreground">{userInfo.subjects}</p>
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                <BookOpen className="w-3 h-3" /> Subjects
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0B1F4D] dark:text-foreground">{userInfo.students}</p>
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                <UserCircle className="w-3 h-3" /> Students
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0B1F4D] dark:text-foreground">6</p>
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                <Award className="w-3 h-3" /> Years
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details */}
      <Card className="border-0 shadow-md rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-[#F4B942]" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-muted-foreground">
                <UserCircle className="w-3.5 h-3.5" /> Full Name
              </Label>
              <Input defaultValue={userInfo.name} />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-3.5 h-3.5" /> Email
              </Label>
              <Input defaultValue={userInfo.email} />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="w-3.5 h-3.5" /> Department
              </Label>
              <Input defaultValue={userInfo.department} />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-muted-foreground">
                <Shield className="w-3.5 h-3.5" /> Role
              </Label>
              <Input defaultValue={userInfo.role} disabled className="bg-muted/50" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" /> Joined
              </Label>
              <Input defaultValue={userInfo.joined} disabled className="bg-muted/50" />
            </div>
          </div>
          <Button
            className="bg-[#0B1F4D] hover:bg-[#0B1F4D]/90 gap-2"
            onClick={() => toast.success("Profile updated successfully")}
          >
            <Edit3 className="w-4 h-4" /> Update Profile
          </Button>
        </CardContent>
      </Card>

      {/* Activity Summary */}
      <Card className="border-0 shadow-md rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Recent Activity Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { action: "Updated CO-PO Mapping", date: "Today, 2:30 PM", type: "mapping" },
              { action: "Added IA1 Assessment marks", date: "Yesterday, 11:00 AM", type: "assessment" },
              { action: "Generated attainment report", date: "Mar 15, 2025", type: "report" },
              { action: "Approved 3 question bank items", date: "Mar 12, 2025", type: "approval" },
            ].map((activity, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#F4B942]" />
                  <span className="text-sm">{activity.action}</span>
                </div>
                <span className="text-xs text-muted-foreground">{activity.date}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
