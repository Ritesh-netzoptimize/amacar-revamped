// src/provider/AuthProvider.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loadUser, logout } from '@/redux/slices/userSlice';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      const expiration = localStorage.getItem('authExpiration');
      if (expiration) {
        const expTime = parseInt(expiration);
        const remainingTime = expTime - Date.now();
        if (remainingTime > 0) {
          const timer = setTimeout(() => {
            dispatch(logout());
            navigate('/');
          }, remainingTime);
          return () => clearTimeout(timer);
        } else {
          dispatch(logout());
          navigate('/');
        }
      }
    }
  }, [user, dispatch, navigate]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-200"
      >
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Loader2 className="w-12 h-12 text-orange-500" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg font-medium text-slate-700"
          >
            Loading your experience...
          </motion.p>
        </div>
      </motion.div>
    );
  }

  return <>{children}</>;
}