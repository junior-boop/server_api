const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const router = express.Router()
const images = require('./images')
const database = require('../database/database.json')
const auteurs = require('../database/auteurs.json')
const categories = require('../database/categories.json')
const images_db = require('../database/images_db.json')
const cors = require('cors')


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


router.use(cors())
router.use('/images', images)


router.route('/tutos')
    .get((req, res) => {
       console.log(req.params.id)
       res.json(database)
    })

    .post((req, res) => {
        console.log(req.params, req.body)
        
    })
router.route('/images_db')
    .get((req, res) => {
       res.json(images_db)
    })

router.post('/images_db', upload.array('images'), async (req, res) => {

        console.log(req)

        // const [...imges] = req.files
        // const objet = {
        //     name : req.body.name
        // }

        // objet.images = imges.map(el => {
        //     return {
        //         image_name : el.filename,
        //         image_path : `/images/${el.filename}`,
        //         image_size : el.size,
        //         image_mimetype : el.mimetype,
        //     }
        // })


        // let tuto_images = new Images(objet)
        // tuto_images.register()
        // await res.redirect('/api/images')
    })
router.route('/auteurs')
    .get((req, res) => {
       res.json(auteurs)
    })

    .post((req, res) => {
        console.log(req.params, req.body)
        
    })




module.exports = router