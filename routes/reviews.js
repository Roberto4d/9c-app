const express = require("express");
const router = express.Router({mergeParams: true});
const {validateReview, isLoggedIn, verifyReview} = require("../middleware")
const Review = require("../models/review"); 
const Test = require("../models/test.js");

const wrapAsync = require("../utils/catchAsync");

router.post('', isLoggedIn,validateReview ,wrapAsync(async(req,res)=>{
    const {id} = req.params;
    const test = await Test.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    test.reviews.push(review);
    await review.save();
    await test.save();
    req.flash('success', 'Se creo un post exitosamente!');
    res.redirect(`/test/${test.id}`)
}))

router.delete('/:reviewId',isLoggedIn,verifyReview,wrapAsync(async(req,res)=>{
    const {id,reviewId} = req.params
    await Test.findByIdAndUpdate(id, { $pull: { reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Se elimino post exitosamente!');
    res.redirect(`/test/${id}`);  
}))

module.exports = router;