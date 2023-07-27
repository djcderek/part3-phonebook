const express = require('express')
const app = express()

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
  console.log(person)
  response.json(person)
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

PORT = 3001
app.listen(PORT, () => {
    console.log('server start on ', PORT)
})