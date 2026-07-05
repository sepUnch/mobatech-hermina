export default function DashboardLoading() {
  return (
    <div className="w-full h-[60vh] flex flex-col items-center justify-center animate-slide-in">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      <p className="mt-4 text-foreground/60 font-medium">Memuat data...</p>
    </div>
  );
}
