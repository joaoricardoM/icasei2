import express, { Express, Request, Response, NextFunction } from 'express'
import axios from 'axios'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app: Express = express()
const PORT = 3001

const apiKey = process.env.API_KEY_VALUE

app.use(cors())
app.use(express.json())
app.use((_: Request, res: Response, next: NextFunction) => {
  res.header({ 'Access-Control-Allow-Origin': '*' })
  res.header('Access-Control-Allow-Methods', 'GET')
  res.header({
    'Access-Control-Allow-Headers':
      'Origin, X-Requested-With, Content-Type, Accept'
  })

  next()
})

const favorites: Set<string> = new Set()

app.get('/search', async (req, res) => {
  const query = req.query.query as string
  try {
    const response = await axios.get(
      'https://www.googleapis.com/youtube/v3/search',
      {
        params: {
          part: 'snippet',
          q: query,
          type: 'video',
          key: apiKey
        }
      }
    )
    const videos = response.data.items.map((item: any) => ({
      title: item.snippet.title,
      videoId: item.id.videoId
    }))
    res.json({ videos })
  } catch (error) {
    if (axios.isAxiosError(error)) {
      res.status(500).send(error.message)
    } else {
      res.status(500).send('An unknown error occurred')
    }
  }
})

app.post('/favorites', (req: Request, res: Response) => {
  const { videoId } = req.body
  if (favorites.has(videoId)) {
    favorites.delete(videoId)
  } else {
    favorites.add(videoId)
  }
  res.json({ success: true })
})

app.get('/favorites/count', (_: Request, res: Response) => {
  res.json({ count: favorites.size })
})

app.listen(PORT, () => {
  console.log(`BFF server running on port ${PORT}`)
})
