const bodyParser = require('body-parser');
const express = require('express');
const multer = require('multer')
const path = require('path')

const router = express.Router();
// const Auteur = require('../models/auteur');
const connectToDB = require('../database/database');
// const User = require('../models/users');

const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, './images')
    },
    filename : (req, file, cb) => {
        cb(null, "image_" + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage : storage})

router.use(bodyParser.urlencoded({ extended : true}))




// router.get('/', (req, res) => {
//     res.json("je suis sur la route Users")
// })
// router.post('/', async (req, res) => {    
//     console.log(req.body) 
//     const {nom, prenom, tel, email, url, categorie}  = req.body;

//     let auteur = new Auteur({name : nom, surname : prenom, phone : tel, mail : email, website : url, categories : categorie, imag : images.filename})
//     auteur.register()
//     await res.redirect('/auteur')
// })

router.get('/login', (req, res) => {
    res.json("je suis sur la route Users")
})
router.post('/login', async (req, res) => {    
    console.log(res.json()) 
    // const {nom, prenom, tel, email, url, categorie}  = req.body;

    // let auteur = new Auteur({name : nom, surname : prenom, phone : tel, mail : email, website : url, categories : categorie, imag : images.filename})
    // auteur.register()
    await res.json('req.body')
})

//signIn
router.get('/signin', (req, res) => {
    res.json("je suis sur la route Users")
})
router.post('/signin', upload.single('image'), async (req, res) => {  
    const response = req.body
    const {name, surname, tel, mail, pw, town, like, share}  = response;

    try{
        const user = {
            name, 
            surname, 
            tel, 
            pw, 
            mail,
            town, 
            like : [],
            share : []
        }

        res.json(user)
    } catch(reason) {
        console.log(reason)
        res.status(500, 'probleme server')
    }
})

module.exports = router