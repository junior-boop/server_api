const { Schema, model, models } = require("mongoose");


const UserSchema = new Schema({
    mail : {
        type : String,
        unique : [true, 'E-mail already existe!'],
        required : [true, 'E-mail is required!']
    },
    name : {
        type : String,
        required : [true, 'User Name is requered'],
    },
    surname : {
        type : String,
        required : [true, 'User Name is requered'],
    },
    pw : {
        type : String,
        required : [true, 'password is required'],
    },
    tel : {
        type : String,
        required : false
    },
    town : {
        type : String,
    },
    like :  {
        type : Array,
    },
    share : {
        type : Array,
    }
});

const User = models.User || model('User', UserSchema);

module.exports = User