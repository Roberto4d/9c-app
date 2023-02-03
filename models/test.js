const mongoose = require('mongoose');
const Reviews = require('./review')
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
        required: [true, 'Result required.']
    },
    categories: {
        type: String,
        lowercase: true,
        enum: ['finger strength', 'upper body', 'flexibility', 'core']
    },
    user:    
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
    reviews: 
    [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ] 
});

testSchema.post('findOneAndDelete', async (test) => {
    if(test.reviews.length){
        const deleteResult = await Reviews.deleteMany({_id: {$in: test.reviews  }})
        console.log(deleteResult)
    }
})

const Test = mongoose.model('Test', testSchema);
module.exports = Test;