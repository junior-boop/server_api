const ImagesModel = require('../models/imagesModels')
const connectToDB = require('../database/database')

class Images {
    constructor({images, path}){
        this.images = images;
        this.path = path
    }

    #Image(){
        if(typeof this.images === 'object' ) return true
        else return false
    }

    async register(){
        const {images, path} = this;
        
        if(this.#Image()){
            try{
                await connectToDB()
                const image = await new ImagesModel({
                    images : images, 
                    image_path : path
                })
                await image.save()
            } catch(reason) {
                console.log(reason)
            }            
        }
        
    }
}


module.exports = Images