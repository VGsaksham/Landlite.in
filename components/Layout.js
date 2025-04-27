import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCog, faQuestionCircle, faBell, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faLinkedinIn, faPinterestP } from '@fortawesome/free-brands-svg-icons';

export default function Layout({ children, title = 'Landlite - Premium Architectural Lighting Solutions' }) {
  const router = useRouter();
  const isHomePage = router.pathname === '/';
  const [activeNav, setActiveNav] = useState(null);
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);

  const toggleNav = (nav) => {
    if (activeNav === nav) {
      setActiveNav(null);
      setIsNavExpanded(false);
    } else {
      setActiveNav(nav);
      setIsNavExpanded(true);
    }
  };

  const closeNav = () => {
    setActiveNav(null);
    setIsNavExpanded(false);
  };

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);
    
    // Add or remove the mobile-menu-open class to the body
    if (newState) {
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
    }
  };

  // Close mobile menu when navigating to a new page
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.classList.remove('mobile-menu-open');
  };

  // Listen for route changes to close navigation
  useEffect(() => {
    const handleRouteChange = () => {
      closeNav();
      closeMobileMenu();
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  // Enhanced scroll handler to manage all navigation-related scroll behaviors
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const body = document.body;
      
      // Basic scroll detection
      if (currentScrollY > 50) {
        setIsScrolled(true);
        body.classList.add('scrolled');
      } else {
        setIsScrolled(false);
        body.classList.remove('scrolled');
      }
      
      // Enhanced scroll direction detection with a small threshold
      // to prevent tiny scroll oscillations from triggering direction changes
      const scrollDifference = currentScrollY - lastScrollY.current;
      const threshold = 5; // pixels
      
      if (scrollDifference > threshold) {
        // Clearly scrolling down
        body.classList.add('scrolling-down');
        body.classList.remove('scrolling-up');
      } else if (scrollDifference < -threshold) {
        // Clearly scrolling up
        body.classList.add('scrolling-up');
        body.classList.remove('scrolling-down');
      }
      // For small movements (< threshold), we keep the current direction
      
      // Check for hero sections (any page can have a hero)
      const heroSection = document.querySelector('.hero, .contact-hero, .history-hero, .page-hero');
      if (heroSection) {
        const heroHeight = heroSection.offsetHeight;
        
        // Check if we're in the hero section
        if (currentScrollY < heroHeight - 50) {
          body.classList.add('at-hero');
        } else {
          body.classList.remove('at-hero');
        }
      }
      
      // Update last scroll position
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', () => {
      // Use requestAnimationFrame for smoother transitions
      requestAnimationFrame(handleScroll);
    });
    
    // Initial check
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close navigation when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isNavExpanded && !event.target.closest('.navbar') && !event.target.closest('.expanded-nav-content')) {
        closeNav();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNavExpanded]);

  // Clean up classes on unmount
  useEffect(() => {
    return () => {
      document.body.classList.remove('mobile-menu-open');
    };
  }, []);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400;500;600&display=swap" rel="stylesheet" />
        <link rel="icon" href="/assets/images/favicon.ico" />
        <link rel="apple-touch-icon" href="/assets/images/apple-touch-icon.png" />
      </Head>

      <header className={isScrolled ? 'scrolled' : ''}>
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''} ${isNavExpanded ? 'expanded' : ''} ${!isHomePage ? 'non-home-page' : ''}`} role="navigation" aria-label="Main Navigation">
          <div className={`nav-bar nav-bar-1 ${activeNav === 'inspiration' ? 'active' : ''}`} 
               data-nav="inspiration"
               onClick={() => toggleNav('inspiration')}>
            <span>INSPIRATION</span>
          </div>
          <div className={`nav-bar nav-bar-2 ${activeNav === 'products' ? 'active' : ''}`} 
               data-nav="products"
               onClick={() => toggleNav('products')}>
            <span>PRODUCTS</span>
          </div>
          <div className={`nav-bar nav-bar-3 ${activeNav === 'about' ? 'active' : ''}`} 
               data-nav="about"
               onClick={() => toggleNav('about')}>
            <span>ABOUT</span>
          </div>
          <div className={`nav-bar nav-bar-4 ${activeNav === 'others' ? 'active' : ''}`} 
               data-nav="others"
               onClick={() => toggleNav('others')}>
            <span>OTHERS</span>
          </div>
          
          <div className={`expanded-nav-content ${activeNav ? `nav-bar-${activeNav}-expanded` : ''}`}>
            <div className="expanded-nav-header">
              <h2 className="expanded-nav-title">
                {activeNav === 'inspiration' && 'INSPIRATION'}
                {activeNav === 'products' && 'PRODUCTS'}
                {activeNav === 'about' && 'ABOUT'}
                {activeNav === 'others' && 'OTHERS'}
              </h2>
              <button className="close-nav-btn" onClick={closeNav} aria-label="Close navigation menu">
                &times;
              </button>
            </div>
            <div className="expanded-nav-links">
              <div className={`nav-section ${activeNav === 'inspiration' ? 'active' : ''}`} data-section="inspiration">
                <div className="sub-nav-section">
                  <ul>
                    <li><Link href="#" title="View our projects gallery">Projects Gallery</Link></li>
                    <li><Link href="#" title="Explore our case studies">Case Studies</Link></li>
                    <li><Link href="#" title="Discover the latest design trends">Design Trends</Link></li>
                    <li><Link href="#" title="Get inspired with lighting ideas">Lighting Ideas</Link></li>
                  </ul>
                </div>
              </div>
              <div className={`nav-section ${activeNav === 'products' ? 'active' : ''}`} data-section="products">
                <div className="sub-nav-section">
                  <ul>
                    <li><Link href="/products/indoor" title="Browse indoor lighting products">Indoor Products</Link></li>
                    <li><Link href="/products/outdoor" title="Explore outdoor lighting solutions">Outdoor Products</Link></li>
                    <li><Link href="/products/modules" title="View modular lighting systems">Modular Systems</Link></li>
                    <li><Link href="/products/track" title="Discover track lighting options">Track Lighting</Link></li>
                  </ul>
                </div>
              </div>
              <div className={`nav-section ${activeNav === 'about' ? 'active' : ''}`} data-section="about">
                <div className="sub-nav-section">
                  <ul>
                    <li><Link href="#" title="Learn about our story">Our Story</Link></li>
                    <li><Link href="/history" title="Explore our company history">Our History</Link></li>
                    <li><Link href="#" title="Understand our design philosophy">Design Philosophy</Link></li>
                    <li><Link href="#" title="Meet our team">Team</Link></li>
                    <li><Link href="/contact" title="Contact us">Contact</Link></li>
                  </ul>
                </div>
              </div>
              <div className={`nav-section ${activeNav === 'others' ? 'active' : ''}`} data-section="others">
                <div className="sub-nav-section">
                  <ul className="account-icons">
                    <li>
                      <Link href="/login" title="Login to your account">
                        <FontAwesomeIcon icon={faUser} /> Login / Register
                      </Link>
                    </li>
                    <li>
                      <Link href="#" title="View your account settings">
                        <FontAwesomeIcon icon={faCog} /> Settings
                      </Link>
                    </li>
                    <li>
                      <Link href="#" title="Get help and support">
                        <FontAwesomeIcon icon={faQuestionCircle} /> Help
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <div className="logo">
          <Link href="/" aria-label="Landlite Home">
            <img src="/assets/images/landlite-logo.png" alt="Landlite Logo" width="150" height="40" />
          </Link>
        </div>
        <div className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`} 
             onClick={toggleMobileMenu}
             aria-label="Mobile menu" 
             role="button" 
             aria-expanded={isMobileMenuOpen} 
             aria-controls="mobile-nav">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </header>

      <main id="main-content">
        {children}
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-section">
              <h3>About Landlite</h3>
              <p>Premium lighting instruments for architecture, creating the perfect light experience in architectural environments.</p>
              <div className="social-links">
                <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener">
                  <FontAwesomeIcon icon={faInstagram} />
                </a>
                <a href="https://linkedin.com" aria-label="LinkedIn" target="_blank" rel="noopener">
                  <FontAwesomeIcon icon={faLinkedinIn} />
                </a>
                <a href="https://pinterest.com" aria-label="Pinterest" target="_blank" rel="noopener">
                  <FontAwesomeIcon icon={faPinterestP} />
                </a>
              </div>
            </div>
            <div className="footer-section">
              <h3>Links</h3>
              <ul className="footer-links">
                <li><Link href="/products">Products</Link></li>
                <li><Link href="/history">Our History</Link></li>
                <li><Link href="/contact">Contact</Link></li>
                <li><Link href="/login">Login / Register</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h3>Contact Us</h3>
              <address>
                <p>123 Design Avenue<br />
                New York, NY 10001<br />
                United States</p>
                <p>Email: info@landlite.com<br />
                Phone: +1 (212) 555-1234</p>
              </address>
            </div>
          </div>
          <div className="footer-bottom">
            <p className="copyright">&copy; {new Date().getFullYear()} Landlite. Designed and Developed by <a href="https://github.com/vgsaksham" target="_blank" rel="noopener noreferrer">Saksham</a></p>
            <div className="footer-legal">
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
} 