const Joi = require('joi');

const listingSchema = Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(0),
    description: Joi.string(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    image: Joi.object({
        filename: Joi.string(),
        url: Joi.string()
    })
});

const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
});

module.exports = { listingSchema, reviewSchema };
