// components/ui/LaunchModal.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import Confetti from 'react-confetti'; // Optional: for celebratory effect
import {useNavigate} from 'react-router-dom';

const LaunchModal = ({ isOpen, onClose, onLaunch, setModalOpen, setIsLaunching }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const navigate = useNavigate();

  // Simulate launch process (replace with actual launch logic)
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        onLaunch(); // Callback to handle post-launch logic
        setIsLoading(false);
        
      }, 3000); // Simulate 5-second loading
      const timer2 = setTimeout(() => {
        setModalOpen(false);
        setIsLaunching(false);
        navigate('/dashboard')
      }, 4000)
      return () => {
        clearTimeout(timer);
        clearTimeout(timer2);
      }
    }
  }, [isOpen, onLaunch]);

  // Get window size for confetti
  useEffect(() => {
    const updateSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            {isLoading ? (
              <div className="flex flex-col items-center gap-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full"
                />
                <p className="text-slate-700 text-lg font-medium">Launching your auction...</p>
                <p className="text-slate-500 text-sm text-center">
                  Please wait while we set up your auction. This may take a moment.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center"
                >
                  <CheckCircle className="h-8 w-8 text-white" />
                </motion.div>
                <p className="text-green-700 text-lg font-bold">Success!</p>
                <p className="text-slate-600 text-sm text-center">
                  Your auction has been successfully launched and is now live!
                </p>
                <div
                  className="mt-4 text-[var(--brand-orange)]"
                >
                  Redirecting to dashboard...
                </div>
              </div>
            )}
          </motion.div>
          {!isLoading && (
            <Confetti
              width={windowSize.width}
              height={windowSize.height}
              recycle={false}
              numberOfPieces={200}
              tweenDuration={5000}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LaunchModal;