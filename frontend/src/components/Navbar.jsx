import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiMenu, FiX } from 'react-icons/fi'
import { Link, useNavigate, useLocation } from 'react-router-dom'

const Navbar = ({ scrollY }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const isScrolled = scrollY > 50
  const isHomePage = location.pathname === '/'

  const navbarClasses = `fixed top-0 left-0 right-0 z-50 py-3 transition-all duration-300 w-full ${
    isScrolled || !isHomePage ? 'bg-white shadow-md py-2' : 'bg-transparent'
  }`

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMenuOpen && !e.target.closest('.nav-menu') && !e.target.closest('.menu-button')) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isMenuOpen])

  // Handle nav item click - navigate to home page section or smooth scroll
  const handleNavClick = (id) => {
    setIsMenuOpen(false)
    
    if (isHomePage) {
      // If we're already on the home page, just scroll to the section
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      // If we're on another page, navigate to home with the section hash
      navigate(`/#${id}`)
    }
  }

  return (
    <motion.header 
      className={navbarClasses}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-bold text-2xl md:text-3xl">
            <span className="text-primary">V</span>
            <span className="text-dark"> - Connect</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-12">
          <Link to="/" className={`text-dark hover:text-primary cursor-pointer transition-colors font-bold ${location.pathname === '/' ? 'text-primary' : ''}`}>Home</Link>
          <a onClick={() => handleNavClick('about')} className="text-dark hover:text-primary cursor-pointer transition-colors font-bold">About</a>
          <a onClick={() => handleNavClick('how-to-use')} className="text-dark hover:text-primary cursor-pointer transition-colors font-bold">How It Works</a>
          <a onClick={() => handleNavClick('testimonials')} className="text-dark hover:text-primary cursor-pointer transition-colors font-bold">Testimonials</a>
        </nav>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <button onClick={() => handleNavClick('donations')} className="btn-outline">Donate</button>
          <button className="btn-primary">Log In</button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-dark p-2 menu-button" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div 
          className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg py-4 px-4 nav-menu"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <nav className="flex flex-col space-y-4">
            <Link to="/" className="text-dark hover:text-primary cursor-pointer px-4 py-2 hover:bg-gray-50 rounded-md font-bold">Home</Link>
            <a onClick={() => handleNavClick('about')} className="text-dark hover:text-primary cursor-pointer px-4 py-2 hover:bg-gray-50 rounded-md font-bold">About</a>
            <a onClick={() => handleNavClick('how-to-use')} className="text-dark hover:text-primary cursor-pointer px-4 py-2 hover:bg-gray-50 rounded-md font-bold">How It Works</a>
            <a onClick={() => handleNavClick('testimonials')} className="text-dark hover:text-primary cursor-pointer px-4 py-2 hover:bg-gray-50 rounded-md font-bold">Testimonials</a>
            <div className="flex flex-col space-y-2 pt-2 border-t border-gray-100">
              <Link to="/donations" className="btn-outline w-full text-center">Donate</Link>
              <button className="btn-primary w-full">Log In</button>
            </div>
          </nav>
        </motion.div>
      )}
    </motion.header>
  )
}

export default Navbar
