const Review = require("../models/review"); 
const Test = require("../models/test.js");

module.exports.createReview = async(req,res)=>{
    const {id} = req.params;
    const test = await Test.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    test.reviews.push(review);
    await review.save();
    await test.save();
    req.flash('success', 'Se creo un post exitosamente!');
    res.redirect(`/test/${test.id}`)
}

module.exports.deleteReview = async(req,res)=>{
    const {id,reviewId} = req.params
    await Test.findByIdAndUpdate(id, { $pull: { reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Se elimino post exitosamente!');
    res.redirect(`/test/${id}`);  
}