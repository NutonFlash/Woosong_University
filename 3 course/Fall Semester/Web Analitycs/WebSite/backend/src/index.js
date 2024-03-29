import express from "express";
import db from "./dbManager/index.js";
import path from 'node:path';
import api from './api.js';
import session from 'express-session';
import { v4 as uuidv4 } from 'uuid';
import expressMySqlSession from 'express-mysql-session';
import 'dotenv/config';

const pathToPublic = path.resolve('../frontend/dist/public');

const app = express();
app.listen(3000); 

app.use(express.static(pathToPublic));
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: false }));

const dbOptions = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_DEDAULT_DATABASE,
};

db.init(dbOptions);

const MySQLStore = expressMySqlSession(session);

const options = {
  ...dbOptions,
  createDatabaseTable: false
}

const sessionStore = new MySQLStore(options);

let sessionOptions = {
  genid: function (req) {
    let id = uuidv4()
    return id;
  },
  store: sessionStore,
  resave: false, 
  saveUninitialized: false,
  name: process.env.SESSION_NAME,
  secret: process.env.SESSION_SECRET,
  cookie: { maxAge: 1000 * 60 * 60 * 2 , sameSite: true},
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sessionOptions.cookie.secure = true // serve secure cookies
}

app.use(session(sessionOptions));

app.use((req, res, next) => {
  if (!req.session.init) {
    req.session.init = "init";
    req.session.isAuthorized = false;
    res.cookie('isAuthorized','false');
  }
  res.cookie('isAuthorized', req.session.isAuthorized);
  next();
});

app.get("/", function (req, res) {
  res.sendFile(pathToPublic + '/index.html');
});

app.post("/api/login", api.login);
app.post("/api/logout", api.logout);

app.post("/api/register", api.register);

app.get("/api/get_top_places", api.getTopPlaces);

app.get("/api/get_all_places", api.getAllPlaces);
