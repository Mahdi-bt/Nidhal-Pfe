import { Link } from "react-router-dom"
import GlobalHeader from "../components/GlobalHeader"
import Footer from "../components/Footer"

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <GlobalHeader />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gray-100 py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Unlock Your Potential with Our Training Programs
                </h1>
                <p className="text-lg mb-6">
                  Discover a wide range of courses designed to help you advance your career and achieve your goals.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/courses" className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium text-center">
                    Explore Courses
                  </Link>
                  <Link
                    to="/register"
                    className="border border-blue-600 text-blue-600 px-6 py-3 rounded-md font-medium text-center"
                  >
                    Sign Up Today
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2">
                <img
                  src="/placeholder.svg?height=400&width=600"
                  alt="Training Center"
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Featured Courses Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Featured Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Course Cards */}
              {[1, 2, 3].map((course) => (
                <div key={course} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img
                    src={`/placeholder.svg?height=200&width=400&text=Course+${course}`}
                    alt={`Course ${course}`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">Course Title {course}</h3>
                    <p className="text-gray-600 mb-4">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
                      labore.
                    </p>
                    <Link to={`/courses/${course}`} className="text-blue-600 font-medium hover:underline">
                      Learn More →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default HomePage
