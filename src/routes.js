//Importa todos os componentes
require('dotenv').config()

const express = require("express")
const mysql = require("mysql2")
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")  

//Cria uma variavel com o express
const router = express.Router()

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }));

//Conecta com o banco de dados
const connection = mysql.createConnection(process.env.DATABASE_URL)

connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar com o banco de dados' + err.stack);
        return
    }
    console.log('Conexão com banco realizada!');
})

router.get('/links:id', (req, res) => {
    connection.query('SELECT * FROM users', (err, rows) => {
        if (err) throw err
        res.send(rows)
    })
})

//Cadastro de usuario
router.post('/cadastro', (req, res) => {
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

//Login
router.post('/login', (req, res) => {
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
        const token = jwt.sign({ id: rows[0].id}, process.env.SECRET_KEY, {expiresIn : '1h'})
        console.log("Login realizado")
        res.redirect(`/perfil/${rows[0].id}`)
    })
})

//Usuario adicionar link a si msm
router.post('/:user_id/edit', (req, res) => {
    const user_id = req.params.user_id
    const { namelink, link } = req.body

    //Verificar se existe o usuario
    connection.query('SELECT id FROM users WHERE id = ?', user_id, (err, result) => {
        if (err) {
            console.error(err)
            res.status(500).send('Erro ao verificar o usuario')
        } else if (result.length === 0) {
            console.log('Usuario nao existe');
            res.status(404).send('Usuario nao existe')
        } else {
            connection.query('insert into links (namelink, link, user_id) value(?, ?, ?)', [namelink, link, user_id], (err, result) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Erro ao adicionar o link')
                } else {
                    res.status(201).send('Link adicionado com sucesso')
                }
            })
        }

    })
})

module.exports = router

