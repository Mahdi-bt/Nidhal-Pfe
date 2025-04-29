import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Training Center</h3>
            <p className="mb-4">Empowering individuals through quality education and training.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-gray-300 hover:text-white">
                  Courses
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Courses</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/courses/web-development" className="text-gray-300 hover:text-white">
                  Web Development
                </Link>
              </li>
              <li>
                <Link to="/courses/data-science" className="text-gray-300 hover:text-white">
                  Data Science
                </Link>
              </li>
              <li>
                <Link to="/courses/design" className="text-gray-300 hover:text-white">
                  UX/UI Design
                </Link>
              </li>
              <li>
                <Link to="/courses/mobile" className="text-gray-300 hover:text-white">
                  Mobile Development
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <address className="not-italic text-gray-300">
              <p className="mb-2">123 Education Street</p>
              <p className="mb-2">Learning City, LC 12345</p>
              <p className="mb-2">Phone: (123) 456-7890</p>
              <p>Email: info@trainingcenter.com</p>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Training Center. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
