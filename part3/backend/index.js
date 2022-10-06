require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
let newDate = new Date()
const Phonebook = require('./models/person')
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
app.use(express.json())
app.use(requestLogger)
app.use(cors())
app.use(express.static('build'))
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :status :res[content-length] - :response-time ms :body'))

app.get('/', morgan('tiny'), (request, response) => {
  response.send('<h1>Hello World!</h1>')
})
app.get('/info',  (request, response) => {
  Phonebook.find({}).then(persons => {
    response.send(`<h4>Phonebook has info for ${persons.length} people</h4>${newDate}`)
  })
})

app.get('/api/persons',  (request, response) => {
  Phonebook.find({}).then(p => {
    response.json(p)
  })
})

app.get('/api/persons/:id', (request, response,next) => {
  Phonebook.findById(request.params.id).then(result => {
    response.json(result)
  })
    .catch(error => next(error))
})

app.delete('/api/persons/del/:id', (request, response, next) => {
  Phonebook.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  const person = new Phonebook({
    name: body.name,
    number: body.number,
  })
  person.save()
    .then(savePerson => {
      response.json(savePerson)
    })
    .catch(error => next(error))

})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const person = {
    number: body.number,
  }
  Phonebook.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
