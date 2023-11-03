// MATH

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  return a / b;
}

function applyOperation(operation) {
  let operationFunction;
  if (operation === "+") {
    operationFunction = add;
  } else if (operation === "-") {
    operationFunction = subtract;
  } else if (operation === "x") {
    operationFunction = multiply;
  } else if (operation === "/") {
    operationFunction = divide;
  }
  let result = operationFunction(Number(firstOperand), Number(secondOperand));
  let decimalPlaces = 10 - String(Math.round(result)).length;
  decimalPlaces = Math.min(decimalPlaces, 9);
  return Math.round((result + Number.EPSILON) * Number("1" + "0".repeat(decimalPlaces))) / Number("1" + "0".repeat(decimalPlaces));
}

// ---

// EVENTS

function addButtonEvents() {

  const digitButtons = document.querySelectorAll(".buttons-row div");
  
  digitButtons.forEach((button) => {

    if (!isNaN(button.textContent)) {
      button.addEventListener("click", () => {
        if (isWaitingForOperand) {
          operandDiv.textContent = button.textContent;
          isWaitingForOperand = false;
        } else if (operandDiv.textContent === "0") {
            operandDiv.textContent = button.textContent;
        } else if (operandDiv.textContent.length < 10) {
            operandDiv.textContent += button.textContent;
        }
      });
    } else if (button.textContent === ".") {
      button.addEventListener("click", () => {
        if (!isWaitingForOperand) {
          operandDiv.textContent = "0.";
        } else if (!operandDiv.textContent.includes(".")) {
          operandDiv.textContent += ".";
        }
      });
    } else if ("+-x/".includes(button.textContent)) {
      button.addEventListener("click", () => {
        if (isLockedInFirstOperand && !isWaitingForOperand) {
          secondOperand = operandDiv.textContent;
          operandDiv.textContent = applyOperation(currentOperator);
        }
        operatorDiv.textContent = button.textContent;
        currentOperator = button.textContent;
        firstOperand = operandDiv.textContent;
        isLockedInFirstOperand = true;
        isWaitingForOperand = true;
      });
    } else if (button.textContent === "=") {
      button.addEventListener("click", () => {
        if (isLockedInFirstOperand && !isWaitingForOperand) {
          secondOperand = operandDiv.textContent;
          operandDiv.textContent = applyOperation(currentOperator);
          operatorDiv.textContent = currentOperator = "";
          isWaitingForOperand = true;
          isLockedInFirstOperand = false;
        }
      });
    } else if (button.textContent === "C") {
      button.addEventListener("click", () => {
        operandDiv.textContent = "0";
      });
    } else if (button.textContent === "AC") {
      button.addEventListener("click", () => {
        operatorDiv.textContent = "";
        operandDiv.textContent = "0";
        isWaitingForOperand = true;
        isLockedInFirstOperand = false;
        currentOperator = "";
      });
    }
  });

}

function addEvents() {

  addButtonEvents();

  document.addEventListener("keyup", (e) => {

    let find = e.key;

    if (e.key === "*") {
      let button = document.evaluate("//div[@class = 'buttons-row']//div[text() = 'x']", document);
      button.iterateNext().click();
    } else if (e.key === "Enter") {
      find = "=";
    } else if (e.key === "Escape") {
      find = "AC";
    } else if (e.key === "Backspace") {
      find = "C";
    }

    let button = document.evaluate(`//div[@class = 'buttons-row']//div[text() = '${find}']`, document);
    button = button.iterateNext();
    if (button != null) {
      button.click();
    }

  });

}

// ---

// Staring Point

let firstOperand, secondOperand, currentOperator;

let isWaitingForOperand;
let isLockedInFirstOperand;

const operatorDiv = document.querySelector(".operator");
const operandDiv = document.querySelector(".operand");

addEvents();