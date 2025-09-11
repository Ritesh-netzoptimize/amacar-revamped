import { useContext, useState } from 'react'
import './header.css'
import LoginModal from '@/components/ui/LoginModal'
import { AuthContext } from '@/contexts/AuthContext'

export default function Header() {
    const [open, setOpen] = useState(false)
    const [loginModalOpen, setLoginModalOpen] = useState(false)
    const {user, logout} = useContext(AuthContext);

    const handleLoginClick = (e) => {
        e.preventDefault()
        setLoginModalOpen(true)
        // Close mobile menu if it's open
        setOpen(false)
      }
    
      const handleForgotPassword = () => {
        console.log("Open forgot password modal")
        // You can implement forgot password modal here
      }
    
      const handleRegister = () => {
        console.log("Open register modal")
        // You can implement register modal here
      }

    return (
        <header className="site-header">
            <div className="container">
                <div className="header-row">
                    {/* left: logo area */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 180 }}>
                        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
                            <img className='logo' src="src\assets\original_logo.jpg" alt="" />
                        </a>
                    </div>

                    {/* center: nav (absolutely centepurple on desktop) */}
                    <nav className="nav-desktop">
                        <a className="nav-link" href="/">Home</a>
                        <a className="nav-link" href="#">Testimonials</a>
                        <a className="nav-link" href="#">Join Our Dealer Network</a>
                        <a className="nav-link" href="#">Our Vision</a>
                    </nav>

                    {/* right: actions */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', minWidth: 180 }}>
                        {
                            !user ? <div className="actions-desktop">
                            <a className="btn-login" href="#" onClick={handleLoginClick}>Login / Register</a>
                        </div> : <div className="actions-desktop">
                            <div className="btn-login cursor-pointer"  onClick={() => logout()}>Logout</div>
                        </div> 
                        }

                        <div className="mobile-toggle" style={{ display: 'flex', alignItems: 'center', marginLeft: 8 }}>
                            <button aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)} className={`hamburger-btn`}>
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
                    </nav>
                    {
                        !user ? <div style={{ marginTop: 12 }}>
                        <a className="btn-login-mobile" href="#" onClick={handleLoginClick}>Login / Register</a>
                    </div> : <div style={{ marginTop: 12 }}>
                        <a className="btn-login-mobile" href="#" onClick={() => logout}>Logout</a>
                    </div>
                    
                    }
                </div>
            </div>

            {/* Login Modal */}
            <LoginModal 
                isOpen={loginModalOpen}
                onClose={setLoginModalOpen}
                onForgotPassword={handleForgotPassword}
                onRegister={handleRegister}
            />
        </header>
    )
}
