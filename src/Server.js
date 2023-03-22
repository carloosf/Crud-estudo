//Importa todos os componentes
const express = require("express")
const mysql = require("mysql")
const bodyParser = require('body-parser')

//Cria uma variavel com o express
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

//Conecta com o banco de dados
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'userlink',
})

connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar com o banco de dados' + err.stack);
        return
    }
    console.log('Conexão realizada com sucesso!');
})

app.get('/registros', (req, res) => {
    connection.query('SELECT * FROM users', (err, rows) => {
        if (err) throw err
        res.send(rows)
    })
})

app.post('/registros', (req, res) => {
    const { name, email, senha } = req.body
    connection.query('INSERT INTO users (name, email, senha) VALUES (?, ?, ?)', [name, email, senha], (err, result) => {
        if (err) throw err
        res.send(`Registro Criado com sucesso! ID: ${result.insertId}`)
    })
    console.log(req.body);
})


app.listen(3000, () => {
    console.log('Servidor iniciando na porta 3000');
})

