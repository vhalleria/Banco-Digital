let { contas, saques, depositos, transferencias } = require('../bancodedados');

const { format } = require('date-fns');


const depositar = (req, res) => {
    const { numero_conta, valor } = req.body;


    if (!numero_conta || !valor) {
        return res.status(400).json({ mensagem: 'O número da conta e o valor são obrigatórios!' });
    }

    const contaEncontrada = contas.find((conta) => {
        return Number(conta.numero) === Number(numero_conta)
    });

    if (!contaEncontrada) {
        return res.status(404).json({ mensagem: 'Conta não encontrada!' });
    }
    if (valor <= 0) {
        return res.status(400).json({ mensagem: 'O valor depositado deve ser maior que 0' });
    }

    contaEncontrada.saldo += valor;

    const depositoRegistrado = {
        data: format(new Date(), 'yyyy-MM-dd  HH:mm:ss'),
        numero_conta,
        valor
    }

    depositos.push(depositoRegistrado);

    return res.status(201).send();
}

const sacar = (req, res) => {
    const { numero_conta, valor, senha } = req.body;

    if (!numero_conta || !valor || !senha) {
        return res.status(400).json({ mensagem: 'O número da conta, a senha e o valor são obrigatórios!' });
    }

    const contaEncontrada = contas.find((conta) => {
        return Number(conta.numero) === Number(numero_conta)
    });

    if (!contaEncontrada) {
        return res.status(404).json({ mensagem: 'Conta não encontrada!' });
    }

    if (contaEncontrada.usuario.senha !== senha) {
        return res.status(403).json({ mensagem: 'Senha inválida!' });
    }
    if (contaEncontrada.saldo < valor) {
        return res.status(403).json({ mensagem: 'Saldo insuficiente!' });
    }

    contaEncontrada.saldo -= valor;

    const saqueRegistrado = {
        data: format(new Date(), 'yyyy-MM-dd  HH:mm:ss'),
        numero_conta,
        valor
    }

    saques.push(saqueRegistrado);

    return res.status(201).send();

}

const transferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

    if (!numero_conta_origem || !numero_conta_destino || !valor || !senha) {
        return res.status(400).json({ mensagem: 'O número da conta de origem, de destino, o valor e a senha são obrigatórios!' });
    }
    const contaOrigemEncontrada = contas.find((conta) => {
        return Number(conta.numero) === Number(numero_conta_origem)
    });

    if (!contaOrigemEncontrada) {
        return res.status(404).json({ mensagem: 'Conta de origem não encontrada!' });
    }
    const contaDestinoEncontrada = contas.find((conta) => {
        return Number(conta.numero) === Number(numero_conta_destino)
    });

    if (!contaDestinoEncontrada) {
        return res.status(404).json({ mensagem: 'Conta de destino não encontrada!' });
    }
    if (contaOrigemEncontrada.usuario.senha !== senha) {
        return res.status(403).json({ mensagem: 'Senha inválida!' });
    }
    if (contaOrigemEncontrada.saldo < valor) {
        return res.status(403).json({ mensagem: 'Saldo insuficiente!' });
    }

    contaOrigemEncontrada.saldo -= valor;
    contaDestinoEncontrada.saldo += valor;

    const transferenciaRegistrada = {
        data: format(new Date(), 'yyyy-MM-dd  HH:mm:ss'),
        numero_conta_origem,
        numero_conta_destino,
        valor
    }

    transferencias.push(transferenciaRegistrada);

    return res.status(201).send();
}
module.exports = {
    depositar,
    sacar,
    transferir
}