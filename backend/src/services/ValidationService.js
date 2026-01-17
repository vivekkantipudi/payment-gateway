class ValidationService {
    // VPA must match standard UPI format: ^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$
    static validateVPA(vpa) {
        const vpaRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
        return vpaRegex.test(vpa);
    }

    // Standard Luhn Algorithm for validating credit/debit card numbers
    static validateCardNumber(number) {
        let cleaned = number.replace(/\D/g, '');
        if (cleaned.length < 13 || cleaned.length > 19) return false;

        let sum = 0;
        let shouldDouble = false;
        
        for (let i = cleaned.length - 1; i >= 0; i--) {
            let digit = parseInt(cleaned.charAt(i));
            if (shouldDouble) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }
            sum += digit;
            shouldDouble = !shouldDouble;
        }
        return (sum % 10) === 0;
    }

    static detectCardNetwork(number) {
        const cleaned = number.replace(/\D/g, '');
        if (cleaned.startsWith('4')) return 'visa';
        if (/^5[1-5]/.test(cleaned)) return 'mastercard';
        if (/^3[47]/.test(cleaned)) return 'amex';
        if (/^(60|65|81|82|83|84|85|86|87|88|89)/.test(cleaned)) return 'rupay';
        return 'unknown';
    }
}

module.exports = ValidationService;