import React, { useState } from "react";
import "./search.css";
import imgWater from "../assets/water.png";
import imgBackpack from "../assets/backpack.png";

const SearchLostItem = () => {
  const [filters, setFilters] = useState({
    category: "",
    location: "",
    date: "",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const sampleItems = [
    {
      id: 1,
      name: "Water Bottle",
      category: "Accessories",
      location: "Tiger Stadium",
      date: "2025-11-05",
      image: imgWater, 
    },
    {
      id: 2,
      name: "Backpack",
      category: "Clothing",
      location: "Middleton Library",
      date: "2025-11-05",
      image: imgBackpack, 
    },
  ];

  return (
    <div className="search-container">
      <h2 className="search-title">Search Lost Items</h2>

      <div className="filters">
        <div className="filter-group">
          <label>Category:</label>
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
          >
            <option value="">All</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Location:</label>
          <select
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
          >
            <option value="">All</option>
            <option value="Tiger Stadium">Tiger Stadium</option>
            <option value="Middleton Library">Middleton Library</option>
            <option value="Student Union">Student Union</option>
            <option value="Patrick F. Taylor Hall">Patrick F. Taylor Hall</option>
            <option value="LSU Bookstore">LSU Bookstore</option>
            <option value="Quad">Quad</option>
            <option value="Recreation Center">Recreation Center</option>
            <option value="Residential Hall">Residential Hall</option>
            <option value="LSU Bus Stop">LSU Bus Stop</option>
            <option value="Tiger Band Hall">Tiger Band Hall</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
          />
        </div>
      </div>

      <div className="items-grid">
        {sampleItems.map((item) => (
          <div key={item.id} className="item-card">
            
            <img src={item.image} alt={item.name} className="item-image" />

            <h3>{item.name}</h3>
            <p><strong>Category:</strong> {item.category}</p>
            <p><strong>Location:</strong> {item.location}</p>
            <p><strong>Date Found:</strong> {item.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchLostItem;
