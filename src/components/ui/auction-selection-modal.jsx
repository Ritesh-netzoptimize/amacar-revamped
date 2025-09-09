import React, { useState } from "react"
import { motion } from "framer-motion"
import { MapPin, Globe, Clock, DollarSign, CheckCircle, Check } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
export default function AuctionSelectionModal({ isOpen, onClose }) {
  const [isAgreed, setIsAgreed] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const navigate = useNavigate()
  const auctionOptions = [
    {
      id: "local",
      title: "Local Auction",
      subtitle: "Get bids from dealers in your area",
      icon: MapPin,
      color: "from-blue-500 to-blue-600",
      hoverColor: "hover:from-blue-600 hover:to-blue-700",
      borderColor: "border-blue-200 hover:border-blue-300",
      bgColor: "bg-blue-50/50",
      features: [
        "Faster pickup and delivery",
        "Support local businesses", 
        "Typically 24-48 hour process",
        "Lower transportation costs"
      ],
      timeline: "24–48 hours",
      priceRange: "$500 – $2,000",
      route: "/local-auction"
    },
    {
      id: "national", 
      title: "National Auction",
      subtitle: "Maximize your car's value nationwide",
      icon: Globe,
      color: "from-orange-500 to-orange-600",
      hoverColor: "hover:from-orange-600 hover:to-orange-700", 
      borderColor: "border-orange-200 hover:border-orange-300",
      bgColor: "bg-orange-50/50",
      features: [
        "Access to premium dealers",
        "Highest possible offers",
        "Extended network reach", 
        "Specialized vehicle markets"
      ],
      timeline: "3–7 days",
      priceRange: "$1,000 – $5,000",
      route: "/national-auction"
    }
  ]
  const handleGo = () => {
    if (!selectedId) {
      toast.error("Please select an auction type.")
      return
    }
    if (!isAgreed) {
      toast.error("Please agree to the Terms of Service and Privacy Policy before continuing.")
      return
    }
    const selected = auctionOptions.find(o => o.id === selectedId)
    toast.success("Redirecting to your selected auction...")
    setTimeout(() => {
      onClose(false)
      navigate(selected?.route || "/local-auction")
    }, 600)
  }
  

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl rounded-2xl shadow-xl p-0 overflow-hidden bg-white">
        <div className="bg-gradient-to-br from-white via-slate-50 to-slate-100 p-6">
          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl font-semibold tracking-tight text-slate-900">
              Choose Your Auction Type
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-600 mt-2">
              Select the auction type that best fits your needs and timeline
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 pt-0">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {auctionOptions.map((option, index) => {
              const IconComponent = option.icon
              return (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedId(option.id)}
                  className={`
                    relative cursor-pointer group rounded-2xl p-6 shadow-lg
                    ${option.bgColor}
                    ${selectedId === option.id ? 'border-2 border-green-400 ring-2 ring-green-200' : `${option.borderColor} border`}
                  `}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${option.color} text-white shadow-lg`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-slate-800">
                          {option.title}
                        </h3>
                        <p className="text-sm text-slate-600 mt-1">
                          {option.subtitle}
                        </p>
                      </div>
                    </div>
                    {selectedId === option.id ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <Check className="h-5 w-5" />
                      </div>
                    ) : (
                      <div className="h-5 w-5" />
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    {option.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-slate-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Timeline and Price */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-slate-500" />
                      <span className="text-sm font-medium text-slate-700">
                        {option.timeline}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-slate-500" />
                      <span className="text-sm font-medium text-slate-700">
                        {option.priceRange}
                      </span>
                    </div>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </motion.div>
              )
            })}
          </motion.div>

          {/* Bottom note */}
          <motion.div 
            className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <p className="text-xs text-slate-600 text-center">
              💡 <strong>Tip:</strong> Local auctions are faster but may have lower offers. 
              National auctions take longer but typically provide higher values for your vehicle.
            </p>
          </motion.div>
           {/* Terms & Conditions */}
           <div className="flex justify-center items-center gap-3 mt-4">
            <input
              type="checkbox"
              checked={isAgreed}
              onChange={(e) => setIsAgreed(e.target.checked)}
              className="h-4 w-4 cursor-pointer"
            />
            <p className="text-xs text-slate-600">
              I agree to the <a href="/terms-of-service" className="underline">Terms of Service</a> and <a href="/privacy-policy" className="underline">Privacy Policy</a>. I understand that my vehicle information will be shared with participating dealers for the auction process.
            </p>
          </div>
          {/* Footer CTA */}
          <div className="mt-6 flex items-center justify-end">
            <button
              onClick={handleGo}
              className={`cursor-pointer inline-flex h-11 items-center justify-center rounded-xl px-6 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.01]
                ${selectedId && isAgreed ? 'bg-slate-900 hover:bg-slate-800' : 'bg-slate-400 cursor-not-allowed'}`}
              disabled={!selectedId || !isAgreed}
            >
              Go →
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
