let saldoBancario = 100;

function dataAtual() {
    const agora = new Date();

    const dia = String(agora.getDate()).padStart(2, '0');
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const ano = agora.getFullYear();

    const horas = String(agora.getHours()).padStart(2, '0');
    const minutos = String(agora.getMinutes()).padStart(2, '0');
    const segundos = String(agora.getSeconds()).padStart(2, '0');

    return `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;
}

function transacao() {
    const inputChavePix = document.getElementById("chavePix").value;
    const inputValorTransacao = parseFloat(document.getElementById("valorTransacao").value);

    if (saldoBancario >= inputValorTransacao && inputValorTransacao > 0) {
        saldoBancario -= inputValorTransacao;

        const data = dataAtual();

        console.log(`Transação realizada com sucesso!`);
        console.log(`Valor: R$ ${inputValorTransacao.toFixed(2)}`);
        console.log(`Chave Pix: ${inputChavePix}`);
        console.log(`Data: ${data}`);
        console.log(`Saldo atual: R$ ${saldoBancario.toFixed(2)}`);
    } else {
        console.log("Saldo insuficiente ou valor inválido!");
    }
}
