import { useState } from 'react';

export default function Filter({ onFilterChange }) {
  const [filters, setFilters] = useState({idealFor: ['all']});


  const handleDropdownChange = (event) => {
    const selectedCategory = event.target.value;
    setFilters((prev) => ({ ...prev, idealFor: [selectedCategory] }));

    onFilterChange({ ...filters, idealFor: [selectedCategory] });
  };

  return (
    <div className="filter-sidebar">
      <div className="filter-heading">IDEAL FOR</div>
      <div className="filter-options">
        <div className="sort-dropdown">
          <select onChange={handleDropdownChange}>
            <option value="all">All</option>
            <option value="electronics">Electronics</option>
            <option value="jewelery">Jewelery</option>
            <option value="men's clothing">Men's Clothing</option>
            <option value="women's clothing">Women's Clothing</option>
          </select>
        </div>
      </div>
    </div>
  );
}
