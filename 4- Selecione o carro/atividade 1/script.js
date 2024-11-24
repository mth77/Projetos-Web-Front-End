let carRed = document.getElementById("red");
let carWhite = document.getElementById("white");
let btnCarRed = document.getElementById("vermelho");
let btnCarWhite = document.getElementById("branco");
let carSelecionado = document.getElementById("result");
let btnAcelerar = document.getElementById("acelerar");
let btnResetar = document.getElementById("resetar");
let btnDesacelerar = document.getElementById("desacelerar");
let container = document.getElementsByClassName("container")[0];
let carAtual = null;
let scaleRed = 1;
let scaleWhite = 1;

function VermelhoSelecionado() {
    carSelecionado.innerHTML = "Vermelho";
    container.style.backgroundColor = "red";
    container.style.border = "1px solid white";
    carWhite.style.filter = "none";
    carRed.style.filter = "none";
    carAtual = carRed;
    applyScale(scaleRed);
    resetButtons();
}

function BrancoSelecionado() {
    carSelecionado.innerHTML = "Branco";
    container.style.backgroundColor = "white";
    container.style.border = "1px solid black";
    carRed.style.filter = "none";
    carWhite.style.filter = "none";
    carAtual = carWhite;
    applyScale(scaleWhite);
    resetButtons();
}

function Acelerar() {
    if (carAtual === carRed && scaleRed < 2) {
        scaleRed += 0.1;
        carRed.style.transform = `scale(${scaleRed})`;
    } else if (carAtual === carWhite && scaleWhite < 2) {
        scaleWhite += 0.1;
        carWhite.style.transform = `scale(${scaleWhite})`;
    }
}

function Desacelerar() {
    if (carAtual === carRed && scaleRed > 0.5) {
        scaleRed -= 0.1;
        carRed.style.transform = `scale(${scaleRed})`;
    } else if (carAtual === carWhite && scaleWhite > 0.5) {
        scaleWhite -= 0.1;
        carWhite.style.transform = `scale(${scaleWhite})`;
    }
}

function Resetar() {
    if (carAtual === carRed) {
        scaleRed = 1;
        carRed.style.transform = `scale(${scaleRed})`;
    } else if (carAtual === carWhite) {
        scaleWhite = 1;
        carWhite.style.transform = `scale(${scaleWhite})`;
    }
}

function applyScale(scale) {
    if (carAtual) {
        carAtual.style.transform = `scale(${scale})`;
    }
}

function resetButtons() {
    btnAcelerar.style.display = "flex";
    btnDesacelerar.style.display = "flex";
    btnResetar.style.display = "flex";
}

function controleTeclado(event) {
    if (event.key === "ArrowUp") {
        Acelerar();
    } else if (event.key === "ArrowDown") {
        Desacelerar();
    }
}

carRed.addEventListener("click", VermelhoSelecionado);
btnCarRed.addEventListener("click", VermelhoSelecionado);
carWhite.addEventListener("click", BrancoSelecionado);
btnCarWhite.addEventListener("click", BrancoSelecionado);
btnResetar.addEventListener("click", Resetar);
btnAcelerar.addEventListener("click", Acelerar);
btnDesacelerar.addEventListener("click", Desacelerar);
document.addEventListener("keydown", controleTeclado);
