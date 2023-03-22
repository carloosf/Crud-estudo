//Importa todos os componentes
require('dotenv').config()

const express = require("express")
const mysql = require("mysql2")
const bodyParser = require('body-parser')

//Cria uma variavel com o express
const rotas = express.Router()

rotas.use(bodyParser.json())
rotas.use(bodyParser.urlencoded({ extended: true }));

//Conecta com o banco de dados
const connection = mysql.createConnection(process.env.DATABASE_URL)

connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar com o banco de dados' + err.stack);
        return
    }
    console.log('Conexão com banco realizada!');
})

rotas.get('/registros', (req, res) => {
    connection.query('SELECT * FROM users', (err, rows) => {
        if (err) throw err
        res.send(rows)
    })
})

rotas.post('/registros', (req, res) => {
    const { name, email, password } = req.body
    connection.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password], (err, result) => { 
        if (err) throw err
        res.send(`Registro Criado com sucesso! ID: ${result.insertId}`)
    })
})

module.exports = rotas
