import React from 'react'
import { motion } from 'framer-motion'

export default function TwoColumnSection() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: {
            opacity: 0,
            y: 30
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.4, 0, 0.2, 1]
            }
        }
    }

    return (
        <section className="relative py-12 px-4 bg-gradient-to-br from-white via-slate-50 to-blue-50/30">
            {/* Background blur effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/3 via-transparent to-purple-500/3"></div>

            <div className="relative z-10 max-w-6xl mx-auto">
                <motion.div
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                >
                    {/* Column 1 */}
                    <motion.div
                        className="space-y-5 p-6 lg:p-8 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm hover:shadow-md transition-all duration-300"
                        variants={itemVariants}
                    >
                        <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 leading-tight">
                            Experience a Smarter, More Rewarding Way to Sell Your Car
                        </h2>
                        <p className="text-base lg:text-lg text-slate-600 leading-relaxed">
                            Unlock The Best Offers And Streamline Your Selling Process With Just A Few Clicks.
                        </p>
                        <motion.button
                            className=" cursor-pointer bg-[var(--brand-orange)] hover:from-orange-700 hover:to-orange-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Check Your Selling Options
                        </motion.button>
                    </motion.div>

                    {/* Column 2 */}
                    <motion.div
                        className="space-y-5 p-6 lg:p-8 bg-[#394da1] backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm hover:shadow-md transition-all duration-300"
                        variants={itemVariants}
                    >
                        <h2 className="text-2xl lg:text-3xl font-bold text-white leading-tight">
                            List My Car Today
                        </h2>
                        <p className="text-base lg:text-lg text-white leading-relaxed">
                            Ready to get the best offers for your vehicle? Start your auction now and see the difference.
                        </p>
                        <motion.button
                            className="cursor-pointer bg-white text-[#394da1] px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Start Auction Now
                        </motion.button>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
