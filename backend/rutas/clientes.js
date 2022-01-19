const { Router } = require('express')
const router = Router()

const {
  leerClientes,
  actualizarCliente,
  eliminarCliente
} = require('../controladores/clientes')

router.get('/', leerClientes)

router.post('/actualizar', actualizarCliente)

router.delete('/:id', eliminarCliente)

module.exports = router