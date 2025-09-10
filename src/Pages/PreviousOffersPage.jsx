import { motion } from 'framer-motion';
import { Car, DollarSign, Clock, RefreshCw, Eye } from 'lucide-react';
import { formatCurrency, formatDate } from '../lib/utils';

const PreviousOffersPage = () => {
  const offers = [
    {
      id: 'OFF-001',
      vehicle: '2020 Honda Civic',
      offerAmount: 18500,
      status: 'expired',
      reason: 'Auction ended without acceptance',
      date: new Date('2024-01-15'),
      auctionId: 'AUC-001',
    },
    {
      id: 'OFF-002',
      vehicle: '2019 Toyota Camry',
      offerAmount: 22100,
      status: 'rejected',
      reason: 'Offer below reserve price',
      date: new Date('2024-01-10'),
      auctionId: 'AUC-002',
    },
    {
      id: 'OFF-003',
      vehicle: '2021 BMW 3 Series',
      offerAmount: 32500,
      status: 'expired',
      reason: 'Time limit exceeded',
      date: new Date('2024-01-05'),
      auctionId: 'AUC-003',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-hero p-8 ">
      <div className="max-w-8xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <motion.h1 variants={itemVariants} className="text-3xl font-bold text-neutral-800 mb-2">
            Previous Offers
          </motion.h1>
          <motion.p variants={itemVariants} className="text-neutral-600">
            Review your past offers and auction results.
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {offers.map((offer) => (
            <motion.div
              key={offer.id}
              variants={itemVariants}
              className="card p-6 hover:shadow-medium transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-neutral-200 rounded-lg flex items-center justify-center">
                    <Car className="w-8 h-8 text-neutral-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-800">{offer.vehicle}</h3>
                    <p className="text-sm text-neutral-600">
                      {formatDate(offer.date)} • Auction {offer.auctionId}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-neutral-800 mb-1">
                    {formatCurrency(offer.offerAmount)}
                  </div>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    offer.status === 'expired' 
                      ? 'bg-warning/10 text-warning' 
                      : 'bg-error/10 text-error'
                  }`}>
                    {offer.status === 'expired' ? 'Expired' : 'Rejected'}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-neutral-200">
                <p className="text-sm text-neutral-600 mb-4">
                  <strong>Reason:</strong> {offer.reason}
                </p>
                <div className="flex space-x-2">
                  <button className="btn-ghost flex items-center space-x-2">
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                  <button className="btn-secondary flex items-center space-x-2">
                    <RefreshCw className="w-4 h-4" />
                    <span>Relist Vehicle</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default PreviousOffersPage;
