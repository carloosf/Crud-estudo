//Importa todos os componentes
const express = require("express")
const mysql = require("mysql")
const cors = require("cors")
const bodyParser = require("body-parser")

//Cria uma variavel com o express
const app = express()

//Usa o bodyParser para usar arquivos json
app.use(bodyParser.json())

//Usa o cors para poder permitir outras requisições
app.use(cors())

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

app.listen(3000, () => {
    console.log('Servidor iniciando na porta 3000');
})

