import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCog, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

export default function Navbar() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState(null);
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const expandedNavRef = useRef(null);
  const navbarRef = useRef(null);
  let lastScrollY = 0;

  // Handle navigation toggle
  const toggleNav = (nav) => {
    // If the same nav is clicked, close it
    if (activeNav === nav) {
      closeNav();
    } else {
      // Clear any existing active nav classes
      clearNavClasses();
      
      // Set the new active nav
      setActiveNav(nav);
      setIsNavExpanded(true);
      
      // Add expanded class to navbar
      if (navbarRef.current) {
        navbarRef.current.classList.add('expanded');
      }
      
      // Add specific expansion class
      if (expandedNavRef.current) {
        expandedNavRef.current.classList.add(`nav-bar-${nav}-expanded`);
      }
    }
  };

  // Close navigation
  const closeNav = () => {
    clearNavClasses();
    setActiveNav(null);
    setIsNavExpanded(false);
    
    // Remove expanded class from navbar
    if (navbarRef.current) {
      navbarRef.current.classList.remove('expanded');
    }
  };

  // Clear all nav-related classes from expanded nav
  const clearNavClasses = () => {
    if (expandedNavRef.current) {
      expandedNavRef.current.classList.remove(
        'nav-bar-inspiration-expanded',
        'nav-bar-products-expanded',
        'nav-bar-about-expanded',
        'nav-bar-others-expanded'
      );
    }
  };

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Detect if scrolled past threshold
      if (currentScrollY > 100) {
        setIsScrolled(true);
        document.body.classList.add('scrolled');
      } else {
        setIsScrolled(false);
        document.body.classList.remove('scrolled');
      }

      // Detect scroll direction
      if (currentScrollY > lastScrollY) {
        // Scrolling down
        setIsScrollingDown(true);
        document.body.classList.add('scrolling-down');
        document.body.classList.remove('scrolling-up');
      } else {
        // Scrolling up
        setIsScrollingDown(false);
        document.body.classList.add('scrolling-up');
        document.body.classList.remove('scrolling-down');
      }
      
      // Update last scroll position
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', () => {
      // Use requestAnimationFrame for smoother transitions
      requestAnimationFrame(handleScroll);
    });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Handle click outside to close nav
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isNavExpanded &&
        expandedNavRef.current && 
        !expandedNavRef.current.contains(event.target) &&
        navbarRef.current &&
        !navbarRef.current.contains(event.target)
      ) {
        closeNav();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNavExpanded]);

  // Add keyboard accessibility
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isNavExpanded) {
        closeNav();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isNavExpanded]);

  return (
    <>
      <header className={isScrolled ? 'scrolled' : ''}>
        <nav 
          className={`navbar ${isScrolled ? 'scrolled' : ''} ${isNavExpanded ? 'expanded' : ''} ${isScrollingDown ? 'scrolling-down' : ''}`} 
          role="navigation" 
          aria-label="Main Navigation"
          ref={navbarRef}
        >
          <div className="logo">
            <Link href="/" aria-label="Landlite Home">
              <img src="/assets/images/landlite-logo.png" alt="Landlite Logo" width="180" height="48" />
            </Link>
          </div>

          <div 
            className={`nav-bar nav-bar-1 ${activeNav === 'inspiration' ? 'active' : ''}`} 
            data-nav="inspiration"
            onClick={() => toggleNav('inspiration')}
            onKeyDown={(e) => e.key === 'Enter' && toggleNav('inspiration')}
            tabIndex="0"
            role="button"
            aria-expanded={activeNav === 'inspiration'}
            aria-controls="inspiration-nav"
          >
            <span>INSPIRATION</span>
          </div>
          <div 
            className={`nav-bar nav-bar-2 ${activeNav === 'products' ? 'active' : ''}`} 
            data-nav="products"
            onClick={() => toggleNav('products')}
            onKeyDown={(e) => e.key === 'Enter' && toggleNav('products')}
            tabIndex="0"
            role="button"
            aria-expanded={activeNav === 'products'}
            aria-controls="products-nav"
          >
            <span>PRODUCTS</span>
          </div>
          <div 
            className={`nav-bar nav-bar-3 ${activeNav === 'about' ? 'active' : ''}`} 
            data-nav="about"
            onClick={() => toggleNav('about')}
            onKeyDown={(e) => e.key === 'Enter' && toggleNav('about')}
            tabIndex="0"
            role="button"
            aria-expanded={activeNav === 'about'}
            aria-controls="about-nav"
          >
            <span>ABOUT</span>
          </div>
          <div 
            className={`nav-bar nav-bar-4 ${activeNav === 'others' ? 'active' : ''}`} 
            data-nav="others"
            onClick={() => toggleNav('others')}
            onKeyDown={(e) => e.key === 'Enter' && toggleNav('others')}
            tabIndex="0"
            role="button"
            aria-expanded={activeNav === 'others'}
            aria-controls="others-nav"
          >
            <span>OTHERS</span>
          </div>
        </nav>
      </header>
      
      {/* Expanded Navigation */}
      <div 
        className={`expanded-nav-content ${activeNav ? 'active' : ''} ${activeNav ? `nav-bar-${activeNav}-expanded` : ''}`}
        ref={expandedNavRef}
      >
        <div className="expanded-nav-header">
          <h2 className="expanded-nav-title">
            {activeNav === 'inspiration' && 'INSPIRATION'}
            {activeNav === 'products' && 'PRODUCTS'}
            {activeNav === 'about' && 'ABOUT'}
            {activeNav === 'others' && 'OTHERS'}
          </h2>
          <button 
            className="close-nav-btn" 
            onClick={closeNav} 
            aria-label="Close navigation menu"
          >
            &times;
          </button>
        </div>
        <div className="expanded-nav-links">
          {activeNav === 'products' && (
            <div className="product-links">
              <Link href="/products/indoor">Indoor Products</Link>
              <Link href="/products/outdoor">Outdoor Products</Link>
              <Link href="/products/modules">Modular Systems</Link>
              <Link href="/products/track">Track Lighting</Link>
            </div>
          )}
          {activeNav === 'inspiration' && (
            <div className="inspiration-links">
              <Link href="#">Projects Gallery</Link>
              <Link href="#">Case Studies</Link>
              <Link href="#">Design Trends</Link>
              <Link href="#">Lighting Ideas</Link>
            </div>
          )}
          {activeNav === 'about' && (
            <div className="about-links">
              <Link href="#">Our Story</Link>
              <Link href="/history">Our History</Link>
              <Link href="#">Design Philosophy</Link>
              <Link href="#">Team</Link>
              <Link href="/contact">Contact</Link>
            </div>
          )}
          {activeNav === 'others' && (
            <div className="others-links">
              <Link href="/login">Login / Register</Link>
              <Link href="#">Settings</Link>
              <Link href="#">Help</Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 