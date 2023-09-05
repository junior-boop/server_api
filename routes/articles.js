const bodyParser = require('body-parser');
const express = require('express');
const multer = require('multer')
const path = require('path')
// const config = require('../config')
const generated_ID = require('./idgen')

const { ressourcesDb, imagesDB } = require('../database/database')

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
    const tb = []
    for await (const [key, value] of ressourcesDb.iterator()){
        tb.push({key : key, value : JSON.parse(value)})
    }

    console.log('GET request /articles')
    res.json(tb)
});

router.post('/', upload.array('image'), async (req, res) => {
    const { contenu, titre, imagesAlbum } = await req.body
    const data_image = req.files
    const table = 'articles'

    const [...imges] = req.files  
    const imageData = []
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

        imageData.push(object.path)
        imagesDB.put(keyImages, JSON.stringify(object))

        return object
    })

    const params = {
        TableName : table
    }
    
    try{
        const keyValue = "" + Date.now() + "_" + generated_ID()
        const article = {
            key : keyValue,
            images : imageData, 
            contenu : JSON.parse(contenu),
            titre : titre, 
            imagesAlbum : imagesAlbum,
            createdAt : new Date(),
            published : false,
            createdBy : {
                name : "Daniel Seppo Eke",
                surname : '',
                user_id : ''
            }
        }

        params.Item = article

        ressourcesDb.put(keyValue, JSON.stringify(params))
        console.log('==> articles enregistre : ', "key : " + keyValue)

        res.json(article)

    } catch (reason) {
        console.log(reason)
        res.status(500, 'il y a un probleme' + reason)
    }

   
});

router.delete('/:id', (req, res) => {
    const { id } = req.params

    ressourcesDb.del(id)
    console.log('DEL request /article/:'+id)
    res.json('supprimer')
})

router.get('/edit/:id', async (req, res) => {
    
    const { id } = req.params
    console.log('GET request /article/edit/:'+id)

    const data = await ressourcesDb.get(id)
    res.json(JSON.parse(data))
});

module.exports = router