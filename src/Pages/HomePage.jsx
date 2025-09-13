import Hero from '@/components/Home/Hero/Hero.jsx'
import SectionHeader from '@/components/Home/SectionHeader/SectionHeader.jsx'
import HowItWorks from '@/components/Home/HowItWorks/HowItWorks.jsx'
import WhyChooseAmacar from '@/components/Home/WhyChooseAmacar/WhyChooseAmacar.jsx'
import WinWinAmacar from '@/components/Home/WinWinAmacar/WinWinAmacar.jsx'
import TwoColumnSection from '@/components/Home/TwoColumnSection/TwoColumnSection.jsx'
import TestimonialCarousel from '@/components/Home/TestimonialCarousel/TestimonialCarousel.jsx'
import CarFooterSection from '@/components/Home/CarFooterSection/CarFooterSection.jsx'
import VideoSection from '@/components/Home/VideoSection/videoSection.jsx'
import HeroCarousel from '@/components/Home/Carousel/Carousel.jsx'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'

export default function HomePage() {
  const { userState, loading } = useSelector((state) => state.user);
    useEffect(() => {
        // console.log(userState); 
    })
    return (
        <>
            <Hero />
            <SectionHeader title="How Amacar works" highlight="Sell smarter, faster" />
            <HeroCarousel />
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