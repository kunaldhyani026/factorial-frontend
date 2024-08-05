// src/components/Home/Home.js
import React, { useState, useEffect } from 'react';
import './Home.css'; // Import CSS for styling
import {Link} from "react-router-dom";

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:4000/products'); // Replace with your API endpoint
                if (response.status !==  200) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className="home">
            <h1>Marcus Store</h1>
            <div className="product-list">
                {products.map((product) => (
                    <Link to={`/products/${product.id}`} key={product.id} className="product-card-link">
                        <div key={product.id} className="product-card">
                            <h2 className="product-name">{product.name}</h2>
                            <p className="product-price">{product.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Home;
