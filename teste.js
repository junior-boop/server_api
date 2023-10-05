const express = require('express');
const bodyParser = require('body-parser')
const multer = require('multer')
const cors = require('cors')
const app = express();
const https = require("https");
const API = require('./routes/api')

// Database
const { Level } = require('level')
const db = new Level('./database')
const ressourcesDb = db.sublevel('articles', {valueEncoding :'json'})
const imagesDB = db.sublevel('images', { valueEncoding : 'json'})
const newsletter = db.sublevel('newsletter', {valueEncoding: 'json'})
const userDB = db.sublevel('user', {valueEncoding : 'json'})
const ressourcesElementDB = db.sublevel('ressources', { valueEncoding : 'json'})
const requete = db.sublevel('requete', {valueEncoding : 'json'})
const files_db = db.sublevel('files_db', {valueEncoding : 'json'})

const generated_ID = require('./routes/idgen')

// function generated_ID(){
//     const A = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567>//     let id = ''
//     for (let i = 0; i < 6; i++) {
//         const random = Math.floor((Math.random() * 100) * 0.63)
//         id += A[random]
//     }

//     return id
// }


const path = require('path')
// const { userDB, ressourcesElementDB, imagesDB, ressourcesDb, newsletter } >const fs = require('fs')

const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, './images' )
    },
    filename : (req, file, cb) => {
        cb(null, "image_" + Date.now() + path.extname(file.originalname))     
    }
})
const filesStorage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, './files' )
    },
    filename : (req, file, cb) => {
        cb(null, "files_" + Date.now() + path.extname(file.originalname))     
    }
})

app.use(cors())
const upload = multer({ storage : storage})
const files_upload = multer({ storage : filesStorage})
app.use(bodyParser.urlencoded({extended : false}))
app.use(bodyParser.json())
// app.use('/assets', express.static('public'));
app.use('/images', express.static('images'));

https.createServer()


app.get('/', (req, res) => {
  res.json({
    ID : generated_ID(),
    ville : "yaounde",
    pays : 'Cameroun'
  })
});


app.get('/api/newsletter', async (req, res) => {
        const data = []

        for await (const [key, value] of newsletter.iterator()){
            data.push({key : key, value : JSON.parse(value)})
        }
        console.log('==> GET Request /newsletter')
        res.json(data)
    })

app.post('/api/newsletter', upload.single('image'), (req, res) => {
        const keyImages = "" + Date.now() + "_" + generated_ID()
        const {mail} = req.body
        console.log(mail)
        const Newsletter = {
            mail, 
            key : keyImages,
            createdAt : new Date()
        } 
        newsletter.put(keyImages, Newsletter)
        console.log(Newsletter)
        res.json("mail")
})
app.delete('/api/newsletter/:id', upload.single('image'), (req, res) => {     
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

app.route('/api/image_content')
    .get((req, res) => {
       res.json("images content")
    })

app.post('/api/image_content', upload.single('image'), async (req, res) => {  

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
    
            imagesDB.put(keyImages, object)
    
        }

        console.log("==> image save to :", "http://18.215.69.15:3000"+response.file.url) 
        res.json(response)
        
})

// fetch Url 
app.route('/api/fetchUrl')
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



// user all routes

app.get('/api/inscription/', async (req, res) => {
    const data = []

    for await (const [key, value] of userDB.iterator()){
        data.push({key : key, value : JSON.parse(value)})
    }
    console.log(data)
    res.json(data)
})

app.get('/api/inscription/:id', async (req, res) => {
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

app.put('/api/inscription/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params
    const data = req.body
    const {name, surname, mail, tel, pw, town } = data
    console.log(data)
    try{
        const user = await userDB.get(id)
        console.log('==> get user with id: ', id)
        
        const ParseUser = JSON.parse(user)
        const result = {...ParseUser, name, surname, mail, tel, pw, town, updatedAt : new Date()}    
        userDB.put(id, JSON.stringify(result))

        res.json(result)
    } catch (reason){
        console.log(reason)
        res.status(500)
    }
    
})

app.delete('/api/inscription/:id', async (req, res) => {
    const { id } = req.params
    
    userDB.del(id).then(() => {
        console.log(`==> User with id : ${id}, has been remove correctly`)
    })

    res.json(`User with id : ${id}, has been remove correctly`)
})


// log in

app.get('/api/inscription/login', (req, res) => {
    res.json("je suis sur la route Users")
})
app.post('/api/inscription/login', async (req, res) => {    
    
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
app.get('/api/inscription/signin', (req, res) => {
    res.json("je suis sur la route Users")
})
app.post('/api/inscription/signin', upload.single('image'), async (req, res) => {  
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

// Ressources, All ressources routes


app.get('/api/ressources/', async (req, res) => {
    const tb = []
    for await (const [key, value] of ressourcesElementDB.iterator()){
        tb.push({key : key, value : value})
    }

    console.log('GET request /ressources')
    res.json(tb)
});

app.get('/api/ressources/:id', async (req, res) => {
    const { id } = req.params

    try{
        const user = await ressourcesElementDB.get(id)
        console.log('==> get ressources with id: ', id)
        res.json(user)
    } catch (reason){
        console.log(reason)
        res.status(500)
    }
});

app.delete('/api/ressources/:id', async (req, res) => {
    const { id } = req.params
    
    ressourcesElementDB.del(id).then(() => {
        console.log(`==> User with id : ${id}, has been remove correctly`)
    })

    res.json(`User with id : ${id}, has been remove correctly`)
})

// like
app.put('/api/ressources/:id/like', async (req, res) => {
    const { id } = req.params
    const { like } = req.query

    try{
        const ressources = await ressourcesElementDB.get(id)
        const user = await userDB.get(like)

        const ckeck = ressources.like.filter(el => el === like)
        if(ckeck.length < 1) {
            const newValue = {...ressources, like : [...ressources.like, like] }
            await ressourcesElementDB.put(id, newValue)
            res.json(newValue)
        } else {
            const remove = ressources.like.filter(el => el !== like)
            const newValue = {...ressources, like : [...remove] }
            await ressourcesElementDB.put(id, newValue)
            res.json(newValue)
        }
        console.log('==> get ressources with id: ', id)
    } catch (reason){
        console.log(reason)
        res.status(500)
    }

    
});

// share
app.put('/api/ressources/:id/share', async (req, res) => {
    const { id } = req.params
    const { share } = req.query

    try{
        const ressources = await ressourcesElementDB.get(id)
        const newValue = {...ressources, sahre : [...ressources.share, share] }
        await ressourcesElementDB.put(id, newValue)
        console.log('==> get ressources with id: ', id, )
        res.json(newValue)
    } catch (reason){
        console.log(reason)
        res.status(500)
    }
});

app.post('/api/ressources/', files_upload.array('files'), async (req, res) => {
    const { images, titre, description, createdAt, createdBy, categorie, like, download, share } = await req.body
    const [...files ] = req.files
 
    const files_Path = []

    files.map(el => {
        const keyImages = "" + Date.now() + "_" + generated_ID()
        const object = {}
        object.images = {
            files_name : el.filename,
            files_originalname : el.originalname, 
            files_path : `/files/${el.filename}`,
            files_size : el.size,
            files_mimetype : el.mimetype,
            createdAt : new Date()
        }
        object.path = `/files/${el.filename}`

        files_db.put(keyImages, object)

        files_Path.push({
            files_name : object.images.files_name,
            files_path : object.images.files_path,
            files_mimetype : object.images.files_mimetype,
            files_size : object.images.files_size,

        })
        console.log("==> image save to :", 'http://18.215.69.15:3000' + object.images.files_path)
    })
    

    try{
       const key = "" + Date.now() + "_" + generated_ID()
        let ressources = { images, titre, description, createdAt, createdBy, categorie, like, download, share, files_Path }

        console.log(ressources)
        await ressourcesElementDB.put(key, ressources)
        res.json(ressources)
    } catch (reason) {
        console.log(reason)
        res.status(500)
    }
});


// Images, all Images Routes

app.get('/api/images/', async (req, res) => { 
    const tb = []
    for await (const [key, value] of imagesDB.iterator()){
        tb.push({key : key, value : value})
    }

    console.log('GET request /images')
    res.json(tb)
});

app.post('/api/images/', upload.array('image'), async (req, res) => {
    const [...imges] =  req.files  
    const image_Path = []

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

        imagesDB.put(keyImages, object)

        image_Path.push(object.images.image_path)
        console.log("==> image save to :", 'http://18.215.69.15:3000' + object.images.image_path)
    })
    
    res.json(image_Path)
})

app.delete('/api/images/:id', upload.array('image'), async (req, res) => {
    const { id } = req.params


    const image = await imagesDB.get(id)
    
    const value = image
    const imagename = value.images.image_name

    console.log('imagename',imagename)

    const filePath = './images/'+imagename

    

    if(fs.existsSync(filePath)) {
        // The file exists, so you can proceed with deleting it
        try {
            fs.unlinkSync(filePath)
            imagesDB.del(id)
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
app.delete('/api/images/', upload.array('image'), async (req, res) => {
    

    await imagesDB.clear()

    console.log(`DEL api/images/ | image `)
    res.json(' ')
}) 

// Articles, all Articles routes

app.get('/api/articles/', async (req, res) => {
    const tb = []
    for await (const [key, value] of ressourcesDb.iterator()){
        tb.push({key : key, value : value})
    }

    console.log('GET request /articles')
    res.json(tb)
});

app.post('/api/articles/', upload.array('image'), async (req, res) => {
    const { contenu, titre, imagesAlbum, google_images } = await req.body
    const data_image = req.files
    const table = 'articles'
        console.log(await req.body)
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
        imagesDB.put(keyImages, object)

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
            google_images : google_images,
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

        ressourcesDb.put(keyValue, params)
        console.log('==> articles enregistre : ', "key : " + keyValue)

        res.json(article)

    } catch (reason) {
        console.log(reason)
        res.status(500, 'il y a un probleme' + reason)
    }

   
});

app.delete('/api/articles/:id', (req, res) => {
    const { id } = req.params

    ressourcesDb.del(id)
    console.log('DEL request /article/:'+id)
    res.json('supprimer')
})

app.get('/api/articles/edit/:id', async (req, res) => {
    
    const { id } = req.params
    console.log('GET request /article/edit/:'+id)

    const data = await ressourcesDb.get(id)
    res.json(data)

});

// contact-us
app.get('/api/contact/', async (req, res) => {
    const tb = []
    for await (const [key, value] of requete.iterator()){
        tb.push({key : key, value : value})
    }

    console.log('GET request /contact')
    res.json(tb)
});

app.get('/api/contact/:id', async (req, res) => {
    
    const { id } = req.params
    console.log('GET request /contact/'+id)

    const data = await requete.get(id)
    res.json(data)
});

app.delete('/api/contact/:id', async (req, res) => {
    
    const { id } = req.params
    
    console.log('DEL request /contact/'+id)
    await requete.del(id)
    console.log('==> DEL request /contact/'+id+ ' is a succes')
    res.json('delete')
});

app.post('/api/contact/',  upload.single('image'), async (req, res) => {

    const content = await req.body

    try {
        const keyValue = "" + Date.now() + "_" + generated_ID()
        const message = {
            ...content,
            key : keyValue,
            createdAt : new Date()
        }
        console.log('POST request /contact')
        await requete.put(keyValue, message)

        res.json('save')
    }

    catch ( reason ) {
        res.json('il ya une Erreur')
        throw new Error('il ya une erreur', reason)
    }
    
});

app.listen(8080, () => {
  console.log('Listening on port 8080');
});

const cred = {
    key, cert
}
const HTTPS = https.createServer()