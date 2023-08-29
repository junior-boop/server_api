const bodyParser = require('body-parser');
const express = require('express');
const multer = require('multer')
const path = require('path')

const router = express.Router();
const Categories = require('../database/categories.json');
const Auteurs = require('../database/auteurs.json');

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


router.route('/')
    .get(async (req, res) => {
        await res.render('pages/index', { name : "Auteurs", data : Auteurs, })
    });

router.get('/add', (req, res) => {
        res.render('pages/auteurs', { name : "Nouvel Auteur", data : Categories})
      })
router.post('/add', upload.single('image'), async (req, res) => {    
        const images = req.file   
        console.log(images, req.body) 
        // req.on('data', data => console.log(data, images))
        const {nom, prenom, tel, email, url, categorie}  = req.body;

        let auteur = {name : nom, surname : prenom, phone : tel, mail : email, website : url, categories : categorie, imag : images.filename}
        // auteur.register()
        await res.redirect('/auteur')
    })

module.exports = router