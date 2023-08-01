const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    Person.find({}).then( result => {
        console.log('phonebook:')
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
        process.exit(1)
    })
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://derekthec2:${password}@cluster0.xqyphgo.mongodb.net/phoneBookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const newPerson = new Person({
    name: name,
    number: number
})

if (process.argv.length === 5) {
    newPerson.save().then( result => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
}