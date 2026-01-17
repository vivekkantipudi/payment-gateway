const crypto = require('crypto');

const generateId = (prefix) => {
    // Generates 16 alphanumeric characters using cryptographically secure random values
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 16; i++) {
        result += chars.charAt(crypto.randomInt(0, chars.length));
    }
    return `${prefix}${result}`;
};

module.exports = { generateId };