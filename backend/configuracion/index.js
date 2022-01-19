// Dependencias
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

// Permitir conexión de otros servidores
let corsOpciones = {
  origin: '*',
  optionsSuccessStatus: 200
}

// Rutas
const {
  entregaRutas,
  revisionRutas,
  clienteRutas,
  empresaRutas
} = require('../rutas')

// App
const app = express()

// Router
const router = express.Router()

app
  .use(express.json())
  .use(cors(corsOpciones))
  .use(morgan('dev'))

 router.use('/entrega', entregaRutas)
 router.use('/revision', revisionRutas)
 router.use('/clientes', clienteRutas)
 router.use('/empresas', empresaRutas)

app.use(router)

module.exports = { app }