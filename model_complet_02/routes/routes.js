import express from "express";
const router = express.Router();

import HomeController from "../controllers/home.js";
import {createUser,signIn, logout, connexion, dashboard} from "../controllers/user.js";
import {checkUserAuthenticated} from '../middleware/auth.js'

router.get("/", HomeController);
router.post('/register', createUser);
router.post('/signIn', signIn)
router.get('/connexion', connexion)
router.get('/logout', logout)

router.get('/dashboard', checkUserAuthenticated, dashboard)

export default router;
