'use strict'

const express = require('express');
const ArtistController = require('../controllers/artist');

let api = express.Router();

let md_auth = require('../middleware/authenticated');

api.get('/getArtist/:id', md_auth.ensureAuth, ArtistController.getArtist);
api.post('/saveArtist', md_auth.ensureAuth, ArtistController.saveArtist);
api.get('/getArtists', md_auth.ensureAuth, ArtistController.getArtists);
api.put('/updateArtist/:id',md_auth.ensureAuth,ArtistController.updateArtist);

module.exports = api;