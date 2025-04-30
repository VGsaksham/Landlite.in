import Link from 'next/link';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCog, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faLinkedinIn, faPinterestP } from '@fortawesome/free-brands-svg-icons';
import homeData from '../data/home.json';

export default function Home() {
  const [activePopup, setActivePopup] = useState(null);

  const openPopup = (item) => {
    setActivePopup(item);
    document.body.style.overflow = 'hidden';
  };

  const closePopup = () => {
    setActivePopup(null);
    document.body.style.overflow = 'auto';
  };

  useEffect(() => {
    // Add structured data to the page
    const script1 = document.createElement('script');
    script1.type = 'application/ld+json';
    script1.text = JSON.stringify(homeData.structuredData.organization);
    document.head.appendChild(script1);

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
    };
  }, []);

  return (
    <>
      <Head>
        <meta name="description" content={homeData.meta.description} />
        <meta name="keywords" content={homeData.meta.keywords} />
        <meta name="author" content={homeData.meta.author} />
        <meta property="og:title" content={homeData.meta.og.title} />
        <meta property="og:description" content={homeData.meta.og.description} />
        <meta property="og:type" content={homeData.meta.og.type} />
        <meta property="og:url" content={homeData.meta.og.url} />
        <meta property="og:image" content={homeData.meta.og.image} />
        <meta name="twitter:card" content={homeData.meta.twitter.card} />
        <meta name="twitter:title" content={homeData.meta.twitter.title} />
        <meta name="twitter:description" content={homeData.meta.twitter.description} />
        <meta name="twitter:image" content={homeData.meta.twitter.image} />
        <meta name="robots" content={homeData.meta.robots} />
        <meta name="googlebot" content={homeData.meta.googlebot} />
        <link rel="canonical" href={homeData.meta.canonical} />
        <title>{homeData.meta.title}</title>
      </Head>

      <div className="light-section" itemScope itemType="https://schema.org/WebPage">
        <section className="hero" aria-label="Main hero banner">
          <div className="hero-content">
            <h1 data-text={homeData.hero.title}>{homeData.hero.title}</h1>
            <p>{homeData.hero.subtitle}</p>
            <Link 
              href={homeData.hero.cta.link} 
              className="cta-button" 
              title={homeData.hero.cta.title}
            >
              {homeData.hero.cta.text}
            </Link>
          </div>
        </section>

        <section className="gallery" aria-label="Product gallery">
          <div className="container">
            <h2>{homeData.gallery.title}</h2>
            <div className="gallery-items">
              {homeData.gallery.items.map((item, index) => (
                <div 
                  key={index} 
                  className={`gallery-item ${index % 2 === 1 ? 'reverse' : ''}`}
                >
                  <div className="image-container">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      width="600" 
                      height="400" 
                      loading="lazy" 
                    />
                  </div>
                  <div className="gallery-info">
                    <div className="gallery-text">
                      <h3>{item.name}</h3>
                      <p className="gallery-description">{item.description}</p>
                      <button 
                        className="read-more-btn"
                        onClick={() => openPopup(item)}
                      >
                        Read More
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {activePopup && (
        <div className="popup-overlay active" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-popup" onClick={closePopup}>×</button>
            <img 
              src={activePopup.image} 
              alt={activePopup.name} 
              className="popup-image"
            />
            <div className="popup-text">
              <h3>{activePopup.name}</h3>
              <p className="popup-description">{activePopup.description}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 