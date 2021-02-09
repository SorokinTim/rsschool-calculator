let digitsArray = document.querySelectorAll("[data-btn-digit]");
let operationsArray = document.querySelectorAll("[data-btn-operation]");
(let = currentOperand = document.getElementById("current-operand")),
  (previousOperand = document.getElementById("previous-operand"));
let allClear = document.getElementById("all-clear");
let previousClear = document.getElementById("previous-clear");
let point = document.getElementById("point");
let root = document.getElementById("root");
let pow = document.getElementById("pow");
let sum = document.getElementById("sum");

let resultArray = currentOperand.innerText.split("");

digitsArray.forEach((item) => {
  item.addEventListener("click", (e) => {
    addValueToScreen(item.value);
  });
});

operationsArray.forEach((item) => {
  item.addEventListener("click", (e) => {
    addValueToScreen(item.value);
  });
});

allClear.addEventListener("click", (e) => {
  clearAll();
});

previousClear.addEventListener("click", (e) => {
  clearPreviousValue();
});

root.addEventListener("click", (e) => {
  addValueToScreen(root.value);
});

pow.addEventListener("click", (e) => {
  addValueToScreen(pow.value);
});

point.addEventListener("click", (e) => {
  addValueToScreen(point.value);
});

sum.addEventListener("click", (e) => {
  getResult();
});

function getArrayWithOperations(str = "") {
  let arr = str.split(/([*\-+/])/g);
  arr = getRootedArr(arr);
  arr = getPowedArr(arr);
  arr.forEach((item, i) => {
    return item == "" ? arr.splice(i, 1) : item;
  });
  return arr;
}

function getSumOfArray(arr = []) {
  let result = arr;
  for (var i = 0; i < result.length; i++) {
    let temp = 0;
    switch (result[i]) {
      case "*":
        if (/[\-]/.test(result[i - 2]) && /[\-]/.test(result[i + 1])) {
          temp = -result[i - 1] * -result[i + 2];
          result.splice(i - 2, 5, temp);
          i = 0;
        } else if (/[\-]/.test(result[i - 2]) && !/[\-]/.test(result[i + 1])) {
          temp = -result[i - 1] * +result[i + 1];
          result.splice(i - 2, 4, temp);
          i = 0;
        } else if (!/[\-]/.test(result[i - 2]) && /[\-]/.test(result[i + 1])) {
          temp = +result[i - 1] * -result[i + 2];
          result.splice(i - 1, 4, temp);
          i = 0;
        } else {
          temp = +result[i - 1] * +result[i + 1];
          result.splice(i - 1, 3, temp);
          i = 0;
        }
        break;
      case "/":
        if (/[\-]/.test(result[i - 2]) && /[\-]/.test(result[i + 1])) {
          temp = -result[i - 1] / -result[i + 2];
          result.splice(i - 2, 5, temp);
          i = 0;
        } else if (/[\-]/.test(result[i - 2]) && !/[\-]/.test(result[i + 1])) {
          temp = -result[i - 1] / result[i + 1];
          result.splice(i - 2, 4, temp);
          i = 0;
        } else if (!/[\-]/.test(result[i - 2]) && /[\-]/.test(result[i + 1])) {
          temp = -result[i + 2] / +result[i - 1];
          result.splice(i - 1, 4, temp);
          i = 0;
        } else {
          temp = +result[i - 1] / +result[i + 1];
          result.splice(i - 1, 3, temp);
          i = 0;
        }
        break;

      default:
        break;
    }
  }

  for (var i = 0; i < result.length; i++) {
    let temp = 0;
    switch (result[i]) {
      case "-":
        if (/[\-]/.test(result[i - 2])) {
          temp = -result[i - 1] + -result[i + 1];
          result.splice(i - 2, 4, temp);
          i = 0;
        } else if (result[i - 1]) {
          temp = +result[i - 1] - +result[i + 1];
          result.splice(i - 1, 3, temp);
          i = 0;
        }
        break;
      case "+":
        if (/[\-]/.test(result[i + 1]) && !/[\-]/.test(result[i - 2])) {
          temp = +result[i - 1] + -result[i + 2];
          result.splice(i - 1, 4, temp);
          i = 0;
        } else if (/[\-]/.test(result[i + 1]) && /[\-]/.test(result[i - 2])) {
          temp = -result[i - 1] + -result[i + 2];
          result.splice(i - 2, 5, temp);
          i = 0;
        } else {
          temp = +result[i - 1] + +result[i + 1];
          result.splice(i - 1, 3, temp);
          i = 0;
        }
        break;
      default:
        break;
    }
  }

  return result[0];
}

function clearAll() {
  currentOperand.innerText = "";
  previousOperand.innerText = "";
  resultArray = currentOperand.innerText.split("");
}

function clearPreviousValue() {
  resultArray = currentOperand.innerText.split("");
  resultArray.pop();
  currentOperand.innerText = resultArray.join("");
}

function getResult() {
  if (!/[\*\-\+\/\.]/.test(resultArray[resultArray.length - 1])) {
    let tempResult = getSumOfArray(
      getArrayWithOperations(currentOperand.innerText)
    );
    previousOperand.innerText = isNaN(tempResult)
      ? "Something went wrong!"
      : tempResult % 1 === 0
      ? tempResult
      : parseFloat(tempResult.toFixed(5));
  } else {
    previousOperand.innerText = "";
  }
}

function getRootedArr(arr) {
  return arr.map((item) => {
    if (/[√]/g.test(item)) {
      item = item.slice(1);
      return Math.sqrt(parseFloat(item));
    } else {
      return item;
    }
  });
}

function getPowedArr(arr) {
  for (var i = 0; i < arr.length; i++) {
    if((/[\^]/g.test(arr[i]))) {
      let result = arr[i].split(/[\^]/);
      arr[i] = Math.pow(result[0], result[1]);
      if(arr[i-1] == "-") {
        arr[i] *= -1;
        arr.splice(i-1,2,arr[i]);
      }
    }
  }
  return arr;
}

function addValueToScreen(value) {
  if (
    /[\-]/g.test(value) &&
    !/[\*\-\+\/\.]/.test(resultArray[resultArray.length - 2]) &&
    !/[\-]/.test(resultArray[resultArray.length - 1])
  ) {
    updateOperandState(value);
    updateArrayState();
  } else if (/[\+\-\*\/\.]/g.test(value)) {
    if (
      !/[\*\-\+\/\.]/.test(resultArray[resultArray.length - 1]) &&
      resultArray[0]
    ) {
      updateOperandState(value);
      updateArrayState();
    }
  } else {
    updateOperandState(value);
    updateArrayState();
  }
}

function updateArrayState() {
  return (resultArray = currentOperand.innerText.split(""));
}

function updateOperandState(value) {
  return (currentOperand.innerText += value);
}
