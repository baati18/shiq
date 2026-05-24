const twilio = require('twilio');

const client = process.env.SMS_MODE === 'real'
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

const sendSMS = async (toNumber, message, type = 'salary') => {
  const cleanNumber = toNumber.replace(/\D/g, '');
  let formattedNumber = cleanNumber;
  if (cleanNumber.startsWith('0')) {
    formattedNumber = '+252' + cleanNumber.substring(1);
  } else if (!cleanNumber.startsWith('+')) {
    formattedNumber = '+' + cleanNumber;
  }

  if (process.env.SMS_MODE === 'real' && client) {
    try {
      const sms = await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: formattedNumber
      });
      return { success: true, sid: sms.sid };
    } catch (error) {
      return { success: false, error: error.message };
    }
  } else {
    // Simulation mode
    console.log('=== SENDING SMS (SIMULATION) ===');
    console.log('To:', formattedNumber);
    console.log('Message:', message);
    return { success: true, simulated: true };
  }
};

const generateSalaryMessage = (salaryData) => (
  `💵 Salary Payment\nTo: ${salaryData.magaca}\nAmount: $${salaryData.lacag}\nDate: ${new Date(salaryData.taariikh).toLocaleDateString()}`
);

const generateExpenseMessage = (expenseData) => (
  `📋 Expense\nItem: ${expenseData.magaca}\nAmount: $${expenseData.lacag}\nDate: ${new Date(expenseData.taariikh).toLocaleDateString()}`
);

module.exports = { sendSMS, generateSalaryMessage, generateExpenseMessage };
