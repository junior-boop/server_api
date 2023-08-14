const express = require('express')
const categories = require('../database/categories.json')
const auteurs = require('../database/categories.json')
const fs = require('fs')
const bodyParser = require('body-parser')


const router = express.Router()
router.use(bodyParser.urlencoded({ extended : true}))


router.route('/')
.get((req, res) => {
    res.render('pages/index', {name : "Tutoriels", data : categories})
});

router.route('/add')
.get((req, res) => {
    res.render('pages/new_tuto', { name : "Nouveau Tuto", data1 : categories, data2 : auteurs})
})
.post((req, res) => {
    console.log(req.body)
})


router.route('/categories')
.get((req, res) => {
    res.render('pages/categories', { name : "Abonnés"} )
})
.post((req, res) => {
    const {nom, shot} = req.body
    let nouveau = new Categorie({nom, shot})
    nouveau.save()
    res.redirect('/tutos')
})


module.exports = router



function Categorie({nom, shot}){
    this.name = nom;
    this.shot = shot;
}

Categorie.prototype.save = function(){
    const {name, shot} = this
    let data = fs.readFileSync('./database/categories.json', { encoding : 'utf-8', flag : 'r'} )

    let state = JSON.parse(data)
 
    const finish = {
        name : name,
        location : `/tutos/${shot}`,
        shot : `/${shot}`,
        counter : 0
    }

    state.push(finish)

    fs.writeFileSync('./database/categories.json', JSON.stringify(state, null, 1))
    
}

