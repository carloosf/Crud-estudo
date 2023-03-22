//Importa todos os componentes
require('dotenv').config()

const express = require("express")
const mysql = require("mysql2")
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')

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

rotas.get('/links:id', (req, res) => {
    connection.query('SELECT * FROM users', (err, rows) => {
        if (err) throw err
        res.send(rows)
    })
})

rotas.post('/cadastro', (req, res) => {
    const { name, email, password } = req.body
    connection.query('SELECT * FROM users WHERE email = ?', [email], (err, rows) => {
        if (err) throw err

        if (rows.length > 0) {
            console.log(`O email ${email} já esta em uso.`)
            res.status(409).send(`ò email ${email} já esta em uso.`)
            return
        }

        bcrypt.hash(password, 10, (err, hash) => {
            if (err) throw err
            connection.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hash], (err, result) => {
                if (err) throw err
                res.send(`Registro Criado com sucesso! ID: ${result.insertId}`)
            })

           
        })
    })
})

rotas.post('/login', (req, res) => {
    const { email, password } = req.body
    connection.query('SELECT * FROM users WHERE email = ?', [email], (err, rows) => {
        if (err) throw err

        if (rows.length === 0) {
            console.log("as Credenciais fornecidas nao sao validas")
            res.status(401).send(`o email ou senha nao esta valido`)
            return
        }

        bcrypt.compare(password, rows[0].password, (err, result) => {
            if (err) throw err
            if (result === false) {
                console.log("as Credenciais fornecidas nao sao validas")
                res.status(401).send(`o email ou senha nao esta valido`)
                return
            }
        })
        const token = jwt.sign({ id: rows[0].id}, process.env.SECRET_ENV, {expiresIn : '1h'})
        res.status(200).send("Login realizado")
        console.log("Login realizado")
    })
})

module.exports = rotas

