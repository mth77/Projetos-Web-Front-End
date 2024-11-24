// Funções principais
function inicializarKanban() {
    carregarTarefasSalvas();
    configurarEventos();
}

function configurarEventos() {
    const botaoAdicionar = document.getElementById('botaoAdicionar');
    const entradaTarefa = document.getElementById('entradaTarefa');

    if (botaoAdicionar && entradaTarefa) {
        botaoAdicionar.addEventListener('click', () => adicionarNovaTarefa(entradaTarefa.value));
        
        entradaTarefa.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                adicionarNovaTarefa(entradaTarefa.value);
            }
        });
    }

    configurarDragAndDrop();
}

function adicionarNovaTarefa(texto) {
    const entradaTarefa = document.getElementById('entradaTarefa');
    
    if (texto.trim() !== '') {
        const cartao = criarCartaoTarefa(texto);
        
        const colunaAberto = document.querySelector('.coluna.aberto .conteudo-coluna');
        
        if (colunaAberto) {
            colunaAberto.appendChild(cartao);
            entradaTarefa.value = '';
            salvarEstadoKanban();
        }
    }
}

function criarCartaoTarefa(texto) {
    const cartao = document.createElement('div');
    cartao.className = 'cartao-tarefa aberto';
    cartao.draggable = true;
    cartao.textContent = texto;
    
    configurarEventosCartao(cartao);
    
    return cartao;
}

function configurarEventosCartao(cartao) {
    cartao.addEventListener('dragstart', (e) => {
        cartao.classList.add('arrastando');
    });

    cartao.addEventListener('dragend', () => {
        cartao.classList.remove('arrastando');
    });
}

function configurarDragAndDrop() {
    const colunas = document.querySelectorAll('.coluna .conteudo-coluna');
    
    colunas.forEach(coluna => {
        coluna.addEventListener('dragover', (e) => {
            e.preventDefault();
            coluna.parentElement.classList.add('arrastando-sobre');
        });

        coluna.addEventListener('dragleave', () => {
            coluna.parentElement.classList.remove('arrastando-sobre');
        });

        coluna.addEventListener('drop', (e) => {
            e.preventDefault();
            const colunaParent = coluna.parentElement;
            colunaParent.classList.remove('arrastando-sobre');
            
            const cartaoArrastado = document.querySelector('.cartao-tarefa.arrastando');
            
            if (cartaoArrastado) {
                const status = colunaParent.dataset.status;
                
                cartaoArrastado.classList.remove('aberto', 'negociacao', 'andamento', 'entregue');
                cartaoArrastado.classList.add(status);
                
                coluna.appendChild(cartaoArrastado);
                salvarEstadoKanban();
            }
        });
    });
}

function salvarEstadoKanban() {
    const colunas = document.querySelectorAll('.coluna');
    const estado = {};
    
    colunas.forEach(coluna => {
        const status = coluna.dataset.status;
        const tarefas = Array.from(coluna.querySelectorAll('.cartao-tarefa')).map(cartao => cartao.textContent);
        estado[status] = tarefas;
    });
    
    localStorage.setItem('estadoKanban', JSON.stringify(estado));
}

function carregarTarefasSalvas() {
    const estadoSalvo = localStorage.getItem('estadoKanban');
    
    if (estadoSalvo) {
        const estado = JSON.parse(estadoSalvo);
        
        for (const [status, tarefas] of Object.entries(estado)) {
            const coluna = document.querySelector(`.coluna[data-status="${status}"] .conteudo-coluna`);
            
            if (coluna) {
                tarefas.forEach(texto => {
                    const cartao = criarCartaoTarefa(texto);
                    cartao.classList.remove('aberto');
                    cartao.classList.add(status);
                    coluna.appendChild(cartao);
                });
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', inicializarKanban);
