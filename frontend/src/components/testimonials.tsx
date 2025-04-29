import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Web Developer",
      content:
        "The web development course was exactly what I needed to transition into a tech career. The instructors were knowledgeable and supportive throughout the entire program.",
      avatar: "SJ",
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Software Engineer",
      content:
        "I took the advanced React course and it significantly improved my skills. The hands-on projects were challenging and relevant to real-world applications.",
      avatar: "MC",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "UX Designer",
      content:
        "The UX/UI design course provided me with the skills and confidence to pursue a career in design. The feedback from instructors was invaluable to my growth.",
      avatar: "ER",
    },
  ]

  return (
    <section className="container py-12 md:py-24 lg:py-32">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">What Our Students Say</h2>
          <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Hear from our graduates about their experience with our training programs.
          </p>
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                  <CardDescription>{testimonial.role}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-gray-500 dark:text-gray-400">{testimonial.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
