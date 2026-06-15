import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="border-0 shadow-xl rounded-2xl max-w-md w-full text-center">
        <CardContent className="p-8">
          <div className="w-20 h-20 rounded-full obe-gradient flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl font-bold text-[#F4B942]">404</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0B1F4D] dark:text-foreground mb-2">
            Page Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => navigate(-1)} className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Go Back
            </Button>
            <Button
              onClick={() => navigate("/dashboard")}
              className="gap-2 bg-[#0B1F4D] hover:bg-[#0B1F4D]/90"
            >
              <Home className="w-4 h-4" /> Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
