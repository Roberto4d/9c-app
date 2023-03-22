const {genders, grades, gradesBoulder, experience} = require("../selects");
const Trainer = require("../models/trainer");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});
const {cloudinary} = require('../cloudinary');
const qrCode = require('qrcode');

module.exports.index = async(req, res) => {
    const { gender } = req.query;
    const counting = await Trainer.find({}).count();
   if (gender){
        const trainers = await Trainer.find({gender: `${gender}`}); 
        res.render("trainers/trainers",{trainers, genders, grades, counting, gradesBoulder, experience });
    } else{
        const trainers = await Trainer.find({}); 
        res.render("trainers/trainers",{counting, trainers, genders, grades, gradesBoulder, experience});
    }   
}

module.exports.newForm = (req,res) => {
    res.render("trainers/new", {genders,grades,gradesBoulder, experience});   
}

module.exports.postForm = async(req,res)=>{
    const geoData = await geocoder.forwardGeocode({
        query: req.body.trainer.location,
        limit: 1
    }).send()
    const newTrainer = new Trainer(req.body.trainer);
    newTrainer.geometry = geoData.body.features[0].geometry
    newTrainer.picture = req.files.map(f => ({ url: f.path, filename: f.filename }));
    newTrainer.author = req.user._id;
    await newTrainer.save();
    req.flash('success', 'Se creo un entrenador exitosamente!');
    res.redirect(`/trainers/${newTrainer._id}`);
}

module.exports.details = async(req,res) => {
    const { id } = req.params;
    const counting = await Trainer.find({}).count();
    const trainer = await Trainer.findById(id).populate("test").populate("author");
    const url = `ninectraing.onrender.com/trainers/${id}`
    const qr = await qrCode.toDataURL(url)
    if(!trainer){
        req.flash('error', 'No se encontro entrenador :(');
        return res.redirect('/trainers')
    }
    res.render("trainers/details", {trainer,counting,qr});
}

module.exports.editForm = async(req,res) =>{
    const {id} = req.params;
    const trainer = await Trainer.findById(id);
    console.log(trainer)
    if(!trainer){
        req.flash('error', 'No se encontro al entrenador');
        return res.redirect(`/trainers`)  
    }
    res.render("trainers/edit", {trainer, genders, grades, gradesBoulder, experience});    
}

module.exports.putEdit = async(req,res)=>{ 
    const {id} = req.params;
    const trainer = await Trainer.findByIdAndUpdate(id,{...req.body.trainer}); 
    const images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    trainer.picture.push(...images);
    await trainer.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await trainer.updateOne({$pull: {picture: {filename: {$in: req.body.deleteImages}}}})
        console.log(trainer)
    }
   
    req.flash('success', 'Se actualizo entrenador exitosamente!');
    res.redirect(`/trainers/${trainer._id}`) 
}

module.exports.delete = async(req, res) => {
    const {id} = req.params;
    const deletedTrainer = await Trainer.findByIdAndDelete(id);
    req.flash('success', 'Se elimino entrenador exitosamente!');
    res.redirect('/trainers');
}