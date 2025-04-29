"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  MdHome,
  MdEvent,
  MdPayment,
  MdDescription,
  MdLogout,
  MdSettings,
  MdPeople,
  MdMenu
} from 'react-icons/md'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const recentCourses = [
    {
      id: 1,
      title: "Web Development Fundamentals",
      students: 24,
      sessions: 16,
      status: "Active",
    },
    {
      id: 2,
      title: "Advanced React Development",
      students: 18,
      sessions: 20,
      status: "Active",
    },
    {
      id: 3,
      title: "UX/UI Design Principles",
      students: 15,
      sessions: 12,
      status: "Active",
    },
  ]

  const upcomingSessions = [
    {
      id: 1,
      title: "HTML & CSS Basics",
      course: "Web Development Fundamentals",
      date: "May 15, 2023",
      time: "10:00 AM - 12:00 PM",
      instructor: "John Smith",
      students: 24,
    },
    {
      id: 2,
      title: "JavaScript Fundamentals",
      course: "Web Development Fundamentals",
      date: "May 17, 2023",
      time: "10:00 AM - 12:00 PM",
      instructor: "John Smith",
      students: 24,
    },
    {
      id: 3,
      title: "React Components",
      course: "Advanced React Development",
      date: "May 16, 2023",
      time: "2:00 PM - 4:00 PM",
      instructor: "Emily Rodriguez",
      students: 18,
    },
  ]

  const recentPayments = [
    {
      id: 1,
      student: "Jane Smith",
      course: "Web Development Fundamentals",
      amount: "$299",
      date: "May 10, 2023",
      status: "Paid",
    },
    {
      id: 2,
      student: "Michael Johnson",
      course: "Advanced React Development",
      amount: "$399",
      date: "May 8, 2023",
      status: "Paid",
    },
    {
      id: 3,
      student: "Sarah Williams",
      course: "UX/UI Design Principles",
      amount: "$349",
      date: "May 5, 2023",
      status: "Paid",
    },
  ]

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="hidden w-64 flex-col border-r bg-muted/40 md:flex">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="font-bold text-xl">Training Center</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium">
            <Link
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 ${
                activeTab === "overview" ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50" : ""
              }`}
              href="#"
              onClick={() => setActiveTab("overview")}
            >
              <MdHome className="h-6 w-6" />
              Overview
            </Link>
            <Link
              href="#"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                activeTab === "courses"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
              onClick={() => setActiveTab("courses")}
            >
              <MdDescription className="h-6 w-6" />
              Courses
            </Link>
            <Link
              href="#"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                activeTab === "sessions"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
              onClick={() => setActiveTab("sessions")}
            >
              <MdEvent className="h-6 w-6" />
              Sessions
            </Link>
            <Link
              href="#"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                activeTab === "students"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
              onClick={() => setActiveTab("students")}
            >
              <MdPeople className="h-6 w-6" />
              Students
            </Link>
            <Link
              href="#"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                activeTab === "payments"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
              onClick={() => setActiveTab("payments")}
            >
              <MdPayment className="h-6 w-6" />
              Payments
            </Link>
            <Link
              href="#"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                activeTab === "settings"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
              onClick={() => setActiveTab("settings")}
            >
              <MdSettings className="h-6 w-6" />
              Settings
            </Link>
          </nav>
        </div>
        <div className="mt-auto border-t p-4">
          <div className="flex items-center gap-4 py-4">
            <Avatar>
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Admin User</span>
              <span className="text-xs text-muted-foreground">admin@example.com</span>
            </div>
          </div>
          <Button variant="outline" className="w-full justify-start gap-2" asChild>
            <Link href="/login">
              <MdLogout className="h-6 w-6" />
              Log out
            </Link>
          </Button>
        </div>
      </div>
      {/* Main content */}
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
          <div className="md:hidden">
            <Button variant="outline" size="icon" className="mr-2">
              <MdMenu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Admin Dashboard</h1>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview" onClick={() => setActiveTab("overview")}>
                Overview
              </TabsTrigger>
              <TabsTrigger value="courses" onClick={() => setActiveTab("courses")}>
                Courses
              </TabsTrigger>
              <TabsTrigger value="sessions" onClick={() => setActiveTab("sessions")}>
                Sessions
              </TabsTrigger>
              <TabsTrigger value="payments" onClick={() => setActiveTab("payments")}>
                Payments
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                    <MdDescription className="h-6 w-6 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground">3 new this month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Students</CardTitle>
                    <MdPeople className="h-6 w-6 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">132</div>
                    <p className="text-xs text-muted-foreground">+12% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <MdPayment className="h-6 w-6 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$48,294</div>
                    <p className="text-xs text-muted-foreground">+8% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
                    <MdEvent className="h-6 w-6 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">24</div>
                    <p className="text-xs text-muted-foreground">Next: Today at 10:00 AM</p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4">
                  <CardHeader>
                    <CardTitle>Recent Courses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentCourses.map((course) => (
                        <div key={course.id} className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="font-medium">{course.title}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{course.students} students</span>
                              <span>•</span>
                              <span>{course.sessions} sessions</span>
                            </div>
                          </div>
                          <Badge variant={course.status === "Active" ? "default" : "secondary"}>{course.status}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View All Courses
                    </Button>
                  </CardFooter>
                </Card>
                <Card className="lg:col-span-3">
                  <CardHeader>
                    <CardTitle>Upcoming Sessions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {upcomingSessions.map((session) => (
                      <div key={session.id} className="flex items-start space-x-4">
                        <div className="rounded-md bg-primary/10 p-2">
                          <MdEvent className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{session.title}</p>
                          <p className="text-sm text-muted-foreground">{session.course}</p>
                          <p className="text-xs text-muted-foreground">
                            {session.date} • {session.time}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>Instructor: {session.instructor}</span>
                            <span>•</span>
                            <span>{session.students} students</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View Full Schedule
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="courses" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Manage Courses</h2>
                <Button>Add New Course</Button>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>All Courses</CardTitle>
                  <CardDescription>Manage your training courses and their details.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {recentCourses.map((course) => (
                      <div key={course.id} className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="font-medium">{course.title}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{course.students} students</span>
                            <span>•</span>
                            <span>{course.sessions} sessions</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={course.status === "Active" ? "default" : "secondary"}>{course.status}</Badge>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="sessions" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Manage Sessions</h2>
                <Button>Schedule New Session</Button>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Sessions</CardTitle>
                  <CardDescription>View and manage upcoming training sessions.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {upcomingSessions.map((session) => (
                      <div key={session.id} className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="rounded-md bg-primary/10 p-2">
                            <MdEvent className="h-6 w-6 text-primary" />
                          </div>
                          <div className="space-y-1">
                            <p className="font-medium">{session.title}</p>
                            <p className="text-sm text-muted-foreground">{session.course}</p>
                            <p className="text-sm">
                              {session.date} • {session.time}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>Instructor: {session.instructor}</span>
                              <span>•</span>
                              <span>{session.students} students</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            View Attendees
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="payments" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Payment History</h2>
                <Button>Export Report</Button>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Payments</CardTitle>
                  <CardDescription>View and manage student payments.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {recentPayments.map((payment) => (
                      <div key={payment.id} className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="rounded-md bg-primary/10 p-2">
                            <MdPayment className="h-6 w-6 text-primary" />
                          </div>
                          <div className="space-y-1">
                            <p className="font-medium">{payment.student}</p>
                            <p className="text-sm text-muted-foreground">{payment.course}</p>
                            <p className="text-sm">
                              {payment.amount} • {payment.date}
                            </p>
                            <Badge variant={payment.status === "Paid" ? "default" : "secondary"}>
                              {payment.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            View Invoice
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Payments
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

function Menu(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}
