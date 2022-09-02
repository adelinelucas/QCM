import UserModel from '../Models/User.js';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import session from 'express-session';
import cryto from "crypto-js";

const ObjectID = mongoose.Types.ObjectId;

const checkEmptyField = (fields) => {
    let message = [];
    fields.forEach(field => {
        console.log(field)
        if(field[1] == '' ){
            message.push(`Le champ ${field[0]} est vide !`);
        } 
    });
    return message
}

export const createUser = async (req, res) => {
    console.log(req.body);
    const {firstName, lastName, email,password, password_confirm} = req.body;
    const arrayFields = [
        ['firstName',firstName],
        ['lastName',lastName],
        ['email',email],
        ['password',password]];
    let isAnyEmptyField = '';
    isAnyEmptyField = checkEmptyField(arrayFields).length;

    const checkUserInDB = await UserModel.find({email: {$eq:`${email}`}});

    if(isAnyEmptyField  && isAnyEmptyField != 0 ){
        let messageInfo = checkEmptyField(arrayFields);
        console.log(messageInfo)
        res.render("home", {messageInfo});
    }else if(password !== password_confirm){
        let messageInfo = ["Le mot de passe ne match pas avec la confirmation de mot de passe "];
        res.render("home", {messageInfo});
    }else if (checkUserInDB.length !== 0){
        let messageInfo = ["L'email utilisateur existe déjà."];
        res.render("home", {messageInfo});
    }
    else {
        try{
            const user= await UserModel.create({firstName, lastName, email,password});
            console.log(user)
            res.render("login");
            // res.render("/home");
          }catch(err){
            res.status(400).send(err.message)
          }
    }
}

export const signIn = async (req,res) => {
    const { email,password} = req.body;

    try {
        const user = await UserModel.findOne({email});
        console.log(user);
        console.log(password)
        if(user){
            const passwordForConnexion = await cryto.SHA1(password).toString()
            if(user.password === passwordForConnexion){
                req.session.token = jwt.sign( {user : user._id}, process.env.APP_SECRET, {expiresIn : '24h'}) ;

                const connectedUser = {
                    firstName : user.firstName,
                    lastName : user.lastName
                }
                
                res.render("dashboard", {connectedUser} );
            }else{
                let messageInfo = "mot de passe invalide";
                res.render("login", {messageInfo} );
            }

        }else {
            let messageInfo = "adresse mail invalide";
            res.render("login", {messageInfo} );
        }
    }catch(err){
        res.status(400).send(err.message)
    }
}

export const logout = async (req, res) => {
    req.session.destroy(err => {
        if (err) {
          return res.status(500).send({ error: err.message });
        }
    
        res.redirect('/');
      });
}

export const connexion = async (req, res) => {
    res.render("login");
}

export const dashboard = async (req, res) => {
    res.render("dashboard");
}