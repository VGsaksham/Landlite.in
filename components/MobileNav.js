import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCog, faQuestionCircle, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';

export default function MobileNav({ isOpen, onClose }) {
  const mobileMenuRef = useRef(null);
  const [activeSection, setActiveSection] = useState(null);
  const router = useRouter();
  const scrollLockRef = useRef({
    scrollY: 0,
    bodyPosition: '',
    bodyTop: '',
    bodyLeft: '',
    bodyWidth: '',
    bodyOverflow: ''
  });
  
  // Reset active section when mobile nav closes
  useEffect(() => {
    if (!isOpen) {
      setActiveSection(null);
    }
  }, [isOpen]);
  
  // Reset active section on route change
  useEffect(() => {
    const handleRouteChange = () => {
      setActiveSection(null);
      onClose();
    };
    
    router.events.on('routeChangeStart', handleRouteChange);
    
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router, onClose]);

  // Prevent body scrolling when menu is open
  useEffect(() => {
    const lockScroll = () => {
      // Store original body styles
      const lockState = scrollLockRef.current;
      lockState.scrollY = window.scrollY;
      lockState.bodyPosition = document.body.style.position;
      lockState.bodyTop = document.body.style.top;
      lockState.bodyLeft = document.body.style.left;
      lockState.bodyWidth = document.body.style.width;
      lockState.bodyOverflow = document.body.style.overflow;
      
      // Apply lock styles
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${lockState.scrollY}px`;
      document.body.style.left = '0';
      document.body.style.width = '100%';
    };
    
    const unlockScroll = () => {
      // Restore original body styles
      const lockState = scrollLockRef.current;
      document.body.style.position = lockState.bodyPosition;
      document.body.style.top = lockState.bodyTop;
      document.body.style.left = lockState.bodyLeft;
      document.body.style.width = lockState.bodyWidth;
      document.body.style.overflow = lockState.bodyOverflow;
      
      // Only scroll if needed - don't use scrollTo to prevent jumping
      if (lockState.scrollY !== window.scrollY) {
        window.scrollTo({
          top: lockState.scrollY,
          behavior: 'instant' // Use instant to prevent animation
        });
      }
    };
    
    if (isOpen) {
      // Prevent default hash link behavior during lock
      const preventHashDefault = (e) => {
        if (e.target.closest('a[href^="#"]')) {
          e.preventDefault();
        }
      };
      
      // Lock scroll after a micro delay to ensure we capture correct position
      setTimeout(lockScroll, 10);
      document.addEventListener('click', preventHashDefault);
      
      return () => {
        document.removeEventListener('click', preventHashDefault);
        unlockScroll();
      };
    }
  }, [isOpen]);

  // Close the mobile menu when clicking outside of it
  useEffect(() => {
    function handleClickOutside(event) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && 
          !event.target.closest('.hamburger')) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Toggle section visibility
  const toggleSection = (section) => {
    if (activeSection === section) {
      setActiveSection(null);
    } else {
      setActiveSection(section);
    }
  };

  // Handle link click to close menu
  const handleLinkClick = (e) => {
    // Only prevent default for hash links
    if (e.currentTarget.getAttribute('href') === '#') {
      e.preventDefault();
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="mobile-nav-overlay" onClick={(e) => e.target.classList.contains('mobile-nav-overlay') && onClose()}>
      <div className="mobile-nav" ref={mobileMenuRef}>
        <div className="mobile-nav-header">
          <div className="mobile-logo">
            <Link href="/">
              <img src="/assets/images/landlite-logo.png" alt="Landlite Logo" />
            </Link>
          </div>
        </div>

        <div className="mobile-nav-content">
          <ul className="mobile-nav-main-links">
            <li className={activeSection === 'inspiration' ? 'active' : ''} style={{"--index": 0}}>
              <button 
                className="mobile-nav-main-button" 
                onClick={() => toggleSection('inspiration')}
              >
                <span>INSPIRATION</span>
                <FontAwesomeIcon 
                  icon={activeSection === 'inspiration' ? faChevronUp : faChevronDown} 
                  className="nav-icon"
                />
              </button>
              
              {activeSection === 'inspiration' && (
                <ul className="mobile-nav-sub-links">
                  <li style={{"--index": 0}}><Link href="#" onClick={handleLinkClick}>Projects Gallery</Link></li>
                  <li style={{"--index": 1}}><Link href="#" onClick={handleLinkClick}>Case Studies</Link></li>
                  <li style={{"--index": 2}}><Link href="#" onClick={handleLinkClick}>Design Trends</Link></li>
                  <li style={{"--index": 3}}><Link href="#" onClick={handleLinkClick}>Lighting Ideas</Link></li>
                </ul>
              )}
            </li>
            
            <li className={activeSection === 'products' ? 'active' : ''} style={{"--index": 1}}>
              <button 
                className="mobile-nav-main-button" 
                onClick={() => toggleSection('products')}
              >
                <span>PRODUCTS</span>
                <FontAwesomeIcon 
                  icon={activeSection === 'products' ? faChevronUp : faChevronDown} 
                  className="nav-icon"
                />
              </button>
              
              {activeSection === 'products' && (
                <ul className="mobile-nav-sub-links">
                  <li style={{"--index": 0}}><Link href="/products/indoor" onClick={handleLinkClick}>Indoor Products</Link></li>
                  <li style={{"--index": 1}}><Link href="/products/outdoor" onClick={handleLinkClick}>Outdoor Products</Link></li>
                  <li style={{"--index": 2}}><Link href="/products/modules" onClick={handleLinkClick}>Modular Systems</Link></li>
                  <li style={{"--index": 3}}><Link href="/products/track" onClick={handleLinkClick}>Track Lighting</Link></li>
                </ul>
              )}
            </li>
            
            <li className={activeSection === 'about' ? 'active' : ''} style={{"--index": 2}}>
              <button 
                className="mobile-nav-main-button" 
                onClick={() => toggleSection('about')}
              >
                <span>ABOUT</span>
                <FontAwesomeIcon 
                  icon={activeSection === 'about' ? faChevronUp : faChevronDown} 
                  className="nav-icon"
                />
              </button>
              
              {activeSection === 'about' && (
                <ul className="mobile-nav-sub-links">
                  <li style={{"--index": 0}}><Link href="#" onClick={handleLinkClick}>Our Story</Link></li>
                  <li style={{"--index": 1}}><Link href="/history" onClick={handleLinkClick}>Our History</Link></li>
                  <li style={{"--index": 2}}><Link href="#" onClick={handleLinkClick}>Design Philosophy</Link></li>
                  <li style={{"--index": 3}}><Link href="#" onClick={handleLinkClick}>Team</Link></li>
                  <li style={{"--index": 4}}><Link href="/contact" onClick={handleLinkClick}>Contact</Link></li>
                </ul>
              )}
            </li>
            
            <li className={activeSection === 'account' ? 'active' : ''} style={{"--index": 3}}>
              <button 
                className="mobile-nav-main-button" 
                onClick={() => toggleSection('account')}
              >
                <span>ACCOUNT</span>
                <FontAwesomeIcon 
                  icon={activeSection === 'account' ? faChevronUp : faChevronDown} 
                  className="nav-icon"
                />
              </button>
              
              {activeSection === 'account' && (
                <ul className="mobile-nav-sub-links account-links">
                  <li style={{"--index": 0}}>
                    <Link href="/login" onClick={handleLinkClick}>
                      <span><FontAwesomeIcon icon={faUser} /> Login / Register</span>
                    </Link>
                  </li>
                  <li style={{"--index": 1}}>
                    <Link href="#" onClick={handleLinkClick}>
                      <span><FontAwesomeIcon icon={faCog} /> Settings</span>
                    </Link>
                  </li>
                  <li style={{"--index": 2}}>
                    <Link href="#" onClick={handleLinkClick}>
                      <span><FontAwesomeIcon icon={faQuestionCircle} /> Help</span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
} 