import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  Car, 
  Settings, 
  CheckCircle, 
  Clock, 
  Camera, 
  FileText,
  ArrowLeft,
  Rocket,
  Shield,
  AlertCircle,
  Loader2
} from 'lucide-react';
import Header from '@/components/Header/Header';
import { useNavigate } from 'react-router-dom';

export default function ReviewPage() {
  const navigate = useNavigate();
  const [isLaunching, setIsLaunching] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  useEffect(() => {
    if (isLaunching) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isLaunching]);
  
  // Mock data - in real app, this would come from state/context/API
  const [reviewData, setReviewData] = useState({
    vehicleDetails: {
      mileage: '42,500',
      interiorColor: 'Gray',
      transmission: 'Semi-Automatic',
      exteriorColor: 'White',
      bodyType: 'SUV',
      engineType: '2.0L Turbo'
    },
    auctionSettings: {
      auctionType: 'Local Auction',
      timeline: '24–48 hours',
      photosUploaded: 11,
      consentGiven: true
    },
    estimatedValue: {
      baseValue: 18500,
      conditionImpact: 0, // This would be calculated from condition assessment
      finalEstimate: 18500
    },
    conditionImpact: {
      positive: ['Complete service history', 'No accidents', 'Excellent paint condition'],
      negative: ['Fair tire condition', 'Minor interior wear']
    }
  });

  const launchSteps = [
    "Validating vehicle information...",
    "Processing condition assessment...",
    "Uploading photos to secure servers...",
    "Notifying participating dealers...",
    "Setting up auction parameters...",
    "✅ Launching your auction!"
  ];

  const handleLaunchAuction = () => {
    setIsLaunching(true);
    setCurrentStep(0);
    setCompletedSteps([]);
    
    // Simulate step progression
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        const nextStep = prev + 1;
        if (nextStep >= launchSteps.length) {
          clearInterval(stepInterval);
          // Navigate to dashboard after completion
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
          return prev;
        }
        return nextStep;
      });
    }, 1500);

    // Mark steps as completed
    const completionInterval = setInterval(() => {
      setCompletedSteps(prev => {
        const nextCompleted = prev.length + 1;
        if (nextCompleted >= launchSteps.length) {
          clearInterval(completionInterval);
          return prev;
        }
        return [...prev, nextCompleted - 1];
      });
    }, 1500);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };


  const handleGoBack = () => {
    navigate('/local-auction');
  };

  return (
    <>
      <Header />
      <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100 pt-20 md:pt-24">
        <div className="mx-auto max-w-7xl px-6 py-12">
          
          {/* Header Section */}
          {!isLaunching && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                Review
              </h1>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Final check before going live
              </p>
            </motion.div>
          )}

          {/* Main Content Grid */}
          {!isLaunching && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
            
            {/* Card 1: Estimated Auction Value */}
            <motion.div
              variants={cardVariants}
              className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-green-100 rounded-xl">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Estimated Auction Value</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 px-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-slate-500" />
                    <span className="text-slate-700 font-medium">Base Value</span>
                  </div>
                  <span className="text-xl font-semibold text-slate-900">
                    ${reviewData.estimatedValue.baseValue.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between py-3 px-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-slate-500" />
                    <span className="text-slate-700 font-medium">Condition Impact</span>
                  </div>
                  <span className={`text-xl font-semibold ${
                    reviewData.estimatedValue.conditionImpact >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {reviewData.estimatedValue.conditionImpact >= 0 ? '+' : ''}${reviewData.estimatedValue.conditionImpact.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between py-4 px-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <span className="text-lg font-bold text-slate-900">Final Estimate</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">
                    ${reviewData.estimatedValue.finalEstimate.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Card 2: Vehicle Details */}
            <motion.div
              variants={cardVariants}
              className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Car className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Vehicle Details</h2>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {Object.entries(reviewData.vehicleDetails).map(([key, value], index) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between py-3 px-4 bg-slate-50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <Settings className="h-4 w-4 text-slate-500" />
                      <span className="text-slate-700 font-medium capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </div>
                    <span className="text-slate-900 font-semibold">{value}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Card 3: Auction Settings */}
            <motion.div
              variants={cardVariants}
              className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-orange-100 rounded-xl">
                  <Settings className="h-6 w-6 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Auction Settings</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 px-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Car className="h-5 w-5 text-slate-500" />
                    <span className="text-slate-700 font-medium">Auction Type</span>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {reviewData.auctionSettings.auctionType}
                  </span>
                </div>
                
                <div className="flex items-center justify-between py-3 px-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-slate-500" />
                    <span className="text-slate-700 font-medium">Timeline</span>
                  </div>
                  <span className="text-slate-900 font-semibold">{reviewData.auctionSettings.timeline}</span>
                </div>
                
                <div className="flex items-center justify-between py-3 px-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Camera className="h-5 w-5 text-slate-500" />
                    <span className="text-slate-700 font-medium">Photos Uploaded</span>
                  </div>
                  <span className="text-slate-900 font-semibold">{reviewData.auctionSettings.photosUploaded} photos</span>
                </div>
                
                <div className="flex items-center justify-between py-3 px-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-slate-500" />
                    <span className="text-slate-700 font-medium">Consent Given</span>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Yes
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Card 4: Condition Assessment Impact */}
            <motion.div
              variants={cardVariants}
              className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-amber-100 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-amber-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Condition Assessment Impact</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Positive Impacts */}
                <div>
                  <h3 className="text-lg font-semibold text-green-700 mb-4 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Positive Factors
                  </h3>
                  <div className="space-y-2">
                    {reviewData.conditionImpact.positive.map((factor, index) => (
                      <div key={index} className="flex items-center gap-2 text-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Negative Impacts */}
                <div>
                  <h3 className="text-lg font-semibold text-red-700 mb-4 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Areas of Concern
                  </h3>
                  <div className="space-y-2">
                    {reviewData.conditionImpact.negative.map((factor, index) => (
                      <div key={index} className="flex items-center gap-2 text-red-600">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-sm">{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
          )}

          {/* Terms & Conditions */}
          {!isLaunching && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 bg-white rounded-2xl shadow-lg border border-slate-200 p-8"
            >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-100 rounded-xl">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Terms & Conditions</h2>
            </div>
            
            <div className="">
              {[
                "You agree to sell your vehicle to the highest bidder",
                "Final price may vary based on final inspection",
                "You can cancel the auction before it starts",
                "Payment will be processed within 24 hours of acceptance"
              ].map((term, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-2 py-1"
                >
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700 text-sm leading-relaxed">{term}</span>
                </motion.div>
              ))}
            </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          {!isLaunching && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12"
            >
              <motion.button
                onClick={handleGoBack}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-8 text-sm font-medium text-slate-700 shadow-sm transition hover:scale-[1.02] hover:shadow-md"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back & Edit
              </motion.button>
              
              <motion.button
                onClick={handleLaunchAuction}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f6851f] to-[#e63946] px-8 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:scale-[1.02] hover:shadow-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Rocket className="h-4 w-4" />
                Launch Auction
              </motion.button>
            </motion.div>
          )}

          {/* Trust Indicators */}
          {!isLaunching && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-wrap justify-center items-center gap-8 mt-8 text-slate-500"
            >
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="text-sm">Secure Transaction</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Verified Dealers</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm">24/7 Support</span>
              </div>
            </motion.div>
          )}

          {/* Launch Simulation Section */}
          {isLaunching && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-12 bg-white rounded-2xl shadow-lg border border-slate-200 p-8"
            >
              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="p-3 bg-gradient-to-r from-orange-100 to-red-100 rounded-xl">
                    <Rocket className="h-6 w-6 text-orange-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Launching Your Auction</h2>
                </div>
                <p className="text-slate-600">Setting up your auction for maximum visibility</p>
              </div>

              {/* Progress Steps */}
              <div className="space-y-4">
                {launchSteps.map((step, index) => {
                  const isActive = index === currentStep;
                  const isCompleted = completedSteps.includes(index);
                  const isUpcoming = index > currentStep;
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                        isActive 
                          ? 'bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200' 
                          : isCompleted 
                          ? 'bg-green-50 border border-green-200' 
                          : 'bg-slate-50 border border-slate-200'
                      }`}
                    >
                      {/* Icon */}
                      <div className="flex-shrink-0">
                        {isCompleted ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
                          >
                            <CheckCircle className="h-5 w-5 text-white" />
                          </motion.div>
                        ) : isActive ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center">
                            <span className="text-slate-500 text-sm font-medium">{index + 1}</span>
                          </div>
                        )}
                      </div>

                      {/* Step Text */}
                      <div className="flex-1">
                        <p className={`font-medium transition-colors duration-300 ${
                          isActive 
                            ? 'text-orange-700' 
                            : isCompleted 
                            ? 'text-green-700' 
                            : 'text-slate-500'
                        }`}>
                          {step}
                        </p>
                      </div>

                      {/* Status Indicator */}
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center gap-2 text-orange-600"
                        >
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm font-medium">Processing...</span>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Info Note */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                  <p className="text-blue-700 text-sm">
                    <strong>Please wait:</strong> This may take a few moments. Please don't close this window.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
