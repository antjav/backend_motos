const { Router } = require('express')
const router = Router()

const {
  leerEmpresas,
  actualizarEmpresa,
  eliminarEmpresa
} = require('../controladores/empresa')

router.get('/', leerEmpresas)

router.post('/actualizar', actualizarEmpresa)

router.delete('/:id', eliminarEmpresa)

module.exports = router