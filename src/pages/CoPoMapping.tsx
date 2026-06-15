import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Info, GitBranch, Target, Award } from "lucide-react";

const coList = ["CO1", "CO2", "CO3", "CO4", "CO5"];
const poList = ["PO1", "PO2", "PO3", "PO4", "PO5", "PO6", "PO7", "PO8", "PO9", "PO10", "PO11", "PO12"];

const correlationLabels: Record<number, string> = {
  0: "No Correlation",
  1: "Low",
  2: "Medium",
  3: "High",
};

const correlationColors: Record<number, string> = {
  0: "bg-white dark:bg-transparent border-gray-200 dark:border-gray-700 text-gray-400",
  1: "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300",
  2: "bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-700 text-amber-700 dark:text-amber-300",
  3: "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300",
};

const demoMatrix: Record<string, Record<string, number>> = {
  CO1: { PO1: 3, PO2: 2, PO3: 1, PO4: 0, PO5: 2, PO6: 0, PO7: 1, PO8: 0, PO9: 2, PO10: 0, PO11: 1, PO12: 0 },
  CO2: { PO1: 2, PO2: 3, PO3: 2, PO4: 1, PO5: 0, PO6: 0, PO7: 0, PO8: 2, PO9: 0, PO10: 1, PO11: 0, PO12: 2 },
  CO3: { PO1: 1, PO2: 2, PO3: 3, PO4: 2, PO5: 1, PO6: 0, PO7: 2, PO8: 0, PO9: 1, PO10: 0, PO11: 2, PO12: 0 },
  CO4: { PO1: 0, PO2: 1, PO3: 2, PO4: 3, PO5: 2, PO6: 1, PO7: 0, PO8: 2, PO9: 0, PO10: 2, PO11: 0, PO12: 1 },
  CO5: { PO1: 2, PO2: 0, PO3: 1, PO4: 2, PO5: 3, PO6: 2, PO7: 1, PO8: 0, PO9: 2, PO10: 1, PO11: 0, PO12: 2 },
};

function calculateAverageCorrelation(coId: string) {
  const values = Object.values(demoMatrix[coId] || {});
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function getCoverageStrength(avg: number) {
  if (avg >= 2) return { label: "Strong", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" };
  if (avg >= 1) return { label: "Moderate", color: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400" };
  return { label: "Weak", color: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400" };
}

export default function CoPoMapping() {
  const [matrix, setMatrix] = useState(demoMatrix);
  const [selectedCell, setSelectedCell] = useState<{ co: string; po: string } | null>(null);

  function cycleCorrelation(co: string, po: string) {
    const current = matrix[co]?.[po] ?? 0;
    const next = ((current + 1) % 4) as 0 | 1 | 2 | 3;
    setMatrix((prev) => ({
      ...prev,
      [co]: { ...prev[co], [po]: next },
    }));
    setSelectedCell({ co, po });
  }

  const overallMappings = Object.values(matrix).flatMap((co) => Object.values(co));
  const totalCells = overallMappings.length;
  const mappedCells = overallMappings.filter((v) => v > 0).length;
  const mappingPercent = Math.round((mappedCells / totalCells) * 100);

  const strongCoverage = coList.filter((co) => calculateAverageCorrelation(co) >= 2);
  const weakCoverage = coList.filter((co) => calculateAverageCorrelation(co) < 1);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md rounded-2xl">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overall Mapping</p>
                <p className="text-2xl font-bold text-[#0B1F4D] dark:text-foreground mt-1">
                  {mappingPercent}%
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#0B1F4D]/10 dark:bg-[#0B1F4D]/20 flex items-center justify-center">
                <GitBranch className="w-5 h-5 text-[#0B1F4D] dark:text-[#F4B942]" />
              </div>
            </div>
            <Progress value={mappingPercent} className="h-2 mt-3" />
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md rounded-2xl">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Strong Coverage</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">
                  {strongCoverage.length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/20 flex items-center justify-center">
                <Target className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md rounded-2xl">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Weak Coverage</p>
                <p className="text-2xl font-bold text-red-500 mt-1">{weakCoverage.length}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-500/20 flex items-center justify-center">
                <Info className="w-5 h-5 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md rounded-2xl">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Correlation</p>
                <p className="text-2xl font-bold text-[#F4B942] mt-1">
                  {(
                    coList.reduce((sum, co) => sum + calculateAverageCorrelation(co), 0) /
                    coList.length
                  ).toFixed(1)}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/20 flex items-center justify-center">
                <Award className="w-5 h-5 text-[#F4B942]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mapping Matrix */}
      <Card className="border-0 shadow-md rounded-2xl overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold">CO-PO Mapping Matrix</CardTitle>
          <p className="text-sm text-muted-foreground">
            Click on any cell to cycle through correlation levels (0-3)
          </p>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead>
              <tr className="bg-muted/50 dark:bg-muted/20">
                <th className="py-3 px-4 text-left font-semibold text-[#0B1F4D] dark:text-foreground sticky left-0 bg-muted/50 dark:bg-muted/20 z-10">
                  CO / PO
                </th>
                {poList.map((po) => (
                  <th
                    key={po}
                    className="py-3 px-2 text-center font-semibold text-[#0B1F4D] dark:text-foreground text-xs"
                  >
                    {po}
                  </th>
                ))}
                <th className="py-3 px-4 text-center font-semibold text-[#F4B942] text-xs">
                  Avg
                </th>
              </tr>
            </thead>
            <tbody>
              {coList.map((co) => {
                const avg = calculateAverageCorrelation(co);
                const coverage = getCoverageStrength(avg);
                return (
                  <tr key={co} className="border-b border-border last:border-0">
                    <td className="py-3 px-4 font-semibold text-[#0B1F4D] dark:text-foreground sticky left-0 bg-white dark:bg-card z-10">
                      {co}
                    </td>
                    {poList.map((po) => {
                      const value = matrix[co]?.[po] ?? 0;
                      return (
                        <td key={po} className="py-2 px-1">
                          <button
                            onClick={() => cycleCorrelation(co, po)}
                            className={`w-full py-2 px-1 rounded-lg border text-center font-bold text-sm transition-all duration-150 hover:scale-105 ${
                              correlationColors[value]
                            } ${
                              selectedCell?.co === co && selectedCell?.po === po
                                ? "ring-2 ring-[#F4B942] ring-offset-1"
                                : ""
                            }`}
                            title={correlationLabels[value]}
                          >
                            {value}
                          </button>
                        </td>
                      );
                    })}
                    <td className="py-3 px-4 text-center">
                      <Badge className={`${coverage.color} text-xs font-bold`}>
                        {avg.toFixed(1)}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="border-0 shadow-md rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Correlation Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {[0, 1, 2, 3].map((val) => (
              <div key={val} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-lg border flex items-center justify-center text-xs font-bold ${correlationColors[val]}`}
                >
                  {val}
                </div>
                <span className="text-xs text-muted-foreground">{correlationLabels[val]}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Coverage Summary */}
      <Card className="border-0 shadow-md rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Coverage Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {coList.map((co) => {
              const avg = calculateAverageCorrelation(co);
              const coverage = getCoverageStrength(avg);
              return (
                <div key={co} className="flex items-center justify-between">
                  <span className="text-sm font-medium w-12">{co}</span>
                  <div className="flex-1 mx-4">
                    <Progress value={(avg / 3) * 100} className="h-2" />
                  </div>
                  <span className="text-xs text-muted-foreground w-16 text-right">
                    {avg.toFixed(1)}/3.0
                  </span>
                  <Badge className={`${coverage.color} text-xs ml-3`}>{coverage.label}</Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
