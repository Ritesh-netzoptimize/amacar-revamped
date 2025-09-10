import { useState } from 'react';
import { motion } from 'framer-motion';
import { Car, Clock, DollarSign, Users, CheckCircle, X, Eye, AlertCircle } from 'lucide-react';
import { formatCurrency, formatDate, formatTimeRemaining } from '../lib/utils';

const PendingOffersPage = () => {
  const [pendingOffers, setPendingOffers] = useState([
    {
      id: 'PEN-001',
      vehicle: '2020 Honda Civic',
      year: 2020,
      make: 'Honda',
      model: 'Civic',
      mileage: '45,000',
      highestBid: 18500,
      bidCount: 8,
      timeRemaining: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      status: 'pending',
      dealer: 'ABC Motors',
      dealerRating: 4.8,
      dealerBidCount: 3,
      images: ['/api/placeholder/400/300'],
      description: 'Well-maintained vehicle with complete service history.',
      auctionEndTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    },
    {
      id: 'PEN-002',
      vehicle: '2019 Toyota Camry',
      year: 2019,
      make: 'Toyota',
      model: 'Camry',
      mileage: '52,000',
      highestBid: 22100,
      bidCount: 12,
      timeRemaining: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
      status: 'pending',
      dealer: 'XYZ Auto',
      dealerRating: 4.9,
      dealerBidCount: 5,
      images: ['/api/placeholder/400/300'],
      description: 'Single owner, garage kept, excellent condition.',
      auctionEndTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
    },
    {
      id: 'PEN-003',
      vehicle: '2021 BMW 3 Series',
      year: 2021,
      make: 'BMW',
      model: '3 Series',
      mileage: '28,000',
      highestBid: 32500,
      bidCount: 15,
      timeRemaining: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour from now
      status: 'urgent',
      dealer: 'Premium Motors',
      dealerRating: 4.7,
      dealerBidCount: 2,
      images: ['/api/placeholder/400/300'],
      description: 'Certified pre-owned, all options included.',
      auctionEndTime: new Date(Date.now() + 1 * 60 * 60 * 1000),
    },
  ]);

  const handleAcceptOffer = (offerId) => {
    setPendingOffers(prev => 
      prev.map(offer => 
        offer.id === offerId 
          ? { ...offer, status: 'accepted' }
          : offer
      )
    );
  };

  const handleRejectOffer = (offerId) => {
    setPendingOffers(prev => 
      prev.map(offer => 
        offer.id === offerId 
          ? { ...offer, status: 'rejected' }
          : offer
      )
    );
  };

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'urgent':
        return 'bg-error/10 text-error border-error/20';
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-neutral-100 text-neutral-600 border-neutral-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'urgent':
        return <AlertCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
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
            Pending Offers
          </motion.h1>
          <motion.p variants={itemVariants} className="text-neutral-600">
            Review and respond to offers from dealers on your vehicles.
          </motion.p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <motion.div variants={itemVariants} className="card p-6 text-center">
            <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-warning" />
            </div>
            <div className="text-2xl font-bold text-neutral-800 mb-1">{pendingOffers.length}</div>
            <div className="text-sm text-neutral-600">Pending Offers</div>
          </motion.div>

          <motion.div variants={itemVariants} className="card p-6 text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-6 h-6 text-primary-600" />
            </div>
            <div className="text-2xl font-bold text-neutral-800 mb-1">
              {formatCurrency(Math.max(...pendingOffers.map(o => o.highestBid)))}
            </div>
            <div className="text-sm text-neutral-600">Highest Offer</div>
          </motion.div>

          <motion.div variants={itemVariants} className="card p-6 text-center">
            <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-success" />
            </div>
            <div className="text-2xl font-bold text-neutral-800 mb-1">
              {pendingOffers.reduce((sum, offer) => sum + offer.bidCount, 0)}
            </div>
            <div className="text-sm text-neutral-600">Total Bids</div>
          </motion.div>

          <motion.div variants={itemVariants} className="card p-6 text-center">
            <div className="w-12 h-12 bg-error/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-error" />
            </div>
            <div className="text-2xl font-bold text-neutral-800 mb-1">
              {pendingOffers.filter(o => o.status === 'urgent').length}
            </div>
            <div className="text-sm text-neutral-600">Urgent Offers</div>
          </motion.div>
        </motion.div>

        {/* Pending Offers List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {pendingOffers.map((offer) => (
            <motion.div
              key={offer.id}
              variants={itemVariants}
              className={`card p-6 border-l-4 ${
                offer.status === 'urgent' ? 'border-error' : 'border-warning'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-neutral-200 rounded-lg flex items-center justify-center">
                    <Car className="w-8 h-8 text-neutral-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-neutral-800">{offer.vehicle}</h3>
                    <p className="text-sm text-neutral-600">{offer.mileage} miles • {offer.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm text-neutral-500">
                        {formatDate(offer.auctionEndTime)} • {offer.bidCount} bids
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-success mb-1">
                    {formatCurrency(offer.highestBid)}
                  </div>
                  <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(offer.status)}`}>
                    {getStatusIcon(offer.status)}
                    <span className="capitalize">{offer.status}</span>
                  </div>
                </div>
              </div>

              {/* Dealer Information */}
              <div className="bg-neutral-50 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-neutral-800 mb-2">Highest Bidder</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-neutral-700">{offer.dealer}</p>
                    <div className="flex items-center space-x-2 text-sm text-neutral-600">
                      <span>Rating: {offer.dealerRating}/5</span>
                      <span>•</span>
                      <span>{offer.dealerBidCount} bids placed</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-neutral-600">Time Remaining</p>
                    <p className="font-semibold text-warning">
                      {formatTimeRemaining(offer.timeRemaining)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <button className="btn-ghost flex items-center space-x-2">
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                  <button className="btn-secondary">
                    View All Bids
                  </button>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleRejectOffer(offer.id)}
                    className="btn-ghost text-error hover:bg-error/10 flex items-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                  <button
                    onClick={() => handleAcceptOffer(offer.id)}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Accept Offer</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {pendingOffers.length === 0 && (
          <motion.div
            variants={itemVariants}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-12 h-12 text-neutral-400" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-800 mb-2">No Pending Offers</h3>
            <p className="text-neutral-600 mb-6">You don't have any pending offers at the moment.</p>
            <button className="btn-primary">
              Start New Auction
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PendingOffersPage;
