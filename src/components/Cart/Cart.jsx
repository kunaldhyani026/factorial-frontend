import React, { useState, useEffect } from 'react';
import './Cart.css';

const Cart = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCartData = async () => {
            try {
                const response = await fetch('http://localhost:4000/carts');
                if (response.status !== 200) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setCart(data.cart);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCartData();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!cart || !cart.cart_items.length) return <p>No items in the cart.</p>;

    const { cart_items, total } = cart;

    return (
        <div className="cart-container">
            {cart_items.map(item => (
                <div key={item.id} className="cart-item">
                    <h2 className="product-title">{item.product}</h2>
                    <div className="customizable-options">
                        {item.customizable_options.map(option => (
                            <div key={option.id} className="customizable-option">
                                <span className="option-name">{option.customizable_name}: </span>
                                <span className="option-value">{option.name}</span>
                                <span className="option-price">€{option.price.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <hr className="divider" />
                </div>
            ))}
            <div className="cart-total">
                <h3>Total:</h3>
                <span className="total-price">€{total.toFixed(2)}</span>
            </div>
        </div>
    );
};

export default Cart;
