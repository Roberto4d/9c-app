const mongoose = require('mongoose');
const { Schema } = mongoose;

const testSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Test must have a name.']
    },
    picture: {
        type: String
    },
    description: {
        type: String
    },
    result: {
        type: Number,
        required: [true, 'Resul required.']
    },
    categories: {
        type: String,
        lowercase: true,
        enum: ["finger streng", "upper boddy", "flexibylity", "core"]
    },
    user:    
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    
    
});

const Test = mongoose.model('Test', testSchema);
module.exports = Test;