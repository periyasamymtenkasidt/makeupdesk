import Navbar from '../components/landing/Navbar'
import Hero from '../components/landing/Hero'
import Services from '../components/landing/Services'
import HowItWorks from '../components/landing/HowItWorks'
import Stats from '../components/landing/Stats'
import Portfolio from '../components/landing/Portfolio'
import Testimonials from '../components/landing/Testimonials'
import BookingCTA from '../components/landing/BookingCTA'
import Footer from '../components/landing/Footer'
import MarqueeBar from '../components/landing/MarqueeBar'

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <MarqueeBar />
      <Services />
      <HowItWorks />
      <Stats />
      <Portfolio />
      <Testimonials />
      <BookingCTA />
      <Footer />
    </div>
  )
}
