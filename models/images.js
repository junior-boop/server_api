const fs = require('fs')

class Images {
    constructor({name, images}){
        this.images = images;
        this.name = name
    }

    #Image(){
        if(typeof this.images === 'object' ) return true
        else return false
    }
    
    #Name(){
        if(typeof this.name === 'string' ) return true
        else return false
    }

    register(){
        const {images, name} = this;

        if(this.#Image() && this.#Name()){
            let data = fs.readFileSync('./database/images_db.json', {encoding : 'utf-8', flag : 'r'})
            let state = JSON.parse(data)

            let object = {
                id : this.#generated_ID(),
                name : name,
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