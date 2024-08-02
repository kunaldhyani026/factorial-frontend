import React, {useEffect, useState} from 'react';
import './SpecialPricingModal.css'; // Import the updated CSS

const SpecialPricingModal = ({ isOpen, onClose, customizables, allOptions, option, onSave }) => {
    const [priceName, setPriceName] = useState('');
    const [price, setPrice] = useState('');
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [priceError, setPriceError] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const normalizedPriceName = priceName.trim().toLowerCase();
        const isValidPriceName = !(normalizedPriceName === '');
        const hasSelectedOptions = selectedOptions.length > 0;

        setIsButtonDisabled(!(isValidPriceName && hasSelectedOptions));
    }, [selectedOptions, priceName]);

    const handlePriceNameChange = (e) => {
        setPriceName(e.target.value);
    };

    const handlePriceChange = (e) => {
        const value = e.target.value;
        setPrice(value);

        if (value.trim() === '' || parseFloat(value) < 0) {
            setPriceError('Price must be a positive number.');
        } else {
            setPriceError('');
        }
    };

    const handleOptionChange = (e) => {
        const optionId = parseInt(e.target.value);
        setSelectedOptions(prevState =>
            prevState.includes(optionId)
                ? prevState.filter(id => id !== optionId)
                : [...prevState, optionId]
        );
    };

    const handleSave = async () => {
        if (priceError) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/pricing_groups`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    pricing_group_name: priceName,
                    price: parseFloat(price),
                    customizable_option_id: option.id,
                    customizable_option_combinations: selectedOptions
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
        <div className="modal-overlay" onClick={onClose}>
            <div className="special-modal" onClick={e => e.stopPropagation()}>
                <div className="special-modal-header">
                    <h2>{option.name} - Add Special Pricing</h2>
                </div>
                <div className="special-modal-content">
                    <label htmlFor="priceName">Special Price Group Name</label>
                    <input
                        type="text"
                        id="priceName"
                        value={priceName}
                        onChange={handlePriceNameChange}
                    />

                    <label htmlFor="price">Special Price</label>
                    <input
                        type="number"
                        id="price"
                        value={price}
                        onChange={handlePriceChange}
                        min="0"
                    />

                    {priceError && <p className="error-message">{priceError}</p>}

                    <label>Choose Pricing Combination</label>
                    <div className="special-options-list">
                        {customizables.map(customizable => (
                            <div key={customizable.id} className="special-customizable-group">
                                <h3>{customizable.name}</h3>
                                <div className="special-options-row">
                                    {allOptions.filter(option => option.customizable_id === customizable.id).map(option => (
                                        <label key={option.id} className="special-customizable-option-item">
                                            <input
                                                type="checkbox"
                                                value={option.id}
                                                checked={selectedOptions.includes(option.id)}
                                                onChange={handleOptionChange}
                                            />
                                            {option.name}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {error && <p className="error-message">{error}</p>}
                <div className="modal-footer">
                    <button className="cancel" onClick={onClose}>Cancel</button>
                    <button onClick={handleSave} disabled={isButtonDisabled || priceError}>Save</button>
                </div>
            </div>
        </div>
    );
};

export default SpecialPricingModal;
