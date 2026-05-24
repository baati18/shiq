
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function AddSalary() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    magaca: '',
    number: '',
    lacag: '',
    taariikh: new Date().toISOString().split('T')[0]
  });
  const [errors, setErrors] = useState({});

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.magaca.trim()) {
      newErrors.magaca = 'Magaca waa loo baahan yahay';
    } else if (formData.magaca.trim().length < 2) {
      newErrors.magaca = 'Magaca waa inuu ka kooban yahay ugu yaraan 2 xaraf';
    }
    
    if (formData.number && !/^[0-9+\-\s()]{6,20}$/.test(formData.number)) {
      newErrors.number = 'Telephone number waa inuu sax ahaadaa (6-20 digits)';
    }
    
    if (!formData.lacag) {
      newErrors.lacag = 'Lacagta waa loo baahan yahay';
    } else if (parseFloat(formData.lacag) <= 0) {
      newErrors.lacag = 'Lacagtu waa inay ka weyn tahay 0';
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

  const handleCall = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Fadlan sax dhamaan goobaha');
      return;
    }

    if (!formData.number) {
      toast.error('No phone number provided');
      return;
    }

    toast.success(`Calling ${formData.magaca || 'contact'}...`);
    setTimeout(() => {
      window.location.href = `tel:${formData.number}`;
    }, 300);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCall(e);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
            <h2 className="text-2xl font-bold text-white">➕ Add New Salary</h2>
            <p className="text-green-100 text-sm mt-1">Record salary information for employee</p>
          </div>
          
          <form onSubmit={handleCall} className="p-8">
            <div className="mb-4 text-sm text-gray-600">
              No save button. After you call or send money, the SMS confirmation will be auto-imported via Forward SMS App.
            </div>
            {/* Person Name */}
            <div className="mb-5">
              <label className="block text-gray-700 font-semibold mb-2">
                Person Name (Magaca) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="magaca"
                required
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition
                  ${errors.magaca ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                value={formData.magaca}
                onChange={handleChange}
                placeholder="e.g., Xasan Ali"
                disabled={loading}
              />
              {errors.magaca && (
                <p className="text-red-500 text-sm mt-1">{errors.magaca}</p>
              )}
            </div>
            
            {/* Phone Number with Call Button */}
            <div className="mb-5">
              <label className="block text-gray-700 font-semibold mb-2">
                Phone Number <span className="text-gray-500 text-sm">(optional)</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="tel"
                  name="number"
                  className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition
                    ${errors.number ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                  value={formData.number}
                  onChange={handleChange}
                  placeholder="0612345678"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={handleCall}
                  disabled={!formData.number || loading}
                  className={`px-6 py-2 rounded-lg font-semibold transition flex items-center gap-2
                    ${formData.number && !loading 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-gray-300 cursor-not-allowed text-gray-500'}`}
                >
                  📞 Call
                </button>
              </div>
              {errors.number && (
                <p className="text-red-500 text-sm mt-1">{errors.number}</p>
              )}
              <p className="text-gray-400 text-xs mt-1">Format: 0612345678 or +252612345678</p>
            </div>
            
            {/* Amount */}
            <div className="mb-5">
              <label className="block text-gray-700 font-semibold mb-2">
                Amount (Lacag) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  name="lacag"
                  required
                  step="0.01"
                  min="0.01"
                  className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition
                    ${errors.lacag ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                  value={formData.lacag}
                  onChange={handleChange}
                  placeholder="200.00"
                  disabled={loading}
                />
              </div>
              {errors.lacag && (
                <p className="text-red-500 text-sm mt-1">{errors.lacag}</p>
              )}
            </div>
            
            {/* Date */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Date (Taariikh) <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="taariikh"
                required
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition
                  ${errors.taariikh ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                value={formData.taariikh}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.taariikh && (
                <p className="text-red-500 text-sm mt-1">{errors.taariikh}</p>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                  {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Calling...
                  </>
                ) : (
                  <>
                    <span>📞</span>
                    <span>Call</span>
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/salary-list')}
                disabled={loading}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddSalary;
