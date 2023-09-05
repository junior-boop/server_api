
const express = require('express')
const multer = require('multer')
const path = require('path')
const bodyParser = require('body-parser')
const { imagesDB } = require('../database/database')
const generated_ID = require('./idgen')
const fs = require('fs')


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
    const tb = []
    for await (const [key, value] of imagesDB.iterator()){
        tb.push({key : key, value : value})
    }

    console.log('GET request /images')
    res.json(tb)
});

router.post('/', upload.array('image'), async (req, res) => {
    const [...imges] =  req.files  
    const image_Path = []

    console.log(req.files)

    imges.map(el => {
        const keyImages = "" + Date.now() + "_" + generated_ID()
        const object = {}
        object.images = {
            image_name : el.filename,
            image_path : `/images/${el.filename}`,
            image_size : el.size,
            image_mimetype : el.mimetype,
            createdAt : new Date()
        }
        object.path = `/images/${el.filename}`

        // let tuto_images = new ImagesModel(object)
        imagesDB.put(keyImages, JSON.stringify(object))

        image_Path.push(object.images.image_path)
        console.log("==> image save to :", 'http://18.215.69.15:3000' + object.images.image_path)
    })
    
    res.json(image_Path)
})


router.delete('/:id', upload.array('image'), async (req, res) => {
    const { id } = req.params


    const image = await imagesDB.get(id)
    // console.log(image)
    const value = JSON.parse(image)
    const imagename = value.images.image_name

    console.log('imagename',imagename)

    const filePath = './images/'+imagename

    

    if(fs.existsSync(filePath)) {
        // The file exists, so you can proceed with deleting it
        try {
            fs.unlinkSync(filePath)
            // imagesDB.del(id)
            console.log('File deleted successfully')
        } catch (err) {
            console.error(err)
        }
    } else {
        console.log('File not found')
    }

    console.log(`DEL api/images/ | image id: ${id}`)
    res.json(' ')
}) 

module.exports = router