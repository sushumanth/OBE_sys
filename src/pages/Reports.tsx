import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,

  FileSpreadsheet,
  FileArchive,
  TrendingUp,
  Target,
  GraduationCap,
  BarChart3,
  Award,
  Calendar,
} from "lucide-react";

const reports = [
  {
    title: "CO Attainment Report",
    description: "Detailed course outcome attainment analysis with direct and indirect measures",
    icon: Target,
    formats: ["PDF", "Excel"],
    color: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
    size: "245 KB",
  },
  {
    title: "PO Attainment Report",
    description: "Program outcome attainment summary with gap analysis",
    icon: Award,
    formats: ["PDF", "Excel"],
    color: "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-400",
    size: "189 KB",
  },
  {
    title: "NBA Accreditation Pack",
    description: "Complete NBA accreditation documentation package",
    icon: GraduationCap,
    formats: ["PDF", "ZIP"],
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
    size: "4.2 MB",
  },
  {
    title: "Student Performance Report",
    description: "Individual student performance and grade distribution",
    icon: BarChart3,
    formats: ["PDF", "Excel"],
    color: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
    size: "512 KB",
  },
  {
    title: "Semester Comparison",
    description: "Compare attainment across multiple semesters",
    icon: TrendingUp,
    formats: ["PDF", "Excel"],
    color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-400",
    size: "356 KB",
  },
  {
    title: "Program Summary",
    description: "Overall program summary with key metrics",
    icon: FileText,
    formats: ["PDF"],
    color: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400",
    size: "128 KB",
  },
];

const semesterTrends = [
  { semester: "Sem 1", coAttainment: 68, poAttainment: 65 },
  { semester: "Sem 2", coAttainment: 72, poAttainment: 70 },
  { semester: "Sem 3", coAttainment: 75, poAttainment: 73 },
  { semester: "Sem 4", coAttainment: 71, poAttainment: 69 },
  { semester: "Sem 5", coAttainment: 78, poAttainment: 76 },
  { semester: "Sem 6", coAttainment: 82, poAttainment: 80 },
];

export default function Reports() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#0B1F4D] dark:text-foreground">Reports</h2>
        <p className="text-sm text-muted-foreground">Generate and download OBE reports</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Reports", value: reports.length, icon: FileText, color: "text-blue-600" },
          { label: "CO Avg", value: "74.3%", icon: Target, color: "text-emerald-600" },
          { label: "PO Avg", value: "72.2%", icon: Award, color: "text-[#F4B942]" },
          { label: "Semesters", value: "6", icon: Calendar, color: "text-violet-600" },
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

      {/* Trend Chart */}
      <Card className="border-0 shadow-md rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#F4B942]" />
            Semester-wise Attainment Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4 h-48 pt-4">
            {semesterTrends.map((s, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex gap-1 items-end justify-center" style={{ height: "120px" }}>
                  <div
                    className="w-4 bg-[#0B1F4D] rounded-t-md"
                    style={{ height: `${(s.coAttainment / 100) * 120}px` }}
                    title={`CO: ${s.coAttainment}%`}
                  />
                  <div
                    className="w-4 bg-[#F4B942] rounded-t-md"
                    style={{ height: `${(s.poAttainment / 100) * 120}px` }}
                    title={`PO: ${s.poAttainment}%`}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{s.semester}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#0B1F4D] rounded-sm" />
              <span className="text-xs text-muted-foreground">CO Attainment</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#F4B942] rounded-sm" />
              <span className="text-xs text-muted-foreground">PO Attainment</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {reports.map((report, i) => {
          const Icon = report.icon;
          return (
            <Card key={i} className="border-0 shadow-md rounded-2xl hover:shadow-lg transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${report.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-sm">{report.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{report.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex gap-1.5">
                        {report.formats.map((fmt) => (
                          <Badge key={fmt} variant="outline" className="text-xs">
                            {fmt}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">{report.size}</span>
                        <div className="flex gap-1">
                          {report.formats.map((fmt) => (
                            <Button
                              key={fmt}
                              variant="ghost"
                              size="icon"
                              className="w-7 h-7"
                              title={`Download ${fmt}`}
                            >
                              {fmt === "PDF" ? (
                                <FileText className="w-3.5 h-3.5 text-red-500" />
                              ) : fmt === "Excel" ? (
                                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
                              ) : (
                                <FileArchive className="w-3.5 h-3.5 text-amber-500" />
                              )}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
