const bodyParser = require('body-parser');
const express = require('express');
const multer = require('multer')
const path = require('path')
const { ressourcesDb } = require('../database/database')


const router = express.Router();


const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, './images')
    },
    filename : (req, file, cb) => {
        cb(null, "image_" + Date.now() + path.extname(file.originalname))
    }
})


const upload = multer({ storage : storage})

router.use(bodyParser.urlencoded({ extended : false}))
router.use(bodyParser.json())



router.get('/', async (req, res) => {
    const data = await Ressource.find({})
    res.json(data)
});
router.post('/', async (req, res) => {
    const { images, titre, description, createdAt, createdBy, categorie, like, download, share } = await req.body

    try{
       
        const ressources = { images, titre, description, createdAt, createdBy, categorie, like, download, share }

        console.log(ressources)
        res.json(ressources)
    } catch (reason) {
        console.log(reason)
        res.status(500)
    }
});

router.get('/add', (req, res) => {
        res.render('pages/auteurs', { name : "Nouvel Auteur", data : Categories})
      })
router.post('/add', async (req, res) => {   
        const {nom, prenom, tel, email, url, categorie}  = req.body;

        let auteur = {name : nom, surname : prenom, phone : tel, mail : email, website : url, categories : categorie, imag : images.filename}
        // auteur.register()
        res.redirect('/auteur')
    })

module.exports = router