const express = require('express')
const app = express()
const Handlebars = require("handlebars");
const handlebars = require("express-handlebars").engine
const bodyParser = require ('body-parser')
const post = require('./models/post')

app.engine("handlebars", handlebars({defaultLayout: "main"}))
app.set("view engine", "handlebars")

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

Handlebars.registerHelper("eq", (origem, valor) => {
    return origem == valor;
});

app.get('/', function(req,res){
    res.render('primeira_pagina')
})

//cadastrar
app.post('/cadastrar', function(req, res){
    post.create({
        nome: req.body.nome,
        telefone: req.body.telefone,
        origem: req.body.origem,
        data_contato: req.body.data_contato,
        observacao: req.body.observacao
    }).then(function(){
        res.redirect('/')
    }).catch(function(erro){
        res.send('Erro ao criar o post: '+ erro)
    })
})

//consultar
app.get('/consulta', function(req,res){
    post.findAll().then(function(posts){
        res.render('consulta', {posts: posts})
        console.log(posts)
    }
    ).catch(function(erro){
        res.send('Erro ao listar os posts: ' + erro)
    })

})

//listar campos para edição do id
app.get('/editar/:id', function(req,res){
    post.findAll({where: {id: req.params.id}}).then(function(posts){
        res.render('editar', {posts: posts})
    }).catch(function(erro){
        res.send('Erro ao listar os posts: '+erro)
    })
})

//excluir pelo id
app.get('/excluir/:id', function (req, res) {
    post.destroy({
        where: { id: req.params.id }
    }).then(function () {
        res.redirect('/consulta')
    }).catch(function (erro) {
        res.send('Erro ao excluir o post: ' + erro)
    })
})

//editar pelo id
app.post('/editar/:id', function(req, res){
    post.update({
        nome: req.body.nome,
        telefone: req.body.telefone,
        origem: req.body.origem,
        data_contato: req.body.data_contato,
        observacao: req.body.observacao
    }, {where: {id: req.params.id}}).then(function(){
        res.redirect('/consulta')
    }).catch(function(erro){
        res.send('Erro ao atualizar o post: ' + erro)
    })
})

app.listen(8081, function(){
    console.log('Servidor Ativo!')
})
