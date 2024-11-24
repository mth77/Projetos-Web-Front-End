let numeroSecreto = Math.floor(Math.random() * 20) + 1;
let chances = 10;

const jogarBtn = document.getElementById("jogar");
const jogarNovamenteBtn = document.getElementById("jogarNovamente");
const chuteInput = document.getElementById("chute");
const mensagem = document.getElementById("mensagem");
const chancesDisplay = document.getElementById("chances");

function atualizarMensagem(texto) {
    mensagem.innerText = texto;
}

function fimDeJogo(resultado) {
    if (resultado === "ganhou") {
        atualizarMensagem("Parabéns! Você acertou o número!");
    } else {
        atualizarMensagem(`Você perdeu! O número era ${numeroSecreto}.`)
        chancesDisplay.innerText = chances
    }
    jogarBtn.disabled = true;
    jogarNovamenteBtn.style.display = "inline";
}

jogarBtn.addEventListener("click", function () {
    let palpite = Number(chuteInput.value);
    
    if (palpite < 1 || palpite > 20 || isNaN(palpite)) {
        atualizarMensagem("Por favor, insira um número entre 1 e 20.");
        return;
    }

    chances--;

    if (palpite === numeroSecreto) {
        fimDeJogo("ganhou");
    } else {
        if (chances > 0) {
            if (palpite < numeroSecreto) {
                atualizarMensagem("O número secreto é maior!");
            } else {
                atualizarMensagem("O número secreto é menor!");
            }
            chancesDisplay.innerText = chances;
        } else {
            fimDeJogo("perdeu");
        }
    }
});

jogarNovamenteBtn.addEventListener("click", function () {
    numeroSecreto = Math.floor(Math.random() * 20) + 1;
    chances = 10;
    chuteInput.value = '';
    atualizarMensagem('');
    chancesDisplay.innerText = chances;
    jogarBtn.disabled = false;
    jogarNovamenteBtn.style.display = "none";
    document.body.style.backgroundColor = ""; // Reseta a cor de fundo
});