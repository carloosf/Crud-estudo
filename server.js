const express = require("express")
const rotas = require("./src/routes")
const app = express()

app.use(express.json())
app.use(rotas)

app.get("/health", (req, res) => {
    return res.json("up")
})

const port = 3333
app.listen(port, () => console.log(`Servidor conectado na rota: ${port}`))
