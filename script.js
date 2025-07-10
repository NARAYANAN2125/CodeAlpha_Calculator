const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

let input = '';
let resultDisplayed = false;

const operators = {
  add: '+',
  subtract: '-',
  multiply: '*',
  divide: '/'
};

function updateDisplay(value) {
  display.textContent = value || '0';
}

function calculate(expr) {
  try {
    // Replace unicode operators with JS equivalents
    expr = expr.replace(/÷/g, '/').replace(/×/g, '*').replace(/−/g, '-');
    // Remove invalid trailing operator
    expr = expr.replace(/[+\-*/.]$/, '');
    // Evaluate
    // eslint-disable-next-line no-eval
    let evalResult = Function('return ' + expr)();
    if (evalResult === undefined || isNaN(evalResult)) return '';
    return evalResult;
  } catch {
    return '';
  }
}

function appendInput(val) {
  if (resultDisplayed && /[0-9.]/.test(val)) {
    input = '';
    resultDisplayed = false;
  }
  if (val === '.' && /[.][^+\-*/]*$/.test(input)) return; // Prevent multiple decimals in a number
  input += val;
  updateDisplay(input);
}

function handleOperator(op) {
  if (!input) return;
  if (/[+\-*/.]$/.test(input)) {
    input = input.slice(0, -1);
  }
  input += op;
  resultDisplayed = false;
  updateDisplay(input);
}

function handleEquals() {
  const res = calculate(input);
  if (res !== '' && res !== undefined) {
    updateDisplay(res);
    input = res.toString();
    resultDisplayed = true;
  }
}

function handleClear() {
  input = '';
  updateDisplay('0');
  resultDisplayed = false;
}

function handleBackspace() {
  if (input.length > 0) {
    input = input.slice(0, -1);
    updateDisplay(input);
  }
}

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.dataset.digit !== undefined) {
      appendInput(btn.dataset.digit);
    } else if (btn.dataset.action) {
      switch (btn.dataset.action) {
        case 'add': handleOperator('+'); break;
        case 'subtract': handleOperator('-'); break;
        case 'multiply': handleOperator('*'); break;
        case 'divide': handleOperator('/'); break;
        case 'decimal': appendInput('.'); break;
        case 'clear': handleClear(); break;
        case 'backspace': handleBackspace(); break;
        case 'equals': handleEquals(); break;
      }
    }
  });
});

// Keyboard support
window.addEventListener('keydown', (e) => {
  if (e.ctrlKey || e.metaKey) return;
  if (e.key >= '0' && e.key <= '9') {
    appendInput(e.key);
  } else if (e.key === '.') {
    appendInput('.');
  } else if (e.key === '+' || e.key === '-') {
    handleOperator(e.key);
  } else if (e.key === '*' || e.key === 'x' || e.key === 'X') {
    handleOperator('*');
  } else if (e.key === '/' || e.key === '÷') {
    handleOperator('/');
  } else if (e.key === 'Enter' || e.key === '=') {
    handleEquals();
    e.preventDefault();
  } else if (e.key === 'Backspace') {
    handleBackspace();
    e.preventDefault();
  } else if (e.key === 'Delete') {
    handleClear();
    e.preventDefault();
  }
});

display.addEventListener('focus', () => {
  display.blur();
}); 