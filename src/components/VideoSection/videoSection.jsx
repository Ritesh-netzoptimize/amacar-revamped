import React from 'react'
import { motion } from 'framer-motion'
import './videoSection.css'
import vd from '../../assets/video_amacar.mp4'

export default function VideoSection() {

    return (
        <section className="video-section">
            <div className='left-text-section'>
                <p className='left-text-heading title-accent'>Sell Your Car the Smarter Way</p>
                <p className='left-text-content'>Skip the hassle of endless listings and lowball offers. With Amacar, dealers compete to buy your car, giving you the best price quickly, securely, and stress-free—cash in hand, without compromise.</p>
            </div>
            <div className='right-video-section'>
                <video className='video-element' controls loop muted playsInline>
                    <source src={vd} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
        </section>
    )
}
