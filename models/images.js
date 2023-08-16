const fs = require('fs')

class Images {
    constructor({images}){
        this.images = images;
    }

    #Image(){
        console.log(typeof this.images)
        if(typeof this.images === 'object' ) return true
        else return false
    }

    register(){
        const {images} = this;
        
        if(this.#Image()){
            let data = fs.readFileSync('./database/images_db.json', {encoding : 'utf-8', flag : 'r'})
            let state = JSON.parse(data)

            let object = {
                id : this.#generated_ID(),
                images : images
            }

            state.push(object)
            fs.writeFileSync('./database/images_db.json', JSON.stringify(state, null, 3))
            
        }
        
    }

    #generated_ID(){
        const A = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890_'
        let id = ''
        for (let i = 0; i < 6; i++) {
            const random = Math.floor((Math.random() * 100) * 0.63)
            id += A[random]
        }

        return id
    }
}


module.exports = Images