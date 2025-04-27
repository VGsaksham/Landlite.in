import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/ProductFamily.module.css';

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  price: string;
  specs: Record<string, string>;
}

interface ProductFamilyProps {
  title: string;
  description: string;
  products: Product[];
  category: string;
  family: string;
}

const ProductFamily: React.FC<ProductFamilyProps> = ({
  title,
  description,
  products,
  category,
  family,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={styles.familyContainer}>
      <button 
        className={styles.familyButton}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {title}
      </button>
      
      {isExpanded && (
        <div className={styles.productsGrid}>
          {products.map((product) => (
            <div key={product.id} className={styles.productCard}>
              <div className={styles.productImage}>
                <Image 
                  src={product.image || '/assets/images/landlite-logo.png'} 
                  alt={product.name}
                  width={180}
                  height={180}
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
      )}
    </div>
  );
};

export default ProductFamily; 