import Hero from '@/components/Home/Hero/Hero.jsx'
import SectionHeader from '@/components/Home/SectionHeader/SectionHeader.jsx'
import Carousel from '@/components/Home/Carousel/Carousel.jsx'
import HowItWorks from '@/components/Home/HowItWorks/HowItWorks.jsx'
import WhyChooseAmacar from '@/components/Home/WhyChooseAmacar/WhyChooseAmacar.jsx'
import WinWinAmacar from '@/components/Home/WinWinAmacar/WinWinAmacar.jsx'
import TwoColumnSection from '@/components/Home/TwoColumnSection/TwoColumnSection.jsx'
import TestimonialCarousel from '@/components/Home/TestimonialCarousel/TestimonialCarousel.jsx'
import CarFooterSection from '@/components/Home/CarFooterSection/CarFooterSection.jsx'
import VideoSection from '@/components/Home/VideoSection/videoSection.jsx'

export default function HomePage() {
    return (
        <>
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
        </>
    )
}