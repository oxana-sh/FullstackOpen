const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const name= process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://fullstack:${password}@cluster0.lpbzz3u.mongodb.net/phonebookApp?retryWrites=true&w=majority`

const phoneBookSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: String,
})

const Phonebook = mongoose.model('Phonebook', phoneBookSchema)
const person = new  Phonebook ({ name: name, number: number })
mongoose
  .connect(url)
  .then(() => {
    console.log('connected')

    if (process.argv.length === 3){
      Phonebook.find({}).then((result) => {
        result.forEach(persons => {
          console.log(`${persons.name}: ${persons.number}`)
        })
        mongoose.connection.close()
      })
    }
    else{
      return person.save()
        .then(() => {
          console.log(`added ${name} number: ${number} to phonebook`)
          return mongoose.connection.close()
        })
        .catch((err) => console.log(err))
    }
  })









