import React, { useState, useRef, useEffect } from 'react'
import './testimonial.css'

export default function TestimonialCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isTransitioning, setIsTransitioning] = useState(false)
    const [touchStart, setTouchStart] = useState(null)
    const [touchEnd, setTouchEnd] = useState(null)
    const [cardsToShow, setCardsToShow] = useState(1)
    const carouselRef = useRef(null)

    const testimonials = [
        {
            id: 1,
            name: "Rahul S.",
            designation: "Private Seller",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
            rating: 5,
            review: "Selling a car usually feels like a headache, but Amacar completely changed that experience. The auction process was transparent and I received multiple competitive offers. Great platform!"
        },
        {
            id: 2,
            name: "Priya K.",
            designation: "Verified User",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
            rating: 5,
            review: "I can't believe how quick the process was. Within 24 hours, I had multiple offers and sold my car for a great price. The team was helpful throughout. My go-to recommendation now."
        },
        {
            id: 3,
            name: "Arjun R.",
            designation: "Car Enthusiast",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
            rating: 5,
            review: "As someone who has sold cars through classified ads before, I was amazed by how streamlined Amacar's process is. No haggling, no time wasters. I couldn't have asked for an easier way."
        },
        {
            id: 4,
            name: "Sneha T.",
            designation: "Happy Seller",
            avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
            rating: 5,
            review: "Amacar really lives up to its promise of a win-win solution. The dealers were genuine, the process was smooth, and I got a fair price for my vehicle. Definitely worth using again."
        }
    ]

    // Handle responsive cards display
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setCardsToShow(2)
            } else {
                setCardsToShow(1)
            }
        }

        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // Touch gesture handling
    const minSwipeDistance = 50

    const onTouchStart = (e) => {
        setTouchEnd(null)
        setTouchStart(e.targetTouches[0].clientX)
    }

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX)
    }

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return

        const distance = touchStart - touchEnd
        const isLeftSwipe = distance > minSwipeDistance
        const isRightSwipe = distance < -minSwipeDistance

        if (isLeftSwipe) {
            nextSlide()
        } else if (isRightSwipe) {
            prevSlide()
        }
    }

    // Mouse drag handling
    const [mouseStart, setMouseStart] = useState(null)
    const [mouseEnd, setMouseEnd] = useState(null)
    const [isDragging, setIsDragging] = useState(false)

    const onMouseDown = (e) => {
        setIsDragging(true)
        setMouseStart(e.clientX)
        setMouseEnd(null)
    }

    const onMouseMove = (e) => {
        if (!isDragging) return
        setMouseEnd(e.clientX)
    }

    const onMouseUp = () => {
        if (!isDragging || !mouseStart || !mouseEnd) {
            setIsDragging(false)
            return
        }

        const distance = mouseStart - mouseEnd
        const isLeftSwipe = distance > minSwipeDistance
        const isRightSwipe = distance < -minSwipeDistance

        if (isLeftSwipe) {
            nextSlide()
        } else if (isRightSwipe) {
            prevSlide()
        }

        setIsDragging(false)
    }

    const nextSlide = () => {
        if (isTransitioning) return
        setIsTransitioning(true)
        setCurrentIndex((prevIndex) => {
            const maxIndex = testimonials.length - cardsToShow
            return prevIndex >= maxIndex ? 0 : prevIndex + 1
        })
        setTimeout(() => setIsTransitioning(false), 500)
    }

    const prevSlide = () => {
        if (isTransitioning) return
        setIsTransitioning(true)
        setCurrentIndex((prevIndex) => {
            const maxIndex = testimonials.length - cardsToShow
            return prevIndex === 0 ? maxIndex : prevIndex - 1
        })
        setTimeout(() => setIsTransitioning(false), 500)
    }

    const goToSlide = (index) => {
        if (isTransitioning || index === currentIndex) return
        setIsTransitioning(true)
        setCurrentIndex(index)
        setTimeout(() => setIsTransitioning(false), 500)
    }

    // Calculate transform for sliding effect
    const getTransform = () => {
        const cardWidth = 100 / cardsToShow
        return `translateX(-${currentIndex * cardWidth}%)`
    }

    return (
        <section className="py-16 px-4 bg-gradient-to-br from-slate-50 to-white">
            <div className="max-w-6xl mx-auto p-[1rem]">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                        What Our <span className="text-blue-600">Customers</span> Say
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-500 mx-auto rounded-full"></div>
                </div>

                {/* Carousel Container */}
                <div className="relative overflow-hidden">
                    <div
                        ref={carouselRef}
                        className="flex transition-transform duration-500 ease-in-out select-none"
                        style={{
                            transform: getTransform(),
                            cursor: isDragging ? 'grabbing' : 'grab'
                        }}
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                        onMouseDown={onMouseDown}
                        onMouseMove={onMouseMove}
                        onMouseUp={onMouseUp}
                        onMouseLeave={onMouseUp}
                    >
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={testimonial.id}
                                className="flex-shrink-0 lg:px-4 p-[2rem]"
                                style={{ 
                                    width: `${100 / cardsToShow}%`
                                }}
                            >
                                <div className="group relative bg-gradient-to-br from-white to-slate-50 rounded-3xl p-8 transition-all class-for-shadow duration-500 hover:scale-105 border border-slate-200/50 overflow-hidden h-full">
                                    {/* Decorative background pattern */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/30 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-100/30 to-transparent rounded-full translate-y-12 -translate-x-12"></div>

                                    {/* Quote icon */}
                                    <div className="absolute top-4 right-4 text-blue-200/50 text-4xl font-serif">"</div>

                                    {/* Avatar with enhanced styling */}
                                    <div className="flex justify-center mb-6 relative z-10">
                                        <div className="relative">
                                            <img
                                                src={testimonial.avatar}
                                                alt={testimonial.name}
                                                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-300"
                                            />
                                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Name and Designation */}
                                    <div className="text-center mb-6 relative z-10">
                                        <h3 className="font-bold text-slate-900 text-xl mb-1">
                                            {testimonial.name}
                                        </h3>
                                        <p className="text-sm text-slate-500 font-medium">
                                            {testimonial.designation}
                                        </p>
                                    </div>

                                    {/* Star Rating */}
                                    <div className="flex justify-center space-x-1 mb-6 relative z-10">
                                        {[...Array(5)].map((_, starIndex) => (
                                            <svg
                                                key={starIndex}
                                                className="w-5 h-5 text-yellow-400 drop-shadow-sm"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>

                                    {/* Review */}
                                    <blockquote className="text-slate-700 text-center leading-relaxed text-base relative z-10 italic">
                                        {testimonial.review}
                                    </blockquote>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Navigation Arrows */}
                    <button
                        onClick={prevSlide}
                        disabled={isTransitioning}
                        className={`absolute left-6 top-1/2 transform -translate-y-1/2 -translate-x-6 bg-white rounded-full p-4 transition-all class-for-shadow duration-300 border border-slate-200 cursor-pointer group z-10 ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        aria-label="Previous testimonial"
                    >
                        <svg className="w-6 h-6 text-slate-600 group-hover:text-orange-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <button
                        onClick={nextSlide}
                        disabled={isTransitioning}
                        className={`absolute right-6 top-1/2 transform -translate-y-1/2 translate-x-6 bg-white rounded-full p-4 transition-all class-for-shadow duration-300 border border-slate-200 cursor-pointer group z-20 ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        aria-label="Next testimonial"
                    >
                        <svg className="w-6 h-6 text-slate-600 group-hover:text-orange-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* Dots Navigation */}
                <div className="flex justify-center space-x-2 mt-8">
                    {Array.from({ length: Math.max(1, testimonials.length - cardsToShow + 1) }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            disabled={isTransitioning}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                                ? 'bg-orange-600 scale-125'
                                : 'bg-slate-300 hover:bg-slate-400'
                                } ${isTransitioning ? 'opacity-50' : ''}`}
                            aria-label={`Go to testimonial ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}