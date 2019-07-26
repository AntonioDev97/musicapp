'use strict'

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

    let find = SongModel.find().sort('name');
    if(albumId) find = SongModel.find({album: albumId}).sort('number');

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

module.exports = {
    getSong, saveSong
}