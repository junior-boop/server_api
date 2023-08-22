const bodyParser = require('body-parser');
const express = require('express');
const multer = require('multer')
const path = require('path')

const Article = require('../models/articles')
const connectToDB = require('../database/database')

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
router.use(bodyParser.urlencoded({ extended : true}))



router.get('/', async (req, res) => {
    const data = await Article.find({})
    res.json(data)
});
router.post('/', upload.array('image'), async (req, res) => {
    const { contenu, titre, imagesAlbum } = await req.body
    const data_image = await req.files
    
    try{
        await connectToDB()
        const article = await new Article({
            images : data_image, 
            contenu : contenu,
            titre : titre, 
            imagesAlbum : imagesAlbum,
            createdAt : new Date(),
            createdBy : {
                name : "Daniel Seppo Eke",
                surname : '',
                user_id : ''
            }
        })

        await article.save()
        res.json(article)
        res.status(200)
    } catch (reason) {
        console.log(reason)
        res.status(500, 'il y a un probleme' + reason)
    }

   
});

module.exports = router