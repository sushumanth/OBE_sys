import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "@/providers/theme-provider";
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Palette,
  Globe,
  Save,
} from "lucide-react";
import { toast } from "sonner";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold text-[#0B1F4D] dark:text-foreground">Settings</h2>
        <p className="text-sm text-muted-foreground">Configure application preferences</p>
      </div>

      {/* Appearance */}
      <Card className="border-0 shadow-md rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Palette className="w-4 h-4 text-[#F4B942]" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Theme</p>
              <p className="text-xs text-muted-foreground">Select your preferred theme</p>
            </div>
            <Select
              value={theme}
              onValueChange={(v: any) => setTheme(v)}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="border-0 shadow-md rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#F4B942]" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Push Notifications</p>
              <p className="text-xs text-muted-foreground">Receive push notifications for important events</p>
            </div>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Email Alerts</p>
              <p className="text-xs text-muted-foreground">Get email alerts for attainment updates</p>
            </div>
            <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="border-0 shadow-md rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#F4B942]" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label>Current Password</Label>
            <Input type="password" placeholder="Enter current password" />
          </div>
          <div className="grid gap-2">
            <Label>New Password</Label>
            <Input type="password" placeholder="Enter new password" />
          </div>
          <div className="grid gap-2">
            <Label>Confirm Password</Label>
            <Input type="password" placeholder="Confirm new password" />
          </div>
        </CardContent>
      </Card>

      {/* General */}
      <Card className="border-0 shadow-md rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <SettingsIcon className="w-4 h-4 text-[#F4B942]" />
            General
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Auto Save</p>
              <p className="text-xs text-muted-foreground">Automatically save changes while editing</p>
            </div>
            <Switch checked={autoSave} onCheckedChange={setAutoSave} />
          </div>
          <Separator />
          <div className="grid gap-2">
            <Label className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5" />
              Attainment Threshold
            </Label>
            <Input type="number" defaultValue={60} className="max-w-xs" />
            <p className="text-xs text-muted-foreground">
              Minimum percentage for a CO/PO to be considered attained
            </p>
          </div>
        </CardContent>
      </Card>

      <Button
        className="bg-[#0B1F4D] hover:bg-[#0B1F4D]/90 gap-2"
        onClick={() => toast.success("Settings saved successfully")}
      >
        <Save className="w-4 h-4" /> Save Settings
      </Button>
    </div>
  );
}
