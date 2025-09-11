import React from 'react'
import { motion } from 'framer-motion'
import './win-win-amacar.css'

export default function WinWinAmacar() {
    const steps = [
        {
            id: 1,
            title: "Get a Competitive Value",
            description: "Start by getting your instant cash offer.",
            icon: "💰",
            color: "var(--brand-orange)"
        },
        {
            id: 2,
            title: "Accept the Offer",
            description: "Accept the offer by selected dealer.",
            icon: "✅",
            color: "var(--accent)"
        },
        {
            id: 3,
            title: "Auction Your Ride",
            description: "Auction your ride and have dealers bid on it.",
            icon: "🔨",
            color: "var(--brand-orange)"
        },
        {
            id: 4,
            title: "Dealer Bids",
            description: "Get the most value for dealer's bid.",
            icon: "🏢",
            color: "var(--accent)"
        },
        {
            id: 5,
            title: "Seamless Transaction",
            description: "Finalize the transaction with the best auction offer through a member dealer.",
            icon: "🤝",
            color: "var(--brand-orange)"
        }
    ]

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    }

    const itemVariants = {
        hidden: {
            opacity: 0,
            y: 40,
            scale: 0.9
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: [0.4, 0, 0.2, 1]
            }
        }
    }

    const iconVariants = {
        hover: {
            scale: 1.1,
            rotate: 5,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        }
    }

    return (
        <section className="win-win-section">
            <div className="container">
                {/* Section Header */}
                <motion.div
                    className="win-win-header"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <h2 className="win-win-title">
                        Creating a Win-Win Situation with <span className="title-plain">Amacar</span>
                    </h2>  
                    <div className="title-underline"></div>
                    <p className="win-win-description">
                        Experience a transparent, efficient process that benefits both sellers and dealers through our innovative platform.
                    </p>
                </motion.div>

                {/* Stepper Container */}
                <motion.div
                    className="stepper-container"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                >
                    {/* Desktop Stepper */}
                    <div className="stepper-desktop">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.id}
                                className="stepper-item"
                                variants={itemVariants}
                            >


                                {/* Step Icon */}
                                <motion.div
                                    className="step-icon"
                                    style={{ backgroundColor: step.color }}
                                    variants={iconVariants}
                                    whileHover="hover"
                                >
                                    <span className="icon-emoji">{step.icon}</span>
                                </motion.div>

                                {/* Step Content */}
                                <div className="step-content">
                                    <h3 className="step-title">{step.title}</h3>
                                    <p className="step-description">{step.description}</p>
                                </div>

                                {/* Connecting Arrow (hidden on last step) */}
                                {index < steps.length - 1 && (
                                    <div className="connecting-arrow">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path
                                                d="M9 18L15 12L9 6"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {/* Mobile Stepper */}
                    <div className="stepper-mobile">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.id}
                                className="mobile-step-item"
                                variants={itemVariants}
                            >
                                <div className="mobile-step-content">
                                    {/* Step Number and Icon */}
                                    <div className="mobile-step-header">
                                        <div className="step-badge">
                                            <span className="step-number">{step.id}</span>
                                        </div>
                                        <motion.div
                                            className="step-icon"
                                            style={{ backgroundColor: step.color }}
                                            variants={iconVariants}
                                            whileHover="hover"
                                        >
                                            <span className="icon-emoji">{step.icon}</span>
                                        </motion.div>
                                    </div>

                                    {/* Step Content */}
                                    <div className="step-content">
                                        <h3 className="step-title">{step.title}</h3>
                                        <p className="step-description">{step.description}</p>
                                    </div>
                                </div>

                                {/* Mobile Connecting Line */}
                                {index < steps.length - 1 && (
                                    <div className="mobile-connecting-line"></div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

            </div>
        </section>
    )
}
