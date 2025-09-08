import React from 'react'
import './hero.css'
import bgImg from '../../assets/home_Page_first_hero(2).jpeg'

export default function Hero() {
    return (
        <section className="hero-section hero-bg">
            <div className="hero-bg-image" style={{ backgroundImage: `url(${bgImg})` }} aria-hidden="true">
                <img src={bgImg} alt="hero background" className="hero-bg-img-element" aria-hidden="true" />
            </div>
            <div className="max-w-7xl my-[3rem] mx-auto px-6 py-28 relative z-10 text-card-container">
                <div className="lg:w-2/3">
                    <div className="text-card">
                        <h1 className="hero-headline">Post Your Car. Dealers Compete Live. You Get Cash.</h1>
                        <p className="hero-sub">Get top offers on your used car in minutes—without the usual hassle.</p>

                        <div className="hero-ctas">
                            <a href="#" className="btn-white">Get Your Instant Offer</a>
                            <a href="#" className="btn-red">Auction Your Ride</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
