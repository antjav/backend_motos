const { pool } = require('../db')
const { transaccion } = require('../transaccion')

const transaccionEntrega = async (req, res) => {
  // Datos leídos desde el cliente
  const { entrega_id, entrega_pagado, entregareporte_incidente } = req.body

  try {
    transaccion(async (pool) => {

      // Extraer cuanto debe pagar
      const { rows } = await pool.query(
        'SELECT entrega_precio FROM entrega WHERE entrega_id = $1', 
        [entrega_id]
      )
      const precio = rows[0].entrega_precio
      const pagado = Number(entrega_pagado).toFixed(2)
      const estado = 'PAGADO'

      // Verificar pago
      if(precio == pagado){

        // Actualizar entrega del estado
        await pool.query(
          'UPDATE entregaestado SET entregaestado_estado = $1 WHERE entregaestado_id = $2',
          [estado, entrega_id]
        )

        // Actualizar entrega
        await pool.query(
          'UPDATE entrega SET entrega_pagado = $1 WHERE entrega_id = $2',
          [pagado, entrega_id]
        )

        // Generar reporte
        const entregareporte_id = Math.ceil(Math.random() * 1000)
        await pool.query(
          'INSERT INTO entregareporte VALUES($1, $2, $3, $4, $5)',
          [entregareporte_id, entrega_id, entregareporte_incidente, pagado ,new Date()]
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

const mostrarTransaccionEntrega = async (req, res) => {
  try {
    const entregas = await pool.query(
      'SELECT entrega.entrega_id, entrega_tipo, entrega_precio, entrega_pagado, '+
      'entregaestado.entregaestado_id, entregaestado_estado, '+
      'entregareporte.entregareporte_id, entregareporte_incidente, entregareporte_fecha '+
      'FROM entrega '+
      'INNER JOIN entregaestado ON entrega.entrega_id = entregaestado.entrega_id '+
      'INNER JOIN entregareporte ON entregaestado.entregaestado_id = entregareporte.entregaestado_id'
    )
    res.json(entregas.rows)
  } catch (e) {
    res.json(e.message)
  }
}

const mostrarEntregas = async (req, res) => {
  try {
    const entregas = await pool.query(
      'SELECT entrega_id, entrega_tipo, entrega_precio, entrega_pagado '+
      'FROM entrega'
    )
    res.json(entregas.rows)
  } catch (e) {
    res.json(e.message)
  }
}

module.exports = {
  transaccionEntrega,
  mostrarTransaccionEntrega,
  mostrarEntregas
}