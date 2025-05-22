

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback,  } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export function RecentActivity() {
  const activities = [
    {
      id: 1,
      user: "Admin",
      action: "Updated hero section",
      time: "2 hours ago",
      avatar: "A",
      type: "update"
    },
    {
      id: 2,
      user: "Editor",
      action: "Added new doctor: Dr. Sarah Johnson",
      time: "Yesterday",
      avatar: "E",
      type: "add"
    },
    {
      id: 3,
      user: "Admin",
      action: "Published a new event",
      time: "2 days ago",
      avatar: "A",
      type: "publish"
    },
    {
      id: 4,
      user: "Editor",
      action: "Updated footer contact details",
      time: "3 days ago",
      avatar: "E",
      type: "update"
    },
    {
      id: 5,
      user: "Admin",
      action: "Added new testimonial",
      time: "4 days ago",
      avatar: "A",
      type: "add"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest content updates</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center gap-4">
            <Avatar className="h-8 w-8">
              <AvatarFallback className={cn(
                activity.type === "add" && "bg-green-100 text-green-700",
                activity.type === "update" && "bg-blue-100 text-blue-700",
                activity.type === "publish" && "bg-purple-100 text-purple-700"
              )}>
                {activity.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">{activity.action}</p>
              <p className="text-xs text-muted-foreground">{activity.user} · {activity.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}