const express = require("express");
const router = express.Router({mergeParams: true});

const Test = require("../models/test.js");
const Trainer = require("../models/trainer");

const wrapAsync = require("../utils/catchAsync");
const {validateTest,isLoggedIn, verifyTest} = require("../middleware")
const {categories} = require("../selects");

router.get('', wrapAsync(async(req,res)=>{
    const { categories } = req.query;
    if(categories){
        const test = await Test.find({ categories })
        res.render("test/index", {categories, test})
    } else{
        const allTest = await Test.find({})
        res.render('test/index', {allTest,categories})
    }   
}))

router.get('/:id', wrapAsync(async(req,res) => {
    const { id } = req.params;   
    const test = await Test.findById(id).populate({
        path: "reviews",
        populate:{
            path: "author"
        }
    }).populate("author");
    if(!test){
        req.flash('error', 'No se encontro test :(');
        return res.redirect(`/trainers`)
    }
    res.render("test/details", {test});
    }
));

router.get('/:id/edit', isLoggedIn,wrapAsync(async(req,res) =>{
    const {id} = req.params;
    const test = await Test.findById(id);
    res.render("test/edit", {test, categories});    
}));

router.put("/:id", isLoggedIn, validateTest, wrapAsync(async(req,res,)=>{
    const {id} = req.params;
    const editedTest = await Test.findByIdAndUpdate(id,{...req.body.test,runValidators: true, new: true});
    req.flash('success', 'Se actualizo test exitosamente!');
    res.redirect(`/test/${editedTest._id}`) 
}));

//Agrgar un test dentro del entrenador
router.get('/trainers/:id/test/new', isLoggedIn, wrapAsync(async(req,res)=>{
    const {id} = req.params;
    const trainer = await Trainer.findById(id);
    res.render('test/new', {trainer, categories })
}))

router.post('/trainers/:id/test', isLoggedIn, validateTest, wrapAsync(async(req,res)=>{
    const { id } = req.params;
    const trainer = await Trainer.findById(id);
    const { name,picture,description,result,categories } = req.body.test;  
    const test = new Test({name,picture,description,result,categories});
    test.author = req.user._id;
    trainer.test.push(test);
    test.trainer = trainer;
    await trainer.save();
    await test.save();
    req.flash('success', 'Se creo un test exitosamente!');
    res.redirect(`/test/${test._id}`)
}))

//Eiminar un test de un entrenador

router.delete('/trainers/:id/test/:testId', isLoggedIn,verifyTest, wrapAsync(async(req, res) => {
    const {id, testId} = req.params;
    await Trainer.findByIdAndUpdate(id, {$pull: { test: testId}})
    await Test.findByIdAndDelete(testId);
    req.flash('success', 'Se elimino test exitosamente!');
    res.redirect(`/trainers/${id}`);
}))

module.exports = router;