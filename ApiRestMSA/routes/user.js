'use strict'

const express = require('express');
const UserController = require('../controllers/user');

let api = express.Router();
let md_auth = require('../middleware/authenticated');

api.get('/probando-controlador', md_auth.ensureAuth, UserController.pruebas);
api.post('/registerUser', UserController.registerUser);
api.post('/login-request', UserController.loginUser);

module.exports = api;