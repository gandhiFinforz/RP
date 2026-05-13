import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import TrustBar from '@/components/TrustBar'
import Products from '@/components/Products'
import Solutions from '@/components/Solutions'
import Stats from '@/components/Stats'
import FeaturesBento from '@/components/FeaturesBento'
import Testimonials from '@/components/Testimonials'
import HowItWorks from '@/components/HowItWorks'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="overflow-x-clip">
      <Navbar />
      <Hero />
      <TrustBar />
      <Products />
      <Solutions />
      <Stats />
      <FeaturesBento />
      <Testimonials />
      <HowItWorks />
      <CTA />
      <Footer />
    </main>
  )
}
