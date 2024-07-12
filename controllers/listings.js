const Listing = require('../models/listing');
const { cloudinary } = require('../cloudConfig');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding ({ accessToken: mapToken });

// Controller for listing index route
module.exports.index = async (req, res) => {
    try {
        const allListings = await Listing.find({});
        res.render('listings/index.ejs', { allListings });
    } catch (err) {
        req.flash('error', 'Something went wrong');
        res.redirect('/');
    }
};

// Controller for rendering the form to create a new listing
module.exports.renderNewForm = (req, res) => {
    res.render('listings/new.ejs');
};

// Controller for showing a specific listing
module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    try {
        const foundListing = await Listing.findById(id)
            .populate({ path: 'reviews', populate: { path: 'author' } })
            .populate('owner');
        if (!foundListing) {
            req.flash('error', 'Listing you requested does not exist');
            return res.redirect('/listings');
        }
        console.log('Found Listing:', foundListing);
        res.render('listings/show', { listing: foundListing });
    } catch (err) {
        req.flash('error', 'Something went wrong');
        res.redirect('/listings');
    }
};

// Controller for creating a new listing
module.exports.createListing = async (req, res) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
    })
        .send();

        // console.log(response.body.features[0].geometry);
        res.send("done!");

       
   let url = req.file.path;
   let filename = req.file.filename;
    
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = { url, filename };

        newListing.geometry = response.body.features[0].geometry;
        console.log('New Listing Data:', newListing);
        let savedLisitng= await newListing.save();
        console.log(savedListing);
        req.flash('success', 'New Listing Created!');
        res.redirect('/listings');
    
};

// Controller for rendering the form to edit a listing
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;

    try {
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash('error', 'Listing you requested does not exist');
            return res.redirect('/listings');
        }
        console.log('Fetched Listing for Edit:', listing);
        
        res.render('listings/edit.ejs', { listing });
    } catch (err) {
        console.error('Error fetching listing:', err); // Log the error for debugging purposes
        req.flash('error', 'Something went wrong');
        res.redirect('/listings');
    }
};





// Controller for updating a listing
module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    try {
        const price = Number(req.body.listing.price);
        const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        if (req.file) {
            const { path: url, filename } = req.file;
            listing.image = { url, filename };
            await listing.save();
        }
        console.log('Updated Listing:', listing);
        console.log('Title from request:', req.body.listing.title);
        req.flash('success', 'Listing Updated!');
        res.redirect(`/listings/${id}`);
    } catch (err) {
        console.error('Error updating listing:', err);
        req.flash('error', 'Something went wrong');
        res.redirect(`/listings/${id}/edit`);
    }
};

// Controller for deleting a listing
module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedListing = await Listing.findByIdAndDelete(id);
        if (!deletedListing) {
            req.flash('error', 'Listing not found');
            return res.redirect('/listings');
        }
        req.flash('success', 'Listing Deleted!');
        res.redirect('/listings');
    } catch (err) {
        req.flash('error', 'Something went wrong');
        res.redirect('/listings');
    }
};
