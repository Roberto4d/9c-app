if (process.env.NODE_ENV !== 'prduction'){
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash')
const AppError = require('./utils/appError');
const methodOverride = require('method-override');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user.js')  

const trainerRoutes = require('./routes/trainers');
const testRoutes = require('./routes/test');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

const mongoSanitize = require('express-mongo-sanitize');
const MongoStore = require('connect-mongo');

// const helmet = require("helmet");
// const dbUrl = process.env.DB_URL;
const dbUrl = 'mongodb://127.0.0.1:27017/powertest'

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(dbUrl);
  console.log('Mongo Connection lobel open');
};

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'secreto'
    }
})

store.on("error", function(e){
    console.log("sesion STORE error", e)
})

const sessionConfig = {
    store,
    name: 'session',
    secret: 'secreto!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());
// app.use(helmet());

// const scriptSrcUrls = [
//     "https://stackpath.bootstrapcdn.com",
//     "https://api.tiles.mapbox.com",
//     "https://api.mapbox.com",
//     "https://kit.fontawesome.com",
//     "https://cdnjs.cloudflare.com",
//     "https://cdn.jsdelivr.net",
// ];
// const styleSrcUrls = [
//     "https://kit-free.fontawesome.com",
//     "https://stackpath.bootstrapcdn.com",
//     "https://api.mapbox.com",
//     "https://api.tiles.mapbox.com",
//     "https://fonts.googleapis.com",
//     "https://use.fontawesome.com",
// ];
// const connectSrcUrls = [
//     "https://api.mapbox.com",
//     "https://*.tiles.mapbox.com",
//     "https://events.mapbox.com",
// ];
// const fontSrcUrls = [];
// app.use(
//     helmet.contentSecurityPolicy({
//         directives: {
//             defaultSrc: [],
//             connectSrc: ["'self'", ...connectSrcUrls],
//             scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
//             styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
//             workerSrc: ["'self'", "blob:"],
//             childSrc: ["blob:"],
//             objectSrc: [],
//             imgSrc: [
//                 "'self'",
//                 "blob:",
//                 "data:",
//                 "https://res.cloudinary.com/ds5vcwsog/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
//                 "https://images.unsplash.com",
//             ],
//             fontSrc: ["'self'", ...fontSrcUrls],
//         },
//     })
// );


app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/favicon.ico',(req,res)=>{
    res.sendStatus(404);
})

app.use((req,res,next)=>{
    if (!['/login', '/'].includes(req.originalUrl)){
        req.session.previousReturnTo = req.session.returnTo;
        req.session.returnTo = req.originalUrl;
        // console.log('req.session.previousReturnTo', req.session.previousReturnTo);
        // console.log('req.session.returnTo', req.session.returnTo);

    }
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')
    next();
})

app.get('/', (req, res) => {
    res.render('home')
});

app.use('/', userRoutes)
app.use('/trainers', trainerRoutes)
app.use('/test', testRoutes)
app.use('/', testRoutes)
app.use('/test/:id/reviews', reviewRoutes)




///Manejando errores

app.all("*",(req,res,next)=>{
    req.session.returnTo = req.session.previousReturnTo;
    next(new AppError("Page Not Found", 404))
})

//Middleware Errs
app.use((err,req,res,next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = "Algo salio muy mal"
    res.status(statusCode).render("errorsTemplate/error", {err})
})

app.listen(3000, () => {
    console.log(`Esta funcionando el Puerto 3 miguelito`);
});