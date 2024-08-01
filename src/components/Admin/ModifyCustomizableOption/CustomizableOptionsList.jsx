import React, { useState, useEffect } from 'react';
import CustomizableOptionModal from './CustomizableOptionModal';
import './CustomizableOptionsList.css'; // Import the updated CSS

const CustomizableOptionsList = () => {
    const [customizables, setCustomizables] = useState([]);
    const [customizableOptions, setCustomizableOptions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentOption, setCurrentOption] = useState(null);

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:3000/customizable_options'); // Replace with actual API endpoint
            const data = await response.json();
            setCustomizables(data.customizables);
            setCustomizableOptions(data.customizable_options);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleModifyClick = (option) => {
        setCurrentOption(option);
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setCurrentOption(null);
        document.body.style.overflow = 'auto';
    };

    const handleModalSave = (price) => {
        debugger
    }

    return (
        <div className="customizable-options-list">
            {isModalOpen && <div className="overlay"></div>}
            <h2>Customizable Options</h2>
            {customizables.map(customizable => (
                <div key={customizable.id} className="customizable-group">
                    <h3>{customizable.name}</h3>
                    <ul className="options-list">
                        {customizableOptions
                            .filter(option => option.customizable_id === customizable.id)
                            .map(option => (
                                <li key={option.id} className="option-item">
                                    <span className="option-name">{option.name}</span>
                                    <span className="option-price">€{option.price.toFixed(2)}</span>
                                    <span className={`option-stock ${option.stock ? '' : 'out-of-stock'}`}>
                                        {option.stock ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                    <button
                                        onClick={() => handleModifyClick(option)}
                                        className="modify-button">
                                        Modify
                                    </button>
                                </li>
                            ))}
                    </ul>
                </div>
            ))}

            {isModalOpen && (
                <CustomizableOptionModal
                    isOpen={isModalOpen}
                    option={currentOption}
                    onClose={handleModalClose}
                    onSave={() => {
                        fetchData();
                        // Optionally refresh the list after saving
                    }}
                />
            )}
        </div>
    );
};

export default CustomizableOptionsList;
