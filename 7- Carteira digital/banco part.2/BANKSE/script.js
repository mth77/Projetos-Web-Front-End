// Variáveis globais para controlar o saldo e as transações
let saldo = 10.00;
let totalEntradas = 10.00;
let totalSaídas = 0.00;

// Elementos DOM
const saldoElemento = document.querySelector('.balance-amount');
const entradaElemento = document.querySelector('.income');
const saídaElemento = document.querySelector('.expense');
const listaTransações = document.getElementById('transactionsList');
const modalPix = document.getElementById('pixModal');
const modalSistema = document.getElementById('systemModal');
const mensagemSucesso = document.getElementById('successMessage');
const mensagemErro = document.getElementById('errorMessage');
const formularioReceber = document.getElementById('receiveForm');
const formularioTransferir = document.getElementById('transferForm');
const abasPix = document.querySelectorAll('.pix-tab');

// Função auxiliar para formatar o valor como moeda
const formatarMoeda = (valor) => `R$ ${valor.toFixed(2)}`;

// Função auxiliar para gerar ID da transação
const gerarIdTransacao = () => {
    const agora = new Date();
    return `${agora.getFullYear()}${String(agora.getMonth() + 1).padStart(2, '0')}${String(agora.getDate()).padStart(2, '0')}${String(agora.getHours()).padStart(2, '0')}${String(agora.getMinutes()).padStart(2, '0')}${String(agora.getSeconds()).padStart(2, '0')}`;
};

// Função auxiliar para formatar a data
const formatarData = (data) => {
    return `${String(data.getDate()).padStart(2, '0')}/${String(data.getMonth() + 1).padStart(2, '0')}/${data.getFullYear()} - ${String(data.getHours()).padStart(2, '0')}:${String(data.getMinutes()).padStart(2, '0')}:${String(data.getSeconds()).padStart(2, '0')}`;
};

// Atualizar os valores exibidos
const atualizarExibicao = () => {
    saldoElemento.textContent = formatarMoeda(saldo);
    entradaElemento.textContent = formatarMoeda(totalEntradas);
    saídaElemento.textContent = formatarMoeda(totalSaídas);
};

// Adicionar transação à lista
const adicionarTransacao = (tipo, valor, detalhes) => {
    const agora = new Date();
    const idTransacao = gerarIdTransacao();
    
    const transacaoHTML = `
        <div class="transaction-item">
            <div class="transaction-icon">${tipo === 'entrada' ? '⬇️' : '⬆️'}</div>
            <div class="transaction-details">
                <div>${tipo === 'entrada' ? 'Entrada' : 'Saída'} | ${formatarData(agora)}</div>
                <div>Tipo: Transferência ${tipo === 'entrada' ? 'recebida' : 'enviada'}</div>
                <div>${detalhes}</div>
                <div>ID: ${idTransacao}</div>
            </div>
            <div class="transaction-amount">${formatarMoeda(valor)}</div>
        </div>
    `;

    listaTransações.insertAdjacentHTML('afterbegin', transacaoHTML);
};

// Mostrar/ocultar modais
const mostrarModal = (modal) => {
    modal.style.display = 'flex';
};

const ocultarModal = (modal) => {
    modal.style.display = 'none';
    mensagemSucesso.style.display = 'none';
    mensagemErro.style.display = 'none';
};

// Função auxiliar para analisar o valor
const analisarValor = (valor) => {
    if (!valor) {
        return NaN;  // Se o valor for null ou vazio, retorna NaN
    }

    // Remove espaços e substitui vírgulas por ponto antes de tentar converter
    const valorLimpo = valor.replace(/\s+/g, '').replace(',', '.');
    const valorConvertido = parseFloat(valorLimpo);

    return !isNaN(valorConvertido) && valorConvertido > 0 ? valorConvertido : NaN;
};

// Lidar com transações PIX
const lidarComTransacaoPix = (recebendo, dadosFormulario) => {
    const valor = analisarValor(dadosFormulario.get('amount'));
    
    if (isNaN(valor)) {
        mensagemErro.textContent = 'Valor inválido!';
        mensagemErro.style.display = 'block';
        return false;
    }
    
    if (recebendo) {
        saldo += valor;
        totalEntradas += valor;
        adicionarTransacao('entrada', valor, `De: ${dadosFormulario.get('cpf')}`);
    } else {
        if (valor > saldo) {
            mensagemErro.textContent = 'Saldo insuficiente!';
            mensagemErro.style.display = 'block';
            return false;
        }
        saldo -= valor;
        totalSaídas += valor;
        adicionarTransacao('saída', valor, `Para: ${dadosFormulario.get('key')}`);
    }
    
    atualizarExibicao();
    mensagemSucesso.style.display = 'block';
    setTimeout(() => {
        ocultarModal(modalPix);
    }, 2000);
    return true;
};

// Listeners de eventos
document.getElementById('pixButton').addEventListener('click', () => {
    mostrarModal(modalPix);
});

document.getElementById('payButton').addEventListener('click', () => {
    mostrarModal(modalSistema);
});

document.getElementById('investButton').addEventListener('click', () => {
    mostrarModal(modalSistema);
});

// Botões de fechar modal
document.querySelectorAll('.close-modal').forEach(botao => {
    botao.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal');
        ocultarModal(modal);
    });
});

// Troca de abas PIX
abasPix.forEach(aba => {
    aba.addEventListener('click', () => {
        // Remove a classe ativa de todas as abas e formulários
        abasPix.forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.pix-form').forEach(formulario => formulario.classList.remove('active'));
        
        // Adiciona a classe ativa à aba clicada e ao formulário correspondente
        aba.classList.add('active');
        const idFormulario = `${aba.dataset.tab}Form`;
        document.getElementById(idFormulario).classList.add('active');
        
        // Reseta mensagens
        mensagemSucesso.style.display = 'none';
        mensagemErro.style.display = 'none';
    });
});

// Lidar com o envio do formulário de receber PIX
formularioReceber.addEventListener('submit', (e) => {
    e.preventDefault();
    const dadosFormulario = new FormData(formularioReceber);
    const cpf = document.getElementById('receiveCpf').value;
    const valor = document.getElementById('receiveAmount').value;
    
    const valorConvertido = analisarValor(valor);
    
    if (!cpf || isNaN(valorConvertido)) {
        mensagemErro.textContent = 'Todos os campos devem ser preenchidos corretamente!';
        mensagemErro.style.display = 'block';
        return;
    }
    
    lidarComTransacaoPix(true, dadosFormulario);
    formularioReceber.reset();
});

// Lidar com o envio do formulário de transferir PIX
formularioTransferir.addEventListener('submit', (e) => {
    e.preventDefault();
    const dadosFormulario = new FormData(formularioTransferir);
    const chave = document.getElementById('transferKey').value;
    const valor = document.getElementById('transferAmount').value;
    
    const valorConvertido = analisarValor(valor);
    
    if (!chave || isNaN(valorConvertido)) {
        mensagemErro.textContent = 'Todos os campos devem ser preenchidos corretamente!';
        mensagemErro.style.display = 'block';
        return;
    }
    
    lidarComTransacaoPix(false, dadosFormulario);
    formularioTransferir.reset();
});

// Fechar modais ao clicar fora
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        ocultarModal(e.target);
    }
});

// Atualização inicial da exibição
atualizarExibicao();
