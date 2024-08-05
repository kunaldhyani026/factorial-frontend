import React, { useState, useEffect } from 'react';
import './ProductForm.css';

const ProductForm = () => {
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [allCustomizables, setAllCustomizables] = useState([]);
    const [groupedOptions, setGroupedOptions] = useState([]);
    const [products, setProducts] = useState([]);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [nameError, setNameError] = useState('');

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:4000/customizable_options');
            const data = await response.json();
            setProducts(data.products);
            setAllCustomizables(data.customizables);

            const groupedOptions = data.customizable_options.reduce((acc, option) => {
                if (!acc[option.customizable_id]) {
                    acc[option.customizable_id] = [];
                }
                acc[option.customizable_id].push(option);
                return acc;
            }, {});

            setGroupedOptions(groupedOptions);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const normalizedProductName = productName.trim().toLowerCase();
        const isNameExists = products.some(product =>
            product.name.trim().toLowerCase() === normalizedProductName
        );

        const isValidProductName = !isNameExists;
        const hasSelectedOptions = selectedOptions.length > 0;
        const hasDescription = productDescription.trim() !== '';
        setIsButtonDisabled(!(isValidProductName && hasSelectedOptions && normalizedProductName !== '' && hasDescription));
        setNameError(isValidProductName ? '' : 'Product already exists.');
    }, [productName, selectedOptions, products, productDescription]);

    const handleNameChange = (e) => {
        setProductName(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setProductDescription(e.target.value);
    };

    const handleOptionChange = (e) => {
        const optionId = parseInt(e.target.value);
        setSelectedOptions((prevOptions) =>
            prevOptions.includes(optionId)
                ? prevOptions.filter(id => id !== optionId)
                : [...prevOptions, optionId]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isButtonDisabled) return;

        try {
            const response = await fetch('http://localhost:4000/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    product_name: productName,
                    product_description: productDescription,
                    customizable_options: Object.values(selectedOptions)
                }),
            });

            if (response.status === 201) {
                fetchData();

                alert('Product added successfully!');

                setProductName('');
                setProductDescription('');
                setSelectedOptions([]);
            } else {
                alert('Failed to add product.');
            }
        } catch (error) {
            alert('Error adding product.');
        }
    };

    return (
        <div className="product-form">
            <h2>Add New Product</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="productName">Product Name</label>
                    <input
                        type="text"
                        id="productName"
                        value={productName}
                        onChange={handleNameChange}
                        required
                    />
                    {nameError && <p className="error-message">{nameError}</p>}
                </div>

                <div>
                    <label htmlFor="productDescription">Description</label>
                    <input
                        type="text"
                        id="productDescription"
                        value={productDescription}
                        onChange={handleDescriptionChange}
                        required
                    />
                </div>

                <div>
                    <label>Customizable Options</label>
                    <div className="options-list">
                        {allCustomizables.map(customizable => (
                            <div key={customizable.id} className="customizable-group">
                                <h3>{customizable.name}</h3>
                                <div className="options-row">
                                    {groupedOptions[customizable.id] && (
                                        groupedOptions[customizable.id].map(option => (
                                            <label key={option.id} className="customizable-option-item">
                                                <input
                                                    type="checkbox"
                                                    value={option.id}
                                                    checked={selectedOptions.includes(option.id)}
                                                    onChange={handleOptionChange}
                                                />
                                                {option.name}
                                            </label>
                                        ))
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <button type="submit" disabled={isButtonDisabled}>
                    Add Product
                </button>
            </form>
        </div>
    );
};

export default ProductForm;
