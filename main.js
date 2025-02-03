'use strict';

const calculator = document.querySelector('.buttonsContainer');
const numbers = document.querySelector('.numbers');

// when a button is pressed:
calculator.addEventListener('click', e => {
    if (!e.target.matches('button')) return 

    const key = e.target; // the button
    const displayedNum = numbers.textContent;

    // changes the numbers displayed on the calculator screen
    const resultString = createResultString(key, displayedNum, calculator.dataset);
    numbers.textContent = resultString;

    // updates variables and visual states
    updateCalculatorState(key, calculator, resultString, displayedNum);
    updateVisualState(key, calculator);
    
});

// creates string value to update on calculator screen
const createResultString = (key, displayedNum, state) => {
    const keyContent = key.textContent;
    const keyType = getKeyType(key);
    const {
        valueOne,
        modValue,
        selectedOperator,
        previousKeyType
    } = state;

    if (keyType === 'number') {
        if (
            displayedNum === '0' || 
            previousKeyType === 'operator' || 
            previousKeyType === 'calculate'
        ) {
            return keyContent;
        } else {
            return displayedNum + keyContent;
        }
    }

    if (keyType === 'decimal') {
        
        // resets display after pressing an operator or "="
        if (previousKeyType === 'operator' || previousKeyType === 'calculate') {
            return '0.';
        } 

        // prevents multiple decimals
        if (!displayedNum.includes('.')) {
            return displayedNum + ".";
        }
        return displayedNum;
    }

    if (keyType === 'operator') {

        // only calculates if two values have been entered
        // prevents additional calculations when pressing operator multiple times
        if (
            valueOne && 
            selectedOperator && 
            previousKeyType != 'operator'  && 
            previousKeyType != 'calculate'
        ) {
            return calculate(valueOne, selectedOperator, displayedNum);

        // if only one value has been entered, resets dispay and shows only the new num
        } else {
            return displayedNum;
        }
    }

    if (keyType === 'clear') {
        return 0;
    }

    if (keyType === 'calculate') {

        // if v1 exists, that means an operator was pressed and we can do a calculation
        // otherwise, does nothing
        if (valueOne) {

            // if "=" is pressed multiple times in a row, calcuates using the modValue
                // user enters: (2 + 3 ==)
                // 2 + 3 = 5 -> 5 stored as v1, 3 stored as v2
                // 5 + 3 = 8
            // else, this is the first time and will use values normally
            return previousKeyType === 'calculate'
                ? calculate(displayedNum, selectedOperator, modValue)
                : calculate(valueOne, selectedOperator, displayedNum)
        } else {
            return displayedNum;
        }
    }
}

// finds the keyType (data-action or "number")
const getKeyType = (key) => { 
    const { action } = key.dataset;
    if (!action) return 'number';

    // groups operations together
    if (
        action === "add" || 
        action === "subtract" || 
        action === "multiply" || 
        action === "divide"
    ) return "operator";

    return action;
}

// updates variables used in calculations
const updateCalculatorState = (key, calculator, calculatedValue, displayedNum) => {
    const keyType = getKeyType(key);
    const {
        valueOne,
        selectedOperator,
        modValue,
        previousKeyType
    } = calculator.dataset;

    // updates keyType for previously pressed button
    calculator.dataset.previousKeyType = keyType;

    if (keyType === 'operator') {
        calculator.dataset.selectedOperator = key.dataset.action; 

        // if all true, then means that calculation has been completed 
            // and updates v1 to be the calculated value
        // else keeps v1 as displayed number (eg. first time pressing operator)
        if (
            valueOne && 
            selectedOperator && 
            previousKeyType != 'operator'  && 
            previousKeyType != 'calculate'
        ) {
            calculator.dataset.valueOne = calculatedValue;
        } else {
            calculator.dataset.valueOne = displayedNum;
        }
    }

    if (keyType === 'calculate') {

        // if "=" is pressed multiple times in a row, saves modValue
            // to be used in those repeated calculations
        // else, modValue is the displayed number (v2)
        if (valueOne && previousKeyType === 'calculate') {
            calculator.dataset.modValue = modValue;
        } else {
            calculator.dataset.modValue = displayedNum;
        }
    }

    if (keyType === 'clear' && key.textContent === 'AC') { 
        calculator.dataset.valueOne = '';
        calculator.dataset.selectedOperator = '';
        calculator.dataset.modValue = '';
        calculator.dataset.previousKeyType = '';
    } 
}

// updates styling for pressed buttons and AC/CE
const updateVisualState = (key, calculator) => {
    const keyType = getKeyType(key);

    // removes all prev depressions each time a button is pressed
    Array.from(calculator.querySelectorAll('button'))
        .forEach(b => {
            b.classList.remove('is-depressed');
    });

    // adds depressions for only operators
    if (keyType === "operator") {
        key.classList.add('is-depressed');
    }

    // allows for All Clear after pressing Clear Entry
    if (keyType === 'clear' && key.textContent != 'AC') {
        key.textContent = 'AC';
    }

    // changes from All Clear to Clear Entry after something has been entered
    if (keyType !== 'clear') {
        const clearButton = calculator.querySelector('[data-action=clear]');
        clearButton.textContent = 'CE';
    }

}

// performs the calculations
const calculate = (v1, operator, v2) => {
    const valueOne = parseFloat(v1);
    const valueTwo = parseFloat(v2);
    if (operator === 'add') return valueOne + valueTwo;
    if (operator === 'subtract') return valueOne - valueTwo;
    if (operator === 'multiply') return valueOne * valueTwo;
    if (operator === 'divide') return valueOne / valueTwo;
}