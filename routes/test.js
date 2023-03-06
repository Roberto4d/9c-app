const express = require("express");
const router = express.Router({mergeParams: true});

const wrapAsync = require("../utils/catchAsync");
const {validateTest,isLoggedIn, verifyTest} = require("../middleware")
const tests = require("../controllers/test");

router.get('', wrapAsync(tests.index))

router.get('/:id', wrapAsync(tests.details));

router.get('/:id/edit', isLoggedIn,wrapAsync(tests.edit));

router.put("/:id", isLoggedIn, validateTest, wrapAsync());

//Agrgar un test dentro del entrenador
router.get('/trainers/:id/test/new', isLoggedIn, wrapAsync(tests.addtestForm))

router.post('/trainers/:id/test', isLoggedIn, validateTest, wrapAsync(tests.postAddTest))

//Eiminar un test de un entrenador

router.delete('/trainers/:id/test/:testId', isLoggedIn,verifyTest, wrapAsync(tests.deleteTest))

module.exports = router;