import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Menu, X } from 'lucide-react';
import Sidebar from '../Sidebar/Sidebar';

const DashboardLayout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Mobile Header */}
      <div className='lg:block py-[1rem] px-[4rem] fixed '><img className=' h-10 w-32' src="src\assets\original_logo.jpg" alt="logo" /></div>
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-neutral-200">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={toggleMobileMenu}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <h1 className="text-lg font-semibold text-neutral-800">Dashboard</h1>
          
          <button className="relative p-2 hover:bg-neutral-100 rounded-lg transition-colors">
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

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`flex-1 transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
        } pt-16 lg:pt-0`}
      >
        <div className="min-h-screen">
          {children}
        </div>
      </motion.main>
    </div>
  );
};

export default DashboardLayout;
