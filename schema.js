const Joi = require('joi');


module.exports.listingSchema = Joi.object({
    listing : Joi.object({
       title:Joi.string().required(),
       description:Joi.string().required(),
       location:Joi.string().required(),
       country:Joi.string().required(),
       price:Joi.number().required().min(0), //mtlb price -ve na ho isiliye minimun value 0  
       image:Joi.object({
          filename:Joi.string(),
          url:Joi.string()
       })
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
});

// module.exports = { listingSchema, reviewSchema };
