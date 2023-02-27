const express = require("express");
const router = express.Router();

const Trainer = require("../models/trainer");

const wrapAsync = require("../utils/catchAsync");

const {genders, grades, gradesBoulder} = require("../selects");
const {isLoggedIn, validateTrainer, verifyAuthor} = require("../middleware")

router.get('/', wrapAsync(async(req, res, next) => {
    const { gender } = req.query;
    const counting = await Trainer.find({}).count();
   if (gender){
        const trainers = await Trainer.find({gender: `${gender}`}); 
        res.render("trainers/trainers",{trainers, genders, grades, counting });
    } else{
        const trainers = await Trainer.find({}); 
        res.render("trainers/trainers",{counting, trainers, genders, grades});
    }   
}));

router.get('/new', isLoggedIn, (req,res) => {
    res.render("trainers/new", {genders,grades,gradesBoulder});   
});

router.post('/', isLoggedIn,validateTrainer ,wrapAsync(async(req,res,next)=>{
    const newTrainer = new Trainer(req.body.trainer);
    newTrainer.author = req.user._id;
    await newTrainer.save();
    req.flash('success', 'Se creo un entrenador exitosamente!');
    res.redirect(`/trainers/${newTrainer._id}`);
}));

router.get('/:id', isLoggedIn, wrapAsync(async(req,res) => {
    const { id } = req.params;
    const counting = await Trainer.find({}).count();
    const trainer = await Trainer.findById(id).populate("test").populate("author");
    if(!trainer){
        req.flash('error', 'No se encontro entrenador :(');
        return res.redirect('/trainers')
    }
    res.render("trainers/details", {trainer,counting});
}));

router.get('/:id/edit', isLoggedIn, verifyAuthor, wrapAsync(async(req,res) =>{
        const {id} = req.params;
        const trainer = await Trainer.findById(id);
        if(!trainer){
            req.flash('error', 'No se encontro al entrenador');
            return res.redirect(`/trainers`)  
        }
        res.render("trainers/edit", {trainer, genders, grades, gradesBoulder});    
}));

router.put("/:id",isLoggedIn, verifyAuthor, validateTrainer, wrapAsync(async(req,res,next)=>{ 
        const {id} = req.params;
        const trainer = await Trainer.findByIdAndUpdate(id,{...req.body.trainer,runValidators: true, new: true});
        req.flash('success', 'Se actualizo entrenador exitosamente!');
        res.redirect(`/trainers/${trainer._id}`) 
}));

router.delete('/:id', isLoggedIn, verifyAuthor, wrapAsync(async(req, res) => {
    const {id} = req.params;
    const deletedTrainer = await Trainer.findByIdAndDelete(id);
    req.flash('success', 'Se elimino entrenador exitosamente!');
    res.redirect('/trainers');
}));


module.exports = router;