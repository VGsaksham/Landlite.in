import React, { useState, useEffect } from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import productsData from '../../../../data/products.json';

interface ProductPageProps {
  product: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    images: string[];
    generalInformation?: {
      location: string;
      installation: string;
      cutoutShape: string;
      cutoutSize: string;
      recessedDepth: string;
      ingressProtection: string;
      adjustability: string;
      beamAngle: string;
      adjustable: string;
      dimension: string;
      cutOut: string;
      finishing: string;
      ipRating: string;
    };
    finishes?: {
      model: string;
      systemPower: string;
      cct: string;
      lightControl: string;
      cri: string;
      gai: string;
      housing: string;
    };
    lightsourceInformation?: {
      lightsourceName: string;
      sdcm: string;
      lm80: string;
      ledTechnics: string;
    };
    requirements?: {
      voltage: string;
      frequency: string;
      powerFactor: string;
      dimming: string;
    };
    // For backwards compatibility with old product structure
    price?: string;
    specs?: Record<string, string>;
  };
  category: string;
  family: string;
}

const ProductPage: React.FC<ProductPageProps> = ({ product, category, family }) => {
  // Add state for tracking current image index and animation direction
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
  
  // Prep images array
  const images = product.images && product.images.length > 0 
    ? product.images 
    : product.imageUrl 
      ? [product.imageUrl] 
      : ['/placeholder-image.jpg'];

  // Image navigation functions with slide animations
  const goToPreviousImage = () => {
    if (currentImageIndex > 0 && !isAnimating) {
      setIsAnimating(true);
      setSlideDirection('right'); // We're moving right to show the previous image (which slides in from left)
      
      setTimeout(() => {
        setCurrentImageIndex(prev => prev - 1);
        
        setTimeout(() => {
          setIsAnimating(false);
          setSlideDirection(null);
        }, 400); // Match animation duration
      }, 50);
    }
  };

  const goToNextImage = () => {
    if (currentImageIndex < images.length - 1 && !isAnimating) {
      setIsAnimating(true);
      setSlideDirection('left'); // We're moving left to show the next image (which slides in from right)
      
      setTimeout(() => {
        setCurrentImageIndex(prev => prev + 1);
        
        setTimeout(() => {
          setIsAnimating(false);
          setSlideDirection(null);
        }, 400); // Match animation duration
      }, 50);
    }
  };

  // Add effect to force navbar into collapsed state
  useEffect(() => {
    // Force navbar into collapsed state
    const navBars = document.querySelectorAll('.nav-bar');
    navBars.forEach(navBar => {
      const navElement = navBar as HTMLElement;
      if (navElement.classList.contains('nav-bar-1')) {
        navElement.style.width = '80px';
      } else if (navElement.classList.contains('nav-bar-2')) {
        navElement.style.width = '60px';
      } else if (navElement.classList.contains('nav-bar-3')) {
        navElement.style.width = '45px';
      } else if (navElement.classList.contains('nav-bar-4')) {
        navElement.style.width = '30px';
      }
    });

    return () => {
      // Cleanup - restore default styles when component unmounts
      navBars.forEach(navBar => {
        const navElement = navBar as HTMLElement;
        navElement.style.width = '';
        navElement.style.textIndent = '';
      });
    };
  }, []);

  // Handle old product structure for backwards compatibility
  const hasNewStructure = !!product.generalInformation;

  // Get the current image to display
  const currentImage = images[currentImageIndex];

  return (
    <>
      <Head>
        <title>{product.name} - Landlite</title>
        <meta name="description" content={product.description} />
      </Head>

      <Script src="/js/product-detail.js" strategy="afterInteractive" />

      <main className="product-detail-page">
        <nav className="breadcrumb">
          <Link href={`/products/${category}?activeFamily=${family}`}>
            Products
          </Link>
          <span className="separator">/</span>
          <Link href={`/products/${category}?activeFamily=${family}`}>
            {productsData.categories[category].title}
          </Link>
          <span className="separator">/</span>
          <Link href={`/products/${category}?activeFamily=${family}`}>
            {productsData.categories[category].families[family].title}
          </Link>
          <span className="separator">/</span>
          <span className="current">{product.name}</span>
        </nav>
        
        <div className="container">
          <div className="product-detail-grid">
            <div className="product-images">
              <div className="main-image">
                {/* Only show navigation arrows if there are multiple images */}
                {images.length > 1 && (
                  <>
                    <button 
                      className={`image-nav prev-image ${currentImageIndex === 0 ? 'disabled' : ''}`} 
                      onClick={goToPreviousImage}
                      disabled={currentImageIndex === 0 || isAnimating}
                      aria-label="Previous image"
                    />
                    <button 
                      className={`image-nav next-image ${currentImageIndex === images.length - 1 ? 'disabled' : ''}`} 
                      onClick={goToNextImage}
                      disabled={currentImageIndex === images.length - 1 || isAnimating}
                      aria-label="Next image"
                    />
                  </>
                )}
                
                <div className="image-slider">
                  <div 
                    className={`product-img-container ${
                      isAnimating && slideDirection === 'left' ? 'slide-in-right' : 
                      isAnimating && slideDirection === 'right' ? 'slide-in-left' : ''
                    }`}
                  >
                    <Image
                      src={currentImage}
                      alt={product.name}
                      width={600}
                      height={600}
                      className="product-img"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="product-info">
              <h1 className="product-name">{product.name}</h1>
              <p className="product-description">{product.description}</p>

              {hasNewStructure ? (
                <div className="product-specs">
                  {product.generalInformation && (
                    <div className="spec-section">
                      <h2>General Information</h2>
                      <div className="specs-grid">
                        {Object.entries(product.generalInformation).map(([key, value]) => (
                          <div key={key} className="spec-item">
                            <span className="spec-label">
                              {key.replace(/([A-Z])/g, ' $1').trim().charAt(0).toUpperCase() + 
                               key.replace(/([A-Z])/g, ' $1').trim().slice(1)}
                            </span>
                            <span className="spec-value">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {product.finishes && (
                    <div className="spec-section">
                      <h2>Finishes</h2>
                      <div className="specs-grid">
                        {Object.entries(product.finishes).map(([key, value]) => (
                          <div key={key} className="spec-item">
                            <span className="spec-label">
                              {key.replace(/([A-Z])/g, ' $1').trim().charAt(0).toUpperCase() + 
                               key.replace(/([A-Z])/g, ' $1').trim().slice(1)}
                            </span>
                            <span className="spec-value">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {product.lightsourceInformation && (
                    <div className="spec-section">
                      <h2>Lightsource Information</h2>
                      <div className="specs-grid">
                        {Object.entries(product.lightsourceInformation).map(([key, value]) => (
                          <div key={key} className="spec-item">
                            <span className="spec-label">
                              {key.replace(/([A-Z])/g, ' $1').trim().charAt(0).toUpperCase() + 
                               key.replace(/([A-Z])/g, ' $1').trim().slice(1)}
                            </span>
                            <span className="spec-value">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {product.requirements && (
                    <div className="spec-section">
                      <h2>Requirements</h2>
                      <div className="specs-grid">
                        {Object.entries(product.requirements).map(([key, value]) => (
                          <div key={key} className="spec-item">
                            <span className="spec-label">
                              {key.replace(/([A-Z])/g, ' $1').trim().charAt(0).toUpperCase() + 
                               key.replace(/([A-Z])/g, ' $1').trim().slice(1)}
                            </span>
                            <span className="spec-value">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // For backward compatibility with old product structure
                product.specs && (
                  <div className="product-specs">
                    <div className="spec-section">
                      <h2>Specifications</h2>
                      <div className="specs-grid">
                        {Object.entries(product.specs).map(([key, value]) => (
                          <div key={key} className="spec-item">
                            <span className="spec-label">{key}</span>
                            <span className="spec-value">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: { params: { category: string; family: string; id: string } }[] = [];

  Object.entries(productsData.categories).forEach(([category, categoryData]) => {
    Object.entries(categoryData.families).forEach(([family, familyData]) => {
      familyData.products.forEach((product) => {
        paths.push({
          params: {
            category,
            family,
            id: product.id,
          },
        });
      });
    });
  });

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { category, family, id } = params as { category: string; family: string; id: string };
  
  const categoryData = productsData.categories[category];
  if (!categoryData) {
    return { notFound: true };
  }

  const familyData = categoryData.families[family];
  if (!familyData) {
    return { notFound: true };
  }

  const product = familyData.products.find((p) => p.id === id);
  if (!product) {
    return { notFound: true };
  }

  return {
    props: {
      product,
      category,
      family,
    },
  };
};

export default ProductPage; 