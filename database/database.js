const mongoose = require('mongoose')
const { Level } = require('level')

// Mongodb URI
const MONGODB_URI = `mongodb+srv://juniorseppo3:k7pnlI25sQpe61WJ@cluster0.pssbfri.mongodb.net/?retryWrites=true&w=majority`
let isConnected = false

const connectToDB = async () => {
    mongoose.set('strictQuery', true)

    if(isConnected) {
        return
    }
    
    try {
        await mongoose.connect(MONGODB_URI, {
            dbName : 'share_prompt',
            useNewUrlParser : true,
            useUnifiedTopology : true
        })

        isConnected = true
    } catch (error) {
        console.log(error)
    }
} 

const db = new Level('../database')
const ressourcesDb = db.sublevel('articles')
const imagesDB = db.sublevel('images')

module.exports = {
    db, 
    ressourcesDb, 
    imagesDB
}