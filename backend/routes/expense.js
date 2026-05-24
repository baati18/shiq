const express = require('express');
const authenticateToken = require('../middleware/auth');
const Expense = require('../models/Expense');

const { sendSMS, generateExpenseMessage } = require('../services/smsService');
const router = express.Router();

// Get all expenses for user
router.get('/', authenticateToken, async (req, res) => {
    try {
        const expenses = await Expense.find({ userId: req.userId }).sort({ taariikh: -1 });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


const mongoose = require('mongoose');


router.post('/', authenticateToken, async (req, res) => {
    const { magaca, lacag, quantity, taariikh, description, number } = req.body;
    console.log('=== Adding New Expense with SMS ===');
    console.log('User ID:', req.userId);
    console.log('Expense Data:', { magaca, lacag, quantity, taariikh });

    // Validation
    if (!magaca || !lacag || !taariikh) {
        return res.status(400).json({
            success: false,
            message: 'Magaca, lacag, iyo taariikh waa loo baahan yahay'
        });
    }

    try {
        const userId = new mongoose.Types.ObjectId(req.userId);
        const expense = new Expense({
            userId: userId,
            magaca: magaca,
            lacag: parseFloat(lacag),
            quantity: parseInt(quantity) || 1,
            taariikh: new Date(taariikh),
            description: description || '',
            number: number || ''
        });
        const savedExpense = await expense.save();
        console.log('✅ Expense saved with ID:', savedExpense._id);

        let smsResult = { success: false, message: 'SMS not sent' };
        // Send SMS only if number exists
        if (number && number.trim() !== '') {
            const smsMessage = generateExpenseMessage({
                magaca: savedExpense.magaca,
                lacag: savedExpense.lacag,
                taariikh: savedExpense.taariikh,
                quantity: savedExpense.quantity
            });
            smsResult = await sendSMS(number, smsMessage, 'expense');
            console.log('📱 SMS Result:', smsResult);
        }

        const isConfirmed = smsResult.success;
        res.status(201).json({
            success: true,
            message: isConfirmed ? 'Expense added and SMS sent' : 'Expense added but SMS failed',
            id: savedExpense._id,
            expense: savedExpense,
            sms: smsResult,
            confirmed: isConfirmed
        });
    } catch (error) {
        console.error('Error adding expense:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add expense',
            error: error.message
        });
    }
});

// Delete expense
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        await Expense.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        res.json({ message: 'Expense deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
