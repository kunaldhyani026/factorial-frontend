// src/components/Product/Product.js
import React, { useState, useEffect } from 'react';
import './Product.css';
import { useParams } from 'react-router-dom';

const Product = () => {
    const { id } = useParams();
    const [customizables, setCustomizables] = useState([]);
    const [customizableOptions, setCustomizableOptions] = useState({});
    const [selectedOptions, setSelectedOptions] = useState({});
    const [dropdownOptions, setDropdownOptions] = useState({});
    const [allOptionsSelected, setAllOptionsSelected] = useState(false);
    const [productDetails, setProductDetails] = useState({ name: '', description: '' });
    const [flashMessage, setFlashMessage] = useState('');
    const [flashMessageType, setFlashMessageType] = useState('');

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const response = await fetch(`http://localhost:4000/products/${id}`);
                if (response.status !== 200) throw new Error('Failed to fetch data');
                const data = await response.json();
                setCustomizables(data.customizables);
                setCustomizableOptions(data.customizable_options);
                setProductDetails({
                    name: data.product.name,
                    description: data.product.description
                });
            } catch (error) {
                console.error('Error fetching product data:', error);
            }
        };

        fetchProductData();
    }, []);

    useEffect(() => {
        const getDisabledOptions = (name, currentOptions) => {
            return currentOptions.map(option => {
                const isDisabledByStock = !option.stock;
                const isDisabledByProhibition = Object.values(selectedOptions).some(selectedId =>
                    option.prohibited_combinations.includes(selectedId)
                );
                return {
                    ...option,
                    disabled: isDisabledByStock || isDisabledByProhibition,
                    disabledReason: isDisabledByStock ? 'Out of stock' :
                        isDisabledByProhibition ? 'Prohibited Combination' : ''
                };
            });
        };

        const updatedOptions = {};
        customizables.forEach(({ name }) => {
            updatedOptions[name] = getDisabledOptions(name, customizableOptions[name] || []);
        });
        setDropdownOptions(updatedOptions);

        setAllOptionsSelected(customizables.every(({ name }) => selectedOptions[name]));
    }, [selectedOptions, customizableOptions, customizables]);

    const handleSelectChange = (name, event) => {
        setSelectedOptions(prev => ({
            ...prev,
            [name]: parseInt(event.target.value, 10), // Convert to integer
        }));
    };

    const handleAddToCart = async () => {
        const payload = {
            product_id: id,
            customizable_options: Object.values(selectedOptions),
        };
        try {
            const response = await fetch('http://localhost:4000/carts/add_item', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.status !== 201) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setFlashMessageType('success');
            setFlashMessage('Item added to cart successfully!');
            setSelectedOptions({});
        } catch (error) {
            setFlashMessageType('error');
            setFlashMessage('Add item failed!');
        }
    };

    return (
        <div className="product">
            <h1>{productDetails.name}</h1>
            <p className="description">{productDetails.description}</p>
            {customizables.map(({ id, name }) => (
                <div key={id} className="dropdown-container">
                    <label htmlFor={name}>{name}</label>
                    <select
                        id={name}
                        value={selectedOptions[name] || ''}
                        onChange={event => handleSelectChange(name, event)}
                    >
                        <option value="">Select an option</option>
                        {dropdownOptions[name]?.map(option => (
                            <option
                                key={option.id}
                                value={option.id}
                                disabled={option.disabled}
                                className={option.disabled ? 'option-disabled' : ''}
                            >
                                {option.name} {option.disabled ? `(${option.disabledReason})` : ''}
                            </option>
                        ))}
                    </select>
                </div>
            ))}
            {flashMessage && (
                <div className={`flash-message ${flashMessageType}`}>
                    {flashMessage}
                </div>
            )}
            <button
                onClick={handleAddToCart}
                disabled={!allOptionsSelected}
            >
                Add to Cart
            </button>
        </div>
    );
};

export default Product;
