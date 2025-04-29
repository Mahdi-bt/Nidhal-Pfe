import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function FeaturedCourses() {
  const courses = [
    {
      id: 1,
      title: "Web Development Fundamentals",
      description: "Learn the basics of HTML, CSS, and JavaScript to build modern websites.",
      duration: "8 weeks",
      level: "Beginner",
      price: "$299",
    },
    {
      id: 2,
      title: "Advanced React Development",
      description: "Master React.js and build complex, interactive web applications.",
      duration: "10 weeks",
      level: "Intermediate",
      price: "$399",
    },
    {
      id: 3,
      title: "Full-Stack Development with MERN",
      description: "Build complete web applications with MongoDB, Express, React, and Node.js.",
      duration: "12 weeks",
      level: "Advanced",
      price: "$499",
    },
  ]

  return (
    <section className="container py-12 md:py-24 lg:py-32">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Featured Courses</h2>
          <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Explore our most popular training programs and start your learning journey today.
          </p>
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
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
              <div className="flex items-center justify-between text-sm">
                <div>Duration: {course.duration}</div>
                <div className="font-bold">{course.price}</div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`/courses/${course.id}`} className="w-full">
                <div className="w-full inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
                  View Details
                </div>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <Link href="/courses">
          <div className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground">
            View All Courses
          </div>
        </Link>
      </div>
    </section>
  )
}
