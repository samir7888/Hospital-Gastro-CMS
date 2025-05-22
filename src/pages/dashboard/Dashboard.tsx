import { Button } from "@/components/ui/button";
import { DashboardStats } from "@/pages/dashboard/dashboard-stats";
import { RecentActivity } from "@/pages/dashboard/recent-activity";
import { QuickActions } from "@/pages/dashboard/quick-actions";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage and update your hospital website content
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link
              to="https://hospital-project-mfls.vercel.app/"
              target="_blank"
            >
              Visit Website
            </Link>
          </Button>
          <Button asChild>
            <Link to="/title">Edit Content</Link>
          </Button>
        </div>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <QuickActions />
        <RecentActivity />
      </div>
    </div>
  );
}
