const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync")
const User = require("../models/user");
const passport = require('passport');

router.get("/register", (req,res)=>{
    res.render("users/register")
});

router.post("/register", catchAsync( async(req,res) => {
    try{
        const {email, username, password} = req.body;
        const user = new User({email,username});
        const registerUser = await User.register(user, password);
        req.login(registerUser, err => {
            if(err) return next(err);
            req.flash("success","Bienvenido 9a");
            res.redirect("/trainers");
        })
        
    } catch(e){
        req.flash("error", e.message)
        res.redirect("register")
    }
}));

router.get("/login", (req,res)=>{
    res.render("users/login")
});

router.post("/login", passport.authenticate('local', {failureFlash: true, failureRedirect: '/login', keepSessionInfo: true}), (req,res) => {
        req.flash("success","Bienvenido De Nuevo a 9a");
        const redirectUrl = req.session.returnTo || '/trainers';
        delete req.session.returnTo;
        res.redirect(redirectUrl);
});

router.get("/logout", (req,res, next)=>{
    req.logout(function(err){
        if (err){
            return next(err);
        }
        req.flash('success','Se cerro su sesion');
        res.redirect('/trainers');
    });
});

module.exports = router;