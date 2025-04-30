import { useEffect, useRef, useState } from 'react';

export default function AnimatedCard({ title, content, image, index }) {
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update visibility state when card enters/exits viewport
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.3, // Trigger when 30% of the card is visible
        rootMargin: '-10% 0px -10% 0px' // Add some margin to trigger earlier/later
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={cardRef}
      className={`animated-card ${isVisible ? 'visible' : ''}`}
      style={{
        '--card-index': index // Used for staggered animations
      }}
    >
      <div className="card-content">
        <h3>{title}</h3>
        <p>{content}</p>
      </div>
      {image && (
        <div className="card-image">
          <img src={image} alt={title} />
        </div>
      )}
    </div>
  );
} 