import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil, Trash2, Plus, School } from "lucide-react";
import { toast } from "sonner";

const demoPSOs = [
  { id: 1, psoNumber: "PSO1", description: "Apply knowledge of computer science and engineering principles to design, develop, and maintain software systems and applications.", departmentId: 1 },
  { id: 2, psoNumber: "PSO2", description: "Analyze, design, and implement solutions for real-world problems using modern tools and technologies in computer science.", departmentId: 1 },
  { id: 3, psoNumber: "PSO3", description: "Demonstrate professional ethics, effective communication skills, and ability to work in multidisciplinary teams.", departmentId: 1 },
];

export default function PsoManagement() {
  const utils = trpc.useUtils();
  const { data: psos } = trpc.pso.list.useQuery();
  const createPso = trpc.pso.create.useMutation({
    onSuccess: () => { utils.pso.list.invalidate(); toast.success("PSO created"); setOpen(false); resetForm(); },
  });
  const updatePso = trpc.pso.update.useMutation({
    onSuccess: () => { utils.pso.list.invalidate(); toast.success("PSO updated"); setEditOpen(false); },
  });
  const deletePso = trpc.pso.delete.useMutation({
    onSuccess: () => { utils.pso.list.invalidate(); toast.success("PSO deleted"); },
  });

  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [psoNumber, setPsoNumber] = useState("");
  const [description, setDescription] = useState("");
  const [editPsoNumber, setEditPsoNumber] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const displayPSOs = psos && psos.length > 0 ? psos : demoPSOs;

  function resetForm() {
    setPsoNumber("");
    setDescription("");
  }

  function handleCreate() {
    if (!psoNumber || !description) { toast.error("Fill all fields"); return; }
    createPso.mutate({ psoNumber, description, departmentId: 1 });
  }

  function startEdit(pso: typeof demoPSOs[0]) {
    setEditingId(pso.id);
    setEditPsoNumber(pso.psoNumber);
    setEditDescription(pso.description);
    setEditOpen(true);
  }

  function handleUpdate() {
    if (!editingId) return;
    updatePso.mutate({ id: editingId, psoNumber: editPsoNumber, description: editDescription });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0B1F4D] dark:text-foreground">Program Specific Outcomes</h2>
          <p className="text-sm text-muted-foreground">Manage department-specific outcomes</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#0B1F4D] hover:bg-[#0B1F4D]/90">
              <Plus className="w-4 h-4 mr-1" /> Add PSO
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl">
            <DialogHeader><DialogTitle>Create PSO</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-4">
              <div><Label>PSO Number</Label><Input value={psoNumber} onChange={(e) => setPsoNumber(e.target.value)} placeholder="e.g. PSO1" /></div>
              <div><Label>Description</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} /></div>
              <Button onClick={handleCreate} className="w-full bg-[#0B1F4D]">Create PSO</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {displayPSOs.map((pso: any) => (
          <Card key={pso.id} className="border-0 shadow-md rounded-2xl group">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-violet-50 dark:bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                  <School className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-400 font-bold">
                      {pso.psoNumber}
                    </Badge>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => startEdit(pso)}>
                        <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => { if (confirm("Delete?")) deletePso.mutate({ id: pso.id }); }}>
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-foreground/80">{pso.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader><DialogTitle>Edit PSO</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-4">
            <div><Label>PSO Number</Label><Input value={editPsoNumber} onChange={(e) => setEditPsoNumber(e.target.value)} /></div>
            <div><Label>Description</Label><Textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} rows={4} /></div>
            <Button onClick={handleUpdate} className="w-full bg-[#0B1F4D]">Update PSO</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
