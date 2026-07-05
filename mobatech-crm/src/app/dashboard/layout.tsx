import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col lg:pl-64 w-full">
        <Header />
        <main className="flex-1 p-4 md:p-8 pt-20 md:pt-24 overflow-y-auto max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
