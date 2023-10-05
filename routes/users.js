const bodyParser = require('body-parser');
const express = require('express');
const multer = require('multer')
const path = require('path')
const router = express.Router();
const generated_ID = require('./idgen')
const { userDB } = require('../database/database')

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
    const data = []

    for await (const [key, value] of userDB.iterator()){
        data.push({key : key, value : JSON.parse(value)})
    }
    console.log(data)
    res.json(data)
})

router.get('/:id', async (req, res) => {
    const { id } = req.params
    try{
        const user = await userDB.get(id)
        console.log('==> get user with id: ', id)
        
        res.json(user)
    } catch (reason){
        console.log(reason)
        res.status(500)
    }
    
})
router.put('/:id', async (req, res) => {
    // const { id } = req.params
    const data = req.body
    try{
        // const user = await userDB.get(id)
        console.log('==> get user with id: ', data)
        res.json(data)
        // res.json(user)
    } catch (reason){
        console.log(reason)
        res.status(500)
    }
    
})
router.delete('/:id', async (req, res) => {
    const { id } = req.params
    
    userDB.del(id).then(() => {
        console.log(`==> User with id : ${id}, has been remove correctly`)
    })

    res.json(`User with id : ${id}, has been remove correctly`)
})

// log in

router.get('/login', (req, res) => {
    res.json("je suis sur la route Users")
})
router.post('/login', async (req, res) => {    
    
    const { mail, pw }  = req.body;
    const data = []
    for await (const [key, value] of userDB.iterator()){
        
        const v= JSON.parse(value)
        if(v.mail === mail) {
            if(v.pw === pw) {
                data.push({key : key, value : JSON.parse(value)})
            }
        }
    }
    console.log(`user ${mail} logIn`, data[0])
    res.json(data[0])
})

//signIn
router.get('/signin', (req, res) => {
    res.json("je suis sur la route Users")
})
router.post('/signin', upload.single('image'), async (req, res) => {  
    const response = req.body
    const {name, surname, tel, mail, pw, town, like, share}  = response;

    try{
        const keyImages = "" + Date.now() + "_" + generated_ID()
        const user = {
            name, 
            surname, 
            tel, 
            pw, 
            mail,
            town, 
            createdAt : new Date(),
        }

        user.key = keyImages
        userDB.put(keyImages, JSON.stringify(user))

        console.log("==> User saved correctly with key :", keyImages)
        res.json(user)
    } catch(reason) {
        console.log(reason)
        res.status(500, 'probleme server')
    }
})

module.exports = router


// aws-mail