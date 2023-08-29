
const { Level } = require('level')


const db = new Level('../database')
const ressourcesDb = db.sublevel('articles')
const imagesDB = db.sublevel('images')

module.exports = {
    db, 
    ressourcesDb, 
    imagesDB
}