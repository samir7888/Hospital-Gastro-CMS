"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Home,
  Layout,
  Award,
  Users,
  Calendar,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  CircleHelp,
  Group,
  Text,
  CalendarCheck,
} from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  open: boolean;
}

interface SidebarItem {
  title: string;
  to: string;
  icon: React.ReactNode;
}

export function Sidebar({ open }: SidebarProps) {
  const pathname = useLocation().pathname;
  const [collapsed, setCollapsed] = useState(false);
  //  const [sidebarOpen, setSidebarOpen] = useState(false);
  const mainItems: SidebarItem[] = [
    {
      title: "Dashboard",
      to: "/dashboard",
      icon: <Home className="h-5 w-5" />,
    },
    
    {
      title: "Pages",
      to: "/pages",
      icon: <Layout className="h-5 w-5" />,
    },
    {
      title: "Comapany Info",
      to: "/company-info",
      icon: <Group className="h-5 w-5" />,
    },

    {
      title: "Services",
      to: "/services",
      icon: <Award className="h-5 w-5" />,
    },
    {
      title: "Doctors",
      to: "/doctors",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "News & Events",
      to: "/news",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      title: "Testimonials",
      to: "/testimonials",
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      title: "FAQ",
      to: "/faq",
      icon: <CircleHelp className="h-5 w-5" />,
    },
    {
      title: "Booked appointments",
      to: "/appointments",
      icon: <CalendarCheck className="h-5 w-5" />,
    },
   
  ];

  const settingsItems: SidebarItem[] = [
    {
      title: "Settings",
      to: "/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  const isActive = (to: string) => {
    if (to === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(to);
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => {}}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full shadow-md bg-background transition-all duration-300 md:relative md:z-0",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          collapsed ? "w-[70px]" : "w-[240px]"
        )}
      >
        <div className="flex h-14 items-center px-4 border-b justify-between">
          {!collapsed && (
            <Link
              to="/dashboard"
              className="flex items-center font-semibold text-lg text-primary"
            >
              Hospital CMS
            </Link>
          )}

          <div className="flex items-center">
            {!collapsed && (
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => {}}
              >
                <X className="h-5 w-5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-56px)] py-2">
          <div className="space-y-6 px-3 py-2">
            <div className="space-y-1">
              {mainItems.map((item) => (
                <Link key={item.to} to={item.to}>
                  <Button
                    variant={isActive(item.to) ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start cursor-pointer",
                      collapsed ? "px-2" : "px-3"
                    )}
                  >
                    {item.icon}
                    {!collapsed && <span className="ml-2">{item.title}</span>}
                  </Button>
                </Link>
              ))}
            </div>

            <div className="space-y-1">
              {settingsItems.map((item) => (
                <Link key={item.to} to={item.to}>
                  <Button
                    variant={isActive(item.to) ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      collapsed ? "px-2" : "px-3"
                    )}
                  >
                    {item.icon}
                    {!collapsed && <span className="ml-2 cursor-pointer">{item.title}</span>}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </ScrollArea>
      </aside>
    </>
  );
}
