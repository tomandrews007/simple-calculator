const display = document.getElementById("display");
let current = "0";
let previous = null;
let operator = null;
let resetOnNext = false;

function render() {
  display.value = current.length > 15 ? Number(current).toExponential(6) : current;
}

function inputDigit(d) {
  if (resetOnNext) {
    current = d;
    resetOnNext = false;
  } else {
    current = current === "0" ? d : current + d;
  }
  render();
}

function inputDot() {
  if (resetOnNext) {
    current = "0.";
    resetOnNext = false;
  } else if (!current.includes(".")) {
    current += ".";
  }
  render();
}

function setOperator(op) {
  if (operator !== null && !resetOnNext) {
    calculate();
  }
  previous = current;
  operator = op;
  resetOnNext = true;
}

function calculate() {
  if (operator === null || previous === null) return;
  const a = parseFloat(previous);
  const b = parseFloat(current);
  let result;
  switch (operator) {
    case "+": result = a + b; break;
    case "-": result = a - b; break;
    case "*": result = a * b; break;
    case "/": result = b === 0 ? null : a / b; break;
    default: return;
  }
  if (result === null) {
    current = "Error";
  } else {
    current = String(parseFloat(result.toPrecision(12)));
  }
  operator = null;
  previous = null;
  resetOnNext = true;
  render();
}

function clear() {
  current = "0";
  previous = null;
  operator = null;
  resetOnNext = false;
  render();
}

function toggleSign() {
  if (current === "0" || current === "Error") return;
  current = current.startsWith("-") ? current.slice(1) : "-" + current;
  render();
}

function percent() {
  current = String(parseFloat(current) / 100);
  render();
}

document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const action = btn.dataset.action;
    if (action === "clear") clear();
    else if (action === "sign") toggleSign();
    else if (action === "percent") percent();
    else if (action === "dot") inputDot();
    else if (action === "equals") calculate();
    else if (btn.dataset.op) setOperator(btn.dataset.op);
    else if (btn.dataset.num) inputDigit(btn.dataset.num);
  });
});

document.addEventListener("keydown", (e) => {
  if (/[0-9]/.test(e.key)) inputDigit(e.key);
  else if (e.key === ".") inputDot();
  else if (e.key === "+" || e.key === "-" || e.key === "*" || e.key === "/")
    setOperator(e.key);
  else if (e.key === "Enter" || e.key === "=") { e.preventDefault(); calculate(); }
  else if (e.key === "Backspace") { clear(); }
  else if (e.key === "%") percent();
});

render();
