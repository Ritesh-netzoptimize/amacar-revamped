import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
  Car, 
  Clock, 
  CheckCircle, 
  Calendar, 
  User, 
  ChevronLeft, 
  ChevronRight,
  Home,
  Bell,
  Settings
} from 'lucide-react';

const Sidebar = ({ isCollapsed, onToggle }) => {
  const location = useLocation();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      badge: null,
    },
    {
      name: 'Live Auctions',
      href: '/auctions',
      icon: Car,
      badge: 2,
    },
    {
      name: 'Pending Offers',
      href: '/pending-offers',
      icon: Clock,
      badge: 3,
    },
    {
      name: 'Previous Offers',
      href: '/offers',
      icon: Car,
      badge: null,
    },
    {
      name: 'Accepted Offers',
      href: '/accepted',
      icon: CheckCircle,
      badge: 1,
    },
    {
      name: 'My Appointments',
      href: '/appointments',
      icon: Calendar,
      badge: 2,
    },
  ];

  const bottomNavigation = [
    {
      name: 'Profile',
      href: '/profile',
      icon: User,
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
    },
  ];

  const containerVariants = {
    open: { width: '16rem' },
    closed: { width: '4rem' },
  };

  const itemVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: -20 },
  };

  return (
    <motion.aside
      variants={containerVariants}
      animate={isCollapsed ? 'closed' : 'open'}
      className="fixed left-0 top-16 bottom-0 bg-white border-r border-neutral-200 z-40 transition-all duration-300"
    >
      <div className="bg-blue-50 flex flex-col h-full">
        {/* Toggle Button */}
        <div className="p-4 border-b border-neutral-200">
          <button
            onClick={onToggle}
            className="w-full flex items-center justify-center p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 text-neutral-600" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-neutral-600" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-100 text-primary-700 font-semibold'
                    : 'text-neutral-600 hover:text-primary-600 hover:bg-primary-50'
                }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-error text-white text-xs rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>
                
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.div
                      variants={itemVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                      className="flex-1 flex items-center justify-between"
                    >
                      <span className="text-sm font-medium">{item.name}</span>
                      {item.badge && (
                        <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Navigation */}
        <div className="p-4 border-t border-neutral-200 space-y-2">
          {bottomNavigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-100 text-primary-700 font-semibold'
                    : 'text-neutral-600 hover:text-primary-600 hover:bg-primary-50'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      variants={itemVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                      className="text-sm font-medium"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </div>

        {/* User Info */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              variants={itemVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="p-4 border-t border-neutral-200"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-800 truncate">John Doe</p>
                  <p className="text-xs text-neutral-500 truncate">john@example.com</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
