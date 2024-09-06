import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function ProductList({ filters, searchQuery, onProductClick, sortOption: initialSortOption }) {
  const [products, setProducts] = useState([]);
  const [sortOption, setSortOption] = useState(initialSortOption || 'recommended');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    let url = 'https://fakestoreapi.com/products';
    
    if (filters.idealFor && filters.idealFor[0] !== 'all') {
      url = `https://fakestoreapi.com/products/category/${filters.idealFor[0]}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        let sortedProducts = [...data];
        if (sortOption === 'priceHighToLow') {
          sortedProducts.sort((a, b) => b.price - a.price);
        } else if (sortOption === 'priceLowToHigh') {
          sortedProducts.sort((a, b) => a.price - b.price);
        } else if (sortOption === 'newestFirst') {
          sortedProducts.sort((a, b) => b.id - a.id);
        } else if (sortOption === 'popular') {
          sortedProducts.sort((a, b) => b.rating.count - a.rating.count);
        }

        setProducts(sortedProducts);
      });
  }, [filters, sortOption]);

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    if (onProductClick) {
      onProductClick(product);
    }
  };

  // const handleBackClick = () => {
  //   setSelectedProduct(null);
  // };

  return (
    <div className="product-list-container">
      {!selectedProduct && (
        <>
          <div className="product-header">
            <span>{filteredProducts.length} Items</span>
            <div className="sort-dropdown">
              <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                <option value="recommended">Recommended</option>
                <option value="newestFirst">Newest First</option>
                <option value="popular">Popular</option>
                <option value="priceHighToLow">Price: High to Low</option>
                <option value="priceLowToHigh">Price: Low to High</option>
              </select>
            </div>
          </div>
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="product-card"
                onClick={() => handleProductClick(product)}
              >
                <Image
                  src={product.image}
                  alt={product.title}
                  width={200}
                  height={200}
                  objectFit="contain"
                />
                <h3>{product.title}</h3>
                <p>${product.price}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
