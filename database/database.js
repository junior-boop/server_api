
const { Level } = require('level')


const db = new Level('../database')
const ressourcesDb = db.sublevel('articles')
const imagesDB = db.sublevel('images')
const newsletter = db.sublevel('newsletter')
const userDB = db.sublevel('user')

module.exports = {
    db, 
    ressourcesDb, 
    imagesDB,
    newsletter,
    userDB
}