import React from 'react';
import { Filter, ChevronDown } from 'lucide-react';

const FilterBar = ({ filters, setFilters, showFilters, setShowFilters }) => {
  return (
    <>
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center gap-2 px-6 py-3 border-2 border-stone-200 rounded-xl hover:border-stone-300 transition-colors"
      >
        <Filter className="w-5 h-5" />
        <span className="font-medium">Filters</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
      </button>

      {showFilters && (
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm animate-fade-in">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Occasion</label>
              <select 
                value={filters.occasion}
                onChange={(e) => setFilters({...filters, occasion: e.target.value})}
                className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="all">All</option>
                <option value="festive">Festive</option>
                <option value="casual">Casual</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Style</label>
              <select 
                value={filters.style}
                onChange={(e) => setFilters({...filters, style: e.target.value})}
                className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="all">All</option>
                <option value="traditional">Traditional</option>
                <option value="contemporary">Contemporary</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Size</label>
              <select 
                value={filters.size}
                onChange={(e) => setFilters({...filters, size: e.target.value})}
                className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="all">All Sizes</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
                <option value="Free Size">Free Size</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Budget</label>
              <select 
                value={filters.budget}
                onChange={(e) => setFilters({...filters, budget: e.target.value})}
                className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="all">All</option>
                <option value="under2000">Under ₹2,000</option>
                <option value="2000-5000">₹2,000 - ₹5,000</option>
                <option value="above5000">Above ₹5,000</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FilterBar;