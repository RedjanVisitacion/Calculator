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
        
        // Listen for keyboard input - use capture phase to ensure it runs first
        document.addEventListener('keydown', (e) => {
            // Only track number keys
            if (e.key >= '0' && e.key <= '9') {
                console.log('Keyboard number pressed:', e.key);
                this.addToSecretCode(e.key);
            }
        }, true); // Use capture phase
        
        // Also add a global listener as backup
        window.addEventListener('keydown', (e) => {
            // Only track number keys
            if (e.key >= '0' && e.key <= '9') {
                console.log('Window keyboard number pressed:', e.key);
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
        
        // In love mode, generate random romantic messages
        const randomLoveMessages = [
            'I miss you 💕',
            'I love you 💖',
            'You are beautiful 💝',
            'You are my everything 💕',
            'Forever yours 💖',
            'You complete me 💝',
            'Love you forever 💕',
            'You are my soulmate 💖',
            'Together forever 💝',
            'Missing you already 💔',
            'You are my dream 💕',
            'Infinite love 💖',
            'My heart beats for you 💝',
            'Lucky to have you 💕',
            'You are perfect 💖',
            'Love at first sight 💝',
            'My happiness 💕',
            'You are my sunshine 💖',
            'Forever in love 💝',
            'You are my destiny 💕',
            'Love you to the moon and back 💖',
            'You are my everything 💝',
            'My soulmate 💕',
            'You make my heart skip a beat 💕',
            'You are my dream come true 💝',
            'My heart beats only for you 💕',
            'You are my perfect match 💖',
            'Love you more than yesterday 💝',
            'You are my reason to smile 💝',
            'Forever and always 💕',
            'You are my number one 💖',
            'We are a perfect pair 💝',
            'Three words: I love you 💕',
            'Four seasons of love 💖',
            'Five fingers, one heart 💝',
            'Six strings of love 💕',
            'Lucky number seven 💖',
            'Infinity symbol of love 💝',
            'Nine lives, one love 💕',
            'Perfect ten, perfect you 💖'
        ];
        
        // Get a random message
        const randomIndex = Math.floor(Math.random() * randomLoveMessages.length);
        const message = randomLoveMessages[randomIndex];
        
        this.currentOperand = message;
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetScreen = true;
        this.updateDisplay();
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
        // Check if currentOperand is a number or text
        if (this.loveMode && typeof this.currentOperand === 'string' && !this.isNumeric(this.currentOperand)) {
            // In love mode, display text directly with auto-resize
            this.currentOperandElement.textContent = this.currentOperand;
            this.autoResizeText();
        } else {
            // Normal mode or numeric value, use number formatting
            this.currentOperandElement.textContent = this.getDisplayNumber(this.currentOperand);
            this.resetTextSize();
        }
        
        if (this.operation != null) {
            this.previousOperandElement.textContent = 
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandElement.textContent = '';
        }
    }
    
    autoResizeText() {
        const element = this.currentOperandElement;
        const text = element.textContent;
        
        // Reset to default size first
        element.style.fontSize = '36px';
        
        // Get the container dimensions
        const containerWidth = element.offsetWidth;
        const containerHeight = element.offsetHeight;
        
        // Start with default font size
        let fontSize = 36;
        const minFontSize = 12; // Minimum font size
        
        // Reduce font size until text fits
        while (fontSize > minFontSize) {
            element.style.fontSize = fontSize + 'px';
            
            // Check if text fits within container
            if (element.scrollWidth <= containerWidth && element.scrollHeight <= containerHeight) {
                break;
            }
            
            fontSize -= 2; // Reduce font size by 2px each iteration
        }
        
        // Ensure minimum font size
        if (fontSize < minFontSize) {
            fontSize = minFontSize;
        }
        
        element.style.fontSize = fontSize + 'px';
        console.log(`Text resized to ${fontSize}px for: "${text}"`);
    }
    
    resetTextSize() {
        // Reset to default size for numbers
        this.currentOperandElement.style.fontSize = '36px';
    }
    
    isNumeric(value) {
        return !isNaN(value) && !isNaN(parseFloat(value));
    }
}

// Initialize calculator when page loads
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
}); 