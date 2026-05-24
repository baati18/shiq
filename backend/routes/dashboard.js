const express = require('express');
const authenticateToken = require('../middleware/auth');
const Salary = require('../models/Salary');
const Expense = require('../models/Expense');
const mongoose = require('mongoose');
const router = express.Router();

router.get('/stats', authenticateToken, async (req, res) => {
    try {
        console.log('=== Calculating Stats for User ===');
        console.log('User ID:', req.userId);
        // Get total salary - convert string to ObjectId
        const salaryAggregation = await Salary.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(req.userId) } },
            { $group: { _id: null, total: { $sum: '$lacag' }, count: { $sum: 1 } } }
        ]);
        // Get total expenses - multiply lacag * quantity
        const expenseAggregation = await Expense.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(req.userId) } },
            { $group: { _id: null, total: { $sum: { $multiply: ['$lacag', '$quantity'] } }, count: { $sum: 1 } } }
        ]);
        const totalSalary = salaryAggregation[0]?.total || 0;
        const totalExpense = expenseAggregation[0]?.total || 0;
        const totalMoney = totalSalary + totalExpense;
        const remainingBalance = totalSalary - totalExpense;
        console.log('Salary Total:', totalSalary);
        console.log('Expense Total:', totalExpense);
        console.log('Total Money:', totalMoney);
        console.log('Remaining Balance:', remainingBalance);
        res.json({
            success: true,
            totalSalary: parseFloat(totalSalary),
            totalExpense: parseFloat(totalExpense),
            totalMoney: parseFloat(totalMoney)
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Search & Filter
router.get('/search', authenticateToken, async (req, res) => {
    const { search, startDate, endDate, month } = req.query;

    try {
        const salaryFilter = { userId: req.userId };
        const expenseFilter = { userId: req.userId };

        if (search) {
            salaryFilter.magaca = { $regex: search, $options: 'i' };
            expenseFilter.magaca = { $regex: search, $options: 'i' };
        }

        if (startDate && endDate) {
            salaryFilter.taariikh = { $gte: new Date(startDate), $lte: new Date(endDate) };
            expenseFilter.taariikh = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        if (month) {
            const monthInt = parseInt(month, 10);
            const salaryStart = new Date(new Date().getFullYear(), monthInt - 1, 1);
            const salaryEnd = new Date(new Date().getFullYear(), monthInt, 0, 23, 59, 59, 999);
            salaryFilter.taariikh = { $gte: salaryStart, $lte: salaryEnd };
            expenseFilter.taariikh = { $gte: salaryStart, $lte: salaryEnd };
        }

        const salaries = await Salary.find(salaryFilter).sort({ taariikh: -1 });
        const expenses = await Expense.find(expenseFilter).sort({ taariikh: -1 });

        res.json({ salary: salaries, expenses });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Monthly summary for reports
router.get('/monthly-summary', authenticateToken, async (req, res) => {
    try {
        const salaryByMonth = await Salary.aggregate([
            { $match: { userId: req.userId } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m', date: '$taariikh' } },
                    total: { $sum: '$lacag' }
                }
            },
            { $sort: { _id: -1 } },
            { $limit: 12 }
        ]);

        const expenseByMonth = await Expense.aggregate([
            { $match: { userId: req.userId } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m', date: '$taariikh' } },
                    total: { $sum: { $multiply: ['$lacag', '$quantity'] } }
                }
            },
            { $sort: { _id: -1 } },
            { $limit: 12 }
        ]);

        res.json({
            salaryByMonth: salaryByMonth.map(item => ({ month: item._id, total: item.total })),
            expenseByMonth: expenseByMonth.map(item => ({ month: item._id, total: item.total }))
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
