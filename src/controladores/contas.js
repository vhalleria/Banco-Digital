

let { banco, contas, ultimoID, saques, depositos, transferencias } = require('../bancodedados');

// função para criação de contas
const criarConta = (req, res) => {
    const {
        nome,
        cpf,
        data_nascimento,
        telefone,
        email,
        senha } = req.body;

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
    }

    const cpfRegistrado = contas.find((conta) => {
        return conta.usuario.cpf === cpf
    })


    if (cpfRegistrado) {
        return res.status(400).json("Já existe uma conta com o cpf informado!");
    }


    const emailRegistrado = contas.find((conta) => {
        return conta.usuario.email === email
    })

    if (emailRegistrado) {
        return res.status(400).json("Já existe uma conta com o email informado!");
    }

    const contaNova = {
        numero: ultimoID++,
        saldo: 0000,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        }
    }
    contas.push(contaNova);

    return res.status(201).send();

}

// função para listar contas
const listarContas = (req, res) => {
    const { senha_banco } = req.query;

    if (!senha_banco) {
        return res.status(403).json({ mensagem: 'A senha do banco é obrigatória para acessar o recurso solicitado!' });
    }
    if (senha_banco === banco.senha) {
        return res.json(contas);
    }

    return res.status(400).json({ mensagem: 'A senha do banco informada é inválida!' });

}

// função para atualizar dados pessoais da conta 
const atualizarConta = (req, res) => {

    const {
        nome,
        cpf,
        data_nascimento,
        telefone,
        email,
        senha } = req.body;
    const { numeroConta } = req.params;

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
    }


    const contaExistente = contas.find(conta => {
        return Number(conta.numero) === Number(numeroConta)
    });

    if (!contaExistente) {
        return res.status(404).json({ mensagem: 'Conta Inexistente!' });
    }

    if (cpf !== contaExistente.usuario.cpf) {
        const cpfExistennte = contas.find(conta => {
            conta.usuario.cpf === cpf
        })
        if (cpfExistennte) {
            return res.status(400).json({ mensagem: 'Já existe uma conta com o cpf informado!' });
        }
    }
    if (email !== contaExistente.usuario.email) {
        const emailExistennte = contas.find(conta => {
            conta.usuario.email === email
        })
        if (emailExistennte) {
            return res.status(400).json({ mensagem: 'Já existe uma conta com o email informado!' });
        }
    }
    contaExistente.usuario = {
        nome,
        cpf,
        data_nascimento,
        telefone,
        email,
        senha
    }
    return res.status(204).send();

}

//função para excluir conta 
const deletarConta = (req, res) => {
    const { numeroConta } = req.params;

    const contaExistente = contas.find(conta => {
        return Number(conta.numero) === Number(numeroConta)
    });

    if (!contaExistente) {
        return res.status(404).json({ mensagem: 'Conta Inexistente!' });
    }

    if (contaExistente.saldo > 0) {
        return res.status(403).json({ mensagem: 'A conta só pode ser removida se o saldo for zero!' });
    }

    contas = contas.filter(conta => Number(conta.numero) !== Number(numeroConta));

    return res.status(204).send();
}

//função para consulta saldo

const saldo = (req, res) => {
    const { senha, numero_conta } = req.query;


    if (!senha || !numero_conta) {
        return res.status(403).json({ mensagem: 'A senha e o número da conta são obrigatórios para acessar o recurso solicitado!' });
    }

    const contaExistente = contas.find((conta) => {
        return Number(conta.numero) === Number(numero_conta)
    });

    if (!contaExistente) {
        return res.status(404).json({ mensagem: 'Conta Inexistente!' });
    }

    if (contaExistente.usuario.senha !== senha) {
        return res.status(400).json({ mensagem: 'A senha informada é inválida!' });
    }

    return res.json({ saldo: contaExistente.saldo });

}
const extrato = (req, res) => {
    const { numero_conta, senha } = req.query;


    if (!senha || !numero_conta) {
        return res.status(403).json({ mensagem: 'A senha e o número da conta são obrigatórios para acessar o recurso solicitado!' });
    }


    const contaExistente = contas.find((conta) => {
        return Number(conta.numero) === Number(numero_conta)
    });

    if (!contaExistente) {
        return res.status(404).json({ mensagem: 'Conta Inexistente!' });
    }

    if (contaExistente.usuario.senha !== senha) {
        return res.status(400).json({ mensagem: 'A senha informada é inválida!' });
    }
    const historicoDepositos = depositos.filter((deposito) => {
        return Number(deposito.numero_conta) === Number(numero_conta)
    });
    const historicoSaques = saques.filter((saque) => {
        return Number(saque.numero_conta) === Number(numero_conta)
    });
    const historicoTransferenciasEnviadas = transferencias.filter((transferencia) => {
        return Number(transferencia.numero_conta_origem) === Number(numero_conta)
    });
    const historicoTransferenciasRecebidas = transferencias.filter((transferencia) => {
        return Number(transferencia.numero_conta_destino) === Number(numero_conta)
    });
    return res.json({
        depositos: historicoDepositos,
        daques: historicoSaques,
        transferenciasEnviadas: historicoTransferenciasEnviadas,
        transferenciasRecebidas: historicoTransferenciasRecebidas
    });
}

module.exports = {
    criarConta,
    listarContas,
    atualizarConta,
    deletarConta,
    saldo,
    extrato
}




