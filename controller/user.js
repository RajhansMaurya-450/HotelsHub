const User = require("../models/user.js");

//renders signup form............
module.exports.renderSignUpForm = (req, res) => {
    res.render("users/signup.ejs");
}

//signUp Route...............
module.exports.SignUpUser = async (req, res) => {

    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);

        req.login(registeredUser, (err) => {//login route........
            if (err) {
                req.flash("error", "An error occured during login, PLease logging in manually..!");
                res.redirect("/listings");
            }
            req.flash("success", `Welcome to the HotelsHub ${registeredUser.username}!`);
            res.redirect("/listings");
        })

    }
    catch (e) {
        req.flash("error", e.message);
        console.log(e.message);
        res.redirect("/signup");
    }

}

//renders login form..................
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
}

//login route..............
module.exports.loginUser = async (req, res) => {
    req.flash("success", `Welcome Back to Hotels Hub ${req.user.username}`);
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

//logout user...............
module.exports.logoutUser = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "User logged out!");
        res.redirect("/");
    });
}