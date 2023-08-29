// const { Schema, model, models } = require("mongoose");


// const ArticlesSchema = new Schema({
//     key : {
//         type : String,
//         required : [true, "chaque valeur doit avoir sa propre cle"]
//     },
//     images : {
//         type : Object,
//         required : [true]
//     },
//     titre : {
//         type : String,
//         required : [true, 'titre Name is requered'],
//     },
//     contenu : {
//         type : Object,
//         required : [true, 'cintent Name is requered'],
//     },
//     imagesAlbum : {
//         type : Array,
//     },
//     published: Boolean,
//     createdAt : {
//         type : String,
//         required : [true, 'password is required'],
//     },
//     createdBy : {
//         type :  Object({
//             name : {
//                 type : String,
//                 required : true,
//             },
//             surname : String,
//             user_id : String
//         }),
//         required : true
//     },
    
// });

// const Article = models.Ressource || model('Article', ArticlesSchema);

// module.exports = Article



// // createdBy : {
// //     type :  Object({
// //         name : {
// //             type : String,
// //             required : true,
// //         },
// //         surname : String,
// //         user_id : String
// //     }),
// //     required : true
// // },