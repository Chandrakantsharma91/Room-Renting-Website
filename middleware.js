const Listing = require('./models/listing');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}



module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
        console.log('Redirect URL retrieved:', res.locals.redirectUrl); // Debug log
        delete req.session.redirectUrl; // Clear after use
    } else {
        res.locals.redirectUrl = '/listings'; // Default fallback
        console.log('Redirect URL not found, defaulting to /'); // Debug log
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/listings/${id}`);
    }
    next();
}


module.exports.isreviewAuthor = async (req, res, next) => {
    let { id ,reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You have not created this review');
        return res.redirect(`/listings/${id}`);
    }
    next();
}