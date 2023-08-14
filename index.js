const express = require('express');
const bodyParser = require('body-parser')
const multer = require('multer')
const cors = require('cors')
const app = express();
const categories = require('./database/categories.json')

const API = require('./routes/api')
const auteur = require('./routes/auteur');
const tutos = require('./routes/tutos')

app.set('view engine', 'ejs')

app.use(cors())

app.use('/assets', express.static('public'));
app.use('/images', express.static('images'));
app.use('/api', API)
app.use('/auteur', auteur)
app.use('/tutos', tutos)
app.use(bodyParser.urlencoded({extended : true}))



app.get('/', (req, res) => {
  res.render('pages/index', { name : "Tableau de bord", data : categories})
});

app.get('/abonner', (req, res) => {
  res.render('pages/index', { name : "Abonnés", data : categories} )
});
app.get('/article', (req, res) => {
  res.render('pages/new_tuto', { name : "Abonnés", data : categories} )
});
app.get('/api', (req, res) => {
  res.json({
    nom : 'Daniel', ville : 'Yaounde' })
});

app.listen(3000, () => {
  console.log('Listening');
});
