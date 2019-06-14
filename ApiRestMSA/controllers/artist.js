'use strict'

const Path = require('path');
const Fs = require('fs');

let ArtistModel = require('../models/artist');
let AlbumModel = require('../models/album');
let Song = require('../models/song');

const getArtist = (req, res)=>{
    let artistId = req.params.id;
    ArtistModel.findById(artistId, (err, resp)=>{
        if(err) return res.status(500).send({message: "Error al realizar la peticion, verifique sus parametros!"});
        if(!resp) return res.status(404).send({message: "El artista no existe!"});
        else return res.status(200).send({message:"Artista encontrado!", artist:resp}); 
    });
};

const saveArtist = (req, res) => {
    let artist = new ArtistModel();

    let params = req.body;
    artist.name = params.name;
    artist.description = params.description;
    artist.image = (params.image)?params.image:'null';

    artist.save((err,artistStored)=>{
        if(err)
            res.status(500).send({message: "Error al guardar el artista"});
        else
            if(!artistStored)
                res.status(404).send({message: "El artista no ha sido guardado"});
            else
                res.status(200).send({message: "Artista Guardado!", artist: artistStored});
    });
};

module.exports = {
    getArtist,
    saveArtist
}