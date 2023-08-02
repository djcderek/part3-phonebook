require('dotenv').config()
const express = require('express')
const morgan  = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('data', (req, res) => {
  return JSON.stringify(req.body)
})
app.use((morgan(':method :url :status :res[content-length] - :response-time ms :data')))

app.get('/api/persons', (request, response) => {
  //response.json(persons)
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
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
  Person.findOneAndDelete({_id: request.params.id}).then(result => {
    response.status(204).end()
  })
})

app.post('/api/persons', (request, response) => {
  // const id = Math.floor(Math.random()* 10000)
  // const body = request.body
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'content missing' })
  }
  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log('server start on ', PORT)
})