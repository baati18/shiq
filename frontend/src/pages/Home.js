import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-6">Expense & Salary Management System</h1>
          <p className="text-xl mb-8">Track your salaries, manage expenses, and take control of your finances</p>
          <div className="space-x-4">
            <Link to="/register" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">
              Get Started
            </Link>
            <Link to="/login" className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600">
              Login
            </Link>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white rounded-lg p-6 text-center shadow-xl">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-bold mb-2">Track Salary</h3>
            <p className="text-gray-600">Record and manage all salary payments</p>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-xl">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2">Manage Expenses</h3>
            <p className="text-gray-600">Track all your daily expenses</p>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-xl">
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-xl font-bold mb-2">View Reports</h3>
            <p className="text-gray-600">Get insights with detailed reports</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
