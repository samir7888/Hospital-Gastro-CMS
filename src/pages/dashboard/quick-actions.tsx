import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  ImagePlus,
  Users,
  FileText,
  Calendar,
  MessageSquareQuote,
} from "lucide-react";
import { Link } from "react-router-dom";

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common content management tasks</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <QuickActionButton
          to="/pages"
          icon={<ImagePlus className="mr-2 h-4 w-4" />}
          label="Update Hero Section"
        />
        <QuickActionButton
          to="/doctors"
          icon={<Users className="mr-2 h-4 w-4" />}
          label="Manage Doctors"
        />
        <QuickActionButton
          to="/features"
          icon={<FileText className="mr-2 h-4 w-4" />}
          label="Edit Features"
        />
        <QuickActionButton
          to="/news"
          icon={<Calendar className="mr-2 h-4 w-4" />}
          label="Add News & Events"
        />
        <QuickActionButton
          to="/testimonials"
          icon={<MessageSquareQuote className="mr-2 h-4 w-4" />}
          label="Update Testimonials"
        />
      </CardContent>
    </Card>
  );
}

function QuickActionButton({
  to,
  icon,
  label,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Button asChild variant="outline" className="justify-start">
      <Link to={to}>
        {icon}
        {label}
      </Link>
    </Button>
  );
}
