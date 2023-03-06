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

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/powertest');
  console.log('Mongo Connection lobel open');
};

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: 'estedeberiadeserunbuensecreto',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/favicon.ico',(req,res)=>{
    res.sendStatus(404);
})

app.use((req,res,next)=>{
    // console.log(req.session)
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

app.use('/', userRoutes)
app.use('/trainers', trainerRoutes)
app.use('/test', testRoutes)
app.use('/', testRoutes)
app.use('/test/:id/reviews', reviewRoutes)


app.get('/', (req, res) => {
    res.send('home')
});

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