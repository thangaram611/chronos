import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header/Sidebar could go here */}
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
}
