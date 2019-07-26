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

const updateAlbum = (request, response) => {
    const albumId = request.params.id;
    const updateData = request.body;

    AlbumModel.findByIdAndUpdate(albumId, updateData, (err, dataUpdated) => {
        return err ? response.status(500).send({message: `Ocurrio un error: ${err}`})
                    : !dataUpdated ? response.status(404).send({message: "No se ha actualizado el album, revise e intente de nuevo"})
                                    : response.status(200).send({message: "Album actualizado", album: dataUpdated});
    });
};

const deleteAlbum = (request, response) => {
    const albumId = request.params.id;

    AlbumModel.findByIdAndRemove(albumId, (err, albumDeleted) => {
        if(err)
            return response.status(500).send({message: `Ocurrio un error: ${err}`});
        else
            return !albumDeleted ? response.status(404).send({message: "Album no encontrado"})
                                 : SongModel.find({album: albumDeleted._id}).remove((err, songRemoved) => {
                                     err ? response.status(500).send({message:`Ocurrio un error: ${err}`})
                                         : songRemoved ? response.status(200).send({message:"Exito!", songs: albumDeleted})
                                                       : response.status(404).send({message: "Canciones no encontradas"});
                                 });
    });
};

const uploadImage = (req,res)=>{
    let albumtId = req.params.id;
    let file_name = "Image not Found";
    if(req.files){
        let file_path = req.files.image.path;
        file_name = file_path.split("/")[2];
        let file_ext = file_name.split('\.')[1];    
        if( file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){
            AlbumModel.findByIdAndUpdate(albumtId, {image: file_name},(err,albumUpdate)=>{
                if(err) return res.status(500).send({message: "Error al actualizar imagen del album"});
                else{
                    return (!albumUpdate) ? res.status(404).send({message:"No se ha actualizado la imagen del album"}) : res.status(200).send({album: albumUpdate}); 
                }
            });
        }
        else return res.status(200).send({message: "Imagen o extension incorrecta",file: file_name});
    }
    else return res.status(200).send({message: 'No se encontro imagen'});
}

const getImageFile = (req,res)=>{
    let imageFile = req.params.image;
    let path_file = `./upload/albums/${imageFile}`;
    Fs.exists(path_file,exist=>{
        (exist)?res.sendFile(Path.resolve(path_file)) : res.status(200).send({message: "No Existe la imagen"}); 
    });
}

module.exports = {
    getAlbum, saveAlbum, getAlbums, updateAlbum, deleteAlbum, uploadImage, getImageFile
}

