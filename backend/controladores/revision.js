const { pool } = require('../db')
const { transaccion } = require('../transaccion')

const transaccionRevision = async (req, res) => {
  // Datos leídos desde el cliente
  const { moto_id, revisionmoto_pagado, reporterevision_danios } = req.body

  try {
    transaccion(async (pool) => {

      // Extraer cuanto debe pagar
      const { rows } = await pool.query(
        'SELECT revisionmoto_costo FROM revisionmoto WHERE revisionmoto_id = $1', 
        [moto_id]
      )
      const precio = rows[0].revisionmoto_costo
      const pagado = Number(revisionmoto_pagado).toFixed(2)
      const estado = 'PAGADO'
      const moto_reparacion = 'NO'

      // Verificar pago
      if(precio == pagado){

        // Actualizar motocicleta
        await pool.query(
          'UPDATE motocicleta SET moto_reparacion = $1 WHERE moto_id = $2',
          [moto_reparacion, moto_id]
        )

        // Actualizar revisionmoto
        await pool.query(
          'UPDATE revisionmoto SET revisionmoto_pagado = $1, revisionmoto_estado = $2 WHERE revisionmoto_id = $3',
          [pagado, estado, moto_id]
        )

        // Generar reporte
        const reporterevision_id = Math.ceil(Math.random() * 1000)
        await pool.query(
          'INSERT INTO reporterevision VALUES($1, $2, $3, $4)',
          [reporterevision_id, moto_id, new Date(), reporterevision_danios]
        )

        res.json({ mensaje: `¡Transacciones ejecutadas con éxito!` })
      } else {
        res.json({ mensaje: `¡No se ejecutó la transacción!\nDebes pagar en total: ${precio}` })
      }
    })
  } catch (e) {
    res.json(e.message)
  }
}

const mostrarTransaccionRevision = async (req, res) => {
  try {
    const revisiones = await pool.query(
      'SELECT motocicleta.moto_id, moto_placa, moto_reparacion, '+
      'revisionmoto.revisionmoto_id, revisionmoto_fecha, revisionmoto_costo, revisionmoto_pagado, revisionmoto_estado, '+
      'reporterevision.reporterevision_id, reporterevision_danios '+
      'FROM motocicleta '+
      'INNER JOIN revisionmoto ON motocicleta.moto_id = revisionmoto.moto_id '+
      'INNER JOIN reporterevision ON revisionmoto.revisionmoto_id = reporterevision.revisionmoto_id'
    )
    res.json(revisiones.rows)
  } catch (e) {
    res.json(e.message)
  }
}

const mostrarRevision = async (req, res) => {
  try {
    const entregas = await pool.query(
      'SELECT revisionmoto_id, revisionmoto_costo, revisionmoto_pagado, revisionmoto_estado '+
      'FROM revisionmoto'
    )
    res.json(entregas.rows)
  } catch (e) {
    res.json(e.message)
  }
}

module.exports = {
  transaccionRevision,
  mostrarTransaccionRevision,
  mostrarRevision
}