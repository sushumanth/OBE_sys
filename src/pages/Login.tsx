import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  CheckCircle,
  Shield,
  BarChart3,
  Users,
  Eye,
  EyeOff,
} from "lucide-react";
import { trpc } from "@/providers/trpc";

export default function Login() {
  const [activeTab, setActiveTab] = useState("admin");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: () => {
      window.location.href = "/dashboard";
    },
    onError: (err) => {
      alert(err.message || "Failed to sign in.");
    },
  });

  const handleLogin = (role: string, useFormInputs = false) => {
    let finalEmail = email;
    if (!useFormInputs || !finalEmail) {
      finalEmail = `${role}@obe.edu`;
    }
    
    loginMutation.mutate({
      email: finalEmail,
      password: password || "password",
      role: role as "admin" | "faculty" | "student",
    });
  };

  const features = [
    "CO-PO Mapping",
    "Attainment Analysis",
    "NBA Reports",
    "Role-Based Access",
  ];

  const roleTabs = [
    { value: "admin", label: "Admin" },
    { value: "faculty", label: "Faculty" },
    { value: "student", label: "Student" },
  ];

  return (
    <div className="min-h-screen flex w-full">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[45%] obe-gradient flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-[#F4B942] rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#F4B942] rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-[#F4B942] flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-[#0B1F4D]" />
            </div>
          </div>
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <h1 className="text-4xl xl:text-5xl font-bold text-white mb-4 leading-tight">
            Outcome Based
            <br />
            Education System
          </h1>
          <p className="text-blue-200/80 text-lg mb-8 max-w-md">
            Comprehensive OBE management platform for engineering colleges.
            Track outcomes, generate reports, ensure NBA/NAAC compliance.
          </p>

          <div className="space-y-4 mb-10">
            {features.map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-[#F4B942] flex-shrink-0" />
                <span className="text-white/90">{feature}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Badge className="bg-[#F4B942]/20 text-[#F4B942] border-[#F4B942]/30 px-4 py-2 text-sm font-medium">
              NBA Compliant
            </Badge>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-4 py-2 text-sm font-medium">
              NAAC Compliant
            </Badge>
          </div>
        </div>

        <div className="relative z-10 text-blue-300/60 text-sm">
          &copy; 2025 OBE Management System. All rights reserved.
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-[#F8FAFC]">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="lg:hidden flex justify-center mb-4">
              <div className="w-14 h-14 rounded-xl bg-[#0B1F4D] flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-[#F4B942]" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-[#0B1F4D] mb-1">
              Welcome Back
            </h2>
            <p className="text-muted-foreground">
              Sign in to access your dashboard
            </p>
          </div>

          <Card className="border-0 shadow-xl shadow-[#0B1F4D]/5 rounded-2xl">
            <CardContent className="p-6">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="w-full grid grid-cols-3 mb-6 bg-muted/50 p-1 rounded-xl">
                  {roleTabs.map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="rounded-lg text-sm font-medium data-[state=active]:bg-[#0B1F4D] data-[state=active]:text-white"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-[#0B1F4D]">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={`Enter your email (e.g. ${activeTab}@obe.edu)`}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11 rounded-xl border-input focus:border-[#0B1F4D] focus:ring-[#0B1F4D]/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-sm font-medium text-[#0B1F4D]">
                        Password
                      </Label>
                      <button className="text-xs text-[#F4B942] hover:text-[#d4a035] font-medium">
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-11 rounded-xl border-input focus:border-[#0B1F4D] focus:ring-[#0B1F4D]/20 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-[#0B1F4D]"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    className="w-full h-11 obe-gradient hover:opacity-90 text-white font-semibold rounded-xl mt-2"
                    disabled={loginMutation.isPending}
                    onClick={() => {
                      handleLogin(activeTab, true);
                    }}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    {loginMutation.isPending ? "Signing In..." : "Sign In"}
                  </Button>

                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-white px-2 text-muted-foreground">
                        or login instantly
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full h-11 rounded-xl border-2 font-medium"
                    disabled={loginMutation.isPending}
                    onClick={() => {
                      handleLogin(activeTab, false);
                    }}
                  >
                    <Users className="w-4 h-4 mr-2 text-[#0B1F4D]" />
                    Continue as {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                  </Button>
                </div>
              </Tabs>
            </CardContent>
          </Card>

          <div className="mt-6 flex items-center justify-center gap-6 text-muted-foreground">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="text-xs">Analytics</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="text-xs">Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span className="text-xs">Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
