import { Header } from "@/pages/dashboard/header";
import { Sidebar } from "@/pages/dashboard/sidebar";
import { useState } from "react";
import { Outlet } from "react-router-dom";

const Applayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar open={sidebarOpen}  />
      <div className="flex flex-col flex-1">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 p-4 md:p-6 bg-white overflow-y-auto max-h-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Applayout;
