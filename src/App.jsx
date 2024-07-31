// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Admin from './components/Admin/Admin'; // Directly importing Admin.js
import './App.css'; // Importing CSS for styling
import Home from "./components/Home";
import Product from "./components/Product/Product";
import Header from "./components/Header/Header";
import ProductForm from './components/Admin/AddProduct/ProductForm';
import CustomizableOptionForm from "./components/Admin/AddCustomizableOption/CustomizableOptionForm";

const App = () => {
  return (
      <Router>
          <Header />
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/admin" element={<Admin/>} />
          <Route path="/products/:id" element={<Product/>} />
          <Route path="/admin/add-product" element={<ProductForm/>} />
          <Route path="/admin/add-customizable-option" element={<CustomizableOptionForm/>} />
        </Routes>
      </Router>
  );
};

export default App;
