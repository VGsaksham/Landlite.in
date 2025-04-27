import '../styles/globals.css';
import '../styles/index.css';
import '../styles/navigation.css';
import '../styles/footer.css';
import '../styles/history.css';
import '../styles/mobile-nav.css';
import '../styles/contact.css';
import '../styles/product-detail.css';
import '../styles/auth.css';
import Layout from '../components/Layout';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { useEffect } from 'react';

// Tell Font Awesome to skip adding the CSS automatically 
// since it's already imported above
config.autoAddCss = false;

function MyApp({ Component, pageProps }) {
  // Fix mobile menu issues
  useEffect(() => {
    // Add emergency fix for mobile menu visibility
    const fixMobileMenu = () => {
      // Script to ensure the mobile menu toggle works
      const hamburgerBtn = document.querySelector('.hamburger');
      const mobileMenu = document.querySelector('.mobile-menu');
      
      if (hamburgerBtn && mobileMenu) {
        // Clear any existing listeners to avoid duplicates
        const newHamburger = hamburgerBtn.cloneNode(true);
        hamburgerBtn.parentNode.replaceChild(newHamburger, hamburgerBtn);
        
        // Add new click event listener
        newHamburger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('Hamburger clicked, toggling mobile menu');
          
          // Toggle active class on mobile menu
          if (mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            document.body.classList.remove('mobile-menu-open');
            document.body.style.overflow = '';
          } else {
            mobileMenu.classList.add('active');
            document.body.classList.add('mobile-menu-open');
            document.body.style.overflow = 'hidden';
          }
          
          // Toggle active class on hamburger
          newHamburger.classList.toggle('active');
        });
        
        // Ensure close button also works
        const closeBtn = document.querySelector('.close-mobile-menu');
        if (closeBtn) {
          const newCloseBtn = closeBtn.cloneNode(true);
          closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
          
          newCloseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Close button clicked');
            
            mobileMenu.classList.remove('active');
            newHamburger.classList.remove('active');
            document.body.classList.remove('mobile-menu-open');
            document.body.style.overflow = '';
          });
        }
      }
    };
    
    // Apply the fix after a small delay to ensure DOM is loaded
    setTimeout(fixMobileMenu, 1000);
    
    // Also apply on route changes
    window.addEventListener('routeChangeComplete', fixMobileMenu);
    
    return () => {
      window.removeEventListener('routeChangeComplete', fixMobileMenu);
    };
  }, []);

  // Skip the Layout component for auth pages
  const isAuthPage = Component.name === 'Login' || 
                     Component.name === 'Signup' || 
                     Component.name === 'ForgotPassword';

  if (isAuthPage) {
    return <Component {...pageProps} />;
  }

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp; 