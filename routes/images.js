
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
    const [...imges] = req.files  
    const image_Path = []

    imges.map(el => {
        const object = {}
        object.images = {
            image_name : el.filename,
            image_path : `/images/${el.filename}`,
            image_size : el.size,
            image_mimetype : el.mimetype,
        }
        object.path = `/images/${el.filename}`

        let tuto_images = new Images(object)
        tuto_images.register()
        image_Path.push(object.images.image_path)
    })
    // await res.redirect('/api/images')
    res.json(image_Path)
})

module.exports = router