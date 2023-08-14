const express = require('express')
const multer = require('multer')
const path = require('path')
const bodyParser = require('body-parser')
const Images = require('../models/images')
const db = require('../database/images_db.json')



const router = express.Router()

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


router.get('/', (req, res) => { 
    res.json(db)
});

router.post('/', upload.array('images'), async (req, res) => {

    console.log(req.files, req.body)
    const [...imges] = req.files
    
    const objet = imges.map(el => {
        return {
            image_name : el.filename,
            image_path : `/images/${el.filename}`,
            image_size : el.size,
            image_mimetype : el.mimetype,
        }
    })


    // let tuto_images = new Images(objet)
    // tuto_images.register()
    // await res.redirect('/api/images')

    res.json(objet)
})

module.exports = router