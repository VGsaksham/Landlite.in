import React, { useState, useEffect, useRef } from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import productsData from '../../../data/products.json';
import styles from '../../../styles/ProductPages.module.css';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  image?: string;
  price: string;
  specs: Record<string, string>;
}

interface Family {
  title: string;
  description: string;
  products: Product[];
}

interface ProductCategoryProps {
  category: string;
  categoryData: {
    title: string;
    description: string;
    families: {
      [key: string]: Family;
    };
  };
}

const ProductsDisplay = ({ products, category, family }: { products: Product[], category: string, family: string }) => {
  return (
    <div className={styles.productsGrid}>
      {products.map((product) => (
        <div key={product.id} className={styles.productCard}>
          <div className={styles.productImage}>
            <Image 
              src={product.imageUrl || product.image || '/assets/images/landlite-logo.png'} 
              alt={product.name}
              width={300}
              height={300}
              objectFit="contain"
            />
          </div>
          <div className={styles.productInfo}>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <div className={styles.price}>{product.price}</div>
            <Link href={`/products/${category}/${family}/${product.id}`}>
              <button className={styles.detailsButton}>
                <span>View Details</span>
              </button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

const ProductCategory: React.FC<ProductCategoryProps> = ({ category, categoryData }) => {
  const router = useRouter();
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null);
  const [key, setKey] = useState<number>(0);
  const productsAreaRef = useRef<HTMLDivElement>(null);

  // Listen for route changes to reset state when returning to this page
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      // Reset key when routing back to this page
      if (url.includes(`/products/${category}`)) {
        setKey(prevKey => prevKey + 1);
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events, category]);

  // When URL parameters change, update the selected family
  useEffect(() => {
    // Important: Check if router is ready to prevent issues during SSR or hydration
    if (!router.isReady) return;

    const { activeFamily } = router.query;
    
    if (activeFamily && typeof activeFamily === 'string' && categoryData.families[activeFamily]) {
      setSelectedFamily(activeFamily);
      
      // Scroll to products section after a short delay to ensure DOM is updated
      setTimeout(() => {
        scrollToProducts();
      }, 100);
    } else {
      // Default to first family if no valid activeFamily is in URL
      const familyKeys = Object.keys(categoryData.families);
      if (familyKeys.length > 0) {
        setSelectedFamily(familyKeys[0]);
        
        // Update URL to reflect the default selection
        const url = new URL(window.location.href);
        url.searchParams.set('activeFamily', familyKeys[0]);
        window.history.replaceState({}, '', url.toString());
      }
    }
  }, [router.isReady, router.query, categoryData.families, category]);

  // Scroll to products section
  const scrollToProducts = () => {
    if (productsAreaRef.current) {
      productsAreaRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleFamilyClick = (familyKey: string) => {
    // Remove the early return so scrolling happens even when same family is clicked
    // Set selected family even if it's the same to ensure scroll happens
    setSelectedFamily(familyKey);
    
    // Update URL if family is different
    if (router.query.activeFamily !== familyKey) {
      // Force hard navigation to ensure page reloads with new family
      router.push(`/products/${category}?activeFamily=${familyKey}`, undefined, { shallow: false });
      // Scroll will happen after page reload due to the useEffect above
    } else {
      // Immediately scroll to products when same family is clicked
      setTimeout(() => {
        scrollToProducts();
      }, 100);
    }
  };
  
  // Get the current family's products directly from the source data
  const getCurrentFamilyProducts = () => {
    if (!selectedFamily) return [];
    return productsData.categories[category].families[selectedFamily].products || [];
  };

  return (
    <>
      <Head>
        <title>{categoryData.title} - Landlite</title>
        <meta name="description" content={categoryData.description} />
      </Head>

      <main className={styles.productCategoryPage} key={`category-page-${key}`}>
        <section className={styles.productHero}>
          <div className={styles.productHeroContent}>
            <h1>{categoryData.title}</h1>
            <p>{categoryData.description}</p>
          </div>
        </section>

        <section className={styles.productCategories}>
          <div className={styles.container}>
            {/* Family buttons in a single row */}
            <div className={styles.familyButtonsRow}>
              {Object.entries(categoryData.families).map(([familyKey, familyData]) => (
                <button
                  key={familyKey}
                  className={`${styles.familyButton} ${selectedFamily === familyKey ? styles.activeFamilyButton : ''}`}
                  onClick={() => handleFamilyClick(familyKey)}
                >
                  {familyData.title}
                </button>
              ))}
            </div>
            
            {/* Products display area - key forces remount when family changes */}
            <div className={styles.productsDisplayArea} ref={productsAreaRef}>
              {selectedFamily && (
                <ProductsDisplay 
                  key={`family-${selectedFamily}-${key}`} 
                  products={getCurrentFamilyProducts()}
                  category={category}
                  family={selectedFamily}
                />
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = Object.keys(productsData.categories).map((category) => ({
    params: { category },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const category = params?.category as string;
  const categoryData = productsData.categories[category];

  if (!categoryData) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      category,
      categoryData,
    },
  };
};

export default ProductCategory; 