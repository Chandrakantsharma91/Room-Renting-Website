const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require("../schemaValidation.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {isLoggedIn , isreviewAuthor} = require("../middleware.js");

const validateReview = (req , res , next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400 , errMsg);
    }else{
        next()
    }
}

const reviewController = require("../controllers/review.js");
// Review Route

router.post("/" ,isLoggedIn ,validateReview , wrapAsync(reviewController.createReview));

// Delete Review Route
router.delete("/:reviewId" ,isLoggedIn,isreviewAuthor, wrapAsync(reviewController.deleteReview));


module.exports = router;