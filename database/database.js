const { Level } = require('level')
const db = new Level('../database')
const ressourcesDb = db.sublevel('articles', {valueEncoding :'json'})
const imagesDB = db.sublevel('images', { valueEncoding : 'json'})
const newsletter = db.sublevel('newsletter')
const userDB = db.sublevel('user', {valueEncoding : 'json'})
const ressourcesElementDB = db.sublevel('ressources', { valueEncoding : 'json'})

module.exports = {
    db, 
    ressourcesDb, 
    imagesDB,
    newsletter,
    userDB,
    ressourcesElementDB
}