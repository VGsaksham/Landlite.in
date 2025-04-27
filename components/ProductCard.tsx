import Image from 'next/image';
import Link from 'next/link';

interface ProductSpecs {
  material: string;
  dimensions: string;
  bulbType: string;
  color: string;
}

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: string;
  specs: ProductSpecs;
  category: string;
  family: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  description,
  imageUrl,
  price,
  specs,
  category,
  family,
}) => {
  return (
    <div className="product-card">
      <Link href={`/products/${category}/${family}/${id}`}>
        <div className="product-image">
          <Image
            src={imageUrl}
            alt={name}
            width={300}
            height={300}
            className="product-img"
          />
        </div>
        <div className="product-info">
          <h3 className="product-name">{name}</h3>
          <p className="product-description">{description}</p>
          <div className="product-specs">
            <div className="spec-item">
              <span className="spec-label">Material:</span>
              <span className="spec-value">{specs.material}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Dimensions:</span>
              <span className="spec-value">{specs.dimensions}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Bulb Type:</span>
              <span className="spec-value">{specs.bulbType}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Color:</span>
              <span className="spec-value">{specs.color}</span>
            </div>
          </div>
          <div className="product-price">{price}</div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard; 