import { motion } from 'framer-motion';
import { Car, CheckCircle, Clock, FileText, Phone, MapPin } from 'lucide-react';
import { formatCurrency, formatDate } from '../lib/utils';

const AcceptedOffersPage = () => {
  const acceptedOffers = [
    {
      id: 'ACC-001',
      vehicle: '2020 Honda Civic',
      offerAmount: 19500,
      status: 'paperwork',
      dealer: 'ABC Motors',
      dealerPhone: '(555) 123-4567',
      dealerAddress: '123 Main St, San Francisco, CA',
      acceptedDate: new Date('2024-01-20'),
      nextStep: 'Complete paperwork',
      estimatedCompletion: new Date('2024-01-25'),
    },
    {
      id: 'ACC-002',
      vehicle: '2019 Toyota Camry',
      offerAmount: 23500,
      status: 'pickup_scheduled',
      dealer: 'XYZ Auto',
      dealerPhone: '(555) 987-6543',
      dealerAddress: '456 Oak Ave, San Francisco, CA',
      acceptedDate: new Date('2024-01-18'),
      nextStep: 'Pickup scheduled',
      estimatedCompletion: new Date('2024-01-22'),
    },
  ];

  const statusSteps = [
    { key: 'accepted', label: 'Offer Accepted', icon: CheckCircle },
    { key: 'paperwork', label: 'Paperwork', icon: FileText },
    { key: 'pickup_scheduled', label: 'Pickup Scheduled', icon: Clock },
    { key: 'completed', label: 'Completed', icon: CheckCircle },
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
    <div className="min-h-screen bg-gradient-hero p-8">
      <div className="max-w-8xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <motion.h1 variants={itemVariants} className="text-3xl font-bold text-neutral-800 mb-2">
            Accepted Offers
          </motion.h1>
          <motion.p variants={itemVariants} className="text-neutral-600">
            Track the progress of your accepted offers through to completion.
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {acceptedOffers.map((offer) => (
            <motion.div
              key={offer.id}
              variants={itemVariants}
              className="card p-6"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-neutral-200 rounded-lg flex items-center justify-center">
                    <Car className="w-8 h-8 text-neutral-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-neutral-800">{offer.vehicle}</h3>
                    <p className="text-neutral-600">
                      Accepted on {formatDate(offer.acceptedDate)}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-success mb-1">
                    {formatCurrency(offer.offerAmount)}
                  </div>
                  <div className="text-sm text-neutral-600">
                    by {offer.dealer}
                  </div>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="mb-6">
                <div className="relative flex items-center justify-between">
                  {statusSteps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = step.key === offer.status;
                    const isCompleted = statusSteps.findIndex(s => s.key === offer.status) > index;

                    return (
                      <div key={step.key} className="flex flex-col items-center flex-1 relative">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                          isCompleted 
                            ? 'bg-success text-white' 
                            : isActive 
                            ? 'bg-primary-500 text-white' 
                            : 'bg-neutral-200 text-neutral-400'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className={`text-xs font-medium text-center ${
                          isActive ? 'text-primary-600' : 'text-neutral-500'
                        }`}>
                          {step.label}
                        </span>
                        {index < statusSteps.length - 1 && (
                          <div
                            className={`absolute top-5 h-0.5 ${
                              isCompleted ? 'bg-success' : 'bg-neutral-200'
                            }`}
                            style={{
                              width: 'calc(100% - 40px)',
                              left: 'calc(50% + 20px)',
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Dealer Information */}
              <div className="bg-neutral-50 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-neutral-800 mb-3">Dealer Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Car className="w-4 h-4 text-neutral-500" />
                    <span className="text-sm text-neutral-700">{offer.dealer}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-neutral-500" />
                    <span className="text-sm text-neutral-700">{offer.dealerPhone}</span>
                  </div>
                  <div className="flex items-center space-x-2 md:col-span-2">
                    <MapPin className="w-4 h-4 text-neutral-500" />
                    <span className="text-sm text-neutral-700">{offer.dealerAddress}</span>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-neutral-800">Next Step</p>
                  <p className="text-sm text-neutral-600">{offer.nextStep}</p>
                  <p className="text-xs text-neutral-500">
                    Estimated completion: {formatDate(offer.estimatedCompletion)}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button className="btn-ghost flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>Contact Dealer</span>
                  </button>
                  <button className="btn-primary">
                    View Details
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

export default AcceptedOffersPage;