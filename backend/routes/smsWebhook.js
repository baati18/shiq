const express = require('express');
const Salary = require('../models/Salary');
const Expense = require('../models/Expense');
const User = require('../models/User');
const router = express.Router();

// Endpoint for Forward SMS app
router.post('/forward-sms', async (req, res) => {
    try {
        console.log('=== SMS Received from Forward App ===');
        console.log('Request Body:', req.body);

        const sender = req.body.from || req.body.sender || req.body.phone || '';
        const message = req.body.message || req.body.text || req.body.msg || '';
        const receivedDate = req.body.date || req.body.received_at || new Date();

        console.log(`📱 From: ${sender}`);
        console.log(`💬 Message: ${message}`);

        if (!sender) {
            return res.status(400).json({ success: false, message: 'Sender number is required' });
        }

        const user = await User.findOne({ phone: sender });
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        let result = null;
        const lowerMessage = message.toLowerCase();
        if (
            lowerMessage.includes('salary') ||
            lowerMessage.includes('mushaar') ||
            lowerMessage.includes('uwareejisay') ||
            lowerMessage.includes('waxaad dirtay') ||
            lowerMessage.includes('waxaad u dirtay') ||
            lowerMessage.includes('waxaad uwareejisay')
        ) {
            result = await parseAndSaveSalary(message, user._id, sender);
            if (result?.error) {
                return res.status(400).json({ success: false, message: result.error });
            }
        } else if (lowerMessage.includes('expense') || lowerMessage.includes('kharash')) {
            result = await parseAndSaveExpense(message, user._id);
        } else {
            console.log('⚠️ Unknown SMS type:', message);
        }

        res.status(200).json({ 
            success: true, 
            message: 'SMS processed successfully',
            saved: result 
        });
    } catch (error) {
        console.error('SMS webhook error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

function normalizePhone(phone = '') {
    const digits = phone.toString().replace(/[^0-9]/g, '');
    return digits.replace(/^0+/, '');
}

function phoneMatches(a = '', b = '') {
    const aNorm = normalizePhone(a);
    const bNorm = normalizePhone(b);
    if (!aNorm || !bNorm) return false;
    return aNorm === bNorm || aNorm.endsWith(bNorm) || bNorm.endsWith(aNorm);
}

function parseEvcSalaryMessage(message) {
    const moneyMatch = message.match(/\$([0-9]+(?:\.[0-9]+)?)/);
    const numberMatch = message.match(/\((\d{6,20})\)/);
    const namePatterns = [
        /uwareejisay\s+([^\(\$\,]+)/i,
        /waxaad\s+dirtay\s+([^\(\$\,]+)/i,
        /waxaad\s+u\s+dirtay\s+([^\(\$\,]+)/i,
        /to\s+([^\(\$\,]+)/i
    ];

    let magaca = '';
    for (const pattern of namePatterns) {
        const match = message.match(pattern);
        if (match && match[1]) {
            magaca = match[1].trim();
            break;
        }
    }

    if (!magaca) {
        const cleaned = message
            .replace(/\$[0-9]+(?:\.[0-9]+)?/g, ' ')
            .replace(/\([^)]*\)/g, ' ')
            .replace(/[-:,.\/]/g, ' ')
            .replace(/\b(evcp?\+|evc|zaad|plus|waxaad|dirtay|diray|to|u|uwareejisay|heshay|haraagaagu|tar|app|http|www|com|net|have|sent|payment|paid|lacagta|lacag|sh|som|usd)\b/gi, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        const words = cleaned.split(' ').filter(word => word.length > 1);
        if (words.length > 0) {
            magaca = words.join(' ').trim();
        }
    }

    return {
        lacag: moneyMatch ? parseFloat(moneyMatch[1]) : 0,
        magaca: magaca || 'Unknown',
        number: numberMatch ? numberMatch[1] : null
    };
}

// Helper function to parse and save salary
async function parseAndSaveSalary(message, userId, senderNumber) {
    const parsed = parseEvcSalaryMessage(message);
    const { lacag, magaca, number } = parsed;

    if (!lacag || lacag <= 0) {
        console.log('❌ Salary parse failed - no amount found:', message);
        return { error: 'Could not detect salary amount from SMS' };
    }

    if (!magaca) {
        console.log('❌ Salary parse failed - no recipient name found:', message);
        return { error: 'Could not detect recipient name from SMS' };
    }

    const salary = new Salary({
        userId: userId,
        magaca: magaca.trim(),
        number: number || senderNumber,
        lacag: lacag,
        taariikh: new Date()
    });
    await salary.save();
    console.log(`✅ EVC Salary saved: ${magaca} - $${lacag}`);
    return { type: 'salary', magaca, lacag, number };
}

// Helper function to parse and save expense
async function parseAndSaveExpense(message, userId) {
    const words = message.split(' ');
    let magaca = '';
    let lacag = 0;
    let quantity = 1;
    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        if (!isNaN(parseFloat(word)) && isFinite(word)) {
            if (lacag === 0) {
                lacag = parseFloat(word);
            } else {
                quantity = parseFloat(word);
            }
        } else if (word.toLowerCase() !== 'expense' && word.toLowerCase() !== 'kharash') {
            if (magaca === '') {
                magaca = word;
            } else {
                magaca += ' ' + word;
            }
        }
    }
    if (magaca && lacag > 0) {
        const expense = new Expense({
            userId: userId,
            magaca: magaca.trim(),
            lacag: lacag,
            quantity: quantity,
            taariikh: new Date(),
            description: 'Auto-imported from SMS'
        });
        await expense.save();
        console.log(`✅ Expense saved: ${magaca} - $${lacag} x ${quantity}`);
        return { type: 'expense', magaca, lacag, quantity };
    }
    return null;
}

// Test endpoint
router.get('/test', (req, res) => {
    res.json({ 
        success: true, 
        message: 'SMS Webhook is working!',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
