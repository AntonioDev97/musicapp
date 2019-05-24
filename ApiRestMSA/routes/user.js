'use strict'

const express = require('express');
const multipart = require('connect-multiparty');
const UserController = require('../controllers/user');


let api = express.Router();
let md_auth = require('../middleware/authenticated');
let md_upload = multipart({ uploadDir: "./upload/users"});

api.get('/probando-controlador', md_auth.ensureAuth, UserController.pruebas);
api.post('/registerUser', UserController.registerUser);
api.post('/login-request', UserController.loginUser);
api.put('/update-user/:id',md_auth.ensureAuth, UserController.updateUser);
api.post('/upload-image-user/:id',[md_auth.ensureAuth, md_upload], UserController.uploadAvatar);
api.get('/get-image-user/:imageFile', UserController.getImageFile);

module.exports = api;