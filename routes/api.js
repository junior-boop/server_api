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
const path = require('path')
const articles = require('../routes/articles')
const ressources = require('../routes/ressources')
const inscriprion = require('../routes/users')
const { imagesDB } = require('../database/database')


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
router.use('/articles', articles)
router.use('/ressources', ressources)
router.use('/inscription', inscriprion)


router.route('/tutos')
    .get((req, res) => {
       console.log(req.params.id)
       res.json(database)
    })

    .post((req, res) => {
        console.log(req.params, req.body)
        
    })
router.route('/image_content')
    .get((req, res) => {
       res.json("images content")
    })

router.post('/image_content', upload.single('image'), async (req, res) => {

        const image = req.file
        
        const response = {
            success : 1,
            file: {
                url : "http://18.215.69.15:3000/images/" + image.filename,
                size : image.size,
                filename : image.filename
            }
        };

        () => {
            const keyImages = "" + Date.now() + "_" + generated_ID()
            const object = {}
            object.images = {
                image_name : image.filename,
                image_path : `/images/${el.filename}`,
                image_size : image.size,
                image_mimetype : image.mimetype,
                createdAt : new Date()
            }
            object.path = `/images/${image.filename}`
    
            imagesDB.put(keyImages, JSON.stringify(object))
    
        }

        console.log("==> image save to :", "http://18.215.69.15:3000"+response.file.url)
        res.json(response)
        
    })
router.route('/fetchUrl')
    .get(async (req, res) => {
        const {url} = req.query
        const metaData = await fetch(`https://jsonlink.io/api/extract?url=${url}`)
        const { title, description, images, domain} = await metaData.json()


        const response = {
            success : 1,
            link: url, 
            meta: {
                title,
                description,
                image : {
                    url : images[0]
                }
            }
        }
        console.log("==> url fetching for meta data : ", response.meta.title, response.link)
        res.json(response)
    })




module.exports = router