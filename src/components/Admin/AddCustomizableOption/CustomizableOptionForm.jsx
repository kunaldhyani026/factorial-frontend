import React, { useState, useEffect } from 'react';
import './CustomizableOptionForm.css';  // Assuming you have a CSS file for styling

const CustomizableOptionForm = () => {
    const [optionName, setOptionName] = useState('');
    const [optionPrice, setOptionPrice] = useState('');
    const [inStock, setInStock] = useState(true);
    const [customizableId, setCustomizableId] = useState('');
    const [existingOptions, setExistingOptions] = useState([]);
    const [customizables, setCustomizables] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [isSaveDisabled, setIsSaveDisabled] = useState(true);
    const [nameError, setNameError] = useState('');
    const [priceError, setPriceError] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:3000/customizable_options'); // Replace with actual endpoint
            const data = await response.json();
            setCustomizables(data.customizables);
            setExistingOptions(data.customizable_options);
            setProducts(data.products);

            // Initialize form with the first customizable id
            if (data.customizables.length > 0) {
                setCustomizableId(data.customizables[0].id);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        // Check if option name exists for the selected customizable
        if (customizableId) {
            const existingOptionNames = existingOptions
                .filter(option => option.customizable_id === customizableId)
                .map(option => option.name.trim().toLowerCase());

            const normalizedOptionName = optionName.trim().toLowerCase();
            const isNameExists = existingOptionNames.includes(normalizedOptionName);

            setIsSaveDisabled(isNameExists || !optionName.trim() || !optionPrice || priceError);
            setNameError(isNameExists ? 'Option already exists for the customizable' : '');
        }
    }, [optionName, customizableId, existingOptions, optionPrice]);

    const handleNameChange = (e) => {
        setOptionName(e.target.value);
    };

    const handlePriceChange = (e) => {
        const value = e.target.value;
        setOptionPrice(value);

        // Validate price
        if (value.trim() === '' || parseFloat(value) < 0) {
            setPriceError('Price must be a positive number.');
        } else {
            setPriceError('');
        }
    };

    const handleInStockChange = (e) => {
        setInStock(e.target.value === 'true');
    };

    const handleCustomizableChange = (e) => {
        setCustomizableId(parseInt(e.target.value));
    };

    const handleProductChange = (e) => {
        const productId = parseInt(e.target.value);
        setSelectedProducts((prevProducts) =>
            prevProducts.includes(productId)
                ? prevProducts.filter(id => id !== productId)
                : [...prevProducts, productId]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSaveDisabled) return;
        if (priceError) {
            return; // Do not save if there's a price error
        }

        try {
            const response = await fetch('http://localhost:3000/customizable_options', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: optionName,
                    price: optionPrice,
                    in_stock: inStock,
                    customizable_id: customizableId,
                    product_ids : selectedProducts,
                }),
            });

            if (response.status === 201) {
                alert('Customizable option added successfully!');
                // Refetch data to update the form
                fetchData();
                setOptionName('');
                setOptionPrice('');
                setInStock(true);
                setSelectedProducts([]);
            } else {
                alert('Failed to add customizable option.');
            }
        } catch (error) {
            alert('Error adding customizable option.');
        }
    };

    return (
        <div className="customizable-option-form">
            <h2>Add New Customizable Option</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="customizable">Customizable</label>
                    <select id="customizable" value={customizableId} onChange={handleCustomizableChange} required>
                        {customizables.map(customizable => (
                            <option key={customizable.id} value={customizable.id}>
                                {customizable.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="optionName">Option Name</label>
                    <input
                        type="text"
                        id="optionName"
                        value={optionName}
                        onChange={handleNameChange}
                        required
                    />
                    {nameError && <p className="error-message">{nameError}</p>}
                </div>

                <div>
                    <label htmlFor="optionPrice">Price</label>
                    <input
                        type="number"
                        id="optionPrice"
                        value={optionPrice}
                        onChange={handlePriceChange}
                        required
                    />
                    {priceError && <p className="error-message">{priceError}</p>}
                </div>

                <div>
                    <label htmlFor="inStock">In Stock</label>
                    <select id="inStock" value={inStock} onChange={handleInStockChange}>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                </div>


                <div>
                    <label>Applicable Products</label>
                    <div className="product-row">
                        {
                            products.map(product => (
                                <label key={product.id} className="product-item">
                                    <input
                                        type="checkbox"
                                        value={product.id}
                                        checked={selectedProducts.includes(product.id)}
                                        onChange={handleProductChange}
                                    />
                                    {product.name}
                                </label>
                            ))
                        }
                    </div>
                </div>




                <button type="submit" disabled={isSaveDisabled}>
                    Add Option
                </button>
            </form>
        </div>
    );
};

export default CustomizableOptionForm;
