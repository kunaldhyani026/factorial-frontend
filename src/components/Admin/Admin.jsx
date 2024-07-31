import React, { useState } from 'react';
import './Admin.css';
import {Link} from "react-router-dom"; // Import the CSS file for styling

const Admin = () => {
    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <Link to={`/admin/add-product`} className="product-card-link">
                <div className="card">
                    <h2>Add New Product</h2>
                    <p>Click here to add a new product and configure customizable options.</p>
                </div>
            </Link>

            <Link to={`/admin/add-customizable-option`} className="product-card-link">
                <div className="card">
                    <h2>Add New Customizable Option</h2>
                    <p>Click here to add a new customizable option for a customizable.</p>
                </div>
            </Link>
        </div>
    );
};

export default Admin;
