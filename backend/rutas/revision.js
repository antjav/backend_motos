const { Router } = require('express')
const router = Router()

const {
  mostrarTransaccionRevision,
  mostrarRevision,
  transaccionRevision
} = require('../controladores/revision')

router.get('/', mostrarTransaccionRevision)

router.get('/estados', mostrarRevision)

router.post('/', transaccionRevision)

module.exports = router