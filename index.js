const express = require('express')
const morgan  = require('morgan')
const app = express()

app.use(express.json())

morgan.token('data', (req, res) => {
  return JSON.stringify(req.body)
})
app.use((morgan(':method :url :status :res[content-length] - :response-time ms :data')))

persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  console.log(id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.get('/info', (request, response) => {
  const numPeople = persons.length
  const date = Date()
  console.log('Phonebook has', numPeople)
  console.log(date)
  response.send(`
  <p>Phonebook has info for ${numPeople} people</p>
  <p>${date}</p>`)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons.filter(person => person.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const id = Math.floor(Math.random()* 10000)
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'content missing' })
  }

  if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({ error: 'name must be unique' })
  }

  const person = {
    "id": id,
    "name": body['name'],
    "number": body['number']
  }

  console.log(id)

  persons.concat(person)
  response.json(person)
})

PORT = 3001
app.listen(PORT, () => {
    console.log('server start on ', PORT)
})