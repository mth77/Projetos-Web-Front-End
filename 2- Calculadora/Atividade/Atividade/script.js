let currentInput = "";
let previousInput = "";
let operator = "";

function updateDisplay() {
    document.getElementById("display").innerText = currentInput || previousInput || "0";
}

function handleNumber(number) {
    currentInput += number;
    updateDisplay();
}

function handleOperator(op) {
    if (currentInput === "") return;
    if (previousInput !== "") calculate();
    operator = op;
    previousInput = currentInput;
    currentInput = "";
    updateDisplay();
}

function calculate() {
    if (previousInput === "" || currentInput === "" || operator === "") return;

    let expression = previousInput + operator + currentInput;

    try {
        currentInput = eval(expression).toString();
    } catch (error) {
        currentInput = "Erro";
    }

    operator = "";
    previousInput = "";
    updateDisplay();
}

function clear() {
    currentInput = "";
    previousInput = "";
    operator = "";
    updateDisplay();
}

function backspace() {
    currentInput = currentInput.slice(0, -1);
    updateDisplay();
}

document.querySelectorAll(".btn").forEach(button => {
    button.addEventListener("click", () => {
        const btnText = button.innerText;

        if (btnText === "C") clear();
        else if (btnText === "<") backspace();
        else if (btnText === "=") calculate();
        else if (["+", "-", "x", "/"].includes(btnText)) handleOperator(btnText === "x" ? "*" : btnText);
        else handleNumber(btnText);
    });
});
