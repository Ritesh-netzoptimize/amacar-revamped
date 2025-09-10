import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Phone, Video, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDate, formatTimeRemaining } from '../lib/utils';

const MyAppointments = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('week'); // 'week' or 'month'

  const appointments = [
    {
      id: 'APT-001',
      title: 'Vehicle Inspection - Honda Civic',
      dealer: 'ABC Motors',
      dealerPhone: '(555) 123-4567',
      date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      time: '14:00',
      duration: '60 minutes',
      location: '123 Main St, San Francisco, CA',
      type: 'inspection',
      status: 'confirmed',
      vehicle: '2020 Honda Civic',
    },
    {
      id: 'APT-002',
      title: 'Final Sale Discussion - Toyota Camry',
      dealer: 'XYZ Auto',
      dealerPhone: '(555) 987-6543',
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      time: '10:30',
      duration: '45 minutes',
      location: '456 Oak Ave, San Francisco, CA',
      type: 'discussion',
      status: 'confirmed',
      vehicle: '2019 Toyota Camry',
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

  const getUpcomingAppointments = () => {
    return appointments.filter(apt => apt.date > new Date());
  };

  const getTodaysAppointments = () => {
    const today = new Date();
    return appointments.filter(apt => 
      apt.date.toDateString() === today.toDateString()
    );
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
            My Appointments
          </motion.h1>
          <motion.p variants={itemVariants} className="text-neutral-600">
            Manage your scheduled appointments with dealers.
          </motion.p>
        </motion.div>

        {/* View Mode Toggle */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'week' 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              Week View
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'month' 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              Month View
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-neutral-100 rounded-lg">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-semibold text-neutral-800">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <button className="p-2 hover:bg-neutral-100 rounded-lg">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Today's Appointments */}
        {getTodaysAppointments().length > 0 && (
          <motion.div variants={itemVariants} className="mb-8">
            <h2 className="text-xl font-bold text-neutral-800 mb-4">Today's Appointments</h2>
            <div className="space-y-4">
              {getTodaysAppointments().map((appointment) => (
                <motion.div
                  key={appointment.id}
                  className="card p-6 border-l-4 border-primary-500"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-neutral-800">{appointment.title}</h3>
                        <p className="text-sm text-neutral-600">{appointment.dealer}</p>
                        <div className="flex items-center space-x-4 text-sm text-neutral-500">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{appointment.time} ({appointment.duration})</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{appointment.location}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="btn-ghost flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>Call</span>
                      </button>
                      <button className="btn-primary flex items-center space-x-2">
                        <Video className="w-4 h-4" />
                        <span>Join</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Upcoming Appointments */}
        <motion.div variants={itemVariants}>
          <h2 className="text-xl font-bold text-neutral-800 mb-4">Upcoming Appointments</h2>
          <div className="space-y-4">
            {getUpcomingAppointments().map((appointment) => (
              <motion.div
                key={appointment.id}
                className="card p-6 hover:shadow-medium transition-all duration-300"
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-neutral-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-800">{appointment.title}</h3>
                      <p className="text-sm text-neutral-600">{appointment.dealer}</p>
                      <div className="flex items-center space-x-4 text-sm text-neutral-500">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatDate(appointment.date)} at {appointment.time}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{appointment.location}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="btn-ghost flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>Call</span>
                    </button>
                    <button className="btn-secondary">
                      Reschedule
                    </button>
                    <button className="btn-primary">
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Empty State */}
        {getUpcomingAppointments().length === 0 && (
          <motion.div
            variants={itemVariants}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-12 h-12 text-neutral-400" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-800 mb-2">No Upcoming Appointments</h3>
            <p className="text-neutral-600 mb-6">You don't have any scheduled appointments at the moment.</p>
            <button className="btn-primary">
              Schedule Appointment
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;
