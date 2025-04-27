import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCog, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faLinkedinIn, faPinterestP } from '@fortawesome/free-brands-svg-icons';

export default function MobileNav({ isOpen, onClose }) {
  const mobileMenuRef = useRef(null);
  // State to track which section is open
  const [openSection, setOpenSection] = useState(null);
  
  // Debug: Log when isOpen changes
  useEffect(() => {
    console.log("MobileNav isOpen changed:", isOpen);
  }, [isOpen]);

  // Toggle section open/closed
  const toggleSection = (section) => {
    console.log("Toggling section:", section);
    if (openSection === section) {
      setOpenSection(null);
    } else {
      setOpenSection(section);
    }
  };

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        mobileMenuRef.current && 
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest('.hamburger')
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Add keyboard accessibility
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  // Handle scroll lock when menu is open
  useEffect(() => {
    console.log("Applying body class for mobile menu:", isOpen);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('mobile-menu-open');
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('mobile-menu-open');
    };
  }, [isOpen]);

  // Don't render anything if not open - add this for debugging
  // if (!isOpen) return null;

  return (
    <div 
      className={`mobile-menu ${isOpen ? 'active' : ''}`}
      ref={mobileMenuRef}
      aria-hidden={!isOpen}
    >
      <div className="mobile-menu-header">
        <h3 className="mobile-menu-title">Menu</h3>
        <button 
          className="close-mobile-menu" 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
          aria-label="Close mobile menu"
        >
          &times;
        </button>
      </div>
      
      <div className="mobile-menu-content">
        <div className={`mobile-menu-section ${openSection === 'inspiration' ? 'open' : ''}`}>
          <h3 onClick={() => toggleSection('inspiration')}>Inspiration</h3>
          <div className="mobile-menu-links">
            <Link href="#">Projects Gallery</Link>
            <Link href="#">Case Studies</Link>
            <Link href="#">Design Trends</Link>
            <Link href="#">Lighting Ideas</Link>
          </div>
        </div>
        
        <div className={`mobile-menu-section ${openSection === 'products' ? 'open' : ''}`}>
          <h3 onClick={() => toggleSection('products')}>Products</h3>
          <div className="mobile-menu-links">
            <Link href="/products/indoor">Indoor Products</Link>
            <Link href="/products/outdoor">Outdoor Products</Link>
            <Link href="/products/modules">Modular Systems</Link>
            <Link href="/products/track">Track Lighting</Link>
          </div>
        </div>
        
        <div className={`mobile-menu-section ${openSection === 'about' ? 'open' : ''}`}>
          <h3 onClick={() => toggleSection('about')}>About</h3>
          <div className="mobile-menu-links">
            <Link href="#">Our Story</Link>
            <Link href="/history">Our History</Link>
            <Link href="#">Design Philosophy</Link>
            <Link href="#">Team</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
        
        <div className={`mobile-menu-section ${openSection === 'account' ? 'open' : ''}`}>
          <h3 onClick={() => toggleSection('account')}>Account</h3>
          <div className="mobile-menu-links">
            <Link href="/login">
              <FontAwesomeIcon icon={faUser} /> <span>Login / Register</span>
            </Link>
            <Link href="#">
              <FontAwesomeIcon icon={faCog} /> <span>Settings</span>
            </Link>
            <Link href="#">
              <FontAwesomeIcon icon={faQuestionCircle} /> <span>Help</span>
            </Link>
          </div>
        </div>
        
        <div className={`mobile-menu-section ${openSection === 'social' ? 'open' : ''}`}>
          <h3 onClick={() => toggleSection('social')}>Social</h3>
          <div className="mobile-menu-links">
            <Link href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener">
              <FontAwesomeIcon icon={faInstagram} /> <span>Instagram</span>
            </Link>
            <Link href="https://linkedin.com" aria-label="LinkedIn" target="_blank" rel="noopener">
              <FontAwesomeIcon icon={faLinkedinIn} /> <span>LinkedIn</span>
            </Link>
            <Link href="https://pinterest.com" aria-label="Pinterest" target="_blank" rel="noopener">
              <FontAwesomeIcon icon={faPinterestP} /> <span>Pinterest</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 