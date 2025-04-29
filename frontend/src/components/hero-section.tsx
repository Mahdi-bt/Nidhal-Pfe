import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Unlock Your Potential with Our Training Programs
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                Discover a wide range of courses designed to help you advance your career and achieve your goals.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/courses">
                <Button size="lg">Explore Courses</Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" size="lg">
                  Sign Up Today
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <img
              alt="Training Center"
              className="aspect-video overflow-hidden rounded-xl object-cover object-center"
              height="310"
              src="/placeholder.svg?height=620&width=1100"
              width="550"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
