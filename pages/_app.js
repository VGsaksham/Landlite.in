import '../styles/globals.css';
import '../styles/index.css';
import '../styles/navigation.css';
import '../styles/footer.css';
import '../styles/history.css';
import '../styles/contact.css';
import '../styles/product-detail.css';
import '../styles/auth.css';
import '../styles/mobile-nav.css';
import Layout from '../components/Layout';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { useEffect } from 'react';

// Tell Font Awesome to skip adding the CSS automatically 
// since it's already imported above
config.autoAddCss = false;

function MyApp({ Component, pageProps }) {
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