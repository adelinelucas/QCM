import UserModel from '../Models/User.js';
import mongoose from 'mongoose';

const ObjectID = mongoose.Types.ObjectId;

export default function home(req, res) {

  res.render("home");

}
