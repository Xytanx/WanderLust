const express=require("express");
const router= express.Router();
const wrapAsync = require("../utils/wrapAsync");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing}= require("../middleware.js")

//INDEX Route
router.get("/", wrapAsync (async(req, res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}));

//NEW Route
router.get("/new", isLoggedIn, (req, res)=>{
    res.render("listings/new.ejs");
});

//SHOW Route
router.get("/:id", wrapAsync (async(req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({
        path:"reviews",
        populate:{
            path: "author"
        }}).populate("owner");
    if(!listing){
        req.flash("error", "The Listing does not exits");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
}));

//CREATE Route
router.post("/", isLoggedIn, validateListing, wrapAsync (async(req, res)=>{
    let result = listingSchema.validate(req.body);
    const newListing= new Listing(req.body.listing);
    newListing.owner=req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
}));

//EDIT Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync (async (req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing)
    {
        req.flash("error", "The Listing does not exits");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing});
}));

//UPDATE Route
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync (async (req, res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing Updated");
    res.redirect ("/listings");
}));

//DELETE Route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync (async (req, res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
}));

module.exports= router;