import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  TrendingUp,
  Target,
  Award,
  AlertCircle,
  Calculator,
  CheckCircle,
  XCircle,
  Users,
} from "lucide-react";

const coAttainmentData = [
  { name: "CO1", direct: 72, indirect: 80, final: 73.6 },
  { name: "CO2", direct: 58, indirect: 65, final: 59.4 },
  { name: "CO3", direct: 85, indirect: 78, final: 83.6 },
  { name: "CO4", direct: 64, indirect: 70, final: 65.2 },
  { name: "CO5", direct: 91, indirect: 85, final: 89.8 },
];

const poAttainmentData = [
  { name: "PO1", value: 75 },
  { name: "PO2", value: 68 },
  { name: "PO3", value: 82 },
  { name: "PO4", value: 70 },
  { name: "PO5", value: 65 },
  { name: "PO6", value: 78 },
  { name: "PO7", value: 72 },
  { name: "PO8", value: 80 },
];

const threshold = 60;

export default function Attainment() {
  const attainedCOs = coAttainmentData.filter((co) => co.final >= threshold);
  const avgCOAttainment =
    coAttainmentData.reduce((sum, co) => sum + co.final, 0) / coAttainmentData.length;
  const avgPOAttainment =
    poAttainmentData.reduce((sum, po) => sum + po.value, 0) / poAttainmentData.length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md rounded-2xl">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0B1F4D]/10 dark:bg-[#0B1F4D]/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#0B1F4D] dark:text-[#F4B942]" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Overall CO Attainment</p>
                <p className="text-2xl font-bold">{avgCOAttainment.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md rounded-2xl">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">COs Attained</p>
                <p className="text-2xl font-bold">{attainedCOs.length}/{coAttainmentData.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md rounded-2xl">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/20 flex items-center justify-center">
                <Award className="w-5 h-5 text-[#F4B942]" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Avg PO Attainment</p>
                <p className="text-2xl font-bold">{avgPOAttainment.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md rounded-2xl">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Students Evaluated</p>
                <p className="text-2xl font-bold">50</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Formula Card */}
      <Card className="border-0 shadow-md rounded-2xl obe-gradient">
        <CardContent className="p-5">
          <div className="flex items-center gap-3 text-white">
            <Calculator className="w-5 h-5 text-[#F4B942]" />
            <div>
              <p className="text-sm font-medium text-blue-100">Attainment Formula</p>
              <p className="text-lg font-bold">
                Final CO Attainment = (Direct &times; 0.80) + (Indirect &times; 0.20)
              </p>
              <p className="text-xs text-blue-200/70 mt-1">
                Threshold: {threshold}% | Low attainment triggers Program Action Plan
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-md rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Target className="w-4 h-4 text-[#F4B942]" /> CO Attainment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={coAttainmentData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                />
                <Bar dataKey="final" fill="#0B1F4D" radius={[8, 8, 0, 0]} name="Final Attainment">
                  {coAttainmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.final >= threshold ? "#0B1F4D" : "#ef4444"} />
                  ))}
                </Bar>
                <Bar dataKey="direct" fill="#F4B942" radius={[8, 8, 0, 0]} name="Direct" opacity={0.4} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Award className="w-4 h-4 text-[#F4B942]" /> PO Attainment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={poAttainmentData} layout="vertical" barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={40} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                />
                <Bar dataKey="value" fill="#0B1F4D" radius={[0, 8, 8, 0]} name="Attainment %">
                  {poAttainmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.value >= threshold ? "#0B1F4D" : "#ef4444"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Attainment Table */}
      <Card className="border-0 shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Detailed Attainment Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-3 px-4 font-semibold">CO</th>
                  <th className="text-center py-3 px-4 font-semibold">Direct (80%)</th>
                  <th className="text-center py-3 px-4 font-semibold">Indirect (20%)</th>
                  <th className="text-center py-3 px-4 font-semibold">Final</th>
                  <th className="text-center py-3 px-4 font-semibold">Status</th>
                  <th className="text-center py-3 px-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {coAttainmentData.map((co) => {
                  const isAttained = co.final >= threshold;
                  return (
                    <tr key={co.name} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="py-3 px-4 font-bold text-[#0B1F4D] dark:text-foreground">{co.name}</td>
                      <td className="py-3 px-4 text-center">{co.direct}%</td>
                      <td className="py-3 px-4 text-center">{co.indirect}%</td>
                      <td className="py-3 px-4 text-center font-bold">{co.final}%</td>
                      <td className="py-3 px-4 text-center">
                        <Badge className={isAttained
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 gap-1"
                          : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 gap-1"
                        }>
                          {isAttained ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {isAttained ? "Attained" : "Not Attained"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {!isAttained && (
                          <Badge variant="outline" className="text-amber-600 border-amber-300 gap-1">
                            <AlertCircle className="w-3 h-3" /> Action Plan
                          </Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
