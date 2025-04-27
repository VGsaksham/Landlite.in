import { useState, useEffect } from 'react';
import Head from 'next/head';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhone, faEnvelope, faClock } from '@fortawesome/free-solid-svg-icons';

export default function Contact() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value
    });
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formState.name.trim()) errors.name = 'Name is required';
    if (!formState.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      errors.email = 'Email is invalid';
    }
    if (!formState.subject.trim()) errors.subject = 'Subject is required';
    if (!formState.message.trim()) errors.message = 'Message is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulating form submission with setTimeout
      // In a real application, you would make an API call here
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitSuccess(true);
        setFormState({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);
      }, 1500);
    }
  };

  useEffect(() => {
    // Add custom page-specific animations or behaviors here
    const handleScroll = () => {
      const scrolled = window.scrollY > 100;
      const contactSections = document.querySelectorAll('.contact-section');
      
      if (scrolled) {
        contactSections.forEach(section => {
          section.classList.add('scrolled');
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Contact Us | Landlite</title>
        <meta name="description" content="Get in touch with Landlite. We're here to answer your questions about our architectural lighting solutions and services." />
      </Head>

      <main id="main-content">
        <section className="contact-hero" aria-label="Contact page header">
          <div className="contact-hero-content">
            <h1 data-text="Get in Touch">Get in Touch</h1>
            <p>We'd love to hear from you</p>
          </div>
        </section>

        <section className="contact-container" itemScope itemType="https://schema.org/ContactPage">
          <div className="contact-wrapper">
            <div className="contact-info">
              <h2>Connect With Us</h2>
              <div className="contact-details" itemScope itemType="https://schema.org/LightingStore">
                <div className="contact-item">
                  <a href="https://maps.google.com/?q=123+Design+Avenue,New+York,NY+10001" target="_blank" className="contact-link" rel="noreferrer" itemProp="hasMap">
                    <div className="contact-icon">
                      <FontAwesomeIcon icon={faMapMarkerAlt} aria-hidden="true" />
                    </div>
                    <div className="contact-text">
                      <h3>Visit Us</h3>
                      <p itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                        <span itemProp="streetAddress">123 Design Avenue</span><br />
                        <span itemProp="addressLocality">New York</span>, {" "}
                        <span itemProp="addressRegion">NY</span> {" "}
                        <span itemProp="postalCode">10001</span>
                      </p>
                    </div>
                  </a>
                </div>
                
                <div className="contact-item">
                  <a href="mailto:info@landlite.com" className="contact-link">
                    <div className="contact-icon">
                      <FontAwesomeIcon icon={faEnvelope} aria-hidden="true" />
                    </div>
                    <div className="contact-text">
                      <h3>Email Us</h3>
                      <p itemProp="email">info@landlite.com</p>
                    </div>
                  </a>
                </div>
                
                <div className="contact-item">
                  <a href="tel:+12125551234" className="contact-link">
                    <div className="contact-icon">
                      <FontAwesomeIcon icon={faPhone} aria-hidden="true" />
                    </div>
                    <div className="contact-text">
                      <h3>Call Us</h3>
                      <p itemProp="telephone">+1 (212) 555-1234</p>
                    </div>
                  </a>
                </div>
                
                <div className="contact-item">
                  <a href="javascript:void(0);" className="contact-link" onClick={() => alert('Booking system coming soon!')}>
                    <div className="contact-icon">
                      <FontAwesomeIcon icon={faClock} aria-hidden="true" />
                    </div>
                    <div className="contact-text">
                      <h3>Business Hours</h3>
                      <div itemProp="openingHoursSpecification" itemScope itemType="https://schema.org/OpeningHoursSpecification">
                        <meta itemProp="dayOfWeek" content="Monday Tuesday Wednesday Thursday Friday" />
                        <meta itemProp="opens" content="09:00" />
                        <meta itemProp="closes" content="18:00" />
                        <p>Monday - Friday: 9AM - 6PM</p>
                      </div>
                      <div itemProp="openingHoursSpecification" itemScope itemType="https://schema.org/OpeningHoursSpecification">
                        <meta itemProp="dayOfWeek" content="Saturday" />
                        <meta itemProp="opens" content="10:00" />
                        <meta itemProp="closes" content="17:00" />
                        <p>Saturday: By appointment</p>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
            
            <div className="contact-form-container">
              <div className="glass-panel">
                <h2>Send a Message</h2>
                
                {submitSuccess && (
                  <div className="success-message">
                    <p>Thank you for your message. We'll get back to you shortly.</p>
                  </div>
                )}
                
                {submitError && (
                  <div className="error-message">
                    <p>There was an error sending your message. Please try again later.</p>
                  </div>
                )}
                
                <form id="contact-form" className={`contact-form ${isSubmitting ? 'submitting' : ''}`} onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      className={formErrors.name ? 'error' : ''}
                      required
                      aria-required="true"
                    />
                    {formErrors.name && <span className="error-text">{formErrors.name}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      className={formErrors.email ? 'error' : ''}
                      required
                      aria-required="true"
                    />
                    {formErrors.email && <span className="error-text">{formErrors.email}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formState.subject}
                      onChange={handleChange}
                      className={formErrors.subject ? 'error' : ''}
                      required
                      aria-required="true"
                    />
                    {formErrors.subject && <span className="error-text">{formErrors.subject}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formState.message}
                      onChange={handleChange}
                      rows="5"
                      className={formErrors.message ? 'error' : ''}
                      required
                      aria-required="true"
                    ></textarea>
                    {formErrors.message && <span className="error-text">{formErrors.message}</span>}
                  </div>
                  
                  <button type="submit" className="submit-btn" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        <section className="map-section" aria-label="Location map">
          <div className="map-container">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095343077!2d-73.99001242363092!3d40.74136737138598!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a3f71c1f67%3A0xbce6248215935bda!2sFifth%20Avenue%2C%20New%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sin!4v1688457942115!5m2!1sen!2sin" 
              width="100%" 
              height="450" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade" 
              title="Google Maps location of Landlite office" 
              aria-label="Interactive map showing our location"
            ></iframe>
          </div>
        </section>
      </main>
    </>
  );
} 