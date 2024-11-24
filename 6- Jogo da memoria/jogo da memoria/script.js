const IndicadorCartas = [
    { img: 'midia/mater.jpg', id: 1 }, //0
    { img: 'midia/Hudson.jpg', id: 2 }, //1
    { img: 'midia/mcqueen.png', id: 3 }, //2
    { img: 'midia/mater.jpg', id: 1 }, //3
    { img: 'midia/Hudson.jpg', id: 2 }, //4 
    { img: 'midia/mcqueen.png', id: 3 } //5 
];

let cartasViradas = [];
let tentativas = 0;
let paresEncontrados = 0;
let estaVirando = false;

const cartas = document.querySelectorAll('.carta');
const mensagem = document.getElementById('mensagem');
const displayTentativa = document.getElementById('tentativas');
const botaoReset = document.getElementById('botaoReset');

function embaralharCartas() {
    for (let i = IndicadorCartas.length - 1; i > 0; i--) {
        const m = Math.floor(Math.random() * (i + 1));
        [IndicadorCartas[i], IndicadorCartas[m]] = [IndicadorCartas[m], IndicadorCartas[i]];
    }
}

function playGame() {
    embaralharCartas();

    cartasViradas = [];
    paresEncontrados = 0;
    tentativas = 0;

    displayTentativa.textContent = tentativas;
    mensagem.textContent = 'Encontre todos os pares!';

    cartas.forEach((carta) => {
        carta.classList.remove('flip', 'acertou');
        carta.style.backgroundImage = 'none';
        carta.removeEventListener('click', virarCarta);
    });

    IndicadorCartas.forEach((_, indice) => {
        cartas[indice].addEventListener('click', () => virarCarta(indice));
        cartas[indice].dataset.id = IndicadorCartas[indice].id;
    });

    if (localStorage.getItem('tentativasDoJogo')) {
        const tentativasSalvas = JSON.parse(localStorage.getItem('tentativasDoJogo'));
        tentativasSalvas.push({ rodada: Date.now(), tentativas: 0 });

        localStorage.setItem('tentativasDoJogo', JSON.stringify(tentativasSalvas));
    } else {
        localStorage.setItem('tentativasDoJogo', JSON.stringify([{ rodada: Date.now(), tentativas: 0 }]));
    }
}


function virarCarta(indice) {
    if (estaVirando || cartas[indice].classList.contains('flip')) return;

    cartas[indice].classList.add('flip');
    cartas[indice].style.backgroundImage = `url(${IndicadorCartas[indice].img})`;
    cartasViradas.push(indice); 

    if (cartasViradas.length === 2) {
        estaVirando = true;

        setTimeout(() => {
            verificarPar();
            estaVirando = false;
        }, 1000);
    }
}

function verificarPar() {
    const [primeiroId, segundoId] = cartasViradas;

    if (IndicadorCartas[primeiroId].id === IndicadorCartas[segundoId].id) {
        paresEncontrados++;

        cartas[primeiroId].classList.add('acertou');
        cartas[segundoId].classList.add('acertou');

        if (paresEncontrados === IndicadorCartas.length / 2) {
            mensagem.textContent = 'PARABÉNS! Você encontrou todos os pares!';
        }
    } else {
        setTimeout(() => {
            cartas[primeiroId].classList.remove('flip');
            cartas[primeiroId].style.backgroundImage = 'none';
            cartas[segundoId].classList.remove('flip');
            cartas[segundoId].style.backgroundImage = 'none';
        }, 1000);
    }

    cartasViradas = [];
    tentativas++;

    displayTentativa.textContent = tentativas;

    const tentativasSalvas = JSON.parse(localStorage.getItem('tentativasDoJogo'));
    tentativasSalvas[tentativasSalvas.length - 1].tentativas = tentativas;
    localStorage.setItem('tentativasDoJogo', JSON.stringify(tentativasSalvas));
}

botaoReset.addEventListener('click', () => {
    playGame();
});

playGame();
