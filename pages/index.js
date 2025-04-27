import Link from 'next/link';
import Head from 'next/head';
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCog, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faLinkedinIn, faPinterestP } from '@fortawesome/free-brands-svg-icons';

export default function Home() {
  // Custom data for schema
  const structuredData = {
    organization: {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Landlite",
      "url": "https://www.landlite.com/",
      "logo": "/assets/images/landlite-logo.png",
      "description": "Premium lighting instruments for architecture, creating the perfect light experience in architectural environments.",
      "sameAs": [
        "https://www.instagram.com/landlite",
        "https://www.linkedin.com/company/landlite",
        "https://www.pinterest.com/landlite"
      ],
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "123 Design Avenue",
        "addressLocality": "New York",
        "addressRegion": "NY",
        "postalCode": "10001",
        "addressCountry": "US"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+12125551234",
        "contactType": "customer service",
        "availableLanguage": ["English"]
      }
    },
    productGallery: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "item": {
            "@type": "Product",
            "name": "Minimalist Pendant Light",
            "description": "Elegant simplicity with focused illumination for modern spaces. Our pendant lights combine sleek design with precise light control.",
            "image": "/assets/images/landlite_test1.JPG",
            "url": "https://www.landlite.com/products/minimalist-pendant"
          }
        },
        {
          "@type": "ListItem",
          "position": 2,
          "item": {
            "@type": "Product",
            "name": "Modern Ceiling Installation",
            "description": "Geometric patterns creating dramatic shadows and ambiance in architectural spaces.",
            "image": "/assets/images/landlite_test2.JPG",
            "url": "https://www.landlite.com/products/ceiling-installation"
          }
        },
        {
          "@type": "ListItem",
          "position": 3,
          "item": {
            "@type": "Product",
            "name": "Contemporary Wall Mount",
            "description": "Sleek wall fixture providing both direct and ambient lighting for versatile illumination.",
            "image": "/assets/images/landlite_test3.JPG",
            "url": "https://www.landlite.com/products/wall-mount"
          }
        }
      ]
    }
  };

  useEffect(() => {
    // Add structured data to the page
    const script1 = document.createElement('script');
    script1.type = 'application/ld+json';
    script1.text = JSON.stringify(structuredData.organization);
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.type = 'application/ld+json';
    script2.text = JSON.stringify(structuredData.productGallery);
    document.head.appendChild(script2);

    // Navigation, scroll, and other interactive behaviors
    const handleScroll = () => {
      const scrolled = window.scrollY > 100;
      const navbar = document.querySelector('.navbar');
      const body = document.body;
      
      if (scrolled) {
        navbar?.classList.add('scrolled');
        body.classList.add('scrolled');
      } else {
        navbar?.classList.remove('scrolled');
        body.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Setup navigation interactions
    const navBars = document.querySelectorAll('.nav-bar');
    const expandedNav = document.querySelector('.expanded-nav-content');
    const closeNavBtn = document.querySelector('.close-nav-btn');
    
    navBars.forEach(nav => {
      nav.addEventListener('click', () => {
        const dataNav = nav.getAttribute('data-nav');
        expandedNav?.classList.add(`nav-bar-${dataNav}-expanded`);
        document.querySelector('.navbar')?.classList.add('expanded');
      });
    });
    
    closeNavBtn?.addEventListener('click', () => {
      expandedNav?.classList.remove(
        'nav-bar-inspiration-expanded', 
        'nav-bar-products-expanded', 
        'nav-bar-about-expanded', 
        'nav-bar-others-expanded'
      );
      document.querySelector('.navbar')?.classList.remove('expanded');
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.head.removeChild(script1);
      document.head.removeChild(script2);
    };
  }, []);

  return (
    <>
      <Head>
        <meta name="description" content="Landlite - Premium lighting instruments for architecture. Discover our elegant lighting solutions for modern architectural spaces and interior design projects." />
        <meta name="keywords" content="landlite, architectural lighting, interior lighting, design lighting, modern lighting, pendant lights, ceiling fixtures, wall lights, custom lighting" />
        <meta name="author" content="Landlite" />
        <meta property="og:title" content="Landlite - Premium Architectural Lighting Solutions" />
        <meta property="og:description" content="Discover Landlite's premium lighting instruments for architecture - creating the perfect light experience in architectural environments." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.landlite.com/" />
        <meta property="og:image" content="/assets/images/landlite-og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Landlite - Premium Architectural Lighting Solutions" />
        <meta name="twitter:description" content="Discover Landlite's premium lighting instruments for architecture - creating the perfect light experience in architectural environments." />
        <meta name="twitter:image" content="/assets/images/landlite-og-image.jpg" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <link rel="canonical" href="https://www.landlite.com/" />
        <title>Landlite - Premium Architectural Lighting Solutions</title>
      </Head>

      <div className="light-section" itemScope itemType="https://schema.org/WebPage">
        <section className="hero" aria-label="Main hero banner">
          <div className="hero-content">
            <h1 data-text="Lighting Instruments for Architecture">Lighting Instruments for Architecture</h1>
            <p>Creating the perfect light experience in architectural environments</p>
            <Link href="/contact" className="cta-button" title="Learn more about our lighting solutions">
              Discover More
            </Link>
          </div>
        </section>

        <section className="gallery" aria-label="Product gallery">
          <div className="container">
            <h2>Our Portfolio</h2>
            <div className="gallery-items">
              <article className="gallery-item" itemScope itemType="https://schema.org/Product">
                <div className="image-container">
                  <img src="/assets/images/landlite_test1.JPG" alt="Minimalist Pendant Light by Landlite" itemProp="image" width="600" height="400" loading="lazy" />
                </div>
                <div className="gallery-info">
                  <div className="gallery-text">
                    <h3 itemProp="name">Minimalist Pendant Light <span className="arrow">→</span></h3>
                    <p className="gallery-description" itemProp="description">
                      Elegant simplicity with focused illumination for modern spaces. Our pendant lights combine sleek design with precise light control, creating the perfect ambiance for contemporary interiors. Each fixture is handcrafted with premium materials to ensure durability and timeless appeal.
                    </p>
                  </div>
                </div>
              </article>
              
              <article className="gallery-item reverse" itemScope itemType="https://schema.org/Product">
                <div className="image-container">
                  <img src="/assets/images/landlite_test2.JPG" alt="Modern Ceiling Installation by Landlite" itemProp="image" width="600" height="400" loading="lazy" />
                </div>
                <div className="gallery-info">
                  <div className="gallery-text">
                    <h3 itemProp="name">Modern Ceiling Installation <span className="arrow">→</span></h3>
                    <p className="gallery-description" itemProp="description">
                      Geometric patterns creating dramatic shadows and ambiance in architectural spaces. This custom ceiling installation transforms ordinary rooms into extraordinary experiences through the interplay of light and form. Perfect for lobbies, galleries, and high-end residential spaces seeking a statement piece.
                    </p>
                  </div>
                </div>
              </article>
              
              <article className="gallery-item" itemScope itemType="https://schema.org/Product">
                <div className="image-container">
                  <img src="/assets/images/landlite_test3.JPG" alt="Contemporary Wall Mount Light by Landlite" itemProp="image" width="600" height="400" loading="lazy" />
                </div>
                <div className="gallery-info">
                  <div className="gallery-text">
                    <h3 itemProp="name">Contemporary Wall Mount <span className="arrow">→</span></h3>
                    <p className="gallery-description" itemProp="description">
                      Sleek wall fixture providing both direct and ambient lighting for versatile illumination. The adjustable light sources allow for personalized lighting scenarios, while the sculptural design serves as an architectural accent even when not illuminated. Available in various finishes to complement any interior style.
                    </p>
                  </div>
                </div>
              </article>
              
              <article className="gallery-item reverse" itemScope itemType="https://schema.org/Product">
                <div className="image-container">
                  <img src="/assets/images/landlite_test4.JPG" alt="Sculptural Light Fixture by Landlite" itemProp="image" width="600" height="400" loading="lazy" />
                </div>
                <div className="gallery-info">
                  <div className="gallery-text">
                    <h3 itemProp="name">Sculptural Light Fixture <span className="arrow">→</span></h3>
                    <p className="gallery-description" itemProp="description">
                      Artistic expression through light and shadow interplay, creating dynamic visual experiences. This statement piece blurs the boundary between lighting and art, with its organic form inspired by natural phenomena. Each fixture is unique, making it the perfect centerpiece for design-forward spaces.
                    </p>
                  </div>
                </div>
              </article>
              
              <article className="gallery-item" itemScope itemType="https://schema.org/Product">
                <div className="image-container">
                  <img src="/assets/images/landlite_test5.JPG" alt="Industrial Downlight Series by Landlite" itemProp="image" width="600" height="400" loading="lazy" />
                </div>
                <div className="gallery-info">
                  <div className="gallery-text">
                    <h3 itemProp="name">Industrial Downlight Series <span className="arrow">→</span></h3>
                    <p className="gallery-description" itemProp="description">
                      Precision-engineered illumination for commercial environments with emphasis on performance and efficiency. These fixtures feature advanced optics for glare control and uniform light distribution, while their minimalist design integrates seamlessly with modern architecture. Available in various beam angles and color temperatures for tailored solutions.
                    </p>
                  </div>
                </div>
              </article>
              
              <article className="gallery-item reverse" itemScope itemType="https://schema.org/Product">
                <div className="image-container">
                  <img src="/assets/images/landlite_test6.JPG" alt="Architectural Spotlight Collection by Landlite" itemProp="image" width="600" height="400" loading="lazy" />
                </div>
                <div className="gallery-info">
                  <div className="gallery-text">
                    <h3 itemProp="name">Architectural Spotlight Collection <span className="arrow">→</span></h3>
                    <p className="gallery-description" itemProp="description">
                      Focused beam lighting to accentuate architectural features and create dramatic highlights. These adjustable spotlights provide precision lighting for artwork, architectural details, and focal points. Their sophisticated mechanism allows for easy adjustment while maintaining a clean aesthetic, making them ideal for museums, galleries, and high-end residences.
                    </p>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>
      </div>
    </>
  );
} 