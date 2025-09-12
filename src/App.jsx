import Header from './components/Layout/Header/Header.jsx';
import Footer from './components/Layout/Footer/Footer.jsx';
import './App.css';
import { Toaster } from 'react-hot-toast';
import HomePage from './Pages/HomePage.jsx';
import { Route, Routes, useLocation } from 'react-router-dom';
import AuctionPage from './Pages/AuctionPage.jsx';
import DashboardLayout from './components/Layout/DashboardLayout/DashboardLayout.jsx';
import Dashboard from './Pages/Dashboard.jsx';
import LiveAuctionsPage from './Pages/LiveAuctionsPage.jsx';
import PendingOffersPage from './Pages/PendingOffersPage.jsx';
import PreviousOffersPage from './Pages/PreviousOffersPage.jsx';
import AcceptedOffersPage from './Pages/AcceptedOffersPage.jsx';
import MyAppointments from './Pages/MyAppointments.jsx';
import ProfilePage from './Pages/ProfilePage.jsx';
import ConditionAssessment from './Pages/ConditionAssessment.jsx';
import ExteriorPhotos from './Pages/ExteriorPhotos.jsx';
import ReviewPage from './Pages/ReviewPage.jsx';
import UnauthorizedPage from './Pages/UnauthorizedPage.jsx';
import { AuthProvider } from './provider/AuthProvider'; // Updated Redux-based AuthProvider
import PrivateRoute from './components/Auth/PrivateRoute'; // Updated PrivateRoute

function App() {
  const location = useLocation();
  const hideHeaderFooter =
    location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/auctions') ||
    location.pathname.startsWith('/pending-offers') ||
    location.pathname.startsWith('/offers') ||
    location.pathname.startsWith('/accepted') ||
    location.pathname.startsWith('/appointments') ||
    location.pathname.startsWith('/profile');

  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-50">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '14px',
              fontWeight: '500',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
          containerStyle={{
            marginTop: '60px',
          }}
        />

        {!hideHeaderFooter && <Header />}

        <main className="pt-0 bg-white">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/auction-page" element={<AuctionPage />} />
            <Route path="/condition-assessment" element={<ConditionAssessment />} />
            <Route path="/local-auction" element={<ExteriorPhotos />} />
            <Route path="/national-auction" element={<ExteriorPhotos />} />
            <Route path="/review" element={<ReviewPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                // <PrivateRoute>
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
              }
            />
            <Route
              path="/auctions"
              element={
                  <DashboardLayout>
                    <LiveAuctionsPage />
                  </DashboardLayout>
              }
            />
            <Route
              path="/pending-offers"
              element={
                  <DashboardLayout>
                    <PendingOffersPage />
                  </DashboardLayout>
              }
            />
            <Route
              path="/offers"
              element={
                  <DashboardLayout>
                    <PreviousOffersPage />
                  </DashboardLayout>
              }
            />
            <Route
              path="/accepted"
              element={
                  <DashboardLayout>
                    <AcceptedOffersPage />
                  </DashboardLayout>
              }
            />
            <Route
              path="/appointments"
              element={
                  <DashboardLayout>
                    <MyAppointments />
                  </DashboardLayout>
              }
            />
            <Route
              path="/profile"
              element={
                  <DashboardLayout>
                    <ProfilePage />
                  </DashboardLayout>
              }
            />
          </Routes>
        </main>

        {!hideHeaderFooter && <Footer />}
      </div>
    </AuthProvider>
  );
}

export default App;