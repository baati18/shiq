import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import toast from 'react-hot-toast';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

function Dashboard() {
  const [stats, setStats] = useState({ totalSalary: 0, totalExpense: 0, totalMoney: 0 });
  const [recentSalaries, setRecentSalaries] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem('token');
    try {
      const [statsRes, salariesRes, expensesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/dashboard/stats', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:5000/api/salary', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:5000/api/expenses', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      
      // Ensure stats object always has all fields as numbers
      const { totalSalary = 0, totalExpense = 0, totalMoney = 0 } = statsRes.data || {};
      setStats({ totalSalary, totalExpense, totalMoney });
      setRecentSalaries(salariesRes.data.slice(0, 5));
      setRecentExpenses(expensesRes.data.slice(0, 5));
    } catch (error) {
      toast.error('Failed to load dashboard data');
    }
  };

  const pieData = {
    labels: ['Total Salary', 'Total Expenses'],
    datasets: [{
      data: [stats.totalSalary, stats.totalExpense],
      backgroundColor: ['#36A2EB', '#FF6384'],
    }]
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">Welcome, {user?.username}!</h1>
        <p className="text-gray-600 mb-8">Here's your financial overview</p>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-500 mb-2">Total Money</div>
            <div className="text-3xl font-bold text-green-600">${stats.totalMoney.toFixed(2)}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-500 mb-2">Total Salary</div>
            <div className="text-3xl font-bold text-blue-600">${stats.totalSalary.toFixed(2)}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-500 mb-2">Total Expenses</div>
            <div className="text-3xl font-bold text-red-600">${stats.totalExpense.toFixed(2)}</div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">Expense vs Salary Chart</h3>
            {stats.totalSalary > 0 || stats.totalExpense > 0 ? (
              <div className="w-full max-w-md mx-auto">
                <Pie data={pieData} />
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No data available yet. Add salary or expenses to see chart.</p>
            )}
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">Recent Salaries</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {recentSalaries.length > 0 ? (
                recentSalaries.map((salary) => (
                  <div key={salary._id || salary.id} className="flex justify-between items-center border-b py-2">
                    <span className="font-medium">{salary.magaca}</span>
                    <span className="font-bold text-green-600">${parseFloat(salary.lacag).toFixed(2)}</span>
                    <span className="text-gray-500 text-sm">{new Date(salary.taariikh).toLocaleDateString()}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No salaries added yet</p>
              )}
            </div>
            <h3 className="text-xl font-bold mt-6 mb-4">Recent Expenses</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {recentExpenses.length > 0 ? (
                recentExpenses.map((expense) => (
                  <div key={expense._id || expense.id} className="flex justify-between items-center border-b py-2">
                    <span className="font-medium">{expense.magaca}</span>
                    <span className="font-bold text-red-600">${(expense.lacag * (expense.quantity || 1)).toFixed(2)}</span>
                    <span className="text-gray-500 text-sm">{new Date(expense.taariikh).toLocaleDateString()}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No expenses added yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
