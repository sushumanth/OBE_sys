import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Progress } from "@/components/ui/progress";
import { StickyNote, Plus, Star, MessageSquare, CheckCircle, BarChart3 } from "lucide-react";

const surveyTypes = ["Course Exit", "Program Exit", "Alumni", "Employer"] as const;

const typeIcons: Record<string, string> = {
  "Course Exit": "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
  "Program Exit": "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-400",
  "Alumni": "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
  "Employer": "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
};

const demoSurveys = [
  { id: 1, title: "Data Structures - Course Exit Survey", type: "Course Exit" as const, responses: 42, avgRating: 4.2, isActive: true },
  { id: 2, title: "B.Tech CSE - Program Exit Survey 2024", type: "Program Exit" as const, responses: 128, avgRating: 4.5, isActive: true },
  { id: 3, title: "Alumni Feedback Survey 2024", type: "Alumni" as const, responses: 85, avgRating: 4.3, isActive: true },
  { id: 4, title: "Industry Employer Survey", type: "Employer" as const, responses: 24, avgRating: 4.1, isActive: false },
];

const ratingQuestions = [
  { question: "Course content was well organized", avg: 4.3 },
  { question: "Teaching methods were effective", avg: 4.1 },
  { question: "Course materials were helpful", avg: 4.5 },
  { question: "Assessment was fair and relevant", avg: 3.9 },
  { question: "Overall course satisfaction", avg: 4.2 },
];

export default function Surveys() {
  const [open, setOpen] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<typeof demoSurveys[0] | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0B1F4D] dark:text-foreground">Surveys</h2>
          <p className="text-sm text-muted-foreground">Course exit, program exit, alumni & employer surveys</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#0B1F4D] hover:bg-[#0B1F4D]/90">
              <Plus className="w-4 h-4 mr-1" /> Create Survey
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl max-w-lg">
            <DialogHeader><DialogTitle>Create New Survey</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-4">
              <div><Label>Survey Title</Label><Input placeholder="Enter survey title" /></div>
              <div><Label>Type</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    {surveyTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Description</Label><Textarea rows={3} /></div>
              <Button className="w-full bg-[#0B1F4D]">Create Survey</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {surveyTypes.map((type) => {
          const count = demoSurveys.filter((s) => s.type === type).length;
          return (
            <Card key={type} className="border-0 shadow-md rounded-2xl">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${typeIcons[type]}`}>
                    <StickyNote className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{type}</p>
                    <p className="text-xl font-bold">{count}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Survey Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {demoSurveys.map((survey) => (
          <Card
            key={survey.id}
            className="border-0 shadow-md rounded-2xl cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedSurvey(survey)}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${typeIcons[survey.type]}`}>
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{survey.title}</h3>
                    <Badge variant="outline" className="text-xs mt-1">{survey.type}</Badge>
                  </div>
                </div>
                <Badge className={survey.isActive
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400"
                }>
                  {survey.isActive ? "Active" : "Closed"}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground">
                    <CheckCircle className="w-3.5 h-3.5 inline mr-1" />
                    {survey.responses} responses
                  </span>
                  <span className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.round(survey.avgRating)
                            ? "text-[#F4B942] fill-[#F4B942]"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-1 font-medium">{survey.avgRating}</span>
                  </span>
                </div>
                <Button variant="ghost" size="sm" className="h-8 gap-1">
                  <BarChart3 className="w-3.5 h-3.5" /> Results
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Survey Results */}
      {selectedSurvey && (
        <Card className="border-0 shadow-md rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#F4B942]" />
              {selectedSurvey.title} - Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ratingQuestions.map((q, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{q.question}</span>
                    <span className="font-medium flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-[#F4B942] fill-[#F4B942]" />
                      {q.avg}
                    </span>
                  </div>
                  <Progress value={(q.avg / 5) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
