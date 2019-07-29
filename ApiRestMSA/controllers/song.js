'use strict'

const Fs = require('fs');
const Path = require('path');

const SongModel = require('../models/song');

const getSong = (request, response) => {
    const songId = request.params.id;

    SongModel.findById(songId).populate([{path: 'album', populate: {path: 'artist'}}] ).exec((err, songStored) => {
        if(err)
            return response.status(500).send({message: `Ocurrio un error: ${err}`})
        else
            if(!songStored)
                return response.status(404).send({message: "¡Cancion no encontrada, intente de nuevo!"});
            else
                return response.status(200).send({message: "¡Exito! \n Cancion encontrada", song: songStored});
    });
};

const getSongs = (request, response) => {
    const albumId = request.params.album;

    let find = SongModel.find().populate([{path: 'album', populate: {path: 'artist'}}]).sort('name');
    if(albumId) find = SongModel.find({album: albumId}).populate({path: 'album', populate: {path: 'artist'}}).sort('number');

    find.exec((err, songsStored) => {
        if(err)
            return response.status(500).send({message: `Ocurrio un error: ${err}`});
        else
            if(!songsStored) return response.status(404).send({message: "No se han encontrado canciones"});
            else return response.status(200).send({message: "Exito", songs: songsStored});
    });
};

const saveSong = (request, response) => {
    let Song = new SongModel();
    const params = request.body;

    let validation = true;
    params.number ? Song.number = params.number : validation=false;
    params.name ? Song.name = params.name : validation=false;
    params.duration ? Song.duration = params.duration : validation=false;
    params.file ? Song.file = params.file : Song.file = null;
    params.album ? Song.album = params.album : validation=false;
    
    if(!validation)
        return response.status(400).send({message: "Campos incorrectos, verifique e intente de nuevo!"});
    else {
        Song.save((err, songSaved) => {
            if(err)
                return response.status(505).send({message: `Ocurrio un error ${err}`});
            else 
                if(!songSaved)
                    return response.status(404).send({message: "No se ha guardado la cancion, intente de nuevo!"});
                else 
                    return response.status(200).send({message: "Se ha Guardado la cancion", song: songSaved});
        });
    }
};

const updateSong = (request, response ) => {
    const songId = request.params.id;
    const update = request.body;

    SongModel.findByIdAndUpdate(songId, update).populate({path: 'album', populate: {path: 'artist'}}).exec((err, songUpdated) => {
        if(err) return response.status(500).send({message: `Ocurrio un error: ${err}`});
        else 
            if(songUpdated) return response.status(200).send({message: "La cancion se ha actualizado!", song: songUpdated});
            else return response.status(404).send({message: "Error no se ha actualizado la cancion!"});
    });

};

const deleteSong = (request, response) => {
    const songId = request.params.id;

    SongModel.findByIdAndRemove(songId, (err, songDeleted) => {
        if(err) return response.status(500).send({message: `Ocurrio un error: ${err}`});
        else
            if(!songDeleted) return response.status(404).send({message: "No se ha encontrado la cancion"});
            else return response.status(200).send({message: "Exito la cancion se elimino", songRemoved: songDeleted});
    });
};

const uploadSong = (request, response) => {
    const songId = request.params.song;
    let file_name = "Sound not found";
    if(request.files){
        let file_path = request.files.fileSong.path;
        file_name = file_path.split("/")[2];
        let file_ext = file_name.split('\.')[1];
        if(file_ext === "mp3" || file_ext === "ogg")
            SongModel.findByIdAndUpdate(songId, {file: file_name},(err, songUpdated) => {
                if(err) return response.status(500).send({message: `Ocurrio un error ${err}`});
                else
                    if(songUpdated) return response.status(200).send({message:"Exito, cancion disponible", song: songUpdated});
                    else return response.status(404).send({message: "No se ha subido la cancion!"});
            });
        else return response.status(422).send({message: "Archivo incorrecto", file: file_name});    
    }
    else return response.status(400).send({message: "Eliga un archivo 'mp3' o 'ogg'"});
};

const getSongFile = (request, response) => {
    const songFile = request.params.songFile;
    
    let song_path = `./upload/songs/${songFile}`;
    Fs.exists(song_path, file => {
        return file ? response.status(200).sendFile(Path.resolve(song_path))
                    : response.status(404).send({message: "No se encontro la cancion!"});
    });
};

module.exports = {
    getSong, 
    saveSong, 
    getSongs, 
    updateSong, 
    deleteSong,
    uploadSong,
    getSongFile
}