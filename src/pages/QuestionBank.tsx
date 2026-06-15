import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Plus, BookOpen, CheckCircle, Clock, XCircle, FileText } from "lucide-react";

const bloomLevels = ["Remember", "Understand", "Apply", "Analyze", "Evaluate", "Create"] as const;
const difficulties = ["Easy", "Medium", "Hard"] as const;

const bloomColors: Record<string, string> = {
  Remember: "bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400",
  Understand: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
  Apply: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
  Analyze: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
  Evaluate: "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400",
  Create: "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-400",
};

const statusConfig: Record<string, { icon: typeof CheckCircle; color: string; bg: string }> = {
  Draft: { icon: FileText, color: "text-gray-500", bg: "bg-gray-100 dark:bg-gray-500/20" },
  Pending: { icon: Clock, color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-500/20" },
  Approved: { icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-500/20" },
  Rejected: { icon: XCircle, color: "text-red-500", bg: "bg-red-100 dark:bg-red-500/20" },
};

const demoQuestions = [
  { id: 1, question: "Explain the concept of binary search trees and their operations.", unit: 3, marks: 8, difficulty: "Medium", bloomLevel: "Understand", mappedCoId: 1, subjectId: 1, createdBy: 1, status: "Approved", approvedBy: 2 },
  { id: 2, question: "Implement a hash table with collision resolution using chaining.", unit: 4, marks: 10, difficulty: "Hard", bloomLevel: "Create", mappedCoId: 2, subjectId: 1, createdBy: 1, status: "Approved", approvedBy: 2 },
  { id: 3, question: "Compare and contrast BFS and DFS algorithms with examples.", unit: 5, marks: 6, difficulty: "Medium", bloomLevel: "Analyze", mappedCoId: 3, subjectId: 1, createdBy: 1, status: "Pending", approvedBy: null },
  { id: 4, question: "Define time complexity and space complexity with examples.", unit: 1, marks: 4, difficulty: "Easy", bloomLevel: "Remember", mappedCoId: 1, subjectId: 1, createdBy: 1, status: "Draft", approvedBy: null },
  { id: 5, question: "Evaluate different sorting algorithms for a given dataset.", unit: 2, marks: 8, difficulty: "Hard", bloomLevel: "Evaluate", mappedCoId: 4, subjectId: 1, createdBy: 1, status: "Rejected", approvedBy: null },
];

export default function QuestionBank() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [unit, setUnit] = useState("");
  const [marks, setMarks] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [bloomLevel, setBloomLevel] = useState("");
  // mappedCo is used for question-CO mapping

  const statusCounts = {
    All: demoQuestions.length,
    Draft: demoQuestions.filter((q) => q.status === "Draft").length,
    Pending: demoQuestions.filter((q) => q.status === "Pending").length,
    Approved: demoQuestions.filter((q) => q.status === "Approved").length,
    Rejected: demoQuestions.filter((q) => q.status === "Rejected").length,
  };

  function getFilteredQuestions(status: string) {
    if (status === "All") return demoQuestions;
    return demoQuestions.filter((q) => q.status === status);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0B1F4D] dark:text-foreground">Question Bank</h2>
          <p className="text-sm text-muted-foreground">Manage questions with approval workflow</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#0B1F4D] hover:bg-[#0B1F4D]/90">
              <Plus className="w-4 h-4 mr-1" /> Add Question
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Question</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label>Question</Label>
                <Textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  rows={3}
                  placeholder="Enter question text..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Unit</Label>
                  <Input type="number" value={unit} onChange={(e) => setUnit(e.target.value)} />
                </div>
                <div>
                  <Label>Marks</Label>
                  <Input type="number" value={marks} onChange={(e) => setMarks(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Difficulty</Label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {difficulties.map((d) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Bloom Level</Label>
                  <Select value={bloomLevel} onValueChange={setBloomLevel}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {bloomLevels.map((b) => (
                        <SelectItem key={b} value={b}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="w-full bg-[#0B1F4D] hover:bg-[#0B1F4D]/90">Create Question</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="All">
        <TabsList className="bg-muted/50 p-1 rounded-xl">
          {Object.entries(statusCounts).map(([status, count]) => (
            <TabsTrigger
              key={status}
              value={status}
              className="rounded-lg text-sm data-[state=active]:bg-[#0B1F4D] data-[state=active]:text-white"
            >
              {status}
              <Badge variant="secondary" className="ml-2 text-xs h-5 px-1.5">{count}</Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.keys(statusCounts).map((status) => (
          <TabsContent key={status} value={status}>
            <div className="grid grid-cols-1 gap-4">
              {getFilteredQuestions(status).map((q) => {
                const StatusIcon = statusConfig[q.status]?.icon || FileText;
                return (
                  <Card key={q.id} className="border-0 shadow-md rounded-2xl">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#0B1F4D]/10 dark:bg-[#0B1F4D]/20 flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-4 h-4 text-[#0B1F4D] dark:text-[#F4B942]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground mb-2">
                            {q.question}
                          </p>
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline" className="text-xs">Unit {q.unit}</Badge>
                            <Badge variant="outline" className="text-xs">{q.marks} marks</Badge>
                            <Badge
                              className={bloomColors[q.bloomLevel] || "bg-muted"}
                              variant="secondary"
                            >
                              {q.bloomLevel}
                            </Badge>
                            <Badge
                              className={
                                q.difficulty === "Easy"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : q.difficulty === "Medium"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-red-100 text-red-700"
                              }
                            >
                              {q.difficulty}
                            </Badge>
                            <Badge className={`${statusConfig[q.status]?.bg} ${statusConfig[q.status]?.color}`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {q.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          {q.status === "Pending" && (
                            <>
                              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 h-8">
                                <CheckCircle className="w-3.5 h-3.5 mr-1" /> Approve
                              </Button>
                              <Button size="sm" variant="destructive" className="h-8">
                                <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                              </Button>
                            </>
                          )}
                          {q.status === "Draft" && (
                            <Button size="sm" variant="outline" className="h-8">
                              <Clock className="w-3.5 h-3.5 mr-1" /> Submit
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
