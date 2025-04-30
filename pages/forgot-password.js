import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const handleBack = () => {
    router.push('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Reset password requested for:', email);
      setSubmitted(true);
    } catch (error) {
      console.error('Password reset error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Reset Password | LandLite</title>
        <meta name="description" content="Reset your LandLite password" />
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
              <h2>Password Recovery</h2>
              <p>We'll help you get back to your account in no time.</p>
            </div>
          </div>
          
          <div className="auth-form-side">
            {!submitted ? (
              <>
                <div className="auth-header">
                  <h1>Reset Password</h1>
                  <p>Enter your email and we'll send you a link to reset your password.</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      required
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="auth-button"
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </form>
              </>
            ) : (
              <div className="auth-success">
                <div className="success-icon"></div>
                <h2 style={{marginBottom: '1rem', color: 'var(--auth-text)'}}>Check Your Email</h2>
                <p style={{color: 'var(--auth-text-light)', marginBottom: '1.5rem'}}>
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
                <button 
                  className="auth-button"
                  onClick={() => router.push('/login')}
                  style={{marginBottom: '1rem'}}
                >
                  Return to Login
                </button>
              </div>
            )}

            <div className="auth-footer">
              <Link href="/login">Back to Login</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 