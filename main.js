'use strict';

const calculator = document.querySelector('.buttonsContainer');
const numbers = document.querySelector('.numbers');

calculator.addEventListener('click', function(e) {
    if (e.target.textContent == 'AC') {
        numbers.textContent = '0';
    } else if (e.target.classList.contains('button') && e.target.textContent != "<3") {
        const buttonText = e.target.textContent;
        if (numbers.textContent == '0') {
            if (e.target.textContent == '.') {
                numbers.textContent += buttonText 
            } else {
                numbers.textContent = buttonText;
            }
        } else { 
            numbers.textContent += buttonText;
        }
    }
})
