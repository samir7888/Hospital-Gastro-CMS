import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";

import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <Card className="w-full max-w-md shadow-lg border-blue-100 hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-blue-700">Hospital CMS</CardTitle>
          <CardDescription>Manage your hospital website content</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground mb-6">
            Login to access the content management system for your hospital website.
            Update information about doctors, services, testimonials and more.
          </p>
          <div className="flex justify-center">
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
              <Link to="/dashboard" className="flex items-center justify-center gap-2">
                Access Dashboard <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}