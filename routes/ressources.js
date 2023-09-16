const bodyParser = require('body-parser');
const express = require('express');
const multer = require('multer')
const path = require('path')
const { ressourcesElementDB, userDB } = require('../database/database')
const generated_ID = require('./idgen')


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
    const tb = []
    for await (const [key, value] of ressourcesElementDB.iterator()){
        tb.push({key : key, value : value})
    }

    console.log('GET request /ressources')
    res.json(tb)
});

router.get('/:id', async (req, res) => {
    const { id } = req.params

    try{
        const user = await ressourcesElementDB.get(id)
        console.log('==> get ressources with id: ', id)
        res.json(user)
    } catch (reason){
        console.log(reason)
        res.status(500)
    }
});

// like
router.put('/:id/like', async (req, res) => {
    const { id } = req.params
    const { like } = req.query

    try{
        const ressources = await ressourcesElementDB.get(id)
        const user = await userDB.get(like)

        const ckeck = ressources.like.filter(el => el === like)
        if(ckeck.length < 1) {
            const newValue = {...ressources, like : [...ressources.like, like] }
            await ressourcesElementDB.put(id, newValue)
            res.json(newValue)
        } else {
            const remove = ressources.like.filter(el => el !== like)
            const newValue = {...ressources, like : [...remove] }
            await ressourcesElementDB.put(id, newValue)
            res.json(newValue)
        }
        console.log('==> get ressources with id: ', id)
    } catch (reason){
        console.log(reason)
        res.status(500)
    }

    
});

// share
router.put('/:id/share', async (req, res) => {
    const { id } = req.params
    const { share } = req.query

    try{
        const ressources = await ressourcesElementDB.get(id)
        const newValue = {...ressources, sahre : [...ressources.share, share] }
        await ressourcesElementDB.put(id, newValue)
        console.log('==> get ressources with id: ', id, )
        res.json(newValue)
    } catch (reason){
        console.log(reason)
        res.status(500)
    }
});


router.post('/', async (req, res) => {
    const { images, titre, description, createdAt, createdBy, categorie, like, download, share } = await req.body

    try{
       const key = "" + Date.now() + "_" + generated_ID()
        let ressources = { images, titre, description, createdAt, createdBy, categorie, like, download, share }

        console.log(ressources)
        await ressourcesElementDB.put(key, ressources)
        res.json(ressources)
    } catch (reason) {
        console.log(reason)
        res.status(500)
    }
});



module.exports = router