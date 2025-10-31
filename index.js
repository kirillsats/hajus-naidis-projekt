const express = require('express')
const app = express()
const port = 8080
const swaggerUi = require('swagger-ui-express')
const yamljs = require('js-yaml')
const path = require('path')

app.use(express.json()) 

const swaggerDocument = yamljs.load(path.join(__dirname, 'docs', 'swagger.yaml'))

// Начальные данные
let games = [
  { id: 1, name: "Witcher 3", price: 59.99 },
  { id: 2, name: "Cyberpunk 2077", price: 49.99 },
  { id: 3, name: "Minecraft", price: 19.99 },
  { id: 4, name: "Counter-Strike", price: 0.00 },
  { id: 5, name: "Roblox", price: 0.00 },
  { id: 6, name: "GTA V", price: 29.99 },
  { id: 7, name: "Valorant", price: 0.00 },
  { id: 8, name: "Forza Horizon 5", price: 69.99 }
]

// Получить все игры
app.get('/games', (req, res) => {
  res.json(games)
})

// Получить игру по ID
app.get('/games/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const game = games.find(g => g.id === id)

  if (!game) {
    return res.status(404).json({ error: "Game not found" })
  }

  res.json(game)
})

// Удалить игру по ID
app.delete('/games/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const index = games.findIndex(g => g.id === id)

  if (index === -1) {
    return res.status(404).json({ error: "Game not found" })
  }

  games.splice(index, 1)
  res.status(204).send() // No content
})

// Добавить новую игру
app.post('/games', (req, res) => {
  const { name, price } = req.body

  if (!name) {
    return res.status(400).json({ error: "Missing 'name' field" })
  }

  // Генерация уникального ID
  const newId = games.length > 0 ? Math.max(...games.map(g => g.id)) + 1 : 1
  const newGame = { id: newId, name, price: price || 0 }

  games.push(newGame)
  res.status(201).json({ message: "Game added successfully", game: newGame })
})

// Swagger документация
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// Запуск сервера
app.listen(port, () => {
  console.log(`API running at: http://localhost:${port}`)
})



