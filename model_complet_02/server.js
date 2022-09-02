import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import session from "express-session";

import route from "./routes/routes.js";
import './db.js';

// ==========
// App initialization
// ==========

dotenv.config();
const { APP_LOCALHOST, APP_PORT, NODE_ENV } = process.env;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();


// ouverture d'une session
app.use(session({
  name: 'simple',
  secret: 'simple',
  resave: false,
  saveUninitialized: true
}))

// body parser va nous permettre de traiter la data 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine", "pug");
app.locals.pretty = (NODE_ENV !== 'production'); // Indente correctement le HTML envoyé au client (utile en dev, mais inutile en production)

// ==========
// App middlewares
// ==========

app.use(express.static(path.join(__dirname, "public")));

// ==========
// Ajout config Pug
// ==========
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// ==========
// App routers
// ==========

app.use("/", route);

// ==========
// App start
// ==========

app.listen(APP_PORT, () => {
  console.log(`App listening at http://${APP_LOCALHOST}:${APP_PORT}`);
});
