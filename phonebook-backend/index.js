require('dotenv').config()
const express = require('express');
var morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const Person = require('./modules/person')

const app = express();
app.use(express.static('./build/'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
morgan.token('data', (req, res) => {
  return JSON.stringify(req.body);
});
app.use(cors())

//---------------------------------------------------------------------------

app.get('/', (request, response) => {
  response.send('<h1>Hello There!</h1>')
})
  
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/info', (request, response) => {
  const currentDate = new Date();
  const info = `<div>Phonebook has info for ${persons.length} persons</div><div>${currentDate}<div>`
  response.send(info)
})

app.get('/api/persons/:id', (request, response) => {
  const getid = Number(request.params.id);
  // hier mongoose =>
  const person = Person.findById(getid).then(person => {
    if (person) {
      response.json(person);
    } else {
      response.status(404).end();
    }
  }).catch(error => {
    console.log(error)
    response.status(500).end()
  })
})

//---------------------------------------------------------------------------

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 
  next(error)
}
// this has to be the last loaded middleware.
app.use(errorHandler)

//---------------------------------------------------------------------------

app.delete('/api/persons/:id', (request, response, next) => {
  // hier mongoose
  const id = Number(request.params.id)
  Person.findByIdAndRemove(id)
    .then(result => response.status(204).end())
    .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
  const body = request.body;
  if (!body.name) response.status(403).json({ error: 'missing name' })
  if (!body.number) response.status(403).json({ error: 'missing number' })
  if (body === undefined) response.status(400).json({ error: 'content missing' })
  Person.find({}).then(persons => {
    for (const person of persons) {
      if (person.name === body.name ) {
        return response.status(403).json({ error: 'name must be unique' });
      }
    }
    const newPerson = new Person({
      name: body.name,
      number: body.number
    })
    newPerson.save()
      .then(savedPerson => response.json(savedPerson))
      .catch(error => next(error))
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})