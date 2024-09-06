import { useState, useEffect } from 'react';

export default function Cart({ cartItems, onClose }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [localCartItems, setLocalCartItems] = useState(cartItems);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const fetchedProducts = await Promise.all(
        localCartItems.map(item =>
          fetch(`https://fakestoreapi.com/products/${item.id}`)
            .then(res => res.json())
        )
      );
      setProducts(fetchedProducts);
      setLoading(false);
    };

    fetchProducts();
  }, [localCartItems]);

  const totalAmount = localCartItems.reduce((total, item) => total + (item.price * item.cartQuantity), 0);

  const handleIncrement = (itemId) => {
    setLocalCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId
          ? { ...item, cartQuantity: item.cartQuantity + 1 }
          : item
      )
    );
  };

  const handleDecrement = (itemId) => {
    setLocalCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId
          ? { ...item, cartQuantity: Math.max(item.cartQuantity - 1, 1) }
          : item
      )
    );
  };

  const handleClearCart = () => {
    setLocalCartItems([]); // Clear the local cart items
  };

  return (
    <div className="cart-dropdown">
      <button onClick={onClose} className="cart-close-button">×</button>
      <h2>Your Cart</h2>
      {/* <button className="delete-icon-button" onClick={handleClearCart}>
        <img src="/delete-icon.png" alt="Delete Icon" role='Clear Cart' aria-label='Clear Cart' title='Clear Cart'/>
      </button> */}
      {loading ? (
        <p>Loading...</p>
      ) : localCartItems.length > 0 ? (
        <div className="cart-items">
          {localCartItems.map(item => {
            const product = products.find(p => p.id === item.id);
            return (
              <div key={item.id} className="cart-item">
                <img src={product?.image} alt={product?.title} className="cart-item-image" />
                <div className="cart-item-details">
                  <p className="cart-item-title">{product?.title}</p>
                  <p className="cart-item-price">${product?.price}</p>
                  <div className="cart-item-quantity-control">
                    <button onClick={() => handleDecrement(item.id)}>-</button>
                    <span className="cart-item-quantity">Qty: {item.cartQuantity}</span>
                    <button onClick={() => handleIncrement(item.id)}>+</button>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="cart-total">
            <p>Total: ${totalAmount.toFixed(2)}</p>
            <button className="buy-now-button">Buy Now</button>
          </div>
        </div>
      ) : (
        <p>Your cart is empty</p>
      )}
    </div>
  );
}
