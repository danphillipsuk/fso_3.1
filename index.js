const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors')

app.use(express.json());
app.use(cors())
app.use(express.static('build'))
morgan.token('person', (request, response) => {
  return JSON.stringify(request.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))

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
    "name": "This is coming from backend", 
    "number": "94785239"
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Phonebook</h1>');
})

app.get('/api/persons', (request, response) => {
  response.json(persons);
})

// get individual entry from persons
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find(person => person.id === id);

  if (person) {
    response.json(person)
  } else {
    response.status(404).end();
  }
})

// get number of entries in persons
app.get('/info', (request, response) => {
  const num = persons.length;
  const date = new Date();
  response.send(`<p>Phonebook has info for ${num} people.</p><p>${date}`);
})

// delete a persons from persons
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter(person => person.id !== id);
  console.log(response)
  response.status(204).end();
})

// Add a person to persons 
const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(p => p.id))
    : 0;
  return maxId + 1;
}

app.post('/api/persons', (request, response) => {
  const body = request.body;
  // check if name is empty
  if (!body.name) {
    return response.status(400).json({
      error: 'Name is missing'
    })
  }
  // check if number is empty
  if (!body.number) {
    return response.status(400).json({
      error: 'Number is missing'
    })
  }
  // check if name is unique
  const duplicateName = persons.find(person => person.name === body.name);
  if (duplicateName) {
    return response.status(400).json({
      error: 'Name already exists in phonebook'
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person);

  response.json(person);
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})

