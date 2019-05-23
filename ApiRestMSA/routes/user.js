'use strict'

const express = require('express');
const UserController = require('../controllers/user');

let api = express.Router();

api.get('/probando-controlador', UserController.pruebas);
api.post('/registerUser', UserController.registerUser);
api.post('/login-request', UserController.loginUser);

module.exports = api;