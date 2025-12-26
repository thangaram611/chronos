import { useEffect, useState } from "react"
import { Plus, Trash2, Settings, Bell, CheckCircle2 } from "lucide-react"
import { seedDatabase } from "@/lib/seed"
import { useContexts, useInboxTasks, useSchedules } from "@/hooks/use-db"
import { db } from "@/lib/db"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Container } from "@/components/ui/container"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


import PWABadge from '@/PWABadge.tsx'

export default function DashboardPage() {
  const [newTaskContent, setNewTaskContent] = useState("")

  useEffect(() => {
    // Only seed if empty (optional, but good for demo to not duplicate too much if strict mode runs twice)
    // For now we just run it as in the original code
    seedDatabase()
  }, [])

  const contexts = useContexts()
  const tasks = useInboxTasks()
  const schedules = useSchedules()

  const handleAddTask = async () => {
    if (!newTaskContent.trim()) return
    await db.tasks.add({
      id: crypto.randomUUID(),
      content: newTaskContent,
      status: "TODO",
      difficulty: "MEDIUM",
      iconId: "circle",
      priority: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })
    setNewTaskContent("")
  }

  const handleDeleteTask = async (id: string) => {
    await db.tasks.delete(id)
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <Container className="space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Chronos</h1>
            <p className="text-muted-foreground">Design System & Functional Showcase</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">1. Component Library</h2>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Buttons Card */}
            <Card>
              <CardHeader>
                <CardTitle>Buttons</CardTitle>
                <CardDescription>Various variants and sizes.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
                <Button variant="glass" className="w-full sm:w-auto">Glass Effect</Button>
                <div className="w-full pt-2 flex gap-2 items-center">
                   <Button size="sm">Small</Button>
                   <Button size="icon"><Plus className="h-4 w-4" /></Button>
                   <Button size="lg">Large</Button>
                </div>
              </CardContent>
            </Card>

            {/* Inputs & Dialogs Card */}
            <Card>
              <CardHeader>
                <CardTitle>Interactive</CardTitle>
                <CardDescription>Inputs and Modal Dialogs.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Standard Input..." />
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">Open Dialog</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Glassmorphism Dialog</DialogTitle>
                      <DialogDescription>
                        This dialog uses the glass-card effect on the background.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <p>Content goes here. It floats above the rest of the UI.</p>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Confirm</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            {/* Typography / Glass Card Demo */}
            <Card className="bg-primary/10 border-primary/20">
              <CardHeader>
                <CardTitle>Glass Card</CardTitle>
                <CardDescription>This card uses the glass utility.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="leading-7 [&:not(:first-child)]:mt-6">
                  The background blurs whatever is behind it. In dark mode, this looks especially sleek.
                </p>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-muted-foreground">Footer content</p>
              </CardFooter>
            </Card>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">2. Live Data (Dexie.js)</h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            {/* Inbox Feature */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Inbox Tasks</span>
                  <span className="text-sm font-normal text-muted-foreground">{tasks?.length || 0} items</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Add a new task..." 
                    value={newTaskContent}
                    onChange={(e) => setNewTaskContent(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                  />
                  <Button size="icon" onClick={handleAddTask}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                  {tasks?.map((task) => (
                    <div key={task.id} className="flex items-center justify-between rounded-md border p-2 text-sm bg-background/50">
                       <span className="flex items-center gap-2">
                         <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                         {task.content}
                       </span>
                       <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteTask(task.id)}
                       >
                         <Trash2 className="h-3 w-3" />
                       </Button>
                    </div>
                  ))}
                  {tasks?.length === 0 && (
                     <div className="text-center py-4 text-muted-foreground text-sm">No tasks in inbox</div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {/* Contexts */}
              <Card>
                <CardHeader>
                  <CardTitle>Contexts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {contexts?.map((ctx) => (
                      <div 
                        key={ctx.id} 
                        className="flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium"
                        style={{ 
                          backgroundColor: `${ctx.colorHex}20`, 
                          borderColor: `${ctx.colorHex}40`,
                          color: ctx.colorHex 
                        }}
                      >
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: ctx.colorHex }} />
                        {ctx.name}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Schedules */}
              <Card>
                <CardHeader>
                  <CardTitle>Today's Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {schedules?.map((sch) => (
                      <div key={sch.id} className="flex gap-4 border-l-2 pl-4" style={{ borderColor: 'hsl(var(--primary))' }}>
                        <div className="text-xs text-muted-foreground min-w-[60px]">
                          {new Date(sch.startTimestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{sch.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {Math.round((sch.endTimestamp - sch.startTimestamp) / 1000 / 60)} min
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </Container>
      <PWABadge />
    </div>
  )
}