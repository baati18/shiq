const express = require('express');
const authenticateToken = require('../middleware/auth');
const Salary = require('../models/Salary');

const { sendSMS, generateSalaryMessage } = require('../services/smsService');
const router = express.Router();

// Get all salaries for user
router.get('/', authenticateToken, async (req, res) => {
    try {
        const salaries = await Salary.find({ userId: req.userId }).sort({ taariikh: -1 });
        res.json(salaries);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});



const mongoose = require('mongoose');

router.post('/', authenticateToken, async (req, res) => {
    const { magaca, number, lacag, taariikh } = req.body;
    console.log('=== Adding New Salary with SMS ===');
    console.log('User ID:', req.userId);
    console.log('Salary Data:', { magaca, number, lacag, taariikh });

    // Validation
    if (!magaca || !lacag || !taariikh) {
        return res.status(400).json({
            success: false,
            message: 'Magaca, lacag, iyo taariikh waa loo baahan yahay'
        });
    }

    try {
        const userId = new mongoose.Types.ObjectId(req.userId);
        const salary = new Salary({
            userId: userId,
            magaca: magaca,
            number: number || '',
            lacag: parseFloat(lacag),
            taariikh: new Date(taariikh)
        });
        const savedSalary = await salary.save();
        console.log('✅ Salary saved with ID:', savedSalary._id);

        let smsResult = { success: false, message: 'SMS not sent' };
        // Send SMS only if number exists
        if (number && number.trim() !== '') {
            const smsMessage = generateSalaryMessage({
                magaca: savedSalary.magaca,
                lacag: savedSalary.lacag,
                taariikh: savedSalary.taariikh,
                number: savedSalary.number
            });
            smsResult = await sendSMS(number, smsMessage, 'salary');
            console.log('📱 SMS Result:', smsResult);
        }

        const isConfirmed = smsResult.success;
        res.status(201).json({
            success: true,
            message: isConfirmed ? 'Salary added and SMS sent' : 'Salary added but SMS failed',
            id: savedSalary._id,
            salary: savedSalary,
            sms: smsResult,
            confirmed: isConfirmed
        });
    } catch (error) {
        console.error('Error adding salary:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add salary',
            error: error.message
        });
    }
});

// Delete salary
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        await Salary.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        res.json({ message: 'Salary deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
