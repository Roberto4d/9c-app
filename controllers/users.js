const User = require("../models/user");


module.exports.formRegister = (req,res)=>{
    res.render("users/register")
}

module.exports.addUser = async(req,res) => {
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
}

module.exports.renderLogin = (req,res)=>{
    res.render("users/login")
}

module.exports.login = (req,res) => {
    req.flash("success","Bienvenido De Nuevo a 9a");
    const redirectUrl = req.session.returnTo || '/trainers';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res, next)=>{
    req.logout(function(err){
        if (err){
            return next(err);
        }
        req.flash('success','Se cerro su sesion');
        res.redirect('/trainers');
    });
}