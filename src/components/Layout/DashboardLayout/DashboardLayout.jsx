import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Menu, X, User, Search, LogOut, Settings, ChevronDown } from 'lucide-react';
import Sidebar from '../Sidebar/Sidebar';

const DashboardLayout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const profileRef = useRef(null);
  const notificationsRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsNotificationsOpen(false); // Close notifications if profile is opened
  };

  const toggleNotificationsDropdown = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    setIsProfileOpen(false); // Close profile if notifications is opened
  };

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current && !profileRef.current.contains(event.target) &&
        notificationsRef.current && !notificationsRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Dummy notifications data
  const notifications = [
    { id: 1, message: "New bid received on your vehicle!", time: "10 min ago" },
    { id: 2, message: "Your auction is ending soon.", time: "1 hr ago" },
    { id: 3, message: "Profile updated successfully.", time: "2 hrs ago" },
  ];

  // Fake profile data
  const profileData = {
    name: "John Doe",
    email: "john.doe@example.com",
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-neutral-200 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={toggleMobileMenu}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors duration-200"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 text-neutral-600" /> : <Menu className="w-5 h-5 text-neutral-600" />}
          </button>
          
          <h1 className="text-lg font-semibold text-neutral-800">Dashboard</h1>
          
          <button className="relative p-2 hover:bg-neutral-100 rounded-lg transition-colors duration-200">
            <Bell className="w-5 h-5 text-neutral-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
          </button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar 
          isCollapsed={isSidebarCollapsed} 
          onToggle={toggleSidebar} 
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div 
            className="absolute inset-0 bg-black/50" 
            onClick={toggleMobileMenu}
          />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-white">
            <Sidebar 
              isCollapsed={false} 
              onToggle={toggleMobileMenu} 
            />
          </div>
        </div>
      )}

      {/* Main Content with Header */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`flex-1 transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
        } pt-16 lg:pt-0`}
      >
        {/* Desktop Header */}
        <div className="hidden h-20 lg:block bg-white border-b border-neutral-200 shadow-md">
          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-white to-neutral-50">
            {/* Left Side: Search Bar */}
            <div className="flex items-center flex-1 max-w-lg">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-white text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all duration-300 shadow-sm hover:shadow-md"
                  style={{ background: 'linear-gradient(145deg, #ffffff, #f8fafc)' }}
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-500" />
              </div>
            </div>

            {/* Right Side: Icons */}
            <div className="flex items-center space-x-3">
              <div className="relative" ref={notificationsRef}>
                <button
                  onClick={toggleNotificationsDropdown}
                  className="cursor-pointer relative p-2.5 bg-neutral-50 rounded-full hover:bg-primary-50 hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <Bell className="w-5 h-5 text-neutral-600" />
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-error rounded-full border border-white"></span>
                </button>
                <AnimatePresence>
                  {isNotificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-neutral-200 z-50 overflow-hidden"
                    >
                      <div className="bg-gradient-to-r from-neutral-50 to-white px-4 py-3 border-b border-neutral-200">
                        <h3 className="text-sm font-semibold text-neutral-800">Notifications</h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className="px-4 py-3 hover:bg-primary-50 transition-colors duration-200 border-b border-neutral-100 last:border-b-0"
                          >
                            <p className="text-sm text-neutral-800">{notification.message}</p>
                            <p className="text-xs text-neutral-500 mt-1">{notification.time}</p>
                          </div>
                        ))}
                      </div>
                      <div className="px-4 py-2 bg-neutral-50">
                        <button className="w-full text-sm text-primary-600 hover:text-primary-700 font-medium text-left">
                          View All Notifications
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="relative" ref={profileRef}>
                <button
                  onClick={toggleProfileDropdown}
                  className="cursor-pointer p-2.5 bg-neutral-50 rounded-full hover:bg-primary-50 hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md flex items-center"
                >
                  <User className="w-5 h-5 text-neutral-600" />
                  <ChevronDown className="w-4 h-4 text-neutral-600 ml-1" />
                </button>
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-neutral-200 z-50 overflow-hidden"
                    >
                      <div className="bg-gradient-to-r from-neutral-50 to-white px-4 py-3 border-b border-neutral-200">
                        <p className="text-sm font-semibold text-neutral-800">{profileData.name}</p>
                        <p className="text-xs text-neutral-500 truncate">{profileData.email}</p>
                      </div>
                      <div className="py-1">
                        <button className="w-full px-4 py-2 text-sm text-neutral-600 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200 flex items-center space-x-2">
                          <Settings className="w-4 h-4" />
                          <span>Settings</span>
                        </button>
                        <button className="w-full px-4 py-2 text-sm text-neutral-600 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200 flex items-center space-x-2">
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        <div className="min-h-screen">
          {children}
        </div>
      </motion.main>
    </div>
  );
};

export default DashboardLayout;