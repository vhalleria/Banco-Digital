
const express = require('express');
const contas = require('./controladores/contas');
const transacoes = require('./controladores/transacoes');


const roteador = express();

// rotas para Controlador de contas 
roteador.post('/contas', contas.criarConta);
roteador.get('/contas', contas.listarContas);
roteador.put('/contas/:numeroConta/usuario', contas.atualizarConta);
roteador.delete('/contas/:numeroConta', contas.deletarConta);
roteador.get('/contas/saldo', contas.saldo);
roteador.get('/contas/extrato', contas.extrato);


//rotas para Controlador das transações 
roteador.post('/transacoes/depositar', transacoes.depositar);
roteador.post('/transacoes/sacar', transacoes.sacar);
roteador.post('/transacoes/transferir', transacoes.transferir);

module.exports = roteador;
