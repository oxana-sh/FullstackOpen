const mongoose = require('mongoose')
const url = process.env.MONGODB_URI
console.log('connecting to', url)
mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const phoneBookSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [2, 'Name: {VALUE} is shorter then the minimum allowed (2)'],
    required: true,
    unique: true,
  },
  number: {
    type: String,
    minLength: [8, 'Phone number: {VALUE} is shorter then the minimum allowed (8)'],
    validate: {
      validator: function(v) {
        return /\d{2}-\d{4}/.test(v)
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, 'User phone number required']
  }
})
phoneBookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
module.exports = mongoose.model('Phonebook', phoneBookSchema)
