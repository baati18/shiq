import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function AddExpense() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    magaca: '',
    customerPhone: '',  // Phone number for SMS/call
    lacag: '',
    quantity: '1',
    taariikh: new Date().toISOString().split('T')[0],
    description: ''
  });
  const [errors, setErrors] = useState({});

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.magaca.trim()) {
      newErrors.magaca = 'Magaca shayga waa loo baahan yahay';
    } else if (formData.magaca.trim().length < 2) {
      newErrors.magaca = 'Magaca waa inuu ka kooban yahay ugu yaraan 2 xaraf';
    }
    
    // Phone number validation (optional but recommended)
    if (formData.customerPhone && !/^[0-9+\-\s()]{6,20}$/.test(formData.customerPhone)) {
      newErrors.customerPhone = 'Telephone number waa inuu sax ahaadaa (6-20 digits)';
    }
    
    if (!formData.lacag) {
      newErrors.lacag = 'Lacagta waa loo baahan yahay';
    } else if (parseFloat(formData.lacag) <= 0) {
      newErrors.lacag = 'Lacagtu waa inay ka weyn tahay 0';
    }
    
    if (formData.quantity && parseInt(formData.quantity) <= 0) {
      newErrors.quantity = 'Quantity waa inay ka weyn tahay 0';
    }
    
    if (!formData.taariikh) {
      newErrors.taariikh = 'Taariikhda waa loo baahan yahay';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Fadlan sax dhamaan goobaha');
      return;
    }
    
    setLoading(true);
    const token = localStorage.getItem('token');
    
    try {
      const response = await axios.post(`${API_BASE_URL}/api/expenses`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Expense added successfully!');
      
      // After save, call the phone number if present
      if (formData.customerPhone) {
        setTimeout(() => {
          window.location.href = `tel:${formData.customerPhone}`;
        }, 500); // Small delay for UX
      }
      
      // Navigate after 2 seconds
      setTimeout(() => {
        navigate('/expense-list');
      }, 2000);
      
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error(error.response?.data?.message || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  const handleCall = () => {
    if (formData.customerPhone) {
      window.location.href = `tel:${formData.customerPhone}`;
      toast.success(`Calling customer...`);
    } else {
      toast.error('No phone number provided');
    }
  };

  // Calculate total amount
  const totalAmount = parseFloat(formData.lacag || 0) * parseInt(formData.quantity || 1);

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
            <h2 className="text-2xl font-bold text-white">📝 Add New Expense</h2>
            <p className="text-red-100 text-sm mt-1">Record expense and notify customer</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8">
            {/* Item Name */}
            <div className="mb-5">
              <label className="block text-gray-700 font-semibold mb-2">
                Item Name (Magaca Shayga) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="magaca"
                required
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition
                  ${errors.magaca ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                value={formData.magaca}
                onChange={handleChange}
                placeholder="e.g., Nafto, Fiilo, Biyo, Koronto"
                disabled={loading}
              />
              {errors.magaca && (
                <p className="text-red-500 text-sm mt-1">{errors.magaca}</p>
              )}
            </div>
            
            {/* Customer Phone Number with Call Button */}
            <div className="mb-5">
              <label className="block text-gray-700 font-semibold mb-2">
                Customer Phone Number <span className="text-gray-500 text-sm">(optional - for SMS/call)</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="tel"
                  name="customerPhone"
                  className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition
                    ${errors.customerPhone ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                  value={formData.customerPhone}
                  onChange={handleChange}
                  placeholder="0612345678"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={handleCall}
                  disabled={!formData.customerPhone || loading}
                  className={`px-6 py-2 rounded-lg font-semibold transition flex items-center gap-2
                    ${formData.customerPhone && !loading 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-gray-300 cursor-not-allowed text-gray-500'}`}
                >
                  📞 Call
                </button>
              </div>
              {errors.customerPhone && (
                <p className="text-red-500 text-sm mt-1">{errors.customerPhone}</p>
              )}
              <p className="text-gray-400 text-xs mt-1">Format: 0612345678 or +252612345678</p>
            </div>
            
            {/* Quantity and Amount in two columns */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Quantity <span className="text-gray-500 text-sm">(optional)</span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  min="1"
                  step="1"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition
                    ${errors.quantity ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="1"
                  disabled={loading}
                />
                {errors.quantity && (
                  <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
                )}
              </div>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Unit Price (Lacag) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    name="lacag"
                    required
                    step="0.01"
                    min="0.01"
                    className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition
                      ${errors.lacag ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                    value={formData.lacag}
                    onChange={handleChange}
                    placeholder="50.00"
                    disabled={loading}
                  />
                </div>
                {errors.lacag && (
                  <p className="text-red-500 text-sm mt-1">{errors.lacag}</p>
                )}
              </div>
            </div>
            
            {/* Total Amount Display */}
            {formData.lacag && (
              <div className="mb-5 p-3 bg-gray-100 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-semibold">Total Amount:</span>
                  <span className="text-xl font-bold text-red-600">${totalAmount.toFixed(2)}</span>
                </div>
                <p className="text-gray-500 text-xs mt-1">
                  {formData.quantity || 1} × ${parseFloat(formData.lacag || 0).toFixed(2)} = ${totalAmount.toFixed(2)}
                </p>
              </div>
            )}
            
            {/* Date */}
            <div className="mb-5">
              <label className="block text-gray-700 font-semibold mb-2">
                Date (Taariikh) <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="taariikh"
                required
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition
                  ${errors.taariikh ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                value={formData.taariikh}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.taariikh && (
                <p className="text-red-500 text-sm mt-1">{errors.taariikh}</p>
              )}
            </div>
            
            {/* Description */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Description (Faahfaahin) <span className="text-gray-500 text-sm">(optional)</span>
              </label>
              <textarea
                name="description"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                placeholder="Additional details about this expense..."
                disabled={loading}
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-red-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-red-700 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving & Calling...
                  </>
                ) : (
                  <>
                    <span>💾</span>
                    <span>Save & Call</span>
                    <span>📞</span>
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/expense-list')}
                disabled={loading}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
            
            <p className="text-center text-gray-500 text-xs mt-4">
              ⚡ Clicking "Save & Call" will: Save expense → Make phone call (if number provided)
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddExpense;