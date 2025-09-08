import React from 'react'
import './how-it-works.css'

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

    return (
        <section className="how-it-works-section">
            <div className="container">
                {/* Section Header */}
                <div className="how-it-works-header">
                    <h2 className="how-it-works-title">How It Works</h2>
                    <div className="title-underline"></div>
                </div>

                {/* Steps Grid */}
                <div className="steps-grid">
                    {steps.map((step, index) => (
                        <div
                            key={step.number}
                            className="step-card"
                            style={{ animationDelay: `${index * 150}ms` }}
                        >
                            {/* Step Number Badge */}
                            <div className="step-badge">
                                <span className="step-number">{step.number}</span>
                            </div>

                            {/* Step Icon */}
                            <div className="step-icon">
                                <span className="icon-emoji">{step.icon}</span>
                            </div>

                            {/* Step Content */}
                            <div className="step-content">
                                <h3 className="step-title">{step.title}</h3>
                                <p className="step-description">{step.description}</p>
                            </div>

                            {/* Connecting Line (hidden on last step) */}
                            {index < steps.length - 1 && (
                                <div className="connecting-line"></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
