import express from 'express'
import path from 'path'
import cors from 'cors'

const app = express()
const PORT = 3003

app.use(cors())

// Servir arquivos estáticos do diretório 'dist/public'
app.use(express.static(path.join(__dirname, '../dist/public')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/public/index.html'))
})

app.listen(PORT, () => {
  console.log(`Videos micro-frontend running on port ${PORT}`)
})
