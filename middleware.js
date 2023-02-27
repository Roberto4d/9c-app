const {trainerSchema, testSchema, reviewSchema} = require("./schemas");
const AppError = require("./utils/appError");
const Trainer = require("./models/trainer");
const Test = require("./models/test")
const Review = require("./models/review")

module.exports.isLoggedIn = (req,res, next) =>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'Necesitas Iniciar Sesion');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateTrainer = (req,res,next) => {
    const {error} =  trainerSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(",")
        throw new AppError(msg, 400)
    }else{
        next();
    }
}

module.exports.verifyAuthor = async(req,res,next) => {
    const {id} = req.params;
    const trainer = await Trainer.findById(id);
    if(!trainer.author.equals(req.user._id)){
        req.flash('error', 'No tienes permiso para editar al entrenador');
        return res.redirect(`/trainers/${id}`) 
    }
    next();  
}

module.exports.verifyTest = async(req,res,next) => {
    const {id, testId} = req.params;
    const test = await Test.findById(testId);
    if(!test.author.equals(req.user._id)){
        req.flash('error', 'No tienes permiso para editar este Test');
        return res.redirect(`/trainers/${id}`) 
    }
    next();  
}

module.exports.verifyReview = async(req,res,next) => {
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'No tienes permiso para eliminar el comentario');
        return res.redirect(`/test/${id}`) 
    }
    next();  
}

module.exports.validateTest = (req,res,next) => {
    const {error} = testSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(",")
        throw new AppError(msg, 400)
    }else{
        next();
    }
}

module.exports.validateReview = (req,res,next) => {
    const {error} =  reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(",")
        throw new AppError(msg, 400)
    }else{
        next();
    }
}
