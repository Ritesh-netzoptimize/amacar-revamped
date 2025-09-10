import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Car, DollarSign, Calendar, TrendingUp, Clock, Users, Bell, ArrowRight, Eye } from 'lucide-react';
import CountUp from 'react-countup';
import { formatCurrency, formatDate } from '../lib/utils';

const Dashboard = () => {
  const [stats, setStats] = useState({
    activeAuctions: 2,
    totalEarnings: 45600,
    pendingAppointments: 1,
    profileCompletion: 85,
  });

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: 'bid',
      message: 'New bid received on your 2020 Honda Civic',
      amount: 18500,
      time: '2 minutes ago',
      auctionId: 'AUC-001',
    },
    {
      id: 2,
      type: 'auction',
      message: 'Auction ending in 2 hours for Toyota Camry',
      time: '15 minutes ago',
      auctionId: 'AUC-002',
    },
    {
      id: 3,
      type: 'appointment',
      message: 'Appointment confirmed with ABC Motors',
      time: '1 hour ago',
      appointmentId: 'APT-001',
    },
  ]);

  const [liveAuctions, setLiveAuctions] = useState([
    {
      id: 'AUC-001',
      vehicle: '2020 Honda Civic',
      currentBid: 18500,
      timeRemaining: '6h 23m',
      bidCount: 8,
      image: '/api/placeholder/300/200',
      status: 'live',
    },
    {
      id: 'AUC-002',
      vehicle: '2019 Toyota Camry',
      currentBid: 22100,
      timeRemaining: '2h 15m',
      bidCount: 12,
      image: '/api/placeholder/300/200',
      status: 'live',
    },
  ]);

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
    <>
    <div className="min-h-screen bg-gradient-hero p-8 ">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <motion.h1 variants={itemVariants} className="text-3xl font-bold text-neutral-800 mb-2">
            Welcome back, John!
          </motion.h1>
          <motion.p variants={itemVariants} className="text-neutral-600">
            Here's what's happening with your auctions today.
          </motion.p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <motion.div variants={itemVariants} className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <Car className="w-6 h-6 text-primary-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-neutral-800">
                  <CountUp end={stats.activeAuctions} duration={1} />
                </div>
                <div className="text-sm text-neutral-600">Active Auctions</div>
              </div>
            </div>
            <div className="flex items-center text-sm text-success">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+2 this week</span>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-success" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-neutral-800">
                  <CountUp end={stats.totalEarnings} duration={1} prefix="$" separator="," />
                </div>
                <div className="text-sm text-neutral-600">Total Earnings</div>
              </div>
            </div>
            <div className="flex items-center text-sm text-success">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+12.5% this month</span>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-warning" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-neutral-800">
                  <CountUp end={stats.pendingAppointments} duration={1} />
                </div>
                <div className="text-sm text-neutral-600">Appointments</div>
              </div>
            </div>
            <div className="flex items-center text-sm text-neutral-600">
              <Clock className="w-4 h-4 mr-1" />
              <span>Next: Tomorrow 2PM</span>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-primary-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-neutral-800">
                  <CountUp end={stats.profileCompletion} duration={1} suffix="%" />
                </div>
                <div className="text-sm text-neutral-600">Profile Complete</div>
              </div>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2 mt-2">
              <motion.div
                className="bg-gradient-to-r from-primary-400 to-primary-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${stats.profileCompletion}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Live Auctions */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2"
          >
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-neutral-800">Live Auctions</h2>
                <button className="text-primary-600 hover:text-primary-700 font-medium flex items-center">
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>

              <div className="space-y-4">
                {liveAuctions.map((auction) => (
                  <motion.div
                    key={auction.id}
                    className="flex items-center space-x-4 p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="w-16 h-16 bg-neutral-200 rounded-lg flex items-center justify-center">
                      <Car className="w-8 h-8 text-neutral-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-neutral-800">{auction.vehicle}</h3>
                      <div className="flex items-center space-x-4 text-sm text-neutral-600">
                        <span>Current Bid: <span className="font-semibold text-success">{formatCurrency(auction.currentBid)}</span></span>
                        <span>•</span>
                        <span>{auction.bidCount} bids</span>
                        <span>•</span>
                        <span className="text-warning">{auction.timeRemaining} left</span>
                      </div>
                    </div>
                    <button className="btn-ghost p-2">
                      <Eye className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div variants={itemVariants}>
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-neutral-800">Recent Activity</h2>
                <button className="p-2 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg">
                  <Bell className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <motion.div
                    key={activity.id}
                    className="flex items-start space-x-3 p-3 hover:bg-neutral-50 rounded-lg transition-colors"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'bid' ? 'bg-success' :
                      activity.type === 'auction' ? 'bg-warning' :
                      activity.type === 'appointment' ? 'bg-primary-500' :
                      'bg-neutral-400'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-neutral-800">{activity.message}</p>
                      {activity.amount && (
                        <p className="text-sm font-semibold text-success">{formatCurrency(activity.amount)}</p>
                      )}
                      <p className="text-xs text-neutral-500">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <button className="w-full mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium">
                View All Activity
              </button>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          variants={itemVariants}
          className="mt-8"
        >
          <div className="card p-6">
            <h2 className="text-xl font-bold text-neutral-800 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="btn-primary flex items-center justify-center space-x-2">
                <Car className="w-4 h-4" />
                <span>Start New Auction</span>
              </button>
              <button className="btn-secondary flex items-center justify-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Schedule Appointment</span>
              </button>
              <button className="btn-ghost flex items-center justify-center space-x-2">
                <Users className="w-4 h-4" />
                <span>View All Auctions</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
    </>
  );
};

export default Dashboard;
