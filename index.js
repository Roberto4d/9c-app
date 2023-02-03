const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require('ejs-mate');
const {athleteSchema, reviewSchema} = require("./schemas.js");
const wrapAsync = require("./utils/catchAsync");
const AppError = require("./utils/appError");
const methodOverride = require('method-override');
const User = require("./models/user");
const {genders, grades, gradesBoulder, categories} = require("./selects");
const Test = require("./models/test.js");
const catchAsync = require("./utils/catchAsync");
const Review = require("./models/review"); 

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/powertest');
  console.log("Mongo Connection lobel open");
};

const app = express();

app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

const validateAthlete = (req,res,next) => {
    const {error} =  athleteSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(",")
        throw new AppError(msg, 400)
    }else{
        next();
    }
}

const validateReview = (req,res,next) => {
    const {error} =  reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(",")
        throw new AppError(msg, 400)
    }else{
        next();
    }
}

//
// Usuarios
//
app.get('/', (req, res) => {
    res.render('home')
});

// Encontrar Todos los atletas
// filtrar por genero

app.get('/users', wrapAsync(async(req, res, next) => {
    const { firstName, gender, redpointLead, redpointBoulder } = req.query;
    const counting = await User.find({}).count();

    if ( firstName ){
        const athletes = await User.find({firstName: `${firstName}`}); 
        res.render("users/user",{athletes, genders, grades, counting});
    } else if (gender){
        const athletes = await User.find({gender: `${gender}`}); 
        res.render("users/user",{athletes, genders, grades, counting });
    } else if (redpointLead){
        const athletes = await User.find({redpointLead: `${redpointLead}`}); 
        res.render("users/user",{athletes, genders, grades, counting});
    } else if (redpointBoulder){
        const athletes = await User.find({redpointBoulder: `${redpointBoulder}`}); 
        res.render("users/user",{athletes, genders, grades, counting});
    } else{
        const athletes = await User.find({}); 
        res.render("users/user",{counting, athletes, genders, grades});
    }   
}));

//crear un nuevo atleta

app.get('/user/new', (req,res) => {
    res.render("users/new", {genders,grades,gradesBoulder});   
});

app.post('/users',validateAthlete ,wrapAsync(async(req,res,next)=>{
    const newUser = new User(req.body.athlete);
    await newUser.save();
    res.redirect(`/user/${newUser._id}`);
}));

  //Busqueda por ID

app.get('/user/:id', wrapAsync(async(req,res,next) => {
    const { id } = req.params;
    const counting = await User.find({}).count();
    const athlete = await User.findById(id).populate("test");
    res.render("users/details", {athlete,counting});
}
));

//Editar

app.get('/user/:id/edit', wrapAsync(async(req,res,next) =>{
        const {id} = req.params;
        const athlete = await User.findById(id);
        res.render("users/edit", {athlete, genders, grades, gradesBoulder});    
}));

app.put("/user/:id", validateAthlete, wrapAsync(async(req,res,next)=>{
        const {id} = req.params;
        const athlete = await User.findByIdAndUpdate(id,{...req.body.athlete,runValidators: true, new: true});
        res.redirect(`/user/${athlete._id}`) 
}));

//Borrar

app.delete('/user/:id', wrapAsync(async(req, res) => {
    const {id} = req.params;
    const deletedAthlete = await User.findByIdAndDelete(id);
    res.redirect('/users');
}));

//Agrgar un test dentro del atleta

app.get('/user/:id/test/new', async(req,res)=>{
    const {id} = req.params;
    const athlete = await User.findById(id);
    res.render('test/new', {athlete, categories })
})

app.post('/user/:id/test', async(req,res)=>{
    const { id } = req.params;
    const athlete = await User.findById(id);
    const { name,picture,description,result,categories } = req.body.test;  
    const test = new Test({name,picture,description,result,categories})
    athlete.test.push(test);
    test.user = athlete
    await athlete.save();
    await test.save();
    res.redirect(`/user/${athlete._id}`)
})
//
///Test
//
app.get('/test', async(req,res)=>{
    const { categories } = req.query;
    if(categories){
        const test = await Test.find({ categories })
        res.render("test/index", {categories, test})
    } else{
        const allTest = await Test.find({})
        res.render('test/index', {allTest,categories})
    }   
})

//Busqueda por ID

app.get('/test/:id', async(req,res) => {
    const { id } = req.params;   
    const test = await Test.findById(id).populate("reviews").populate("user");
    res.render("test/details", {test});
    }
);
//Editar

app.get('/test/:id/edit', async(req,res) =>{
    const {id} = req.params;
    const test = await Test.findById(id);
    res.render("test/edit", {test, categories});    
});

app.put("/test/:id", async(req,res,)=>{
    const {id} = req.params;
    const editedTest = await Test.findByIdAndUpdate(id,{...req.body.test,runValidators: true, new: true});
    res.redirect(`/test/${editedTest._id}`) 
});

//borrar

app.delete('/test/:id', async(req, res) => {
    const {id} = req.params;
    await Test.findByIdAndDelete(id);
    res.redirect(`/users`);
});

///
///Reviews
///

app.post('/test/:id/reviews', validateReview ,wrapAsync(async(req,res,next)=>{
    const {id} = req.params;
    const test = await Test.findById(id);
    const review = new Review(req.body.review);
    test.reviews.push(review);
    await review.save();
    await test.save();
    res.redirect(`/test/${test.id}`)
}))

//delete review

app.delete('/test/:id/reviews/:reviewId',wrapAsync(async(req,res,next)=>{
    const {reviewId, id} = req.params
    await Test.findByIdAndUpdate(id, { $pull: { reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/test/${id}`);  
}))


///Manejando errores

app.all("*",(req,res,next)=>{
    next(new AppError("Page Not Found", 404))
})

//Middleware Errs
app.use((err,req,res,next) => {
    const {statusCode = 500, message = 'Algo salio muy mal'} = err;
    if(!err.message) err.message = "Oh No, Something Went Wrong"
    res.status(statusCode).render("errorsTemplate/error", {err})
})

app.listen(3000, () => {
    console.log(`Esta funcionando el Puerto 3 miguelito`);
});