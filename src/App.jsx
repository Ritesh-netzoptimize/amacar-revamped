import Header from './components/Header/Header.jsx'
import Hero from './components/Hero/Hero.jsx'
import Carousel from './components/Carousel/Carousel.jsx'
import SectionHeader from './components/SectionHeader/SectionHeader.jsx'
import HowItWorks from './components/HowItWorks/HowItWorks.jsx'
import WhyChooseAmacar from './components/WhyChooseAmacar/WhyChooseAmacar.jsx'
import WinWinAmacar from './components/WinWinAmacar/WinWinAmacar.jsx'
import TwoColumnSection from './components/TwoColumnSection/TwoColumnSection.jsx'
import TestimonialCarousel from './components/TestimonialCarousel/TestimonialCarousel.jsx'
import CarFooterSection from './components/CarFooterSection/CarFooterSection.jsx'
import Footer from './components/Footer/Footer.jsx'
import './App.css'
import VideoSection from './components/VideoSection/videoSection.jsx'
import { Toaster } from "react-hot-toast"

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '14px',
              fontWeight: '500',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      <Header />

      <main className="pt-0 bg-white">
        <Hero />
        <SectionHeader title="How Amacar works" highlight="Sell smarter, faster" />
        <Carousel />
        <HowItWorks />
        <VideoSection />
        <WhyChooseAmacar />
        <WinWinAmacar />
        <TwoColumnSection />
        <TestimonialCarousel />
        <CarFooterSection />
      </main>

      <Footer />
    </div>
  )
}

export default App
