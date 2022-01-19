const { pool } = require('../db')

const leerClientes = async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM cliente')
    res.json(resultado.rows)
  } catch (error) {
    res.json(error.message)
  }
}

const actualizarCliente = async (req, res) => {
  let { cliente_id, cliente_cedula, cliente_nombre, cliente_apellido, cliente_correo,
   cliente_fechanacimiento, cliente_telefono } = req.body

  try {
    const resultado = await pool.query(
      'SELECT * FROM cliente WHERE cliente_id = $1', 
      [cliente_id]
    )

    if(resultado.rows.length === 0){
      await pool.query(
        'INSERT INTO cliente VALUES($1, $2, $3, $4, $5, $6, $7)',
        [ cliente_id, cliente_cedula, cliente_nombre, cliente_apellido, cliente_correo,
          cliente_fechanacimiento, cliente_telefono]
      )
      res.json({mensaje: 'Se insertó el cliente correctamente'})
    } else {
      await pool.query(
        'UPDATE cliente SET cliente_cedula = $1, cliente_nombre = $2, ' +
        'cliente_apellido = $3, cliente_correo = $4, cliente_fechanacimiento = $5, ' +
        'cliente_telefono = $6 '+
        'WHERE cliente_id = $7',
        [ cliente_cedula, cliente_nombre, cliente_apellido, cliente_correo,
          cliente_fechanacimiento, cliente_telefono, cliente_id]
      )
      res.json({mensaje: 'Se actualizó el cliente correctamente'})
    }
  } catch (error) {
    res.json(error.message)
  }
}

const eliminarCliente = async (req, res) => {
  const { id } = req.params
  try {
    const resultado = await pool.query(
      'SELECT * FROM cliente WHERE cliente_id = $1', 
      [id]
    )

    if(resultado.rows.length === 0){
      return res.status(404).json({
        mensaje: 'El cliente no fue encontrado'
      })
    } else {
      await pool.query(
        'DELETE FROM cliente WHERE cliente_id = $1',
        [id]
      )
      res.json({mensaje: 'El cliente fue eliminado con éxito'})
    }
  } catch (error) {
    res.json(error.message)
  }
}

module.exports = {
  leerClientes,
  actualizarCliente,
  eliminarCliente
}