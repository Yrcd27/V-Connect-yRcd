import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './sections/Hero'
import About from './sections/About'
import HowToUse from './sections/HowToUse'
import Donations from './sections/Donations'
import Testimonials from './sections/Testimonials'
import Footer from './components/Footer'

// Import Page Components
import AboutPage from './pages/About'
import AllDonationsPage from './pages/AllDonations'
import BlogPage from './pages/Blog'
import ContactPage from './pages/Contact'
import EventsPage from './pages/Events'
import FAQsPage from './pages/FAQs'
import LearnMorePage from './pages/LearnMore'
import Login from './pages/Login'
import OrganizationsPage from './pages/Organizations'
import VolunteerResourcesPage from './pages/VolunteerResources'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import VolunteerDashboard from './pages/VolunteerDashboard'
import VolunteerProfile from './pages/VolunteerProfile'
import OrganizationDashboard from './pages/OrganizationDashboard'
import OrganizationProfile from './pages/OrganizationProfile'
import AdminDashboard from './pages/AdminDashboard'
import CreateDonation from './pages/CreateDonation'
import MyDonations from './pages/MyDonations'
import DonationDetails from './pages/DonationDetails'

// Home page component for the main landing page
const HomePage = () => {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar scrollY={scrollY} />
      
      <motion.main 
        className="flex-grow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Hero />
        <About />
        <HowToUse />
        <Donations />
        <Testimonials />
      </motion.main>
      
      <Footer />
    </div>
  )
}

// ScrollToTop component to handle scroll behavior when navigating
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If there's a hash, scroll to the element with that ID
    if (hash) {
      // Slight delay to ensure DOM is ready
      setTimeout(() => {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // Otherwise scroll to top of the page
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/donations" element={<AllDonationsPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/faqs" element={<FAQsPage />} />
        <Route path="/learn-more" element={<LearnMorePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/volunteer-resources" element={<VolunteerResourcesPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/volunteer-dashboard" element={<VolunteerDashboard />} />
        <Route path="/volunteer-profile" element={<VolunteerProfile />} />
        <Route path="/organization-dashboard" element={<OrganizationDashboard />} />
        <Route path="/organization-profile" element={<OrganizationProfile />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/create-donation" element={<CreateDonation />} />
        <Route path="/my-donations" element={<MyDonations />} />
        <Route path="/donation-details/:id" element={<DonationDetails />} />
      </Routes>
    </Router>
  )
}

export default App
