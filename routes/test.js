const express = require("express");
const router = express.Router({mergeParams: true});

const wrapAsync = require("../utils/catchAsync");
const {validateTest,isLoggedIn, verifyTest, verifyAuthor} = require("../middleware")
const tests = require("../controllers/test");
const multer  = require('multer');
const { storage } = require('../cloudinary/index')
const upload = multer({storage});

router.get('/test/:id', wrapAsync(tests.details));

router.get('/trainers/:id/test/new', isLoggedIn, wrapAsync(tests.addtestForm))

router.route('/trainers/:id/test')
    .post( isLoggedIn, upload.array('image'), validateTest, wrapAsync(tests.postAddTest))

router.get('/test/:id/edit', isLoggedIn,wrapAsync(tests.editForm));

router.put("/test/:id", isLoggedIn, upload.array('image'), validateTest, wrapAsync(tests.edit));

router.delete('/trainers/:id/test/:testId', isLoggedIn,verifyTest, wrapAsync(tests.deleteTest))

module.exports = router;