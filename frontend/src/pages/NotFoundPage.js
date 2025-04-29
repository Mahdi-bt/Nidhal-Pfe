import { Link } from "react-router-dom"
import GlobalHeader from "../components/GlobalHeader"
import Footer from "../components/Footer"

const NotFoundPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <GlobalHeader />
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <h1 className="text-9xl font-bold text-gray-300">404</h1>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Page Not Found</h2>
          <p className="mt-2 text-sm text-gray-600">The page you are looking for doesn't exist or has been moved.</p>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go back home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default NotFoundPage
