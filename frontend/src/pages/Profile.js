import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';
import toast from 'react-hot-toast';

function Profile({ user, setUser }) {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');
    
    try {
      await axios.put(`${API_BASE_URL}/api/auth/profile`, 
        { phone },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const updatedUser = { ...user, phone };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-8">My Profile</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={user?.username || ''}
                disabled
                className="w-full px-4 py-2 border rounded-lg bg-gray-100"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-2 border rounded-lg bg-gray-100"
              />
            </div>
            
            <form onSubmit={handleUpdate}>
              <div>
                <label className="block text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Enter your phone number"
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
