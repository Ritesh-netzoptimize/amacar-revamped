import React from 'react'
import './how-it-works.css'
import { motion } from 'framer-motion'

export default function HowItWorks() {
    const steps = [
        {
            number: 1,
            title: "List in 3 minutes",
            description: "Simply enter your car details and VIN number to get started.",
            icon: "📝"
        },
        {
            number: 2,
            title: "Receive live bids",
            description: "Dealers compete in real-time auctions for your vehicle.",
            icon: "🔨"
        },
        {
            number: 3,
            title: "Pick your top offer & get paid",
            description: "Choose the best offer and complete the sale seamlessly.",
            icon: "🤝"
        }
    ]

    // 🔹 Animation variants
    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.2, duration: 0.5, ease: "easeOut" }
        })
    }

    return (
        <section className="how-it-works-section">
            <motion.div 
                className="container"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                {/* Section Header */}
                <motion.div 
                    className="how-it-works-header"
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="how-it-works-title">How It Works</h2>
                    <div className="title-underline"></div>
                </motion.div>

                {/* Steps Grid */}
                <motion.div className="steps-grid">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.number}
                            className="step-card"
                            custom={index}
                            variants={cardVariants}
                        >
                            {/* Step Number Badge */}
                            <motion.div className="step-badge">
                                <span className="step-number">{step.number}</span>
                            </motion.div>

                            {/* Step Icon */}
                            <motion.div className="step-icon">
                                <span className="icon-emoji">{step.icon}</span>
                            </motion.div>

                            {/* Step Content */}
                            <motion.div className="step-content">
                                <h3 className="step-title">{step.title}</h3>
                                <p className="step-description">{step.description}</p>
                            </motion.div>

                            {/* Connecting Line */}
                            {index < steps.length - 1 && (
                                <motion.div className="connecting-line"></motion.div>
                            )}
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </section>
    )
}
