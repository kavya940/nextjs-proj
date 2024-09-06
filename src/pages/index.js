import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductList from '../components/ProductList';
import Filter from '../components/Filter';
import Cart from '../components/Cart';

export default function Home() {
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [selectedQuantity, setSelectedQuantity] = useState(1); // Renamed from quantity
  const [showCart, setShowCart] = useState(false);

  const searchOverlayRef = useRef(null);

  const toggleFilter = () => setShowFilter(!showFilter);
  const handleFilterChange = (updatedFilters) => setFilters(updatedFilters);
  const toggleSearch = () => setShowSearch(!showSearch);
  const toggleCart = () => setShowCart(!showCart);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setSelectedQuantity(1); // Reset selectedQuantity on product click
  };

  const handleBackClick = () => {
    setSelectedProduct(null);
  };


  const incrementCartQuantity = (productId) => {
    setCartItems(prevItems => {
      return prevItems.map(item => {
        if (item.id === productId) {
          return { ...item, cartQuantity: item.cartQuantity + 1 };
        }
        return item;
      });
    });
  };

  const decrementCartQuantity = (productId) => {
    setCartItems(prevItems => {
      return prevItems.map(item => {
        if (item.id === productId && item.cartQuantity > 1) {
          return { ...item, cartQuantity: item.cartQuantity - 1 };
        }
        return item;
      });
    });
  };

  const incrementSelectedQuantity = () => {
    setSelectedQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decrementSelectedQuantity = () => {
    setSelectedQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  const handleAddToCart = () => {
    if (selectedProduct) {
      setCartItems((prevItems = []) => {
        const existingItemIndex = prevItems.findIndex(
          (item) => item.id === selectedProduct.id
        );
  
        // Product already exists in the cart
        if (existingItemIndex !== -1) {
          // Create a new array with updated quantity, not mutating original state
          const updatedItems = prevItems.map((item, index) => {
            if (index === existingItemIndex) {
              return {
                ...item,
                cartQuantity: item.cartQuantity + selectedQuantity, // Properly adding selectedQuantity
              };
            }
            return item;
          });
          
          return updatedItems;
        } else {
          // Product not in cart, add it with selectedQuantity as cartQuantity
          return [...prevItems, { ...selectedProduct, cartQuantity: selectedQuantity }];
        }
      });
  
      // Reset selectedQuantity to 1 after adding to cart
      // setSelectedQuantity(1);
    }
  };
  
  const handleClearCart = () => {
    setCartItems([]); // Reset the cart items to an empty array
  };
  
  const handleBuyNow = () => {
    alert('Proceed to checkout with the product.');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchOverlayRef.current && !searchOverlayRef.current.contains(event.target)) {
        setShowSearch(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Backspace' && searchQuery === '') {
        setShowSearch(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [searchQuery]);

  return (
    <>
      <Head>
        <title>Advanced E-commerce</title>
        <meta name="description" content="Discover our products" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header onSearchClick={toggleSearch} cartItems={cartItems} onCartClick={toggleCart} />

      {showSearch && (
        <div className="search-overlay" ref={searchOverlayRef}>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      <main>
        {selectedProduct ? (
          <div className="product-details">
            <button className="back-button" onClick={handleBackClick} role="Back" aria-label="Go Back" title="Go Back">←</button>
            <div className="product-info">
              <div className="product-image">
                <img src={selectedProduct.image} alt={selectedProduct.title} />
              </div>
              <div className="product-content">
                <h2>{selectedProduct.title}</h2>
                <p>Category: {selectedProduct.category}</p>
                <p>Price: ${selectedProduct.price}</p>
                <p>{selectedProduct.description}</p>

                {/* Quantity Control */}
                <div className="quantity-control">
                  <button onClick={decrementSelectedQuantity}>-</button>
                  <input type="text" value={selectedQuantity} readOnly />
                  <button onClick={incrementSelectedQuantity}>+</button>
                </div>
                <button onClick={handleBuyNow}>Buy Now</button>
                <div className="add-to-cart-container">
                  <button onClick={handleAddToCart}>Add to Cart</button>
                  <button className="delete-icon-button" onClick={handleClearCart}>
                      <img src="/delete-icon.png" alt="Delete Icon" role='Clear Cart' aria-label='Clear Cart' title='Clear Cart'/>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <section className="product-section">
            <div className="filter-container">
              <button className="filter-toggle" onClick={toggleFilter}>
                {showFilter ? 'Hide Filter' : 'Show Filter'}
              </button>
              {showFilter && <Filter onFilterChange={handleFilterChange} />}
            </div>

            <ProductList
              filters={filters}
              searchQuery={searchQuery}
              onProductClick={handleProductClick}
            />
          </section>
        )}
      </main>

      <Footer />

      {showCart && (
        <Cart 
        cartItems={cartItems} 
        onClose={toggleCart} 
        incrementCartQuantity={incrementCartQuantity} 
        decrementCartQuantity={decrementCartQuantity}
      />
      )}
    </>
  );
}
