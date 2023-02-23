const express = require("express");
const router = express.Router({mergeParams: true});

const Review = require("../models/review"); 
const Test = require("../models/test.js");

const wrapAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const {reviewSchema} = require("../schemas.js");



const validateReview = (req,res,next) => {
    const {error} =  reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(",")
        throw new AppError(msg, 400)
    }else{
        next();
    }
}

router.post('', validateReview ,wrapAsync(async(req,res)=>{
    const {id} = req.params;
    const test = await Test.findById(id);
    const review = new Review(req.body.review);
    test.reviews.push(review);
    await review.save();
    await test.save();
    req.flash('success', 'Se creo un post exitosamente!');
    res.redirect(`/test/${test.id}`)
}))

router.delete('/:reviewId',wrapAsync(async(req,res)=>{
    const {reviewId, id} = req.params
    await Test.findByIdAndUpdate(id, { $pull: { reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Se elimino post exitosamente!');
    res.redirect(`/test/${id}`);  
}))

module.exports = router;