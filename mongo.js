const mongoose = require('mongoose')

// if (process.argv.length < 3) {
//   console.log('Please provide the password as an argument: node mongo.js <password>')
//   process.exit(1)
// }

const password = process.argv[2]
const personName = process.argv[3]
const personNumber = process.argv[4]

const url =
  `mongodb+srv://danPhone:${password}@cluster0.fuzt0.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url)

  const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  })

  const Person = mongoose.model('Person', personSchema)

  const person = new Person({
    name: personName,
    number: personNumber,
  })

  if(!personName || !personNumber) {
    Person.find({}).then(result => {
      result.forEach(person => {
        console.log(person)
      })
      mongoose.connection.close()
    }) 
  } else {
    person.save().then(result => {
      console.log(`Added ${personName} number ${personNumber} to phonebook`)
      mongoose.connection.close()
    })
  }

