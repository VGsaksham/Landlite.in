import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [mobileError, setMobileError] = useState('');
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'mobileNumber') {
      validateMobileNumber(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateMobileNumber = (value) => {
    // Reset error first
    setMobileError('');
    
    // Check if empty (required validation handled by HTML)
    if (!value) return;
    
    // Check if starts with + (country code)
    if (!value.startsWith('+')) {
      setMobileError('Mobile number must start with country code (e.g., +1, +91)');
      return;
    }
    
    // Extract country code and number
    const countryCodeMatch = value.match(/^\+(\d+)/);
    if (!countryCodeMatch) {
      setMobileError('Invalid country code format');
      return;
    }
    
    const countryCode = countryCodeMatch[1];
    const numberWithoutCode = value.substring(countryCode.length + 1).replace(/\s+|-|\(|\)/g, '');
    
    // Validate based on common country codes
    switch (countryCode) {
      case '1': // USA, Canada
        if (!/^\d{10}$/.test(numberWithoutCode)) {
          setMobileError('US/Canada number should have 10 digits after country code');
        }
        break;
      case '91': // India
        if (!/^\d{10}$/.test(numberWithoutCode)) {
          setMobileError('Indian number should have 10 digits after country code');
        }
        break;
      case '44': // UK
        if (!/^\d{10}$/.test(numberWithoutCode)) {
          setMobileError('UK number should have 10 digits after country code');
        }
        break;
      case '61': // Australia
        if (!/^\d{9}$/.test(numberWithoutCode)) {
          setMobileError('Australian number should have 9 digits after country code');
        }
        break;
      default:
        // Generic validation - at least 7 digits after country code
        if (!/^\d{7,15}$/.test(numberWithoutCode)) {
          setMobileError('Phone number should have 7-15 digits after country code');
        }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if there are any errors
    if (mobileError) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Signup data:', formData);
      router.push('/login');
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Sign Up | LandLite</title>
        <meta name="description" content="Create your LandLite account" />
      </Head>

      <div className="auth-page">
        <div className="bg-pattern"></div>
        
        <button onClick={handleBack} className="back-button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back
        </button>

        <div className="auth-container">
          <div className="auth-image-side" style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}>
            <div className="auth-logo">LandLite</div>
            <div className="auth-image-content">
              <h2>Join Our Community</h2>
              <p>Create an account and get started with LandLite today.</p>
            </div>
          </div>
          
          <div className="auth-form-side">
            <div className="auth-header">
              <h1>Create Account</h1>
              <p>Please fill in your information to create your account.</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="mobileNumber">
                  Mobile Number <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>(with country code)</span>
                </label>
                <input
                  id="mobileNumber"
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  required
                />
                {mobileError && (
                  <div className="error-message">
                    {mobileError}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="terms-acceptance">
                By creating an account, you agree to our <Link href="/terms">Terms of Service</Link> and <Link href="/privacy">Privacy Policy</Link>.
              </div>

              <button 
                type="submit" 
                className="auth-button"
                disabled={loading || mobileError}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="auth-footer">
              Already have an account? <Link href="/login">Sign In</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 