import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import Image from 'next/image';

export default function History() {
  const [activeItemIndex, setActiveItemIndex] = useState(null);
  const [approachingItems, setApproachingItems] = useState([]);
  const [scrollIndicatorActive, setScrollIndicatorActive] = useState(false);
  const timelineRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const timelineSection = timelineRef.current;
      
      if (timelineSection) {
        const timelineRect = timelineSection.getBoundingClientRect();
        const timelineTop = timelineRect.top + scrollY;
        const timelineBottom = timelineTop + timelineRect.height;
        const viewportHeight = window.innerHeight;
        
        // Check if we're in the timeline section
        if (scrollY > timelineTop - viewportHeight && scrollY < timelineBottom) {
          // Calculate scroll progress
          const progress = (scrollY - timelineTop + viewportHeight) / (timelineRect.height + viewportHeight/2);
          
          // Show indicator throughout most of the timeline
          if (progress > 0.1 && progress < 1.0) {
            setScrollIndicatorActive(true);
          } else {
            setScrollIndicatorActive(false);
          }

          // Get all timeline items
          const items = timelineSection.querySelectorAll('.timeline-item');
          const viewportCenter = window.innerHeight / 2;
          
          // Track approaching and active items
          const approaching = [];
          let activeFound = false;
          
          items.forEach((item, index) => {
            const rect = item.getBoundingClientRect();
            const itemCenter = rect.top + rect.height / 2;
            const distanceFromCenter = Math.abs(itemCenter - viewportCenter);
            
            // Check if item is approaching (increase distance for earlier appearance)
            if (distanceFromCenter < 600) {
              approaching.push(index);
              
              // Check if this is the most centered item (active)
              if (distanceFromCenter < 180 && !activeFound) {
                setActiveItemIndex(index);
                activeFound = true;
                item.classList.add('active');
              } else {
                item.classList.remove('active');
              }
            } else {
              item.classList.remove('active');
            }
          });
          
          setApproachingItems(approaching);
          
          // If no item is active, reset active index
          if (!activeFound) {
            setActiveItemIndex(null);
          }
        } else {
          setScrollIndicatorActive(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Set a timeout to check scroll position after images load
    const timer = setTimeout(() => {
      handleScroll();
    }, 500);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const timelineData = [
    {
      year: '1985',
      title: 'The Beginning',
      content: 'Founded by Thomas Keller, a visionary architect with a passion for how light shapes space, Landlite began as a small design studio in New York City focused on custom lighting solutions for residential projects.',
      image: '/assets/images/landlite_test1.jpg'
    },
    {
      year: '1992',
      title: 'First Major Collection',
      content: 'The launch of our \'Cascade\' pendant series marked our transition from custom projects to our first commercially available collection, establishing Landlite\'s signature minimalist aesthetic.',
      image: '/assets/images/landlite_test2.jpg'
    },
    {
      year: '1998',
      title: 'International Expansion',
      content: 'Opening our first European showroom in Milan, Italy, bringing Landlite\'s distinctive design language to an international audience and collaborating with renowned European architects.',
      image: '/assets/images/landlite_test3.jpg'
    },
    {
      year: '2005',
      title: 'Technological Innovation',
      content: 'Pioneered the integration of LED technology into architectural lighting, setting new standards for energy efficiency without compromising on design aesthetics or light quality.',
      image: '/assets/images/landlite_test4.jpg'
    },
    {
      year: '2012',
      title: 'Museum of Modern Art Exhibition',
      content: 'Our \'Light as Form\' collection was featured in a dedicated exhibition at the Museum of Modern Art, recognizing Landlite\'s contribution to design at the intersection of art and functionality.',
      image: '/assets/images/landlite_test5.jpg'
    },
    {
      year: '2018',
      title: 'Sustainability Initiative',
      content: 'Launched our \'Circular Light\' program, committing to sustainable production methods, recyclable materials, and a product lifecycle management system that minimizes environmental impact.',
      image: '/assets/images/landlite_test6.jpg'
    },
    {
      year: 'Present',
      title: 'Looking to the Future',
      content: 'Today, Landlite continues to push boundaries in architectural lighting, exploring new technologies, materials, and design approaches to create lighting instruments that inspire and transform spaces around the world.',
      image: '/assets/images/landlite_test7.jpg'
    }
  ];

  return (
    <>
      <Head>
        <title>Our History | Landlite</title>
        <meta name="description" content="Explore the rich history of Landlite, from our founding to our position as a leader in architectural lighting design." />
      </Head>

      <div className="page-container history-page">
        <section className="history-hero">
          <div className="history-hero-content">
            <h1 data-text="Our History">Our History</h1>
            <p>A legacy of innovation in architectural lighting</p>
          </div>
        </section>

        <div className={`scroll-indicator ${scrollIndicatorActive ? 'active' : ''}`} />

        <section className="timeline-container">
          <div className="timeline-intro">
            <div className="intro-content">
              <h2>Our Journey</h2>
              <p>Since our founding in 1985, Landlite has been at the forefront of architectural lighting innovation. What began as a small studio with a passion for design has evolved into a global presence, creating iconic lighting solutions that transform spaces around the world.</p>
                </div>
              </div>
              
          <div className="timeline" ref={timelineRef}>
            <div className="timeline-tracker"></div>
            
            {timelineData.map((item, index) => (
              <div 
                key={item.year} 
                className={`timeline-item ${activeItemIndex === index ? 'active' : ''} ${approachingItems.includes(index) ? 'approaching' : ''}`}
                data-year={item.year}
              >
                <div className={`timeline-content ${index % 2 !== 0 ? 'right' : ''}`}>
                  <div className="year-badge">{item.year}</div>
                  <div className="content-wrapper">
                    <h3>{item.title}</h3>
                    <p>{item.content}</p>
                    <div className="timeline-image">
                      <img src={item.image} alt={item.title} />
                </div>
              </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="history-quote">
          <div className="quote-container">
            <blockquote>
              <p>"Light reveals architecture, and architecture gives meaning to light. In this dialogue between the two, we find the essence of our work."</p>
              <cite>— Thomas Keller, Founder</cite>
            </blockquote>
          </div>
        </section>
      </div>
    </>
  );
} 