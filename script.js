class Calculator {
    constructor() {
        this.previousOperand = '';
        this.currentOperand = '0';
        this.operation = undefined;
        this.shouldResetScreen = false;
        this.loveMode = false;
        
        this.previousOperandElement = document.getElementById('previous-operand');
        this.currentOperandElement = document.getElementById('current-operand');
        
        this.setupEventListeners();
        this.setupHiddenControls();
    }
    
    setupHiddenControls() {
        // Type 302409 to automatically activate love mode (works with both keyboard and calculator buttons)
        this.secretCode = '';
        this.secretCodeTimer = null;
        
        // Listen for keyboard input
        document.addEventListener('keydown', (e) => {
            // Only track number keys
            if (e.key >= '0' && e.key <= '9') {
                this.addToSecretCode(e.key);
            }
        });
    }
    
    addToSecretCode(number) {
        this.secretCode += number;
        console.log('Secret code so far:', this.secretCode);
        
        // Clear the code after 3 seconds of no input
        if (this.secretCodeTimer) {
            clearTimeout(this.secretCodeTimer);
        }
        
        this.secretCodeTimer = setTimeout(() => {
            this.secretCode = '';
        }, 3000);
        
        // Check if the secret code matches
        if (this.secretCode === '302409') {
            if (this.loveMode) {
                console.log('Secret code matched! Deactivating love mode...');
                this.deactivateLoveMode();
            } else {
                console.log('Secret code matched! Activating love mode...');
                this.activateLoveMode();
            }
            this.secretCode = ''; // Reset the code
        }
    }
    
    activateLoveMode() {
        this.loveMode = true;
        document.body.classList.add('love-mode-active');
        
        // Debug: Log that love mode is activated
        console.log('Love mode activated!', this.loveMode);
        
        // Show a brief notification that love mode is activated
        this.showLoveModeNotification();
        
        // Clear the display
        this.clear();
    }
    
    deactivateLoveMode() {
        this.loveMode = false;
        document.body.classList.remove('love-mode-active');
        
        // Debug: Log that love mode is deactivated
        console.log('Love mode deactivated!', this.loveMode);
        
        // Show a brief notification that normal mode is activated
        this.showNormalModeNotification();
        
        // Clear the display
        this.clear();
    }
    
    showLoveModeNotification() {
        // Create a temporary notification
        const notification = document.createElement('div');
        notification.textContent = '💕 Love Mode Activated! 💕';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #ff69b4, #ff1493);
            color: white;
            padding: 15px 25px;
            border-radius: 25px;
            font-weight: bold;
            font-size: 18px;
            box-shadow: 0 5px 20px rgba(255, 105, 180, 0.5);
            z-index: 1000;
            animation: slideDown 0.5s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideUp 0.5s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }, 3000);
    }
    
    showNormalModeNotification() {
        // Create a temporary notification
        const notification = document.createElement('div');
        notification.textContent = '🧮 Normal Mode Activated! 🧮';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 15px 25px;
            border-radius: 25px;
            font-weight: bold;
            font-size: 18px;
            box-shadow: 0 5px 20px rgba(102, 126, 234, 0.5);
            z-index: 1000;
            animation: slideDown 0.5s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideUp 0.5s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }, 3000);
    }
    
    setupEventListeners() {
        // Number buttons
        document.querySelectorAll('[data-number]').forEach(button => {
            button.addEventListener('click', () => {
                this.appendNumber(button.dataset.number);
            });
        });
        
        // Operator buttons
        document.querySelectorAll('[data-action]').forEach(button => {
            button.addEventListener('click', () => {
                const action = button.dataset.action;
                
                switch(action) {
                    case 'add':
                        this.chooseOperation('+');
                        break;
                    case 'subtract':
                        this.chooseOperation('-');
                        break;
                    case 'multiply':
                        this.chooseOperation('×');
                        break;
                    case 'divide':
                        this.chooseOperation('÷');
                        break;
                    case 'equals':
                        this.compute();
                        break;
                    case 'clear':
                        this.clear();
                        break;
                    case 'delete':
                        this.delete();
                        break;
                }
            });
        });
        
        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key >= '0' && e.key <= '9' || e.key === '.') {
                this.appendNumber(e.key);
            } else if (e.key === '+' || e.key === '-') {
                this.chooseOperation(e.key);
            } else if (e.key === '*') {
                this.chooseOperation('×');
            } else if (e.key === '/') {
                e.preventDefault();
                this.chooseOperation('÷');
            } else if (e.key === 'Enter' || e.key === '=') {
                this.compute();
            } else if (e.key === 'Escape') {
                this.clear();
            } else if (e.key === 'Backspace') {
                this.delete();
            }
        });
    }
    
    appendNumber(number) {
        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }
        
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
        
        // Check for secret code activation when calculator buttons are pressed
        if (number !== '.') {
            this.addToSecretCode(number);
        }
        
        this.updateDisplay();
    }
    
    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        this.shouldResetScreen = false;
        this.updateDisplay();
    }
    
    compute() {
        console.log('Compute called, love mode:', this.loveMode);
        if (this.loveMode) {
            console.log('Calling computeLoveMode');
            this.computeLoveMode();
            return;
        }
        
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    alert('Cannot divide by zero!');
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }
        
        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetScreen = true;
        this.updateDisplay();
    }
    
    computeLoveMode() {
        console.log('computeLoveMode called with:', this.previousOperand, this.operation, this.currentOperand);
        const prev = this.previousOperand;
        const current = this.currentOperand;
        const operation = this.operation;
        
        // Create a unique key for the calculation
        const calculationKey = `${prev}${operation}${current}`;
        console.log('Calculation key:', calculationKey);
        
        // Special love messages for common calculations
        const specialLoveMessages = {
            '1+1': 'I miss you 💕',
            '1+2': 'You are my everything 💖',
            '2+2': 'Forever yours 💝',
            '1×1': 'You complete me 💕',
            '2×2': 'Love you forever 💖',
            '1÷1': 'You are my soulmate 💝',
            '3+3': 'Together forever 💕',
            '1-1': 'Missing you already 💔',
            '2-1': 'You are my dream 💕',
            '5+5': 'Infinite love 💖',
            '10+10': 'My heart beats for you 💝',
            '7+7': 'Lucky to have you 💕',
            '1×10': 'You are perfect 💖',
            '2×5': 'Love at first sight 💝',
            '3×3': 'My happiness 💕'
        };
        
        // Check if it's a special calculation first
        let message = specialLoveMessages[calculationKey];
        
        if (!message) {
            // Generate romantic message based on the actual math result
            const prevNum = parseFloat(prev);
            const currentNum = parseFloat(current);
            
            if (!isNaN(prevNum) && !isNaN(currentNum)) {
                let result;
                switch (operation) {
                    case '+':
                        result = prevNum + currentNum;
                        break;
                    case '-':
                        result = prevNum - currentNum;
                        break;
                    case '×':
                        result = prevNum * currentNum;
                        break;
                    case '÷':
                        if (currentNum === 0) {
                            message = 'My heart is broken 💔';
                            break;
                        }
                        result = prevNum / currentNum;
                        break;
                }
                
                if (message) {
                    // Message already set (like division by zero)
                } else if (typeof result !== 'undefined') {
                    // Generate message based on the result
                    message = this.generateLoveMessageFromResult(result, prevNum, currentNum, operation);
                } else {
                    // Fallback to random romantic message
                    message = this.getRandomLoveMessage();
                }
            } else {
                // Fallback to random romantic message
                message = this.getRandomLoveMessage();
            }
        }
        
        this.currentOperand = message;
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetScreen = true;
        this.updateDisplay();
    }
    
    generateLoveMessageFromResult(result, num1, num2, operation) {
        // Messages based on result values
        if (result === 0) {
            return 'You are my zero, my beginning 💕';
        } else if (result === 1) {
            return 'You are my number one 💖';
        } else if (result === 2) {
            return 'We are a perfect pair 💝';
        } else if (result === 3) {
            return 'Three words: I love you 💕';
        } else if (result === 4) {
            return 'Four seasons of love 💖';
        } else if (result === 5) {
            return 'Five fingers, one heart 💝';
        } else if (result === 6) {
            return 'Six strings of love 💕';
        } else if (result === 7) {
            return 'Lucky number seven 💖';
        } else if (result === 8) {
            return 'Infinity symbol of love 💝';
        } else if (result === 9) {
            return 'Nine lives, one love 💕';
        } else if (result === 10) {
            return 'Perfect ten, perfect you 💖';
        } else if (result > 100) {
            return 'Love beyond numbers 💝';
        } else if (result < 0) {
            return 'Negative numbers, positive love 💕';
        } else if (result % 2 === 0) {
            return 'Even numbers, odd love 💖';
        } else if (result % 2 === 1) {
            return 'Odd numbers, even love 💝';
        } else if (result.toString().includes('.')) {
            return 'Decimal love, infinite heart 💕';
        } else {
            return `Love equals ${result} 💖`;
        }
    }
    
    getRandomLoveMessage() {
        const randomMessages = [
            'You are beautiful 💕',
            'I love you 💖',
            'You are amazing 💝',
            'My heart belongs to you 💕',
            'You are my sunshine 💖',
            'Forever in love 💝',
            'You are my destiny 💕',
            'Love you to the moon and back 💖',
            'You are my everything 💝',
            'My soulmate 💕',
            'You make my heart skip a beat 💕',
            'Love at first sight 💖',
            'You are my dream come true 💝',
            'My heart beats only for you 💕',
            'You are my perfect match 💖',
            'Love you more than yesterday 💝',
            'You are my happiness 💕',
            'My love for you is endless 💖',
            'You are my reason to smile 💝',
            'Forever and always 💕'
        ];
        return randomMessages[Math.floor(Math.random() * randomMessages.length)];
    }
    
    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
        this.updateDisplay();
    }
    
    delete() {
        if (this.currentOperand === '0') return;
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') {
            this.currentOperand = '0';
        }
        this.updateDisplay();
    }
    
    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }
    
    updateDisplay() {
        this.currentOperandElement.textContent = this.getDisplayNumber(this.currentOperand);
        
        if (this.operation != null) {
            this.previousOperandElement.textContent = 
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandElement.textContent = '';
        }
    }
}

// Initialize calculator when page loads
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
}); 