/*
  Voici la structure d'un document Utilisateur sur lequel vous vous baserez pour faire le Schéma mongoose :

  {
    firstName  // type String, obligatoire
    lastName  // type String, obligatoire
    email  // type String, obligatoire
    password  // type String, obligatoire
  }
  
*/
import mongoose from "mongoose";
import cryto from "crypto-js";

const UserShema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength:2,
        maxLength:25,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        minLength:2,
        maxLength:25,
        trim: true
    },
    email: {
        type: String,
        required: true,
        minLength:5,
        maxLength:25,
        trim: true,
        unique: true,
    },
    password : {
        type: String,
        required: true,
        minLength:2,
        maxLength:25,
        trim: true
    }
});

// crypter le mdp
//play function before save into display: 'block';
UserShema.pre('save', async function(next) {
    this.password = await cryto.SHA1(this.password).toString();
    next();
});

const UserModel = mongoose.model('users', UserShema);
export default UserModel;