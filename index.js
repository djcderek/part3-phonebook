require('dotenv').config()
const express = require('express')
const morgan  = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

const errorHandler = (error, request, response, next) => {
  console.log(error)
  if (error.name === 'CastError') {
    return response.status(400).send({error: 'malformed id'})
  }

  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint'})
}

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
  Person.countDocuments({})
    .then( count => {
      const date = Date()
      console.log('Phonebook has', count)
      console.log(date)
      response.send(`
      <p>Phonebook has info for ${count} people</p>
      <p>${date}</p>
      `)
    })
  // const numPeople = persons.length
  // const date = Date()
  // console.log('Phonebook has', numPeople)
  // console.log(date)
  // response.send(`
  // <p>Phonebook has info for ${numPeople} people</p>
  // <p>${date}</p>`)
})

app.delete('/api/persons/:id', (request, response) => {
  Person.findOneAndDelete({_id: request.params.id}).then(result => {
    response.status(204).end()
    console.log(typeof request.params.id)
  })
})

app.post('/api/persons', (request, response) => {
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

app.put('/api/persons/:id', (request, response) => {
  const body = request.body
  Person.findOneAndUpdate({name: body.name}, {number: body.number}, {new: true})
    .then(result => {
      console.log(result)
      response.json(result)
    })
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log('server start on ', PORT)
})