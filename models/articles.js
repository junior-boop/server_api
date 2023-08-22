const { Schema, model, models } = require("mongoose");


const ArticlesSchema = new Schema({
    images : {
        type : Object,
        required : [true]
    },
    titre : {
        type : String,
        required : [true, 'titre Name is requered'],
    },
    contenu : {
        type : String,
        required : [true, 'cintent Name is requered'],
    },
    imagesAlbum : {
        type : Array,
    },
    createdAt : {
        type : String,
        required : [true, 'password is required'],
    },
    createdBy : {
        type :  Object({
            name : {
                type : String,
                required : true,
            },
            surname : String,
            user_id : String
        }),
        required : true
    },
    
});

const Article = models.Ressource || model('Article', ArticlesSchema);

module.exports = Article