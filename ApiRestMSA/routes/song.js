const express = require('express');

const api = express.Router();

const SongController = require('../controllers/song.js');

api.get('/getSong/:id', SongController.getSong);
api.post('/saveSong', SongController.saveSong);

module.exports = api;