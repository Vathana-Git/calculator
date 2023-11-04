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

function operate(operation) {
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
  let decimalPlaces = Math.min(10 - String(Math.round(result)).length, 9);
  return Math.round((result + Number.EPSILON) * Number("1" + "0".repeat(decimalPlaces))) / Number("1" + "0".repeat(decimalPlaces));
}

// ---

// EVENTS

function addEvents() {

  const digitButtons = document.querySelectorAll(".buttons-row div");
  
  digitButtons.forEach((button) => {

    let clickFunction;

    if (!isNaN(button.textContent)) {
      clickFunction = () => {
        if (isWaitingForOperand) {
          operandDiv.textContent = button.textContent;
          isWaitingForOperand = false;
        } else if (operandDiv.textContent === "0") {
            operandDiv.textContent = button.textContent;
        } else if (operandDiv.textContent.length < 10) {
            operandDiv.textContent += button.textContent;
        }
      };
    } else if (button.textContent === ".") {
      clickFunction = () => {
        if (isWaitingForOperand) {
          operandDiv.textContent = "0.";
          isWaitingForOperand = false;
        } else if (!operandDiv.textContent.includes(".")) {
          operandDiv.textContent += ".";
        }
      };
    } else if ("+-x/".includes(button.textContent)) {
      clickFunction = () => {
        if (operandDiv.textContent === "ERROR") return;
        if (isLockedInFirstOperand && !isWaitingForOperand) {
          secondOperand = operandDiv.textContent;
          if (secondOperand === "0" && currentOperator === "/") {
            operandDiv.textContent = "ERROR";
            operatorDiv.textContent = "";
            isWaitingForOperand = true;
            isLockedInFirstOperand = false;
            return;
          } else {
            operandDiv.textContent = operate(currentOperator);
          }
        }
        operatorDiv.textContent = button.textContent;
        currentOperator = button.textContent;
        firstOperand = operandDiv.textContent;
        isLockedInFirstOperand = true;
        isWaitingForOperand = true;
      };
    } else if (button.textContent === "=") {
      clickFunction = () => {
        if (isLockedInFirstOperand && !isWaitingForOperand) {
          secondOperand = operandDiv.textContent;
          if (secondOperand === "0" && currentOperator === "/") {
            operandDiv.textContent = "ERROR";
          } else {
            operandDiv.textContent = operate(currentOperator);
          }
          operatorDiv.textContent = currentOperator = "";
          isWaitingForOperand = true;
          isLockedInFirstOperand = false;
        }
      };
    } else if (button.textContent === "+/-") {
      clickFunction = () => {
        if (!isWaitingForOperand) {
          if (Number(operandDiv.textContent) > 0) {
            operandDiv.textContent = "-" + operandDiv.textContent
          } else {
            if (operandDiv.textContent[0] === "-") {
              operandDiv.textContent = operandDiv.textContent.slice(1);
            }
          }
          if(isLockedInFirstOperand) {
            firstOperand = operandDiv.textContent;
          }
        }
      }
    } else if (button.textContent === "C") {
      clickFunction = () => {
        if (operandDiv.textContent === "ERROR") {
          let acButton = document.evaluate("//div[@class = 'buttons-row']//div[text() = 'AC']", document)
          acButton.iterateNext().click();
        } else {
          operandDiv.textContent = "0";
        }
      };
    } else if (button.textContent === "AC") {
      clickFunction = () => {
        operatorDiv.textContent = "";
        operandDiv.textContent = "0";
        isWaitingForOperand = true;
        isLockedInFirstOperand = false;
        currentOperator = "";
      };
    } else if (button.textContent === "<") {
      clickFunction = () => {
        if(!isWaitingForOperand) {
          if (operandDiv.textContent >= 10 || operandDiv.textContent <= -10 || operandDiv.textContent.includes("."))  {
            operandDiv.textContent = operandDiv.textContent.slice(0, operandDiv.textContent.length - 1);
          } else {
            operandDiv.textContent = 0;
          }
        }
      }
    }

    button.addEventListener("click", clickFunction);

  });  

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
      find = "<";
    } else if (e.key ==="`") {
      find = "+/-";
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