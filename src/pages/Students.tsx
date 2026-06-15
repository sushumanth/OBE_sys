import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Users,
  Search,
  Plus,
  FileSpreadsheet,
  Pencil,
  Trash2,
  TrendingUp,
  TrendingDown,
  Award,
  AlertTriangle,
} from "lucide-react";

const demoStudents = [
  { id: 1, rollNumber: "CSE001", name: "Aditya Sharma", email: "aditya@example.com", branchId: 1, batch: "2022-26", year: 3, semester: 5, section: "A", totalMarks: 385, percent: 77, grade: "A" },
  { id: 2, rollNumber: "CSE002", name: "Bhavya Patel", email: "bhavya@example.com", branchId: 1, batch: "2022-26", year: 3, semester: 5, section: "A", totalMarks: 412, percent: 82, grade: "A+" },
  { id: 3, rollNumber: "CSE003", name: "Chirag Gupta", email: "chirag@example.com", branchId: 1, batch: "2022-26", year: 3, semester: 5, section: "A", totalMarks: 298, percent: 60, grade: "B" },
  { id: 4, rollNumber: "CSE004", name: "Divya Kumar", email: "divya@example.com", branchId: 1, batch: "2022-26", year: 3, semester: 5, section: "A", totalMarks: 445, percent: 89, grade: "A+" },
  { id: 5, rollNumber: "CSE005", name: "Emily Thomas", email: "emily@example.com", branchId: 1, batch: "2022-26", year: 3, semester: 5, section: "A", totalMarks: 356, percent: 71, grade: "B+" },
  { id: 6, rollNumber: "CSE006", name: "Farhan Khan", email: "farhan@example.com", branchId: 1, batch: "2022-26", year: 3, semester: 5, section: "A", totalMarks: 210, percent: 42, grade: "F" },
  { id: 7, rollNumber: "CSE007", name: "Gaurav Singh", email: "gaurav@example.com", branchId: 1, batch: "2022-26", year: 3, semester: 5, section: "A", totalMarks: 398, percent: 80, grade: "A" },
  { id: 8, rollNumber: "CSE008", name: "Harini Rao", email: "harini@example.com", branchId: 1, batch: "2022-26", year: 3, semester: 5, section: "A", totalMarks: 425, percent: 85, grade: "A+" },
  { id: 9, rollNumber: "CSE009", name: "Ishan Verma", email: "ishan@example.com", branchId: 1, batch: "2022-26", year: 3, semester: 5, section: "A", totalMarks: 268, percent: 54, grade: "C" },
  { id: 10, rollNumber: "CSE010", name: "Jaya Reddy", email: "jaya@example.com", branchId: 1, batch: "2022-26", year: 3, semester: 5, section: "A", totalMarks: 378, percent: 76, grade: "A" },
];

const gradeColors: Record<string, string> = {
  "A+": "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
  "A": "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
  "B+": "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-400",
  "B": "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
  "C": "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400",
  "F": "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400",
};

export default function Students() {
  const [search, setSearch] = useState("");
  const [selectedSection, setSelectedSection] = useState("All");

  const filtered = demoStudents.filter((s) => {
    const matchSearch =
      search === "" ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(search.toLowerCase());
    const matchSection = selectedSection === "All" || s.section === selectedSection;
    return matchSearch && matchSection;
  });

  const atRisk = filtered.filter((s) => s.percent < 55);
  const topPerformers = [...filtered].sort((a, b) => b.percent - a.percent).slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md rounded-2xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Students</p>
                <p className="text-xl font-bold">{demoStudents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md rounded-2xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Pass Rate</p>
                <p className="text-xl font-bold">{Math.round((demoStudents.filter((s) => s.grade !== "F").length / demoStudents.length) * 100)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md rounded-2xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">At Risk</p>
                <p className="text-xl font-bold">{demoStudents.filter((s) => s.percent < 55).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md rounded-2xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/20 flex items-center justify-center">
                <Award className="w-5 h-5 text-[#F4B942]" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Class Avg</p>
                <p className="text-xl font-bold">{Math.round(demoStudents.reduce((s, a) => s + a.percent, 0) / demoStudents.length)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or roll number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={selectedSection} onValueChange={setSelectedSection}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Section" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="A">Section A</SelectItem>
              <SelectItem value="B">Section B</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <FileSpreadsheet className="w-4 h-4" /> Import
          </Button>
          <Button className="bg-[#0B1F4D] hover:bg-[#0B1F4D]/90 gap-2">
            <Plus className="w-4 h-4" /> Add
          </Button>
        </div>
      </div>

      {/* Top Performers */}
      <Card className="border-0 shadow-md rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Award className="w-4 h-4 text-[#F4B942]" /> Top Performers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {topPerformers.map((s, i) => (
              <div key={s.id} className="flex items-center gap-3 bg-muted/50 rounded-xl p-3 min-w-[200px]">
                <div className="w-8 h-8 rounded-full obe-gradient flex items-center justify-center text-white text-xs font-bold">
                  {i + 1}
                </div>
                <div>
                  <p className="text-sm font-medium">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.percent}% - {s.grade}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Student Table */}
      <Card className="border-0 shadow-md rounded-2xl">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-3 px-4 font-semibold">Rank</th>
                  <th className="text-left py-3 px-4 font-semibold">Roll No</th>
                  <th className="text-left py-3 px-4 font-semibold">Name</th>
                  <th className="text-center py-3 px-4 font-semibold">Marks</th>
                  <th className="text-center py-3 px-4 font-semibold">%</th>
                  <th className="text-center py-3 px-4 font-semibold">Grade</th>
                  <th className="text-center py-3 px-4 font-semibold">Status</th>
                  <th className="text-center py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[...filtered].sort((a, b) => b.percent - a.percent).map((s, idx) => (
                  <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="py-3 px-4">
                      <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold inline-flex">
                        {idx + 1}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs">{s.rollNumber}</td>
                    <td className="py-3 px-4 font-medium">{s.name}</td>
                    <td className="py-3 px-4 text-center">{s.totalMarks}/500</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center gap-2 justify-center">
                        <Progress value={s.percent} className="w-12 h-2" />
                        <span className="text-xs font-medium">{s.percent}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge className={gradeColors[s.grade] || "bg-muted"}>{s.grade}</Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {s.percent < 55 ? (
                        <Badge variant="destructive" className="text-xs gap-1">
                          <TrendingDown className="w-3 h-3" /> At Risk
                        </Badge>
                      ) : (
                        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 text-xs gap-1">
                          <TrendingUp className="w-3 h-3" /> Good
                        </Badge>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Button variant="ghost" size="icon" className="w-7 h-7">
                          <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" className="w-7 h-7">
                          <Trash2 className="w-3.5 h-3.5 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* At Risk Students */}
      {atRisk.length > 0 && (
        <Card className="border-0 shadow-md rounded-2xl border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-4 h-4" /> At Risk Students (Below 55%)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {atRisk.map((s) => (
                <div key={s.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-500/20 flex items-center justify-center">
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.rollNumber}</p>
                    </div>
                  </div>
                  <Badge variant="destructive">{s.percent}%</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
