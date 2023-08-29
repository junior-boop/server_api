// const { Schema, model, models } = require("mongoose");


// const RessourceSchema = new Schema({
//     images : {
//         type : Array,
//         required : [true]
//     },
//     titre : {
//         type : String,
//         required : [true, 'User Name is requered'],
//     },
//     description : {
//         type : String,
//         required : [true, 'User Name is requered'],
//     },
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
//     categorie : {
//         type : String,
//     },
//     like :  {
//         type : Array,
//     },
//     share : {
//         type : Array,
//     },
//     download : {
//         type : Array,
//     }
// });

// const Ressource = models.Ressource || model('Ressource', RessourceSchema);

// module.exports = Ressource