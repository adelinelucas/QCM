import session from "express-session";
import jwt from "jsonwebtoken";
import UserModel from "../Models/User.js";

export const checkUserAuthenticated = async (req, res, next) =>{

    console.log('req.session.token', req.session.token)
    const token = req.session.token;

    try{

        if(token === undefined){
            const redirectUser = "Vous n'êtez pas connecté pour accéder à cette page !";
            // res.json({message : redirectUser})
            return res.render('home', {redirectUser});
            next();
            return;
        }
    
        console.log('try')
        const tokenB = jwt.verify(req.session.token, process.env.APP_SECRET);
        console.log('token =>', tokenB)
        console.log('token user =>', tokenB.user)
        console.log("Token is valid, access ok");
        const idUserToFind = tokenB.user
        const userToFind = await UserModel.findOne({idUserToFind});
        console.log(userToFind)
        const connectedUser = {
            firstName : userToFind.firstName,
            lastName : userToFind.lastName
        }
        next();
    }catch (err) {
        console.log('catch')
        res.status(400).json({
          error: `Invalid token (${err.message})`,
        });
    }
}