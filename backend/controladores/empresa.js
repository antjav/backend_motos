const { pool } = require('../db')

const leerEmpresas = async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM empresa')
    res.json(resultado.rows)
  } catch (error) {
    res.json(error.message)
  }
}

const actualizarEmpresa = async (req, res) => {
  let { empresa_id, empresa_nombre, empresa_direccion, empresa_ciudad,
  empresa_correo, empresa_telefono } = req.body

  try {
    const resultado = await pool.query(
      'SELECT * FROM empresa WHERE empresa_id = $1', 
      [empresa_id]
    )

    if(resultado.rows.length === 0){
      await pool.query(
        'INSERT INTO empresa VALUES($1, $2, $3, $4, $5, $6)',
        [ empresa_id, empresa_nombre, empresa_direccion, empresa_ciudad,
          empresa_correo, empresa_telefono]
      )
      res.json({mensaje: 'Se insertó la empresa correctamente'})
    } else {
      await pool.query(
        'UPDATE empresa SET empresa_nombre = $1, empresa_direccion = $2, ' +
        'empresa_ciudad = $3, empresa_correo = $4, empresa_telefono = $5 ' +
        'WHERE empresa_id = $6',
        [ empresa_nombre, empresa_direccion, empresa_ciudad, empresa_correo,
          empresa_telefono, empresa_id]
      )
      res.json({mensaje: 'Se actualizó la empresa correctamente'})
    }
  } catch (error) {
    res.json(error.message)
  }
}

const eliminarEmpresa = async (req, res) => {
  const { id } = req.params
  try {
    const resultado = await pool.query(
      'SELECT * FROM empresa WHERE empresa_id = $1', 
      [id]
    )

    if(resultado.rows.length === 0){
      return res.status(404).json({
        mensaje: 'La empresa no fue encontrada'
      })
    } else {
      await pool.query(
        'DELETE FROM empresa WHERE empresa_id = $1',
        [id]
      )
      res.json({mensaje: 'La empresa fue eliminada con éxito'})
    }
  } catch (error) {
    res.json(error.message)
  }
}

module.exports = {
  leerEmpresas,
  actualizarEmpresa,
  eliminarEmpresa
}