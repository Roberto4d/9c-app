const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)


module.exports.trainerSchema = Joi.object({
    trainer: Joi.object({
        firstName: Joi.string().required().escapeHTML(),
        lastName: Joi.string().required().escapeHTML(),
        location: Joi.string().escapeHTML(),
        age: Joi.number().min(0).required(),
        gender: Joi.string(),
        // picture: Joi.string(),
        experience: Joi.string(),
        trainingExperince: Joi.string(),
        redpointLead: Joi.string(),
        redpointBoulder: Joi.string(),
        description: Joi.string().escapeHTML()
    }).required(),
    deleteImages: Joi.array()
});

module.exports.testSchema = Joi.object({
    test: Joi.object({
        name: Joi.string().required().escapeHTML(),
        // picture: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML(),
        duration: Joi.string().required(),
        categories: Joi.string().required()
    }).required(),
    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().integer().min(1).max(5),
        body: Joi.string().required().escapeHTML()
    }).required()
});
