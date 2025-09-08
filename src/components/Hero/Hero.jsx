import React, { useState } from "react"
import { motion } from "framer-motion"
import "./hero.css"
import bgImg from "../../assets/home_Page_first_hero(10).jpg"

// ⬇️ shadcn components
import Modal from "@/components/ui/modal.jsx"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function Hero() {
  const [open, setOpen] = useState(false)

  // 🔹 Variants for animation
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut", delay },
    }),
  }

  return (
    <section
      className="hero-section"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      <div className="hero-overlay"></div>
      <motion.div
        className="hero-content"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h1 className="hero-headline" variants={fadeUp} custom={0}>
          Post Your Car. Dealers Compete Live. You Get Cash.
        </motion.h1>

        <motion.p className="hero-sub" variants={fadeUp} custom={0.2}>
          Get top offers on your used car in minutes—without the usual hassle.
        </motion.p>

        <motion.div className="hero-ctas" variants={fadeUp} custom={0.4}>
          <a href="#" className="btn-white" onClick={(e) => {
              e.preventDefault()
              setOpen(true)
            }}>
            Get Your Instant Offer
          </a>
          <a
            href="#"
            className="btn-purple"
          >
            Auction Your Ride
          </a>
        </motion.div>
      </motion.div>

      {/* 🔹 Reusable Modal */}
      <Modal
        isOpen={open}
        onClose={setOpen}
        title="Get your instant offer"
        description="Enter your car details to start the auction"
        footer={
          <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold">
            Start Auction
          </Button>
        }
      >
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="vin">Vehicle VIN</Label>
            <Input id="vin" placeholder="Enter VIN number" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="zip">Zip Code</Label>
            <Input id="zip" placeholder="Enter Zip Code" />
          </div>
        </div>
      </Modal>
    </section>
  )
}
