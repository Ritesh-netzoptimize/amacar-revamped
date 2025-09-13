import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  Car, 
  ArrowLeft,
  Rocket,
  CheckCircle,
  Star,
  Trophy,
  Sparkles,
  Camera
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AuctionSelectionModal from '@/components/ui/auction-selection-modal';

export default function ReviewPage() {
  const navigate = useNavigate();
  const [showAuctionModal, setShowAuctionModal] = useState(false);
  
  // Get data from Redux state
  const { vehicleDetails, offer, offerStatus } = useSelector((state) => state.carDetailsAndQuestions);
  const userState = useSelector((state) => state.user.user);
  
  // Check if we have the necessary data
  const hasVehicleData = vehicleDetails && Object.keys(vehicleDetails).length > 0;
  const hasOfferData = offer && offer.offerAmount;
  
  // Redirect if no data available
  useEffect(() => {
    if (!hasVehicleData) {
      navigate('/condition-assessment');
    }
  }, [hasVehicleData, navigate]);

  const handleLaunchAuction = () => {
    // setShowAuctionModal(true);
    navigate('/local-auction');
  };

  const handleAuctionModalClose = () => {
    setShowAuctionModal(false);
  };

  const handleGoBack = () => {
    navigate('/condition-assessment');
  };

  // Show loading state if data is not available
  if (!hasVehicleData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your offer...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100 pt-20 md:pt-24">
        <div className="mx-auto max-w-4xl px-6 py-12">
          
          {/* Congratulations Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Trophy className="h-12 w-12 text-yellow-500" />
              <h1 className="text-5xl md:text-6xl font-bold text-slate-900">
                Congratulations!
              </h1>
              <Sparkles className="h-12 w-12 text-yellow-500" />
            </div>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              We've analyzed your vehicle and prepared an instant offer for you
            </p>
          </motion.div>

          {/* Main Offer Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-8 md:p-12 mb-8"
          >
            {/* Vehicle Details */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Car className="h-8 w-8 text-blue-600" />
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                  {vehicleDetails.modelyear || vehicleDetails.year} {vehicleDetails.make} {vehicleDetails.model}
                </h2>
              </div>
              
              <div className="flex items-center justify-center gap-6 text-lg text-slate-600 mb-8">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  <span>Mileage: {vehicleDetails.mileage || vehicleDetails.mileage_km || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Offer Amount - Highlighted */}
            <div className="text-center mb-8">
              <div className="inline-block bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-8">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Star className="h-6 w-6 text-green-600" />
                  <span className="text-lg font-semibold text-green-800">Your Instant Offer</span>
                </div>
                <div className="text-5xl md:text-6xl font-bold text-green-600 mb-2">
                  ${hasOfferData ? offer.offerAmount.toLocaleString() : '5,038'}
                </div>
                <p className="text-sm text-green-700">Valid for 7 days</p>
              </div>
            </div>

            {/* Persuasive Text */}
            <div className="text-center mb-8">
              <p className="text-lg text-slate-700 mb-4">
                Looking for a competitive offer? Auction Your Ride or share your information with local dealers.
              </p>
              <p className="text-sm text-slate-500">
                Get multiple offers from verified dealers in your area and choose the best one for you.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              
              
              <motion.button
                onClick={handleLaunchAuction}
                className="cursor-pointer inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f6851f] to-[#e63946] px-8 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:scale-[1.02] hover:shadow-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Camera className="h-4 w-4" />
                Upload photos
              </motion.button>
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-wrap justify-center items-center gap-8 text-slate-500"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">Secure Transaction</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              <span className="text-sm">Verified Dealers</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              <span className="text-sm">Best Price Guarantee</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Auction Selection Modal */}
      <AuctionSelectionModal
        isOpen={showAuctionModal}
        onClose={handleAuctionModalClose}
      />
    </>
  );
}
