const Joi = require("joi");
module.exports.athleteSchema = Joi.object({
    athlete: Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        age: Joi.number().min(0).required(),
        gender: Joi.string(),
        picture: Joi.string(),
        weight: Joi.number(),
        height: Joi.number(),
        wingSpan: Joi.number(),
        redpointLead: Joi.string(),
        redpointBoulder: Joi.string(),
        description: Joi.string()
    }).required()
});
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().integer().min(1).max(5),
        body: Joi.string().required()
    }).required()
})