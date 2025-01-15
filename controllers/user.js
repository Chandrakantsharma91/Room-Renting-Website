const User = require('../models/user');


module.exports.rendersignup =  (req, res) => {
    res.render('users/signup.ejs');
}

module.exports.signup = async (req, res) => {

    try {
        let { email, username, password } = req.body;   
    const newuser = new User({ email, username });  
    
    const registeredUser = await User.register(newuser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Welcome to wanderlust');
        res.redirect('/listings');
    });
    
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/signup');
        
    }    
    
}


module.exports.renderlogin = (req, res) => {
    res.render('users/login.ejs');
}

module.exports.login=async(req,res)=>{
    req.flash("success","Welcome back to your account");
    redirectUrl=res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
}

// module.exports.login = async (req, res) => {
//     // console.log('Redirect URL:', res.locals.redirectUrl);
//     const redirectUrl = res.locals.redirectUrl || '/listings'; // Default fallback
//     req.flash('success', 'Welcome back to your account');
//     res.redirect(redirectUrl );
    
// }

module.exports.logout = (req, res) => {
    req.logout((err)=>{
        if(err){
            next(err);
        }
    });
    req.flash('success', 'You are logged out');
    res.redirect('/listings');
}