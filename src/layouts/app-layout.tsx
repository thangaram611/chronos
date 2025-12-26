import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';

export default function AppLayout() {
  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      {/* Main content area */}
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
      <Toaster position="bottom-center" />
    </div>
  );
}
