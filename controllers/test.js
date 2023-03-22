
const Test = require("../models/test.js");
const Trainer = require("../models/trainer");
const { categories } = require("../selects");
const {cloudinary} = require('../cloudinary')


module.exports.index = async(req,res)=>{
    const { categories } = req.query;
    if(categories){
        const test = await Test.find({ categories })
        res.render("test/index", {categories, test})
    } else{
        const allTest = await Test.find({})
        res.render('test/index', {allTest,categories})
    }   
}

module.exports.details = async(req,res) => {
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


module.exports.addtestForm = async(req,res)=>{
    const {id} = req.params;
    const trainer = await Trainer.findById(id);
    res.render('test/new', {trainer, categories })
}

module.exports.postAddTest = async(req,res)=>{
    const { id } = req.params;
    const trainer = await Trainer.findById(id);
    const { name,picture,description,duration,categories } = req.body.test;  
    const test = new Test({name,picture,description,categories, duration});
    test.picture = req.files.map(f => ({ url: f.path, filename: f.filename }));
    test.author = req.user._id;
    trainer.test.push(test);
    test.trainer = trainer;
    await trainer.save();
    await test.save();
    req.flash('success', 'Se creo un test exitosamente!');
    res.redirect(`/test/${test._id}`)
}

module.exports.editForm = async(req,res) =>{
    const {id} = req.params;
    const test = await Test.findById(id);
    res.render("test/edit", {test, categories});    
}

module.exports.edit = async(req,res)=>{
    const {id} = req.params;
    const test = await Test.findByIdAndUpdate(id,{...req.body.test,runValidators: true, new: true});
    const images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    test.picture.push(...images);
    await test.save()
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await test.updateOne({$pull: {picture: {filename: {$in: req.body.deleteImages}}}})
    }
    req.flash('success', 'Se actualizo test exitosamente!');
    res.redirect(`/test/${test._id}`) 
}

module.exports.deleteTest = async(req, res) => {
    const {id, testId} = req.params;
    await Trainer.findByIdAndUpdate(id, {$pull: { test: testId}})
    await Test.findByIdAndDelete(testId);
    req.flash('success', 'Se elimino test exitosamente!');
    res.redirect(`/trainers/${id}`);
}