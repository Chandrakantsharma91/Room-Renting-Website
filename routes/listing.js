// Description: Routes for listing model


const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schemaValidation.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// Index route
router.get("/", wrapAsync(listingController.index));

// New form route
router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm));

// Show route
router.get("/:id", wrapAsync(listingController.showRoute));

// Create route
router.post("/", 
    isLoggedIn, 
    upload.single("listing[image]"), 
    validateListing, 
    wrapAsync(listingController.createNewRoute)
    
);

// Edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editRoute));

// Update route
router.put("/:id", isLoggedIn,
    upload.single("listing[image]"), 
    isOwner, validateListing, wrapAsync(listingController.updateRoute));

// Delete route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.deleteRoute));

module.exports = router;