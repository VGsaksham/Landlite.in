import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import historyData from '../data/history.json';

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

  return (
    <>
      <Head>
        <title>Our History | Landlite</title>
        <meta name="description" content="Explore the rich history of Landlite, from our founding to our position as a leader in architectural lighting design." />
      </Head>

      <div className="page-container history-page">
        <section className="history-hero">
          <div className="history-hero-content">
            <h1 data-text={historyData.hero.title}>{historyData.hero.title}</h1>
            <p>{historyData.hero.subtitle}</p>
          </div>
        </section>

        <div className={`scroll-indicator ${scrollIndicatorActive ? 'active' : ''}`} />

        <section className="timeline-container">
          <div className="timeline-intro">
            <div className="intro-content">
              <h2>{historyData.intro.title}</h2>
              <p>{historyData.intro.content}</p>
            </div>
          </div>
              
          <div className="timeline" ref={timelineRef}>
            <div className="timeline-tracker"></div>
            
            {historyData.timeline.map((item, index) => (
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
              <p>"{historyData.quote.text}"</p>
              <cite>— {historyData.quote.author}</cite>
            </blockquote>
          </div>
        </section>
      </div>
    </>
  );
} 