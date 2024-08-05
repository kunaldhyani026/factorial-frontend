import React, { useState, useEffect } from 'react';
import './CustomizableOptionModal.css';

const CustomizableOptionModal = ({ isOpen, onClose, option, onSave }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [inStock, setInStock] = useState(false);
    const [priceError, setPriceError] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (option) {
            setName(option.name);
            setPrice(option.price);
            setInStock(option.stock);
        }
    }, [option]);

    const handlePriceChange = (e) => {
        const value = e.target.value;
        setPrice(value);

        if (value.trim() === '' || parseFloat(value) < 0) {
            setPriceError('Price must be a positive number.');
        } else {
            setPriceError('');
        }
    };

    const handleSave = async () => {
        if (priceError) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:4000/customizable_options/${option.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    price: parseFloat(price),
                }),
            });

            if (response.ok) {
                onSave();
                onClose();
            } else {
                setError('Failed to save changes. Please try again.');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={(e) => { e.stopPropagation(); onClose(); }}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Modify Customizable Option</h2>
                </div>
                <div className="modal-content">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        disabled
                    />

                    <label htmlFor="price">Price</label>
                    <input
                        type="number"
                        id="price"
                        value={price}
                        onChange={handlePriceChange}
                        min="0"
                    />
                    {priceError && <p className="error-message">{priceError}</p>}

                    <label htmlFor="inStock">In Stock</label>
                    <select
                        id="inStock"
                        value={inStock}
                        onChange={(e) => setInStock(e.target.value === 'true')}
                        disabled
                    >
                        <option value={true}>True</option>
                        <option value={false}>False</option>
                    </select>

                    {error && <p className="error-message">{error}</p>}
                </div>
                <div className="modal-footer">
                    <button className="cancel" onClick={onClose}>Cancel</button>
                    <button
                        onClick={handleSave}
                        disabled={!!priceError}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomizableOptionModal;
