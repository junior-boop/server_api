
const express = require('express')
const multer = require('multer')
const path = require('path')
const bodyParser = require('body-parser')
const Images = require('../models/images')



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


router.get('/', async (req, res) => { 
    const object = {}
    object.images = []
    object.path = ' '

    const images = new Images(object)
    const data = await images.get()

    res.json(data)
});

router.post('/', upload.array('image'), async (req, res) => {
    const [...imges] = req.files  
    const image_Path = []

    imges.map(el => {
        const object = {}
        object.images = {
            image_name : el.filename,
            image_path : `/images/${el.filename}`,
            image_size : el.size,
            image_mimetype : el.mimetype,
            createdAt : new Date()
        }
        object.path = `/images/${el.filename}`

        // let tuto_images = new Images(object)
        // tuto_images.register()
        image_Path.push(object.images.image_path)
    })
    res.json(image_Path)
})

module.exports = router