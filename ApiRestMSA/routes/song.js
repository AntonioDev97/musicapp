const express = require('express');

const api = express.Router();
const multipart = require('connect-multiparty');

const md_upload = multipart({uploadDir: "./upload/songs"});
const SongController = require('../controllers/song.js');

api.get('/getSong/:id', SongController.getSong);
api.get('/getSongs/:album?', SongController.getSongs);
api.post('/saveSong', SongController.saveSong);
api.put('/updateSong/:id', SongController.updateSong);
api.delete('/deleteSong/:id', SongController.deleteSong);
api.post('/uploadSong/:song', [md_upload], SongController.uploadSong);
api.get('/getFileSong/:songFile', SongController.getSongFile);

module.exports = api;