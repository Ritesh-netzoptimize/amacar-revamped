import { useContext, useState } from 'react'
import './header.css'
import LoginModal from '@/components/ui/LoginModal'
import { logout, setLoginRedirect } from '@/redux/slices/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import LogoutModal from '@/components/ui/LogoutModal'
import { persistor } from '@/redux/store'
// import { AuthContext } from '@/contexts/AuthContext'

export default function Header() {
    const [open, setOpen] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [logoutModalOpen, setLogoutModalOpen] = useState(false);
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
  
    const handleLoginClick = (e) => {
      e.preventDefault();
      dispatch(setLoginRedirect(null)); // Stay on current page
      setLoginModalOpen(true);
      setOpen(false);
    };
  
    const handleLogoutClick = () => {
      setLogoutModalOpen(true);
      setOpen(false);
    };
  
    const handleConfirmLogout = async () => {
        // await persistor.purge();
        await dispatch(logout());   
        navigate('/');
    };
  
    const handleForgotPassword = () => {
      console.log("Open forgot password modal");
    };
  
    const handleRegister = () => {
      console.log("Open register modal");
    };
  
    return (
      <>
        <header className="site-header">
          <div className="container">
            <div className="header-row">
              {/* left: logo area */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 180 }}>
                <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
                  <img className="logo" src="src/assets/original_logo.jpg" alt="Logo" />
                </a>
              </div>
  
              {/* center: nav (absolutely centered on desktop) */}
              <nav className="nav-desktop">
                <a className="nav-link" href="/">Home</a>
                <a className="nav-link" href="#">Testimonials</a>
                <a className="nav-link" href="#">Join Our Dealer Network</a>
                <a className="nav-link" href="#">Our Vision</a>
              </nav>
  
              {/* right: actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', minWidth: 180 }}>
                <div className="actions-desktop">
                  {user ? (
                    <button className="btn-login cursor-pointer" onClick={handleLogoutClick}>
                      Logout
                    </button>
                  ) : (
                    <a className="btn-login" href="#" onClick={handleLoginClick}>
                      Login / Register
                    </a>
                  )}
                </div>
  
                <div className="mobile-toggle" style={{ display: 'flex', alignItems: 'center', marginLeft: 8 }}>
                  <button
                    aria-label="Toggle menu"
                    aria-expanded={open}
                    onClick={() => setOpen(!open)}
                    className="hamburger-btn"
                  >
                    <span className={`hamburger ${open ? 'open' : ''}`}>
                      <span></span>
                      <span></span>
                      <span></span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
  
          <div className={`mobile-panel ${open ? 'open' : ''}`}>
            <div className="container" style={{ paddingTop: 12, paddingBottom: 18 }}>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <a className="nav-link-mobile" href="#">Home</a>
                <a className="nav-link-mobile" href="#">Testimonials</a>
                <a className="nav-link-mobile" href="#">Join Our Dealer Network</a>
                <a className="nav-link-mobile" href="#">Our Vision</a>
                {user ? (
                  <button className="btn-login-mobile" onClick={handleLogoutClick}>
                    Logout
                  </button>
                ) : (
                  <a className="btn-login-mobile" href="#" onClick={handleLoginClick}>
                    Login / Register
                  </a>
                )}
              </nav>
            </div>
          </div>
        </header>
  
        {/* Login Modal */}
        <LoginModal
          isOpen={loginModalOpen}
          onClose={() => setLoginModalOpen(false)}
          onForgotPassword={handleForgotPassword}
          onRegister={handleRegister}
        />
  
        {/* Logout Modal */}
        <LogoutModal
          isOpen={logoutModalOpen}
          onClose={() => setLogoutModalOpen(false)}
          onConfirm={handleConfirmLogout}
        />
      </>
    );
  }