const  { model, models, Schema } = require("mongoose");


const imageSchema = new Schema({
    images : {
        type : Object({
            image_name : String,
            image_path : String,
            image_size : Number,
            image_mimetype : String
        }),
        required : true
    },
    image_path : {
        type : String,
        required : true,
    }
})


const ImagesModel = models.ImagesModel || model("ImagesModel", imageSchema)
module.exports = ImagesModel