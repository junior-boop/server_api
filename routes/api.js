const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const router = express.Router()
const images = require('./images')
const cors = require('cors')
const path = require('path')
const articles = require('../routes/articles')
const ressources = require('../routes/ressources')
const inscriprion = require('../routes/users')
const { imagesDB, newsletter } = require('../database/database')
const generated_ID = require('./idgen')


router.use(bodyParser.urlencoded({ extended : false}))
router.use(bodyParser.json())




const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, './images')
    },
    filename : (req, file, cb) => {
        cb(null, "image_" + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage : storage})


router.use(cors())
router.use('/images', images)
router.use('/articles', articles)
router.use('/ressources', ressources)
router.use('/inscription', inscriprion)



// news letter
router.route('/newsletter')
    .get((req, res) => {
       res.json("newsletter")
    })

router.post('/newsletter', upload.single('image'), (req, res) => {
        const keyImages = "" + Date.now() + "_" + generated_ID()
        const {mail} = req.body
        console.log(mail)
        const Newsletter = {
            mail, 
            key : keyImages,
            createdAt : new Date()
        } 
        newsletter.put(keyImages, JSON.stringify(Newsletter))
        console.log(Newsletter)
        res.json("mail")
})
router.delete('/newsletter/:id', upload.single('image'), (req, res) => {
        const { id } = req.params

        newsletter.del(id)
        .then(() => {
            console.log("==> DEL | mail d'id supprimer : ", id)
        })
        .catch (reason => {
            console.log(reason)
        }) 
        res.json("DELETE")
})

// telechargement de l'image dans l'editeur de texte

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

// fetch Url 
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