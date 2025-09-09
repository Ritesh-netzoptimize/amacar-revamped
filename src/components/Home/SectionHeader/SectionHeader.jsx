import React from 'react'
import './section-header.css'

export default function SectionHeader({ preTitle = '', title = 'Why choose Amacar', highlight = 'Trusted by sellers & dealers' }) {
    return (
        <section className="section-header-wrap">
            <div className="container">
                {preTitle ? <p className="pretitle">{preTitle}</p> : null}
                <h2 className="title">{title} <span className="highlight">{highlight}</span></h2>
            </div>
        </section>
    )
}
