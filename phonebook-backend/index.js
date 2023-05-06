const express = require('express');
var morgan = require('morgan')
const cors = require('cors')

const app = express();
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
morgan.token('data', (req, res) => {
  return JSON.stringify(req.body);
});
app.use(cors())

let persons = [
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
    },
    { 
      "id": 5,
      "name": "Lucasio", 
      "number": "39-23-6423123"
    }
]

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})
  
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  const currentDate = new Date();
  const info = `<div>Phonebook has info for ${persons.length} persons</div><div>${currentDate}<div>`
  response.send(info)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find(note => note.id === id);
  if (person) {response.json(person)}
  else {response.status(404).end()}
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const newPerson = request.body;
  if (!newPerson.name) {
    response.status(403).json({ error: 'missing name' });
    return;
  } else if (!newPerson.number) {
    response.status(403).json({ error: 'missing number' });
    return;
  } else {
    for (const person of persons) {
      if (person.name === newPerson.name ) {
        response.status(403).json({ error: 'name must be unique' });
        return;
      }
    }
  }
  newPerson.id = getRandomInt(1000000000);
  persons = persons.concat(newPerson);
  response.json(newPerson);
})
  
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})