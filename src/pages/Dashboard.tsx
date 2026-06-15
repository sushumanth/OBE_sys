import { trpc } from "@/providers/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  Target,
  Award,
  TrendingUp,
  CheckCircle,
  Clock,
  BookOpen,
  FileText,
  AlertCircle,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Radar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = trpc.dashboard.stats.useQuery();
  const { data: coStats, isLoading: coStatsLoading } = trpc.dashboard.coStats.useQuery();
  const { data: attainmentSummary, isLoading: attainmentLoading } =
    trpc.dashboard.attainmentSummary.useQuery();

  const kpiCards = [
    {
      title: "Total Students",
      value: stats?.totalStudents ?? 0,
      icon: Users,
      color: "bg-blue-500",
      lightColor: "bg-blue-50 dark:bg-blue-500/10",
      textColor: "text-blue-600 dark:text-blue-400",
      change: "+12%",
    },
    {
      title: "Course Outcomes",
      value: stats?.totalCourseOutcomes ?? 0,
      icon: Target,
      color: "bg-emerald-500",
      lightColor: "bg-emerald-50 dark:bg-emerald-500/10",
      textColor: "text-emerald-600 dark:text-emerald-400",
      change: "+5",
    },
    {
      title: "Avg CO Attainment",
      value: `${attainmentSummary?.avgAttainment ?? "0.00"}%`,
      icon: TrendingUp,
      color: "bg-[#F4B942]",
      lightColor: "bg-amber-50 dark:bg-amber-500/10",
      textColor: "text-amber-600 dark:text-amber-400",
      change: "Threshold: 60%",
    },
    {
      title: "COs Achieved",
      value: `${coStats?.attained ?? 0}/${coStats?.total ?? 0}`,
      icon: CheckCircle,
      color: "bg-violet-500",
      lightColor: "bg-violet-50 dark:bg-violet-500/10",
      textColor: "text-violet-600 dark:text-violet-400",
      change: `${coStats?.percentage ?? 0}% attained`,
    },
  ];

  const coAttainmentData = {
    labels: ["CO1", "CO2", "CO3", "CO4", "CO5"],
    datasets: [
      {
        label: "Attainment %",
        data: [72, 58, 85, 64, 91],
        backgroundColor: "#0B1F4D",
        borderColor: "#0B1F4D",
        borderWidth: 0,
        borderRadius: 8,
        borderSkipped: false as const,
      },
      {
        label: "Threshold",
        data: [60, 60, 60, 60, 60],
        backgroundColor: "#F4B942",
        borderColor: "#F4B942",
        borderWidth: 0,
        borderRadius: 8,
        borderSkipped: false as const,
      },
    ],
  };

  const poRadarData = {
    labels: ["PO1", "PO2", "PO3", "PO4", "PO5", "PO6", "PO7", "PO8", "PO9", "PO10", "PO11", "PO12"],
    datasets: [
      {
        label: "PO Attainment",
        data: [75, 68, 82, 70, 65, 78, 72, 80, 74, 69, 85, 77],
        fill: true,
        backgroundColor: "rgba(11, 31, 77, 0.2)",
        borderColor: "#0B1F4D",
        pointBackgroundColor: "#F4B942",
        pointBorderColor: "#0B1F4D",
        pointHoverBackgroundColor: "#F4B942",
        pointHoverBorderColor: "#0B1F4D",
      },
    ],
  };

  const gradeDistributionData = {
    labels: ["A+", "A", "B+", "B", "C", "F"],
    datasets: [
      {
        data: [15, 28, 22, 18, 10, 7],
        backgroundColor: [
          "#0B1F4D",
          "#1a3a6e",
          "#F4B942",
          "#60a5fa",
          "#a78bfa",
          "#f87171",
        ],
        borderWidth: 0,
      },
    ],
  };

  const recentActivities = [
    { action: "CO-PO Mapping updated", subject: "Data Structures", time: "2 min ago", type: "success" },
    { action: "New assessment added", subject: "IA2 - Algorithms", time: "15 min ago", type: "info" },
    { action: "Student marks uploaded", subject: "Database Systems", time: "1 hour ago", type: "info" },
    { action: "Question approved", subject: "Operating Systems", time: "2 hours ago", type: "success" },
    { action: "Low attainment alert", subject: "CO3 - Networks", time: "3 hours ago", type: "warning" },
    { action: "Report generated", subject: "Semester Summary", time: "5 hours ago", type: "info" },
  ];

  const summaryTable = [
    { subject: "Data Structures", code: "CS201", cos: 5, attainment: "78%", status: "Achieved" },
    { subject: "Algorithms", code: "CS202", cos: 5, attainment: "65%", status: "Achieved" },
    { subject: "Database Systems", code: "CS301", cos: 6, attainment: "82%", status: "Achieved" },
    { subject: "Operating Systems", code: "CS302", cos: 5, attainment: "54%", status: "Review" },
    { subject: "Computer Networks", code: "CS401", cos: 5, attainment: "71%", status: "Achieved" },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Card */}
      <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
        <div className="obe-gradient p-6 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-1">Computer Science & Engineering</h2>
              <p className="text-blue-200/80 text-sm">Academic Year 2024-25 | Semester 5</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Badge className="bg-white/15 text-white border-white/25 px-4 py-1.5">
                <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                6 Subjects
              </Badge>
              <Badge className="bg-[#F4B942]/20 text-[#F4B942] border-[#F4B942]/30 px-4 py-1.5">
                <Award className="w-3.5 h-3.5 mr-1.5" />
                NBA Accredited
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpiCards.map((card, i) => (
          <Card key={i} className="border-0 shadow-md rounded-2xl hover:shadow-lg transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground font-medium">{card.title}</p>
                  {statsLoading || coStatsLoading || attainmentLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-3xl font-bold text-[#0B1F4D] dark:text-foreground">
                      {card.value}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">{card.change}</p>
                </div>
                <div className={`${card.lightColor} p-3 rounded-xl`}>
                  <card.icon className={`w-5 h-5 ${card.textColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CO Attainment Bar Chart */}
        <Card className="border-0 shadow-md rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Target className="w-4 h-4 text-[#F4B942]" />
              CO Attainment Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Bar
                data={coAttainmentData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: "bottom" as const },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      grid: { color: "rgba(0,0,0,0.05)" },
                    },
                    x: {
                      grid: { display: false },
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* PO Radar Chart */}
        <Card className="border-0 shadow-md rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Award className="w-4 h-4 text-[#F4B942]" />
              PO Attainment Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Radar
                data={poRadarData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    r: {
                      beginAtZero: true,
                      max: 100,
                      ticks: { display: false },
                      grid: { color: "rgba(0,0,0,0.08)" },
                      pointLabels: {
                        font: { size: 11 },
                      },
                    },
                  },
                  plugins: {
                    legend: { display: false },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grade Distribution */}
        <Card className="border-0 shadow-md rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Grade Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center">
              <Doughnut
                data={gradeDistributionData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "right" as const,
                      labels: { boxWidth: 12, font: { size: 11 } },
                    },
                  },
                  cutout: "65%",
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-0 shadow-md rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#F4B942]" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
              {recentActivities.map((activity, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      activity.type === "success"
                        ? "bg-emerald-500"
                        : activity.type === "warning"
                        ? "bg-amber-500"
                        : "bg-blue-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.subject}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* At Risk Students */}
        <Card className="border-0 shadow-md rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              At Risk Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "Rahul Kumar", roll: "CSE042", percent: "42%" },
                { name: "Priya Sharma", roll: "CSE055", percent: "48%" },
                { name: "Amit Patel", roll: "CSE038", percent: "51%" },
                { name: "Sneha Gupta", roll: "CSE061", percent: "54%" },
              ].map((student, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{student.name}</p>
                    <p className="text-xs text-muted-foreground">{student.roll}</p>
                  </div>
                  <Badge variant="destructive" className="text-xs">
                    {student.percent}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Summary Table */}
      <Card className="border-0 shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#F4B942]" />
            Course Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                    Subject
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                    Code
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-muted-foreground">
                    COs
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-muted-foreground">
                    Attainment
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {summaryTable.map((row, i) => (
                  <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{row.subject}</td>
                    <td className="py-3 px-4 text-muted-foreground">{row.code}</td>
                    <td className="py-3 px-4 text-center">{row.cos}</td>
                    <td className="py-3 px-4 text-center font-medium">{row.attainment}</td>
                    <td className="py-3 px-4 text-center">
                      <Badge
                        className={
                          row.status === "Achieved"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
                        }
                      >
                        {row.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
