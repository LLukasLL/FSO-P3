const mongoose = require('mongoose')

console.log(process.argv.length)

if (process.argv.length<3) {
  console.log('no password provided')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://lukasmichaelfischer:${password}@clusterlf.zovaiyp.mongodb.net/?retryWrites=true&w=majority`
mongoose.set('strictQuery',false)
mongoose.connect(url)
console.log("afterconnection")
const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})
const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5) {
    const name = process.argv[3]
    const number = process.argv[4]

    const person = new Person({
        name: name,
        number: number
    })
    person.save().then(result => {
      console.log(`added ${result.name} number ${result.number} to phonebook`)
      mongoose.connection.close()
    })
} else if (process.argv.length === 3) {
  console.log('phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    process.exit(1);
  })
} else {
  console.log('wrong number of arguments')
  process.exit(1)
}
