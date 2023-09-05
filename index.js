const express = require('express');
const bodyParser = require('body-parser')
const multer = require('multer')
const cors = require('cors')
const app = express();
const https = require("https");
const API = require('./routes/api')

app.use(cors())

app.use(bodyParser.urlencoded({extended : false}))
app.use('/assets', express.static('public'));
app.use('/images', express.static('images'));
app.use('/api', API)

https.createServer()


app.get('/', (req, res) => {
  res.json({
    ville : "yaounde",
    pays : 'Cameroun'
  })
});


// https.createServer(
//   app
// )
// .listen(3000, () => {
//   console.log('Listening');
// })

app.listen(3000, () => {
  console.log('Listening');
});
