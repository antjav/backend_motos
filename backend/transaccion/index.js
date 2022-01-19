const { pool } = require('../db')

const transaccion = async (callback) => {
  try {
      await pool.query('BEGIN');
      try {
          await callback(pool);
          await pool.query('COMMIT');
      } catch (error) {
          await pool.query('ROLLBACK');
          console.error(error.stack)
      }
  } catch (error) {
    console.error(error.message)
  }
}

module.exports = { transaccion }