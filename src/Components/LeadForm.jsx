import React, { useState } from 'react';
import { X } from 'lucide-react';
import { sendLeadMessage } from '../Utils/whatsapp';

const LeadForm = ({ onClose }) => {
  const [formData, setFormData] = useState({ 
    name: '', 
    size: '', 
    budget: '', 
    phone: '' 
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    sendLeadMessage(formData);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-end md:items-center justify-center p-0 md:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full md:max-w-md md:rounded-2xl p-6 md:p-8 animate-slide-in-right">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-serif text-2xl text-stone-800">Get Recommendations</h3>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Your Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Enter your name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Preferred Size</label>
            <select
              required
              value={formData.size}
              onChange={(e) => setFormData({...formData, size: e.target.value})}
              className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">Select size</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
              <option value="Free Size">Free Size</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Budget Range</label>
            <select
              required
              value={formData.budget}
              onChange={(e) => setFormData({...formData, budget: e.target.value})}
              className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">Select budget</option>
              <option value="Under ₹2,000">Under ₹2,000</option>
              <option value="₹2,000 - ₹5,000">₹2,000 - ₹5,000</option>
              <option value="Above ₹5,000">Above ₹5,000</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Phone Number</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Your WhatsApp number"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-4 rounded-xl font-medium hover:from-green-700 hover:to-green-600 transition-all shadow-lg"
          >
            Send to WhatsApp
          </button>
        </form>
      </div>
    </div>
  );
};

export default LeadForm;