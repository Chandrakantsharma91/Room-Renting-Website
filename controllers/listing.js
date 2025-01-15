const Listing = require('../models/listing.js');
const {listingSchema} = require("../schemaValidation.js");

module.exports.index = async (req , res)=>{
    const allListings = await Listing.find({})
    res.render("listings/index.ejs" , {allListings});
    
}

module.exports.renderNewForm = async(req , res)=>{
    res.render("listings/new.ejs")
}

module.exports.showRoute = async(req , res)=>{
    let {id} = req.params //for pars the data use the middleware url.extended 
    const listing = await Listing.findById(id).populate({
        path : "reviews",
        populate : {
        path : "author"
    },
    }).populate("owner");
    if(!listing){
        req.flash("error" , "Cannot find that listing")
        res.redirect("/listings")
    }
    res.render("listings/show.ejs" , {listing} );
}

module.exports.createNewRoute = async(req , res , next)=>{
        let url = req.file.path;
        let filename = req.file.filename;

        let result = listingSchema.validate(req.body);
        console.log(result);
        
    // we can destructure like this 
    //let {title , description , image , price , country , locaton}; and also
     
    const newListing = new Listing(req.body.listing)
    newListing.owner = req.user._id
    newListing.image = {url , filename};
    await newListing.save();
    req.flash("success" , "New listing created successfully")
    res.redirect("/listings")
   }

module.exports.editRoute = async(req , res)=>{
    let {id} = req.params 
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error" , "Cannot find that listing")
        res.redirect("/listings")
    }
    res.render("listings/edit.ejs" , {listing})
}

module.exports.updateRoute = async(req ,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id , {...req.body.listing});

    if(typeof req.file!== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url , filename};
    await listing.save();
    }
    req.flash("success" , "Listing updated successfully")
    res.redirect(`/listings/${id}`)
}

module.exports.deleteRoute = async(req , res)=>{
    let {id} = req.params;
    deletedListing = await Listing.findByIdAndDelete(id)
    console.log(deletedListing);
    req.flash("success" , "Listing deleted successfully")
    res.redirect("/listings");
    
}