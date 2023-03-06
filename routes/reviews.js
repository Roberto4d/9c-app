const express = require("express");
const router = express.Router({mergeParams: true});

const {validateReview, isLoggedIn, verifyReview} = require("../middleware")
const reviews =  require("../controllers/reviews")

const wrapAsync = require("../utils/catchAsync");

router.post('', isLoggedIn,validateReview ,wrapAsync(reviews.createReview))

router.delete('/:reviewId',isLoggedIn,verifyReview,wrapAsync(reviews.deleteReview))

module.exports = router;