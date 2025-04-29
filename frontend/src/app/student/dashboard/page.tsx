"use client"

import React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  MdMenu,
  MdHome,
  MdEvent,
  MdAccessTime,
  MdPayment,
  MdDescription,
  MdLogout,
  MdSettings,
  MdPerson
} from 'react-icons/md'

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const enrolledCourses = [
    {
      id: 1,
      title: "Web Development Fundamentals",
      progress: 65,
      nextSession: "Tomorrow, 10:00 AM",
      instructor: "John Smith",
    },
    {
      id: 2,
      title: "UX/UI Design Principles",
      progress: 30,
      nextSession: "Thursday, 2:00 PM",
      instructor: "Sarah Johnson",
    },
  ]

  const upcomingSessions = [
    {
      id: 1,
      title: "HTML & CSS Basics",
      course: "Web Development Fundamentals",
      date: "May 15, 2023",
      time: "10:00 AM - 12:00 PM",
    },
    {
      id: 2,
      title: "JavaScript Fundamentals",
      course: "Web Development Fundamentals",
      date: "May 17, 2023",
      time: "10:00 AM - 12:00 PM",
    },
    {
      id: 3,
      title: "User Research Methods",
      course: "UX/UI Design Principles",
      date: "May 18, 2023",
      time: "2:00 PM - 4:00 PM",
    },
  ]

  const recentPayments = [
    {
      id: 1,
      course: "Web Development Fundamentals",
      amount: "$299",
      date: "April 28, 2023",
      status: "Paid",
    },
    {
      id: 2,
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
              href="/student/dashboard"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                activeTab === "overview"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              <MdHome className="h-4 w-4" />
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
              <MdDescription className="h-4 w-4" />
              My Courses
            </Link>
            <Link
              href="#"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                activeTab === "schedule"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
              onClick={() => setActiveTab("schedule")}
            >
              <MdEvent className="h-4 w-4" />
              Schedule
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
              <MdPayment className="h-4 w-4" />
              Payments
            </Link>
            <Link
              href="#"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                activeTab === "profile"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
              onClick={() => setActiveTab("profile")}
            >
              <MdPerson className="h-4 w-4" />
              Profile
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
              <MdSettings className="h-4 w-4" />
              Settings
            </Link>
          </nav>
        </div>
        <div className="mt-auto border-t p-4">
          <div className="flex items-center gap-4 py-4">
            <Avatar>
              <AvatarFallback>JS</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Jane Smith</span>
              <span className="text-xs text-muted-foreground">jane.smith@example.com</span>
            </div>
          </div>
          <Button variant="outline" className="w-full justify-start gap-2" asChild>
            <Link href="/login">
              <MdLogout className="h-4 w-4" />
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
              <MdMenu className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Student Dashboard</h1>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview" onClick={() => setActiveTab("overview")}>
                Overview
              </TabsTrigger>
              <TabsTrigger value="courses" onClick={() => setActiveTab("courses")}>
                My Courses
              </TabsTrigger>
              <TabsTrigger value="schedule" onClick={() => setActiveTab("schedule")}>
                Schedule
              </TabsTrigger>
              <TabsTrigger value="payments" onClick={() => setActiveTab("payments")}>
                Payments
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
                    <MdDescription className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{enrolledCourses.length}</div>
                    <p className="text-xs text-muted-foreground">
                      {enrolledCourses.length > 0 ? "Active courses" : "No active courses"}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
                    <MdEvent className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{upcomingSessions.length}</div>
                    <p className="text-xs text-muted-foreground">Next: {upcomingSessions[0]?.date}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                    <MdPayment className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$648</div>
                    <p className="text-xs text-muted-foreground">2 payments</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
                    <MdAccessTime className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">47.5%</div>
                    <p className="text-xs text-muted-foreground">Across all courses</p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4">
                  <CardHeader>
                    <CardTitle>My Courses</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {enrolledCourses.map((course) => (
                      <div key={course.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{course.title}</div>
                          <div className="text-sm text-muted-foreground">{course.progress}%</div>
                        </div>
                        <Progress value={course.progress} />
                        <div className="flex items-center justify-between text-sm">
                          <div className="text-muted-foreground">Next session: {course.nextSession}</div>
                          <div className="text-muted-foreground">Instructor: {course.instructor}</div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/courses">Browse More Courses</Link>
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
                          <MdEvent className="h-4 w-4 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{session.title}</p>
                          <p className="text-sm text-muted-foreground">{session.course}</p>
                          <p className="text-xs text-muted-foreground">
                            {session.date} • {session.time}
                          </p>
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
              <h2 className="text-2xl font-bold tracking-tight">My Courses</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {enrolledCourses.map((course) => (
                  <Card key={course.id} className="flex flex-col">
                    <CardHeader>
                      <CardTitle>{course.title}</CardTitle>
                      <CardDescription>Instructor: {course.instructor}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Progress</span>
                          <span className="text-sm font-medium">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} />
                        <p className="text-sm text-muted-foreground">Next session: {course.nextSession}</p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">Continue Learning</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="schedule" className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">My Schedule</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {upcomingSessions.map((session) => (
                      <div key={session.id} className="flex items-start space-x-4">
                        <div className="rounded-md bg-primary/10 p-2">
                          <MdEvent className="h-4 w-4 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium">{session.title}</p>
                          <p className="text-sm text-muted-foreground">{session.course}</p>
                          <p className="text-sm">
                            {session.date} • {session.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="payments" className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">Payment History</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {recentPayments.map((payment) => (
                      <div key={payment.id} className="flex items-start space-x-4">
                        <div className="rounded-md bg-primary/10 p-2">
                          <MdPayment className="h-4 w-4 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium">{payment.course}</p>
                          <p className="text-sm">{payment.amount}</p>
                          <p className="text-sm text-muted-foreground">
                            {payment.date} • {payment.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Download All Invoices
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
