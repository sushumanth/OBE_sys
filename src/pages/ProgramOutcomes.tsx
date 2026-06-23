import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Pencil, Save, X, Award, TrendingUp } from "lucide-react";
import { toast } from "sonner";

const demoPOs = [
  { id: 1, poNumber: "PO1", description: "Engineering knowledge: Apply the knowledge of mathematics, science, engineering fundamentals, and an engineering specialization to the solution of complex engineering problems.", attainmentPercent: "75.00", departmentId: 1 },
  { id: 2, poNumber: "PO2", description: "Problem analysis: Identify, formulate, research literature, and analyze complex engineering problems reaching substantiated conclusions.", attainmentPercent: "68.00", departmentId: 1 },
  { id: 3, poNumber: "PO3", description: "Design/development of solutions: Design solutions for complex engineering problems and design system components or processes.", attainmentPercent: "82.00", departmentId: 1 },
  { id: 4, poNumber: "PO4", description: "Conduct investigations of complex problems: Use research-based knowledge and research methods including design of experiments.", attainmentPercent: "70.00", departmentId: 1 },
  { id: 5, poNumber: "PO5", description: "Modern tool usage: Create, select, and apply appropriate techniques, resources, and modern engineering and IT tools.", attainmentPercent: "65.00", departmentId: 1 },
  { id: 6, poNumber: "PO6", description: "The engineer and society: Apply reasoning informed by the contextual knowledge to assess societal, health, safety, legal and cultural issues.", attainmentPercent: "78.00", departmentId: 1 },
  { id: 7, poNumber: "PO7", description: "Environment and sustainability: Understand the impact of the professional engineering solutions in societal and environmental contexts.", attainmentPercent: "72.00", departmentId: 1 },
  { id: 8, poNumber: "PO8", description: "Ethics: Apply ethical principles and commit to professional ethics and responsibilities and norms of the engineering practice.", attainmentPercent: "80.00", departmentId: 1 },
  { id: 9, poNumber: "PO9", description: "Individual and team work: Function effectively as an individual, and as a member or leader in diverse teams.", attainmentPercent: "74.00", departmentId: 1 },
  { id: 10, poNumber: "PO10", description: "Communication: Communicate effectively on complex engineering activities with the engineering community and with society at large.", attainmentPercent: "69.00", departmentId: 1 },
  { id: 11, poNumber: "PO11", description: "Project management and finance: Demonstrate knowledge and understanding of the engineering and management principles.", attainmentPercent: "85.00", departmentId: 1 },
  { id: 12, poNumber: "PO12", description: "Life-long learning: Recognize the need for, and have the preparation and ability to engage in independent and life-long learning.", attainmentPercent: "77.00", departmentId: 1 },
];

export default function ProgramOutcomes() {
  const utils = trpc.useUtils();
  const { data: pos } = trpc.programOutcome.list.useQuery();
  const updatePo = trpc.programOutcome.update.useMutation({
    onSuccess: () => {
      utils.programOutcome.list.invalidate();
      toast.success("Program outcome updated");
      setEditingId(null);
    },
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDesc, setEditDesc] = useState("");

  const displayPOs = pos && pos.length > 0 ? pos : demoPOs;
  const avgAttainment =
    displayPOs.reduce((sum: number, po: any) => sum + parseFloat(po.attainmentPercent), 0) / displayPOs.length;

  function startEdit(po: typeof demoPOs[0]) {
    setEditingId(po.id);
    setEditDesc(po.description);
  }

  function saveEdit(id: number) {
    updatePo.mutate({ id, description: editDesc });
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-0 shadow-md rounded-2xl">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total POs</p>
                <p className="text-2xl font-bold text-[#0B1F4D] dark:text-foreground">{displayPOs.length}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#0B1F4D]/10 dark:bg-[#0B1F4D]/20 flex items-center justify-center">
                <Award className="w-5 h-5 text-[#0B1F4D] dark:text-[#F4B942]" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md rounded-2xl">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Attainment</p>
                <p className="text-2xl font-bold text-[#F4B942]">{avgAttainment.toFixed(1)}%</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#F4B942]" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md rounded-2xl">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Above Threshold</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {displayPOs.filter((po: any) => parseFloat(po.attainmentPercent) >= 60).length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/20 flex items-center justify-center">
                <Award className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* PO Cards */}
      <div className="grid grid-cols-1 gap-4">
        {displayPOs.map((po: any) => (
          <Card key={po.id} className="border-0 shadow-md rounded-2xl">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl obe-gradient flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">{po.poNumber}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      {editingId === po.id ? (
                        <div className="space-y-2">
                          <Textarea
                            value={editDesc}
                            onChange={(e) => setEditDesc(e.target.value)}
                            rows={3}
                            className="text-sm"
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => saveEdit(po.id)}
                              className="bg-[#0B1F4D]"
                            >
                              <Save className="w-3.5 h-3.5 mr-1" />
                              Save
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                              <X className="w-3.5 h-3.5 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm text-foreground leading-relaxed">
                            {po.description}
                          </p>
                          <div className="flex items-center gap-4 mt-3">
                            <div className="flex-1 max-w-xs">
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-muted-foreground">Attainment</span>
                                <span className="font-semibold">{po.attainmentPercent}%</span>
                              </div>
                              <Progress
                                value={parseFloat(po.attainmentPercent)}
                                className="h-1.5"
                              />
                            </div>
                            <Badge
                              className={
                                parseFloat(po.attainmentPercent) >= 60
                                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                                  : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                              }
                            >
                              {parseFloat(po.attainmentPercent) >= 60 ? "Attained" : "Review"}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-7 h-7"
                              onClick={() => startEdit(po)}
                            >
                              <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
