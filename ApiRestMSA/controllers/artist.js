'use strict'

const Path = require('path');
const Fs = require('fs');
const Mpag = require('mongoose-pagination');

let ArtistModel = require('../models/artist');
let AlbumModel = require('../models/album');
let SongModel = require('../models/song');

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

const getArtists = (req, res) => {
    let page = (req.body.page)?parseInt(req.body.page):1;
    let itemsPerPage = parseInt(req.body.size);
    console.log(itemsPerPage);
    if(typeof page === 'number' && typeof itemsPerPage === 'number' && !isNaN(page) && !isNaN(itemsPerPage) ) {
        ArtistModel.find().sort('name').paginate(page,itemsPerPage, (rej,artists,countAll)=>{
            if(rej)
                return res.status(500).send({ message: `Error, porfavor revise e intente de nuevo ${rej}`});
            else
                if(!artists) return res.status(404).send({message: "No existen artistas!"})
                else return res.status(200).send({
                    total: countAll,
                    artists: artists
                });
        });
    }
    else return res.status(400).send({message:"Parametros incorrectos revise e intente de nuevo."});
}

const updateArtist = (req, res) => {
    const artistId = req.params.id;
    const update = req.body;

    ArtistModel.findByIdAndUpdate(artistId, update, (err, data) => {
        if(err) return res.status(500).send({message: `Error: ${err}`});
        else
            return !data ? res.status(404).send({message: "Error registro no encontrado"})
                         : res.status(200).send({message:"Exito!", artist: data});
    });
}

const deleteArtist = (req, res) => {
    let artistId = req.params.id;

    ArtistModel.findByIdAndRemove(artistId, (err, dataRemoved) => {
        if(err)
            return res.status(500).send({message: `Error al eliminar: ${err}`});
        else
            return !dataRemoved ? res.status(404).send({message:"Artista no eliminado"})
                                : AlbumModel.find({artist: dataRemoved._id}).remove((err, albumRemoved)=>{
                                    return err ? res.status(500).send({message: `Error al eliminar: ${err}`})
                                               : !albumRemoved ? res.status(404).send({message:"Album(s) no eliminado(s)"})
                                                               : SongModel.find({album: albumRemoved._id}).remove((err, songRemoved) => {
                                                                    return err ? res.status(500).send({message: `Error al eliminar: ${err}`})
                                                                               :  res.status(200).send({
                                                                                    message:"Artista Eliminado Correctamente",
                                                                                    removed: dataRemoved
                                                                                });
                                                               });
                                }); 
                               

    });
}

const uploadImage = (req,res)=>{
    let artistId = req.params.id;
    let file_name = "Image not Found";
    if(req.files){
        let file_path = req.files.image.path;
        file_name = file_path.split("/")[2];
        let file_ext = file_name.split('\.')[1];    
        if( file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){
            ArtistModel.findByIdAndUpdate(artistId, {image: file_name},(err,artistUpdate)=>{
                if(err) return res.status(500).send({message: "Error al actualizar imagen del artista"});
                else{
                    return (!artistUpdate) ? res.status(404).send({message:"No se ha actualizado la imagen del artista"}) : res.status(200).send({artist: artistUpdate}); 
                }
            });
        }
        else return res.status(200).send({message: "Imagen o extension incorrecta",file: file_name});
    }
    else return res.status(200).send({message: 'No se encontro imagen'});
}

const getImageFile = (req,res)=>{
    let imageFile = req.params.imageFile;
    let path_file = `./upload/artist/${imageFile}`;
    Fs.exists(path_file,exist=>{
        (exist)?res.sendFile(Path.resolve(path_file)) : res.status(200).send({message: "No Existe la imagen"}); 
    });
}

module.exports = {
    getArtist,
    saveArtist,
    getArtists,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile
}