const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/catchAsync");
const trainers = require("../controllers/trainers")
const multer  = require('multer');
const { storage } = require('../cloudinary/index')
const upload = multer({storage});

const { isLoggedIn, validateTrainer, verifyAuthor } = require("../middleware")

router.route('/')
    .get(wrapAsync(trainers.index))
    .post(isLoggedIn, upload.array('image'), validateTrainer, wrapAsync(trainers.postForm));
    
router.get('/new', isLoggedIn, trainers.newForm);

router.route('/:id')
    .get(isLoggedIn, wrapAsync(trainers.details))
    .put(isLoggedIn, verifyAuthor, upload.array('image'), validateTrainer,wrapAsync(trainers.putEdit))
    .delete(isLoggedIn, verifyAuthor, wrapAsync(trainers.delete));

router.get('/:id/edit', isLoggedIn, verifyAuthor, wrapAsync(trainers.editForm))

module.exports = router;