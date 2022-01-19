const { Router } = require('express')
const router = Router()

const {
  mostrarEntregas,
  mostrarTransaccionEntrega,
  transaccionEntrega
} = require('../controladores/entrega')

router.get('/', mostrarTransaccionEntrega)

router.get('/estados', mostrarEntregas)

router.post('/', transaccionEntrega)

module.exports = router