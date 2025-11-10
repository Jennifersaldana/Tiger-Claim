import React from "react";
import Navbar from "../../components/navBar";
import SearchBar from "../../components/searchBar";
import Filters from "../../components/filter";
import ItemGrid from "../../components/itemGrid";
import "./searchPage.css";

const searchPage = () => {
  return (
    <div className="search-page">
      <Navbar />

      <header className="header-section">
        <h1 className="title">Find Your Lost Items</h1>
        <p className="subtitle">Search and filter by category, date, or location</p>
      </header>

      <SearchBar />
      <Filters />
      <ItemGrid />
    </div>
  );
};

export default searchPage;