import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
          {/* Critical CSS for mobile navigation */}
          <style dangerouslySetInnerHTML={{ __html: `
            .mobile-menu {
              position: fixed !important;
              top: 0 !important;
              left: 0 !important;
              width: 100% !important;
              height: 100% !important;
              background-color: rgba(0, 0, 0, 0.85) !important;
              z-index: 1900 !important;
              visibility: hidden !important;
              opacity: 0 !important;
              transition: opacity 0.3s ease, visibility 0.3s ease !important;
              display: flex !important;
              flex-direction: column !important;
            }
            
            .mobile-menu.active {
              visibility: visible !important;
              opacity: 1 !important;
            }
            
            .hamburger {
              position: fixed !important;
              z-index: 2000 !important;
              display: none !important;
            }
            
            @media (max-width: 768px) {
              .hamburger {
                display: flex !important;
              }
            }
            
            body.mobile-menu-open {
              overflow: hidden !important;
              position: fixed !important;
              width: 100% !important;
            }
          `}} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument; 