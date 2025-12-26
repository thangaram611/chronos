import { useEffect } from 'react';
import PWABadge from '@/PWABadge.tsx';
import '@/App.css';
import { seedDatabase } from '@/lib/seed';
import { useContexts, useInboxTasks, useSchedules } from '@/hooks/use-db';

export default function DashboardPage() {
  useEffect(() => {
    seedDatabase();
  }, []);

  const contexts = useContexts();
  const tasks = useInboxTasks();
  const schedules = useSchedules();

  return (
    <div className="container">
      <h1>Chronos Database Test!!</h1>

      <div className="grid">
        <div className="section">
          <h2>Contexts</h2>
          <ul>
            {contexts?.map((ctx) => (
              <li
                key={ctx.id}
                style={{ borderLeft: `4px solid ${ctx.colorHex}`, paddingLeft: '8px' }}
              >
                {ctx.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="section">
          <h2>Inbox Tasks</h2>
          <ul>
            {tasks?.map((task) => (
              <li key={task.id}>
                [{task.priority}] {task.content} ({task.difficulty})
              </li>
            ))}
          </ul>
        </div>

        <div className="section">
          <h2>Schedule (All)</h2>
          <ul>
            {schedules?.map((sch) => (
              <li key={sch.id}>
                {sch.title} <br />
                <small>
                  {new Date(sch.startTimestamp).toLocaleTimeString()} -{' '}
                  {new Date(sch.endTimestamp).toLocaleTimeString()}
                </small>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <PWABadge />
    </div>
  );
}
