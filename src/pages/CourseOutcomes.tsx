import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Trash2, Plus, Target } from "lucide-react";
import { toast } from "sonner";

const bloomLevels = ["Remember", "Understand", "Apply", "Analyze", "Evaluate", "Create"] as const;

const bloomColors: Record<string, string> = {
  Remember: "bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400",
  Understand: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
  Apply: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
  Analyze: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
  Evaluate: "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400",
  Create: "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-400",
};

export default function CourseOutcomes() {
  const utils = trpc.useUtils();
  const { data: cos, isLoading } = trpc.courseOutcome.list.useQuery();
  const createCo = trpc.courseOutcome.create.useMutation({
    onSuccess: () => {
      utils.courseOutcome.list.invalidate();
      toast.success("Course outcome created successfully");
      setOpen(false);
      resetForm();
    },
  });
  const updateCo = trpc.courseOutcome.update.useMutation({
    onSuccess: () => {
      utils.courseOutcome.list.invalidate();
      toast.success("Course outcome updated successfully");
      setEditOpen(false);
      resetForm();
    },
  });
  const deleteCo = trpc.courseOutcome.delete.useMutation({
    onSuccess: () => {
      utils.courseOutcome.list.invalidate();
      toast.success("Course outcome deleted successfully");
    },
  });

  const [editOpen, setEditOpen] = useState(false);
  const [, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [coNumber, setCoNumber] = useState("");
  const [description, setDescription] = useState("");
  const [bloomLevel, setBloomLevel] = useState<string>("");
  const [subjectId, setSubjectId] = useState("1");

  function resetForm() {
    setCoNumber("");
    setDescription("");
    setBloomLevel("");
    setEditingId(null);
  }

  function handleCreate() {
    if (!coNumber || !description || !bloomLevel) {
      toast.error("Please fill all required fields");
      return;
    }
    createCo.mutate({
      coNumber,
      description,
      bloomLevel: bloomLevel as any,
      subjectId: parseInt(subjectId),
    });
  }

  function handleUpdate() {
    if (!editingId || !coNumber || !description || !bloomLevel) return;
    updateCo.mutate({
      id: editingId,
      coNumber,
      description,
      bloomLevel: bloomLevel as any,
    });
  }

  function startEdit(co: any) {
    setEditingId(co.id);
    setCoNumber(co.coNumber);
    setDescription(co.description);
    setBloomLevel(co.bloomLevel);
    setEditOpen(true);
  }

  const demoCos = [
    { id: 1, coNumber: "CO1", description: "Understand basic data structures and their applications", bloomLevel: "Understand", attainmentPercent: "78.50", isAttained: true, subjectId: 1 },
    { id: 2, coNumber: "CO2", description: "Apply algorithms for searching and sorting", bloomLevel: "Apply", attainmentPercent: "65.00", isAttained: true, subjectId: 1 },
    { id: 3, coNumber: "CO3", description: "Analyze time and space complexity of algorithms", bloomLevel: "Analyze", attainmentPercent: "82.30", isAttained: true, subjectId: 1 },
    { id: 4, coNumber: "CO4", description: "Evaluate different algorithmic approaches for problem solving", bloomLevel: "Evaluate", attainmentPercent: "54.20", isAttained: false, subjectId: 1 },
    { id: 5, coNumber: "CO5", description: "Create efficient solutions using advanced data structures", bloomLevel: "Create", attainmentPercent: "91.00", isAttained: true, subjectId: 1 },
  ];

  const displayCos = cos && cos.length > 0 ? cos : demoCos;

  return (
    <div className="space-y-6">
      {/* Inline Add Form */}
      <Card className="border-0 shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#F4B942]" />
            Add New Course Outcome
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-xs font-medium text-muted-foreground">CO Number</Label>
              <Input
                placeholder="e.g. CO1"
                value={coNumber}
                onChange={(e) => setCoNumber(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Bloom Level</Label>
              <Select value={bloomLevel} onValueChange={setBloomLevel}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {bloomLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Subject ID</Label>
              <Input
                type="number"
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleCreate}
                className="w-full bg-[#0B1F4D] hover:bg-[#0B1F4D]/90"
                disabled={createCo.isPending}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add CO
              </Button>
            </div>
          </div>
          <div className="mt-4">
            <Label className="text-xs font-medium text-muted-foreground">Description</Label>
            <Textarea
              placeholder="Enter course outcome description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* CO Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="border-0 shadow-md rounded-2xl h-48 animate-pulse">
                <div className="p-5 space-y-4">
                  <div className="h-4 bg-muted rounded w-1/3" />
                  <div className="h-3 bg-muted rounded w-full" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                  <div className="h-8 bg-muted rounded w-full" />
                </div>
              </Card>
            ))
          : displayCos.map((co: any) => (
              <Card
                key={co.id}
                className="border-0 shadow-md rounded-2xl hover:shadow-lg transition-all duration-200 group"
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-lg bg-[#0B1F4D]/10 dark:bg-[#0B1F4D]/20 flex items-center justify-center">
                        <Target className="w-4 h-4 text-[#0B1F4D] dark:text-[#F4B942]" />
                      </div>
                      <div>
                        <h3 className="font-bold text-[#0B1F4D] dark:text-foreground text-sm">
                          {co.coNumber}
                        </h3>
                        <p className="text-[10px] text-muted-foreground">ID: {co.id}</p>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-7 h-7"
                        onClick={() => startEdit(co)}
                      >
                        <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-7 h-7"
                        onClick={() => {
                          if (confirm("Delete this course outcome?")) {
                            deleteCo.mutate({ id: co.id });
                          }
                        }}
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-sm text-foreground/80 mb-3 line-clamp-2">
                    {co.description}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <Badge
                      className={`text-xs font-medium ${
                        bloomColors[co.bloomLevel] || "bg-muted"
                      }`}
                      variant="secondary"
                    >
                      {co.bloomLevel}
                    </Badge>
                    <Badge
                      className={
                        co.isAttained
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                          : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                      }
                    >
                      {co.isAttained ? "Attained" : "Not Attained"}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Attainment</span>
                      <span className="font-semibold">{co.attainmentPercent}%</span>
                    </div>
                    <Progress
                      value={parseFloat(co.attainmentPercent)}
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Edit Course Outcome</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <Label>CO Number</Label>
              <Input value={coNumber} onChange={(e) => setCoNumber(e.target.value)} />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <Label>Bloom Level</Label>
              <Select value={bloomLevel} onValueChange={setBloomLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {bloomLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleUpdate}
              className="w-full bg-[#0B1F4D] hover:bg-[#0B1F4D]/90"
              disabled={updateCo.isPending}
            >
              Update Course Outcome
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
