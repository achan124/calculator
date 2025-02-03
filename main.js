'use strict';

const calculator = document.querySelector('.buttonsContainer');
const numbers = document.querySelector('.numbers');

calculator.addEventListener('click', e => {

    // initialized previous key type if exists
    const previousKeyType = calculator.dataset.previousKeyType;

    if (e.target.matches('button')) {

        // saves button and action
        const key = e.target;
        const action = key.dataset.action;

        // if there was an operator pressed previously, removes pressed styling
        Array.from(calculator.querySelectorAll('button'))
            .forEach(b => {
                b.classList.remove('is-depressed');
        });

        // 1. Number is pressed
        if (!action) {

            // restarts with new number in cases: (0 <- 0) (num after operator)
            if (numbers.textContent === '0' || previousKeyType === 'operator') {
                numbers.textContent = e.target.textContent;

            // appends number to current
            } else {
                numbers.textContent += e.target.textContent;
            }
            calculator.dataset.previousKeyType = 'number';

        // 2. CE is pressed -> resets display
        } else if (action === 'clear'){
            numbers.textContent = '0';
            calculator.dataset.previousKeyType = 'clear';

        // 3. Decimal is pressed -> no (..) or (operation <- .)
        } else if (action === 'decimal') {
            if (previousKeyType === 'operator') {
                numbers.textContent = '0';
            } else if (!numbers.textContent.includes('.')) {
                numbers.textContent += ".";
            }
            calculator.dataset.previousKeyType = 'decimal';

        // 4. Operation is pressed
        } else if (action === 'add' || 
                   action === 'subtract' || 
                   action === 'multiply' || 
                   action === 'divide') {

            // saves values and operator for calculation
            const valueOne = calculator.dataset.valueOne;
            const selectedOperator = calculator.dataset.selectedOperator;
            const valueTwo = numbers.textContent;

            // only calculates if two values have been entered with an operater between
            // prevents pressing operator multiple times to continue calculating
            if (valueOne && selectedOperator && previousKeyType != 'operator') {
                const calcValue = calculate(valueOne, selectedOperator, valueTwo);

                // assigns calculated value as to first value and displays
                numbers.textContent = calcValue;
                calculator.dataset.valueOne = calcValue;
            } else {

                // in the case that this was the first operator pressed
                // assigns first number as value one
                calculator.dataset.valueOne = numbers.textContent;
            }

            // adds styling to pressed operator buttons
            key.classList.add('is-depressed');
            calculator.dataset.previousKeyType = 'operator';
            calculator.dataset.selectedOperator = action; 
            
        // 5. Calculate is pressed
        } else if (action === 'calculate') {
            const valueOne = calculator.dataset.valueOne;
            const selectedOperator = calculator.dataset.selectedOperator;
            const valueTwo = numbers.textContent;

            // if valueOne is set, then we know that an operator has been pressed
            if (valueOne) {
                numbers.textContent = calculate(valueOne, selectedOperator, valueTwo);
            }
            calculator.dataset.previousKeyType = 'calculate';
        }
    }
});

// function to do calculations
const calculate = (v1, operator, v2) => {
    let result = '';
    if (operator === 'add') {
        result = parseFloat(v1) + parseFloat(v2);
    } else if (operator === 'subtract') {
        result = parseFloat(v1) - parseFloat(v2);
    } else if (operator === 'multiply') {
        result = parseFloat(v1) * parseFloat(v2);
    } else if (operator === 'divide') {
        result = parseFloat(v1) / parseFloat(v2);
    }

    console.log('result: ' + result);
    return result;
}