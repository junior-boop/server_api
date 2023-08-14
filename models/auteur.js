const Personne = require('./personne')
const fs = require('fs')


class Auteur extends Personne {
    constructor({name, surname, phone, mail, website = 'nothing', categories, imag}){
        super(name, surname,  phone);
        this.mail = mail;
        this.phone = phone
        this.website = website;
        this.categories = categories
        this.image = imag
    }

    #Name(){
        if(typeof this.name === 'string') return true;
        else return false 
    }
    #Surname(){
        if(typeof this.surname === 'string') return true;
        else return false 
    }
    #Phone(){
        if(typeof this.phone === 'string') return true;
        else return false 
    }
    #Mail(){
        if(typeof this.mail === 'string') return true;
        else return false 
    }
    #Website(){
        if(typeof this.website === 'string') return true;
        else return false 
    }
    #Categorie(){
        if(typeof this.categories === 'string') return true;
        else return false 
    }
  
    register(){
       const {image, name, surname, phone, mail, website, categories} = this;
       if( this.#Name() && this.#Surname() && this.#Phone() && this.#Mail() && this.#Website() && this.#Categorie()){
            let data = fs.readFileSync('./database/auteurs.json', { encoding : 'utf-8', flag : 'r'})
            
            let state = JSON.parse(data)

            let objet = {
                id : this.generated_ID() ,
                image : {
                    name : image,
                    path : `/images/${image}`
                },
                name: name,
                surname : surname,
                phone : phone,
                mail: mail, 
                website : website,
                categories : categories
            }

            state.push(objet)
            console.log(state)

            fs.writeFileSync('./database/auteurs.json', JSON.stringify(state, null, 3))
            console.log('sauvegade')
       } 
    }
    
    generated_ID(){
        const A = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890_'
        let id = ''
        for (let i = 0; i < 6; i++) {
            const random = Math.floor((Math.random() * 100) * 0.63)
            id += A[random]
        }

        return id
    }
}

module.exports = Auteur