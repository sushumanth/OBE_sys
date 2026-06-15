import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ClipboardList,
  Plus,
  Calendar,
  Clock,
  BarChart3,
  FileSpreadsheet,
  TrendingUp,
  Users,
} from "lucide-react";

const assessmentTypes = ["IA1", "IA2", "Quiz", "Assignment", "Lab", "ESE"] as const;

const typeColors: Record<string, string> = {
  IA1: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
  IA2: "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-400",
  Quiz: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
  Assignment: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
  Lab: "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-400",
  ESE: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400",
};

const demoAssessments = [
  { id: 1, title: "Internal Assessment 1", type: "IA1", date: "2025-02-15", maxMarks: 30, duration: "1.5 hours", subjectId: 1, coCoverage: "CO1, CO2", avgScore: 22, highest: 28, lowest: 12, passCount: 42, totalCount: 50 },
  { id: 2, title: "Internal Assessment 2", type: "IA2", date: "2025-03-20", maxMarks: 30, duration: "1.5 hours", subjectId: 1, coCoverage: "CO3, CO4", avgScore: 20, highest: 29, lowest: 8, passCount: 38, totalCount: 50 },
  { id: 3, title: "Quiz 1 - Sorting", type: "Quiz", date: "2025-01-25", maxMarks: 10, duration: "20 mins", subjectId: 1, coCoverage: "CO2", avgScore: 7.5, highest: 10, lowest: 4, passCount: 45, totalCount: 50 },
  { id: 4, title: "Lab Assignment 1", type: "Lab", date: "2025-02-05", maxMarks: 20, duration: "2 hours", subjectId: 1, coCoverage: "CO1, CO2, CO3", avgScore: 16, highest: 20, lowest: 10, passCount: 48, totalCount: 50 },
  { id: 5, title: "End Semester Exam", type: "ESE", date: "2025-04-10", maxMarks: 100, duration: "3 hours", subjectId: 1, coCoverage: "CO1-CO5", avgScore: 68, highest: 92, lowest: 35, passCount: 40, totalCount: 50 },
];

export default function Assessments() {
  const [open, setOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<typeof demoAssessments[0] | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0B1F4D] dark:text-foreground">Assessments</h2>
          <p className="text-sm text-muted-foreground">Manage all types of assessments</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#0B1F4D] hover:bg-[#0B1F4D]/90">
              <Plus className="w-4 h-4 mr-1" /> Add Assessment
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl max-w-lg">
            <DialogHeader><DialogTitle>Create Assessment</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-4">
              <div><Label>Title</Label><Input placeholder="Assessment title" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Type</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      {assessmentTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Date</Label><Input type="date" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Max Marks</Label><Input type="number" /></div>
                <div><Label>Duration</Label><Input placeholder="e.g. 1.5 hours" /></div>
              </div>
              <Button className="w-full bg-[#0B1F4D]">Create Assessment</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Assessments", value: demoAssessments.length, icon: ClipboardList, color: "text-blue-600" },
          { label: "Avg Score", value: `${Math.round(demoAssessments.reduce((s, a) => s + a.avgScore, 0) / demoAssessments.length)}%`, icon: TrendingUp, color: "text-emerald-600" },
          { label: "Students", value: 50, icon: Users, color: "text-violet-600" },
          { label: "Pass Rate", value: "84%", icon: BarChart3, color: "text-[#F4B942]" },
        ].map((stat, i) => (
          <Card key={i} className="border-0 shadow-md rounded-2xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-lg font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Assessment Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {demoAssessments.map((a) => (
          <Card key={a.id} className="border-0 shadow-md rounded-2xl cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedAssessment(a)}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-[#0B1F4D]/10 dark:bg-[#0B1F4D]/20 flex items-center justify-center">
                    <ClipboardList className="w-4 h-4 text-[#0B1F4D] dark:text-[#F4B942]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{a.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" /> {a.date}
                    </div>
                  </div>
                </div>
                <Badge className={typeColors[a.type]}>{a.type}</Badge>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                <div className="bg-muted/50 rounded-lg p-2">
                  <p className="text-xs text-muted-foreground">Max</p>
                  <p className="font-bold text-sm">{a.maxMarks}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-2">
                  <p className="text-xs text-muted-foreground">Avg</p>
                  <p className="font-bold text-sm text-[#F4B942]">{a.avgScore}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-2">
                  <p className="text-xs text-muted-foreground">Pass</p>
                  <p className="font-bold text-sm text-emerald-600">{a.passCount}/{a.totalCount}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span><Clock className="w-3 h-3 inline mr-1" />{a.duration}</span>
                <span>CO: {a.coCoverage}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Assessment Detail */}
      {selectedAssessment && (
        <Card className="border-0 shadow-md rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#F4B942]" />
              {selectedAssessment.title} - Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Average", value: selectedAssessment.avgScore },
                { label: "Highest", value: selectedAssessment.highest },
                { label: "Lowest", value: selectedAssessment.lowest },
                { label: "Pass Count", value: `${selectedAssessment.passCount}/${selectedAssessment.totalCount}` },
              ].map((s, i) => (
                <div key={i} className="text-center p-4 bg-muted/50 rounded-xl">
                  <p className="text-2xl font-bold text-[#0B1F4D] dark:text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" className="gap-2">
                <FileSpreadsheet className="w-4 h-4" /> Import Marks
              </Button>
              <Button variant="outline" className="gap-2">
                <BarChart3 className="w-4 h-4" /> View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
