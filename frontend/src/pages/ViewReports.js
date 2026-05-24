import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';
import toast from 'react-hot-toast';

function ViewReports() {
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [month, setMonth] = useState('');
  const [salaries, setSalaries] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [filteredSalaries, setFilteredSalaries] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    const token = localStorage.getItem('token');
    try {
      const [salariesRes, expensesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/salary`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE_URL}/api/expenses`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setSalaries(salariesRes.data);
      setExpenses(expensesRes.data);
      setFilteredSalaries(salariesRes.data);
      setFilteredExpenses(expensesRes.data);
    } catch (error) {
      toast.error('Failed to load data');
    }
  };

  const handleSearch = async () => {
    const token = localStorage.getItem('token');
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (startDate && endDate) {
        params.startDate = startDate;
        params.endDate = endDate;
      }
      if (month) params.month = month;
      
      const response = await axios.get(`${API_BASE_URL}/api/dashboard/search`, {
        params,
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setFilteredSalaries(response.data.salary);
      setFilteredExpenses(response.data.expenses);
      toast.success('Search completed');
    } catch (error) {
      toast.error('Search failed');
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStartDate('');
    setEndDate('');
    setMonth('');
    setFilteredSalaries(salaries);
    setFilteredExpenses(expenses);
    toast.success('Filters reset');
  };

  const totalSalary = filteredSalaries.reduce((sum, s) => sum + parseFloat(s.lacag), 0);
  const totalExpense = filteredExpenses.reduce((sum, e) => sum + (parseFloat(e.lacag) * e.quantity), 0);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Reports & Search</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search by name..."
              className="px-4 py-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <input
              type="date"
              className="px-4 py-2 border rounded-lg"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Start Date"
            />
            <input
              type="date"
              className="px-4 py-2 border rounded-lg"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="End Date"
            />
            <select
              className="px-4 py-2 border rounded-lg"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            >
              <option value="">All Months</option>
              {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => (
                <option key={m} value={m}>{new Date(2000, m-1, 1).toLocaleString('default', { month: 'long' })}</option>
              ))}
            </select>
          </div>
          <div className="mt-4 flex gap-4">
            <button onClick={handleSearch} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Search
            </button>
            <button onClick={resetFilters} className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700">
              Reset
            </button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-2">Total Salary (Filtered)</h3>
            <p className="text-3xl font-bold text-green-600">${totalSalary.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-2">Total Expenses (Filtered)</h3>
            <p className="text-3xl font-bold text-red-600">${totalExpense.toFixed(2)}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
          <div className="p-6 border-b">
            <h3 className="text-xl font-bold">Salary Records</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Phone</th>
                  <th className="px-6 py-3 text-left">Amount</th>
                  <th className="px-6 py-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredSalaries.map((salary) => (
                  <tr key={salary.id} className="border-b">
                    <td className="px-6 py-4">{salary.magaca}</td>
                    <td className="px-6 py-4">
                      {salary.number ? (
                        <a href={`tel:${salary.number}`} className="text-blue-600 hover:underline">
                          {salary.number}
                        </a>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4 text-green-600 font-bold">${parseFloat(salary.lacag).toFixed(2)}</td>
                    <td className="px-6 py-4">{new Date(salary.taariikh).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b">
            <h3 className="text-xl font-bold">Expense Records</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">Item</th>
                  <th className="px-6 py-3 text-left">Quantity</th>
                  <th className="px-6 py-3 text-left">Unit Price</th>
                  <th className="px-6 py-3 text-left">Total</th>
                  <th className="px-6 py-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((expense) => (
                  <tr key={expense.id} className="border-b">
                    <td className="px-6 py-4">{expense.magaca}</td>
                    <td className="px-6 py-4">{expense.quantity}</td>
                    <td className="px-6 py-4">${parseFloat(expense.lacag).toFixed(2)}</td>
                    <td className="px-6 py-4 text-red-600 font-bold">${(expense.lacag * expense.quantity).toFixed(2)}</td>
                    <td className="px-6 py-4">{new Date(expense.taariikh).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewReports;
