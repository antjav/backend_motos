const { app } = require('./backend/configuracion')

// Puerto del servidor
const PORT = 4001

// Servidor
app.listen(PORT, () => {
  console.log(`Servidor funcionando en el puerto: ${PORT}`)
})