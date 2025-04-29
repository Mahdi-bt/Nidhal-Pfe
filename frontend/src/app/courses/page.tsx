import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { GlobalNav } from "@/components/global-nav"
import { Footer } from "@/components/footer"
import { Search } from "lucide-react"

export default function CoursesPage() {
  const courses = [
    {
      id: 1,
      title: "Web Development Fundamentals",
      description: "Learn the basics of HTML, CSS, and JavaScript to build modern websites.",
      duration: "8 weeks",
      level: "Beginner",
      price: "$299",
      category: "Web Development",
    },
    {
      id: 2,
      title: "Advanced React Development",
      description: "Master React.js and build complex, interactive web applications.",
      duration: "10 weeks",
      level: "Intermediate",
      price: "$399",
      category: "Web Development",
    },
    {
      id: 3,
      title: "Full-Stack Development with MERN",
      description: "Build complete web applications with MongoDB, Express, React, and Node.js.",
      duration: "12 weeks",
      level: "Advanced",
      price: "$499",
      category: "Web Development",
    },
    {
      id: 4,
      title: "UX/UI Design Principles",
      description: "Learn the fundamentals of user experience and interface design.",
      duration: "6 weeks",
      level: "Beginner",
      price: "$349",
      category: "Design",
    },
    {
      id: 5,
      title: "Data Science Fundamentals",
      description: "Introduction to data analysis, visualization, and machine learning concepts.",
      duration: "10 weeks",
      level: "Beginner",
      price: "$399",
      category: "Data Science",
    },
    {
      id: 6,
      title: "Mobile App Development with React Native",
      description: "Build cross-platform mobile applications using React Native.",
      duration: "8 weeks",
      level: "Intermediate",
      price: "$449",
      category: "Mobile Development",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <GlobalNav />
      <main className="flex-1 container mx-auto py-8 px-4">
        <section className="bg-muted py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Our Courses</h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Browse our comprehensive selection of training courses designed to help you advance your career.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search courses..." className="w-full bg-background pl-8" />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="container py-8 md:py-12">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Card key={course.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{course.title}</CardTitle>
                    <Badge>{course.level}</Badge>
                  </div>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Duration:</span>
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Category:</span>
                      <span>{course.category}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Price:</span>
                      <span className="font-bold">{course.price}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/courses/${course.id}`} className="w-full">
                    <Button className="w-full">View Details</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
