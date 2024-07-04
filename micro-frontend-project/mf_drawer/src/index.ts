import express, { Request, Response } from 'express'
import path from 'path'
import cors from 'cors'

const app = express()
const PORT = 3002

app.use(cors())

app.use(express.static(path.join(__dirname, 'public')))

let favoritos: { videoId: string; title: string }[] = []

app.get('/favorites', (req: Request, res: Response) => {
  res.json(favoritos)
})

// Rota para adicionar um vídeo aos favoritos
app.post('/favorites', express.json(), (req: Request, res: Response) => {
  const { videoId, title } = req.body
  if (!videoId || !title) {
    return res.status(400).send('VideoId e title são obrigatórios.')
  }
  favoritos.push({ videoId, title })
  res.status(201).send('Vídeo adicionado aos favoritos.')
})

// Rota para remover um vídeo dos favoritos
app.delete('/favorites/:videoId', (req: Request, res: Response) => {
  const { videoId } = req.params
  favoritos = favoritos.filter((video) => video.videoId !== videoId)
  res.status(200).send('Vídeo removido dos favoritos.')
})

app.get('/favorites/count', (req: Request, res: Response) => {
  res.json({ count: favoritos.length })
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'))
})

app.listen(PORT, () => {
  console.log(`Drawer micro-frontend running on port ${PORT}`)
})
