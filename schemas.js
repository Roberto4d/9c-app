const Joi = require("joi");
module.exports.trainerSchema = Joi.object({
    trainer: Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        age: Joi.number().min(0).required(),
        gender: Joi.string(),
        // picture: Joi.string(),
        weight: Joi.number(),
        height: Joi.number(),
        wingSpan: Joi.number(),
        redpointLead: Joi.string(),
        redpointBoulder: Joi.string(),
        description: Joi.string()
    }).required(),
    deleteImages: Joi.array()
});
module.exports.testSchema = Joi.object({
    test: Joi.object({
        name: Joi.string().required(),
        picture: Joi.string().required(),
        description: Joi.string().required(),
        result: Joi.number().required(),
        categories: Joi.string().required()
    }).required()
});
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().integer().min(1).max(5),
        body: Joi.string().required()
    }).required()
});
