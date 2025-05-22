import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Newspaper, CalendarClock, Star } from "lucide-react";

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard 
        title="Doctors" 
        value="12" 
        description="Active specialists" 
        icon={<Users className="h-4 w-4 text-blue-500" />}
        trend="+2 this month"
      />
      <StatsCard 
        title="News & Events" 
        value="8" 
        description="Published items" 
        icon={<Newspaper className="h-4 w-4 text-emerald-500" />}
        trend="+3 this week"
      />
      <StatsCard 
        title="Upcoming Events" 
        value="4" 
        description="Scheduled events" 
        icon={<CalendarClock className="h-4 w-4 text-purple-500" />}
        trend="Next: Jun 15"
      />
      <StatsCard 
        title="Testimonials" 
        value="32" 
        description="Patient reviews" 
        icon={<Star className="h-4 w-4 text-amber-500" />}
        trend="+5 this month"
      />
    </div>
  );
}

function StatsCard({
  title,
  value,
  description,
  icon,
  trend
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        <div className="mt-2 text-xs font-medium text-blue-600">{trend}</div>
      </CardContent>
    </Card>
  );
}