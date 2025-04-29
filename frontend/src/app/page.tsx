import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GlobalNav } from "@/components/global-nav"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { FeaturedCourses } from "@/components/featured-courses"
import { Testimonials } from "@/components/testimonials"

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <GlobalNav />
      <main className="flex-1">
        <HeroSection />
        <FeaturedCourses />
        <section className="container py-12 md:py-24 lg:py-32">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Why Choose Our Training Center?
              </h2>
              <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Our training center offers comprehensive courses taught by industry experts. We provide hands-on
                experience and personalized learning paths to help you achieve your goals.
              </p>
            </div>
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Expert Instructors</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Learn from professionals with years of industry experience.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Flexible Learning</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Access your courses anytime, anywhere with our online platform.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Certification</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Receive industry-recognized certifications upon course completion.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <Testimonials />
        <section className="bg-muted py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Ready to Start Learning?</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Join thousands of students who have already taken the first step towards their career goals.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/courses">
                  <Button size="lg">Browse Courses</Button>
                </Link>
                <Link href="/register">
                  <Button variant="outline" size="lg">
                    Register Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
