import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';

export default function EmptyLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Outlet />
      <Toaster />
    </div>
  );
}
