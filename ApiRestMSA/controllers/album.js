'use strict'

const Path = require('path');
const Fs = require('fs');

const ArtistModel = require('../models/artist');
const AlbumModel = require('../models/album');
const SongModel = require('../models/song');

const getAlbum = (request, response) => {

    let albumId = request.params.id;

    AlbumModel.findById(albumId).populate({path: 'artist'}).exec((err, albumResolve) => {
        return err ? response.status(500).send({message:`Ocurrio un error: ${err}`})
                        : !albumResolve ? response.status(404).send({message: "No se ha encontrado el album"})
                                : response.status(200).send({message: "Album encontrado!", album: albumResolve});
    });
};

const getAlbums = (request, response) => {
    const artistId = request.params.artist;
    
    let find = AlbumModel.find({}).sort('title');
    if(artistId)
        find = AlbumModel.find({artist: artistId}).sort('year');
    
    find.populate({path: 'artist'}).exec((err, albumsData) => {
        return err ? response.status(500).send({message: `Ocurrio un error: ${err}`})
                    : !albumsData || albumsData.length <= 0 ? response.status(404).send({message: "No se encontraron albums"})
                                  : response.status(200).send({message: "Exito!", albums: albumsData});
    });
        
};

const saveAlbum = (request, response) =>{
    let Album = new AlbumModel();
    let validate = true;
    let params = request.body;

    params.title ? Album.title = params.title : validate = false;
    params.description ? Album.description = params.description : validate = false;
    params.year ? Album.year = params.year : validate = false;
    params.image ? Album.image = params.image : Album.image = null;
    params.artist ? Album.artist = params.artist : validate = false;

    if(validate)
        Album.save((err,resp)=>{
            return err ? response.status(500).send({message:`Ocurrio un error: ${err}`})
                        : !resp ? response.status(503).send({message: "No se ha guardado el album"})
                                : response.status(200).send({message: "Album guardado!", album: resp});
        });

    else
        return response.status(403).send({message: "Verifique los datos e intente nuevamente."});
    
};

module.exports = {
    getAlbum, saveAlbum, getAlbums
}

